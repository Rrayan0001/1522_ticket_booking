import { Router } from 'express';
import { supabase } from '../supabase';
import { requireAuth, requireAdmin } from '../middleware/auth';

const router = Router();

// List Pending Tickets
router.get('/tickets', requireAuth, requireAdmin, async (req, res) => {
    const { status } = req.query;
    let query = supabase
        .from('tickets')
        .select('*')
        .order('created_at', { ascending: false });

    if (status) {
        query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
        return res.status(500).json({ error: 'Failed to fetch tickets' });
    }

    res.json(data);
});

// Verify or Reject Ticket
router.post('/verify', requireAuth, requireAdmin, async (req, res) => {
    const { ticket_id, action } = req.body; // action: 'VERIFY' | 'REJECT'

    if (!['VERIFY', 'REJECT'].includes(action)) {
        return res.status(400).json({ error: 'Invalid action' });
    }

    const newStatus = action === 'VERIFY' ? 'VERIFIED' : 'REJECTED';

    const { data, error } = await supabase
        .from('tickets')
        .update({ status: newStatus })
        .eq('ticket_id', ticket_id)
        .select()
        .single();

    if (error) {
        return res.status(500).json({ error: 'Failed to update ticket status' });
    }

    res.json(data);
});

export default router;
