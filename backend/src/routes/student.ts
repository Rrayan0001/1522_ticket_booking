import { Router } from 'express';
import multer from 'multer';
import Groq from 'groq-sdk';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// Verify Student ID Card
router.post('/verify-student-id', upload.single('id_card'), async (req, res) => {
    try {
        const file = req.file;

        if (!file) {
            return res.status(400).json({
                success: false,
                error: 'Student ID card image is required'
            });
        }

        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

        const base64Image = file.buffer.toString('base64');
        const dataUrl = `data:${file.mimetype};base64,${base64Image}`;

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: `Analyze this student ID card image and extract the validity/expiry year. 
                            Look for text like "Valid Till", "Valid Through", "Expiry", "Valid Upto", or date ranges like "2024-2027".
                            
                            Return ONLY a JSON object with these fields:
                            - is_student_id: boolean (true if this appears to be a valid student ID card)
                            - valid_till_year: number (the year the ID is valid until, e.g., 2026 or 2027)
                            - student_name: string (name on the ID if visible)
                            - college_name: string (institution name if visible)
                            - error: string (if unable to extract data, explain why)
                            
                            If you see a date range like "2024-2027", extract 2027 as the valid_till_year.
                            If you cannot find validity info, set valid_till_year to null.`
                        },
                        {
                            type: "image_url",
                            image_url: {
                                url: dataUrl
                            }
                        }
                    ]
                }
            ],
            model: "meta-llama/llama-4-scout-17b-16e-instruct",
            temperature: 0,
            response_format: { type: "json_object" }
        });

        const content = chatCompletion.choices[0]?.message?.content;

        if (content) {
            const extracted = JSON.parse(content);
            console.log('Student ID Verification:', extracted);

            // Check if it's a valid student ID
            if (!extracted.is_student_id) {
                return res.status(400).json({
                    success: false,
                    error: 'This does not appear to be a valid student ID card',
                    details: extracted.error || 'Please upload a clear photo of your student ID'
                });
            }

            // Check validity year
            const validTillYear = extracted.valid_till_year;
            const currentYear = new Date().getFullYear(); // 2025

            if (!validTillYear) {
                return res.status(400).json({
                    success: false,
                    error: 'Could not find validity year on the ID card',
                    details: 'Please upload an ID card with a visible validity date'
                });
            }

            // Valid if year >= 2025
            const isEligible = validTillYear >= 2025;

            res.json({
                success: true,
                is_eligible: isEligible,
                valid_till_year: validTillYear,
                student_name: extracted.student_name || null,
                college_name: extracted.college_name || null,
                message: isEligible
                    ? `Student discount applied! ID valid till ${validTillYear}`
                    : `ID expired or expiring before 2025 (valid till ${validTillYear})`
            });
        } else {
            res.status(400).json({
                success: false,
                error: 'Could not analyze the ID card image',
                details: 'Please upload a clear, well-lit photo of your student ID'
            });
        }
    } catch (err) {
        console.error('Student ID Verification Error:', err);
        res.status(500).json({
            success: false,
            error: 'Failed to verify student ID'
        });
    }
});

export default router;
