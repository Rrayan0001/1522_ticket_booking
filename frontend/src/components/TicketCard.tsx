'use client';

// API URL - uses environment variable in production, localhost in development
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

interface Ticket {
    ticket_id: string;
    name: string;
    ticket_type: string;
    status: string;
    created_at: string;
}

export default function TicketCard({ ticketId, data }: { ticketId: string, data?: Ticket }) {
    const [ticket, setTicket] = useState<Ticket | null>(data || null);
    const [qrCode, setQrCode] = useState<string | null>(null);
    const [loading, setLoading] = useState(!data);

    // Check if ticket is valid (VERIFIED status means paid, can show QR)
    const isValidTicket = (status: string) => status === 'VERIFIED' || status === 'USED';

    useEffect(() => {
        if (data) {
            setTicket(data);
            if (isValidTicket(data.status)) {
                QRCode.toDataURL(data.ticket_id).then(setQrCode);
            }
            setLoading(false);
            return;
        }

        const fetchTicket = async () => {
            try {
                const res = await fetch(`${API_URL}/api/tickets/${ticketId}`);
                if (res.ok) {
                    const fetchedData = await res.json();
                    setTicket(fetchedData);

                    if (isValidTicket(fetchedData.status)) {
                        const qr = await QRCode.toDataURL(fetchedData.ticket_id);
                        setQrCode(qr);
                    }
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchTicket();
        const interval = setInterval(fetchTicket, 5000);
        return () => clearInterval(interval);
    }, [ticketId, data]);

    if (loading) return <div className="glass-card p-6 animate-pulse h-64"></div>;
    if (!ticket) return null;

    // Determine display status
    const getDisplayStatus = () => {
        if (ticket.status === 'VERIFIED') return { label: 'VALID', color: 'bg-green-900/80 text-green-400' };
        if (ticket.status === 'USED') return { label: 'USED', color: 'bg-blue-900/80 text-blue-400' };
        if (ticket.status === 'PENDING') return { label: 'PROCESSING', color: 'bg-yellow-900/80 text-[#FADA5E]' };
        return { label: 'INVALID', color: 'bg-red-900/80 text-red-400' };
    };

    const displayStatus = getDisplayStatus();

    return (
        <div className="glass-card overflow-hidden relative group transition-all duration-300 hover:bg-black/60">
            {/* Status Banner */}
            <div className={`absolute top-0 right-0 px-4 py-1 text-xs font-bold tracking-widest ${displayStatus.color}`}>
                {displayStatus.label}
            </div>

            <div className="p-6 border-b border-[#D4AF37]/20">
                <h3 className="text-xl font-bold text-white mb-1">{ticket.name}</h3>
                <p className="text-[#D4AF37] text-sm tracking-widest">{ticket.ticket_type} ACCESS</p>
            </div>

            <div className="p-6 flex flex-col items-center justify-center min-h-[200px]">
                {isValidTicket(ticket.status) && qrCode ? (
                    <div className="text-center">
                        <div className="bg-white p-2 mb-4 inline-block rounded-sm">
                            <img src={qrCode} alt="Ticket QR" className="w-32 h-32" />
                        </div>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                            {ticket.status === 'USED' ? 'Ticket Already Used' : 'Show at Gate'}
                        </p>
                    </div>
                ) : ticket.status === 'PENDING' ? (
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-400 text-sm tracking-wide">Processing Payment...</p>
                    </div>
                ) : (
                    <div className="text-center text-gray-500">
                        <p className="tracking-widest uppercase text-sm">Booking Failed</p>
                    </div>
                )}
            </div>

            <div className="bg-black/40 p-4 flex justify-between items-center text-xs text-gray-500 font-mono border-t border-[#D4AF37]/10">
                <span>ID: {ticket.ticket_id.slice(0, 8)}...</span>
                <span>{new Date(ticket.created_at).toLocaleDateString()}</span>
            </div>
        </div>
    );
}
