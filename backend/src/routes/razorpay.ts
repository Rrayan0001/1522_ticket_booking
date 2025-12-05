import { Router } from 'express';
import { supabase } from '../supabase';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || '',
    key_secret: process.env.RAZORPAY_KEY_SECRET || ''
});

// Create Order
router.post('/create-order', async (req, res) => {
    try {
        const { amount, ticket_type, customer_name, customer_phone, customer_email } = req.body;

        if (!amount || !ticket_type) {
            return res.status(400).json({ error: 'Amount and ticket type are required' });
        }

        const options = {
            amount: amount * 100, // Razorpay expects amount in paise
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
            notes: {
                ticket_type,
                customer_name,
                customer_phone,
                customer_email
            }
        };

        const order = await razorpay.orders.create(options);

        res.json({
            success: true,
            order_id: order.id,
            amount: order.amount,
            currency: order.currency,
            key_id: process.env.RAZORPAY_KEY_ID
        });
    } catch (err) {
        console.error('Razorpay Order Error:', err);
        res.status(500).json({ error: 'Failed to create order' });
    }
});

// Verify Payment and Create Ticket
router.post('/verify-payment', async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            customer_name,
            customer_phone,
            customer_email,
            ticket_type,
            price
        } = req.body;

        console.log('Verifying payment:', { razorpay_order_id, razorpay_payment_id, ticket_type, price });

        // Verify signature
        const body = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
            .update(body)
            .digest('hex');

        if (expectedSignature !== razorpay_signature) {
            console.error('Signature mismatch:', { expected: expectedSignature, received: razorpay_signature });
            return res.status(400).json({
                success: false,
                error: 'Payment verification failed - invalid signature'
            });
        }

        // Payment verified - Create ticket
        const ticket_id = uuidv4().slice(0, 8).toUpperCase();

        // Insert ticket with Razorpay payment info as screenshot_url placeholder
        const { data, error } = await supabase
            .from('tickets')
            .insert([
                {
                    ticket_id,
                    name: customer_name,
                    phone: customer_phone,
                    email: customer_email,
                    ticket_type: ticket_type, // Store as text
                    price: parseInt(price),
                    screenshot_url: `razorpay://${razorpay_payment_id}`, // Use payment ID as reference
                    utr_number: razorpay_order_id, // Store order_id in utr_number field
                    status: 'VERIFIED' // Use VERIFIED instead of CONFIRMED (matches enum)
                }
            ])
            .select()
            .single();

        if (error) {
            console.error('DB Insert Error:', error);
            return res.status(500).json({
                success: false,
                error: 'Failed to create ticket',
                details: error.message
            });
        }

        console.log('Ticket created successfully:', data);

        res.json({
            success: true,
            ticket: data,
            message: 'Payment verified and ticket created successfully'
        });
    } catch (err: any) {
        console.error('Payment Verification Error:', err);
        res.status(500).json({
            success: false,
            error: 'Payment verification failed',
            details: err.message
        });
    }
});

export default router;

