'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { CheckCircle2, XCircle, LogOut, Filter, QrCode, Calendar, User, Phone, Mail, CreditCard } from 'lucide-react';

// API URL - uses environment variable in production, localhost in development
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

interface Ticket {
    ticket_id: string;
    name: string;
    phone: string;
    email: string;
    ticket_type: string;
    price: number;
    screenshot_url: string;
    status: string;
    created_at: string;
    utr_number?: string;
}

export default function AdminDashboard() {
    const router = useRouter();
    const { user, loading: authLoading, signOut, getToken } = useAuth();
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('PENDING');
    const [selectedTicket, setSelectedTicket] = useState<string | null>(null);

    // Admin Email Check
    const ADMIN_EMAILS = ['admin@1522.in', 'mrrayan0407@gmail.com'];

    useEffect(() => {
        if (!authLoading) {
            if (!user) {
                router.push('/admin/login');
            } else if (user.email && !ADMIN_EMAILS.includes(user.email)) {
                // Redirect non-admin users (e.g. customers)
                alert('Access Denied: Admin privileges required.');
                router.push('/');
            }
        }
    }, [user, authLoading, router]);

    const fetchTickets = async () => {
        setLoading(true);
        try {
            const token = await getToken();
            const res = await fetch(`${API_URL}/api/admin/tickets?status=${filter}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (res.ok) {
                const data = await res.json();
                setTickets(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchTickets();
        }
    }, [filter, user]);

    const handleAction = async (ticketId: string, action: 'VERIFY' | 'REJECT') => {
        try {
            const token = await getToken();
            const res = await fetch(`${API_URL}/api/admin/verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ ticket_id: ticketId, action }),
            });

            if (res.ok) {
                fetchTickets(); // Refresh list
            } else {
                alert('Action failed');
            }
        } catch (err) {
            console.error(err);
            alert('Error performing action');
        }
    };

    if (authLoading) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <div className="text-[#D4AF37] text-xl tracking-widest animate-pulse font-playfair">LOADING DASHBOARD...</div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-[#050505] text-gray-200 font-sans selection:bg-[#D4AF37] selection:text-black">
            {/* Header */}
            <header className="bg-black/50 backdrop-blur-md border-b border-[#D4AF37]/20 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 border border-[#D4AF37] flex items-center justify-center">
                            <span className="text-[#D4AF37] font-bold font-playfair text-xl">1522</span>
                        </div>
                        <h1 className="text-xl font-playfair text-[#D4AF37] tracking-wider hidden md:block">ADMIN DASHBOARD</h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.push('/admin/scan')}
                            className="flex items-center gap-2 px-4 py-2 bg-[#D4AF37] text-black hover:bg-[#FADA5E] transition-all text-sm font-bold tracking-widest uppercase"
                        >
                            <QrCode size={16} />
                            <span className="hidden md:inline">Scanner</span>
                        </button>
                        <button
                            onClick={() => signOut()}
                            className="flex items-center gap-2 px-4 py-2 border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all text-sm tracking-widest uppercase"
                        >
                            <LogOut size={16} />
                            <span className="hidden md:inline">Logout</span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats & Filters */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                    <div>
                        <h2 className="text-2xl font-playfair text-white mb-1">Ticket Management</h2>
                        <p className="text-gray-500 text-sm">Manage and verify incoming bookings</p>
                    </div>

                    <div className="flex bg-white/5 p-1 rounded-lg border border-[#D4AF37]/20">
                        {['PENDING', 'VERIFIED', 'REJECTED'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                className={`px-6 py-2 text-sm font-medium transition-all rounded-md ${filter === status
                                    ? 'bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-64 bg-white/5 rounded-lg border border-white/5"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {tickets.map((ticket) => (
                            <div
                                key={ticket.ticket_id}
                                className="group bg-black/40 border border-[#D4AF37]/20 hover:border-[#D4AF37]/50 transition-all duration-300 relative overflow-hidden"
                            >
                                {/* Status Indicator */}
                                <div className={`absolute top-0 right-0 px-4 py-1 text-xs font-bold uppercase tracking-wider ${ticket.status === 'VERIFIED' ? 'bg-green-900/80 text-green-400' :
                                    ticket.status === 'REJECTED' ? 'bg-red-900/80 text-red-400' :
                                        'bg-yellow-900/80 text-yellow-400'
                                    }`}>
                                    {ticket.status}
                                </div>

                                <div className="p-6">
                                    {/* Header Info */}
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <h3 className="text-xl font-playfair text-white mb-1">{ticket.name}</h3>
                                            <div className="flex items-center gap-2 text-xs text-[#D4AF37] tracking-widest uppercase">
                                                <span className="px-2 py-0.5 border border-[#D4AF37]/30">{ticket.ticket_type}</span>
                                                <span>•</span>
                                                <span>₹{ticket.price}</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setSelectedTicket(selectedTicket === ticket.ticket_id ? null : ticket.ticket_id)}
                                            className="text-gray-500 hover:text-[#D4AF37] transition-colors"
                                        >
                                            <QrCode size={20} />
                                        </button>
                                    </div>

                                    {/* QR Code Reveal */}
                                    {selectedTicket === ticket.ticket_id && (
                                        <div className="mb-6 p-4 bg-white flex flex-col items-center justify-center animate-in zoom-in-95 duration-200">
                                            <img
                                                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${ticket.ticket_id}`}
                                                alt="Ticket QR"
                                                className="w-32 h-32 mb-2"
                                            />
                                            <p className="text-black text-xs font-mono">{ticket.ticket_id}</p>
                                        </div>
                                    )}

                                    {/* Details Grid */}
                                    <div className="space-y-3 mb-6">
                                        <div className="flex items-center gap-3 text-sm text-gray-400">
                                            <Phone size={14} className="text-[#D4AF37]" />
                                            <span>{ticket.phone}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-gray-400">
                                            <Mail size={14} className="text-[#D4AF37]" />
                                            <span className="truncate">{ticket.email}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-gray-400">
                                            <Calendar size={14} className="text-[#D4AF37]" />
                                            <span>{new Date(ticket.created_at).toLocaleString()}</span>
                                        </div>
                                        {ticket.utr_number && (
                                            <div className="flex items-center gap-3 text-sm text-gray-400">
                                                <CreditCard size={14} className="text-[#D4AF37]" />
                                                <span className="font-mono text-white bg-white/10 px-2 py-0.5 rounded">{ticket.utr_number}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Screenshot */}
                                    <div className="mb-6 relative group/image">
                                        <div className="aspect-video w-full bg-black/50 rounded border border-white/10 overflow-hidden">
                                            <img
                                                src={ticket.screenshot_url}
                                                alt="Payment Proof"
                                                className="w-full h-full object-cover opacity-70 group-hover/image:opacity-100 transition-opacity cursor-pointer"
                                                onClick={() => window.open(ticket.screenshot_url, '_blank')}
                                            />
                                        </div>
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/image:opacity-100 pointer-events-none">
                                            <span className="bg-black/80 text-white text-xs px-3 py-1 rounded backdrop-blur-sm">View Full Image</span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    {ticket.status === 'PENDING' && (
                                        <div className="grid grid-cols-2 gap-4">
                                            <button
                                                onClick={() => handleAction(ticket.ticket_id, 'VERIFY')}
                                                className="flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white text-sm font-bold tracking-wider uppercase transition-all"
                                            >
                                                <CheckCircle2 size={16} />
                                                Verify
                                            </button>
                                            <button
                                                onClick={() => handleAction(ticket.ticket_id, 'REJECT')}
                                                className="flex items-center justify-center gap-2 py-3 bg-white/5 border border-red-500/50 text-red-400 hover:bg-red-900/20 hover:text-red-300 text-sm font-bold tracking-wider uppercase transition-all"
                                            >
                                                <XCircle size={16} />
                                                Reject
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && tickets.length === 0 && (
                    <div className="text-center py-20">
                        <div className="w-16 h-16 border border-[#D4AF37]/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Filter size={24} className="text-[#D4AF37]" />
                        </div>
                        <h3 className="text-xl font-playfair text-white mb-2">No tickets found</h3>
                        <p className="text-gray-500">There are no {filter.toLowerCase()} tickets at the moment.</p>
                    </div>
                )}
            </main>
        </div>
    );
}
