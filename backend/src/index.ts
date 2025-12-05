import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import ticketRoutes from './routes/tickets';
import adminRoutes from './routes/admin';
import scanRoutes from './routes/scan';
import authRoutes from './routes/auth';
import razorpayRoutes from './routes/razorpay';
import studentRoutes from './routes/student';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// CORS configuration - allow frontend URL
const allowedOrigins = [
    process.env.FRONTEND_URL || 'https://1522-ticket-booking.vercel.app',
    'http://localhost:3000', // For local development
    'http://192.168.31.68:3000', // For local network access from phone
];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('CORS not allowed'));
        }
    },
    credentials: true
}));
app.use(express.json());

app.use('/api/tickets', ticketRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/scan', scanRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/razorpay', razorpayRoutes);
app.use('/api/student', studentRoutes);

app.get('/', (req, res) => {
    res.send('Restaurant Ticket Booking Backend is running');
});

// Error handling middleware
app.use((err: any, req: any, res: any, next: any) => {
    console.error('--- ERROR OCCURRED ---');
    console.error('Route:', req.method, req.path);
    console.error('Error:', err);
    console.error('Stack:', err.stack);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
