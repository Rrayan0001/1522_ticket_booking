import express from 'express';
import { supabase } from '../supabase';

const router = express.Router();

// Send OTP  
router.post('/send-otp', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        // IMPORTANT: This sends OTP only if Supabase Email Templates are configured for OTP
        // Go to: Supabase Dashboard > Auth > Email Templates > Change "Confirm signup" to use OTP format
        const { data, error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                shouldCreateUser: true,
                data: {
                    // This metadata hints to use OTP
                    auth_type: 'otp'
                }
            }
        });

        if (error) {
            console.error('OTP send error:', error);
            return res.status(400).json({ error: error.message });
        }

        console.log('OTP request processed for:', email);

        res.json({
            message: 'Check your email for the OTP code',
        });
    } catch (error: any) {
        console.error('Send OTP error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
    try {
        const { email, token } = req.body;

        if (!email || !token) {
            return res.status(400).json({ error: 'Email and OTP token are required' });
        }

        // Verify the OTP
        const { data, error } = await supabase.auth.verifyOtp({
            email,
            token,
            type: 'email'
        });

        if (error) {
            console.error('OTP verification error:', error);
            return res.status(400).json({ error: error.message });
        }

        res.json({
            message: 'OTP verified successfully',
            user: data.user,
            session: data.session
        });
    } catch (error: any) {
        console.error('Verify OTP error:', error);
        res.status(500).json({ error: error.message });
    }
});

export default router;
