import { Router } from 'express';
import { supabase } from '../supabase';
import { requireAuth } from '../middleware/auth';

const router = Router();

// Scan Ticket
router.post('/scan', requireAuth, async (req, res) => {
    const { ticket_id, gate_id, device_id } = req.body;

    if (!ticket_id) {
        return res.status(400).json({ error: 'Ticket ID is required' });
    }

    // Fetch ticket
    const { data: ticket, error } = await supabase
        .from('tickets')
        .select('*')
        .eq('ticket_id', ticket_id)
        .single();

    if (error || !ticket) {
        return res.json({ result: 'INVALID', message: 'Invalid Ticket' });
    }

    // Check Status
    if (ticket.status === 'PENDING') {
        return res.json({ result: 'PENDING', message: 'Payment Not Verified' });
    }

    if (ticket.status === 'REJECTED') {
        return res.json({ result: 'REJECTED', message: 'Ticket Rejected' });
    }

    if (ticket.status === 'USED') {
        return res.json({ result: 'USED', message: 'Already Used' });
    }

    if (ticket.status === 'VERIFIED') {
        return res.json({
            result: 'VERIFIED',
            message: 'Valid Ticket',
            ticket: {
                name: ticket.name,
                ticket_type: ticket.ticket_type,
                ticket_id: ticket.ticket_id,
            },
        });
    }

    return res.json({ result: 'INVALID', message: 'Unknown Status' });
});

// Confirm Entry
router.post('/confirm', requireAuth, async (req, res) => {
    const { ticket_id, gate_id, device_id } = req.body;

    // Double check status
    const { data: ticket } = await supabase
        .from('tickets')
        .select('status')
        .eq('ticket_id', ticket_id)
        .single();

    if (!ticket || ticket.status !== 'VERIFIED') {
        return res.status(400).json({ error: 'Ticket not valid for entry' });
    }

    // Update to USED
    const { error: updateError } = await supabase
        .from('tickets')
        .update({ status: 'USED', used_at: new Date().toISOString() })
        .eq('ticket_id', ticket_id);

    if (updateError) {
        return res.status(500).json({ error: 'Failed to update status' });
    }

    // Log Scan
    await supabase.from('scan_logs').insert([
        {
            ticket_id,
            scan_result: 'VALID',
            gate_id,
            device_id,
        },
    ]);

    res.json({ success: true, message: 'Entry Confirmed' });
});

export default router;
