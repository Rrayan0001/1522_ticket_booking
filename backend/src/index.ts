import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import ticketRoutes from './routes/tickets';
import adminRoutes from './routes/admin';
import scanRoutes from './routes/scan';
import authRoutes from './routes/auth';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/tickets', ticketRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/scan', scanRoutes);
app.use('/api/auth', authRoutes);

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
