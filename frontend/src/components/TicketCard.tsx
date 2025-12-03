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

export default function TicketCard({ ticketId }: { ticketId: string }) {
    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [qrCode, setQrCode] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTicket = async () => {
            try {
                const res = await fetch(`${API_URL}/api/tickets/${ticketId}`);
                if (res.ok) {
                    const data = await res.json();
                    setTicket(data);

                    if (data.status === 'VERIFIED') {
                        const qr = await QRCode.toDataURL(data.ticket_id);
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
    }, [ticketId]);

    if (loading) return <div className="glass-card p-6 animate-pulse h-64"></div>;
    if (!ticket) return null;

    return (
        <div className="glass-card overflow-hidden relative group transition-all duration-300 hover:bg-black/60">
            {/* Status Banner */}
            <div className={`absolute top-0 right-0 px-4 py-1 text-xs font-bold tracking-widest ${ticket.status === 'VERIFIED' ? 'bg-green-900/80 text-green-400' :
                ticket.status === 'PENDING' ? 'bg-yellow-900/80 text-[#FADA5E]' :
                    ticket.status === 'USED' ? 'bg-blue-900/80 text-blue-400' :
                        'bg-red-900/80 text-red-400'
                }`}>
                {ticket.status}
            </div>

            <div className="p-6 border-b border-[#D4AF37]/20">
                <h3 className="text-xl font-bold text-white mb-1">{ticket.name}</h3>
                <p className="text-[#D4AF37] text-sm tracking-widest">{ticket.ticket_type} ACCESS</p>
            </div>

            <div className="p-6 flex flex-col items-center justify-center min-h-[200px]">
                {ticket.status === 'VERIFIED' ? (
                    <div className="text-center">
                        <div className="bg-white p-2 mb-4 inline-block rounded-sm">
                            <img src={qrCode} alt="Ticket QR" className="w-32 h-32" />
                        </div>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest">Show at Gate</p>
                    </div>
                ) : ticket.status === 'PENDING' ? (
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-400 text-sm tracking-wide">Verification in Progress</p>
                    </div>
                ) : (
                    <div className="text-center text-gray-500">
                        <p className="tracking-widest uppercase text-sm">{ticket.status === 'USED' ? 'TICKET REDEEMED' : 'BOOKING REJECTED'}</p>
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
