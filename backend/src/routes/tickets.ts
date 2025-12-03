import { Router } from 'express';
import { supabase } from '../supabase';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// NEW: Extract UTR from payment screenshot (called when image is uploaded)
router.post('/extract-utr', upload.single('screenshot'), async (req, res) => {
    try {
        const file = req.file;

        if (!file) {
            return res.status(400).json({ error: 'Screenshot is required' });
        }

        // Use Groq Vision API to extract UTR
        const Groq = require('groq-sdk');
        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

        const base64Image = file.buffer.toString('base64');
        const dataUrl = `data:${file.mimetype};base64,${base64Image}`;

        const chatCompletion = await groq.chat.completions.create({
            "messages": [
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": "Extract the UPI UTR number (12 digits), Amount, and Date from this payment screenshot. Return ONLY a JSON object with keys: utr_number (string), extracted_amount (number), extracted_date (ISO string). If not found, return null for that field."
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": dataUrl
                            }
                        }
                    ]
                }
            ],
            "model": "meta-llama/llama-4-scout-17b-16e-instruct",
            "temperature": 0,
            "response_format": { "type": "json_object" }
        });

        const content = chatCompletion.choices[0]?.message?.content;
        if (content) {
            const extracted = JSON.parse(content);
            console.log('Extracted Data:', extracted);

            // Validate that UTR was actually found
            if (!extracted.utr_number || extracted.utr_number === null) {
                return res.status(400).json({
                    error: 'Invalid payment screenshot',
                    message: 'Could not find a valid UPI UTR number in this image. Please upload a clear payment screenshot showing the UTR/transaction ID.'
                });
            }

            res.json({
                success: true,
                ...extracted
            });
        } else {
            res.status(400).json({
                error: 'Invalid payment screenshot',
                message: 'Could not extract data from image. Please upload a clear payment screenshot.'
            });
        }
    } catch (err) {
        console.error('OCR Error:', err);
        res.status(500).json({ error: 'Failed to extract UTR from image' });
    }
});

// Create Ticket
router.post('/', upload.single('screenshot'), async (req, res) => {
    try {
        const { name, phone, email, ticket_type, price, utr_number } = req.body;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ error: 'Screenshot is required' });
        }

        // Upload screenshot to Supabase Storage
        const filename = `${Date.now()}_${file.originalname}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('screenshots')
            .upload(filename, file.buffer, {
                contentType: file.mimetype,
            });

        if (uploadError) {
            console.error('Upload Error:', uploadError);
            return res.status(500).json({ error: 'Failed to upload screenshot' });
        }

        const { data: publicUrlData } = supabase.storage
            .from('screenshots')
            .getPublicUrl(filename);

        const screenshot_url = publicUrlData.publicUrl;
        const ticket_id = uuidv4().slice(0, 8).toUpperCase(); // Simple short ID

        // Insert Ticket with UTR
        const { data, error } = await supabase
            .from('tickets')
            .insert([
                {
                    ticket_id,
                    name,
                    phone,
                    email,
                    ticket_type,
                    price: parseInt(price),
                    screenshot_url,
                    utr_number: utr_number || null, // Include UTR from frontend
                    status: 'PENDING',
                },
            ])
            .select()
            .single();

        if (error) {
            console.error('DB Insert Error:', error);
            return res.status(500).json({ error: 'Failed to create ticket' });
        }

        res.status(201).json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get Ticket by ID (Public view for Cart)
router.get('/:ticket_id', async (req, res) => {
    const { ticket_id } = req.params;

    const { data, error } = await supabase
        .from('tickets')
        .select('ticket_id, name, ticket_type, status, price, created_at') // Exclude sensitive fields
        .eq('ticket_id', ticket_id)
        .single();

    if (error) {
        return res.status(404).json({ error: 'Ticket not found' });
    }

    res.json(data);
});

export default router;
