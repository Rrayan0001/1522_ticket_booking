'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, QrCode, Calendar, Phone, Mail, Ticket, Users } from 'lucide-react';

// API URL - uses environment variable in production, localhost in development
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

interface TicketData {
    ticket_id: string;
    name: string;
    phone: string;
    email: string;
    ticket_type: string;
    price: number;
    status: string;
    created_at: string;
}

export default function AdminDashboard() {
    const router = useRouter();
    const { user, loading: authLoading, signOut, getToken } = useAuth();
    const [tickets, setTickets] = useState<TicketData[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');
    const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
    const [stats, setStats] = useState({ total: 0, used: 0 });

    // Admin Email Check
    const ADMIN_EMAILS = ['admin@1522.in', 'mrrayan0407@gmail.com'];

    useEffect(() => {
        if (!authLoading) {
            if (!user) {
                router.push('/admin/login');
            } else if (user.email && !ADMIN_EMAILS.includes(user.email)) {
                alert('Access Denied: Admin privileges required.');
                router.push('/');
            }
        }
    }, [user, authLoading, router]);

    const fetchTickets = async () => {
        setLoading(true);
        try {
            const token = await getToken();
            // Fetch VERIFIED tickets (sold tickets)
            const res = await fetch(`${API_URL}/api/admin/tickets?status=VERIFIED`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            // Also fetch USED tickets
            const resUsed = await fetch(`${API_URL}/api/admin/tickets?status=USED`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            let allTickets: TicketData[] = [];
            let usedCount = 0;

            if (res.ok) {
                const verifiedTickets = await res.json();
                allTickets = [...verifiedTickets];
            }

            if (resUsed.ok) {
                const usedTickets = await resUsed.json();
                allTickets = [...allTickets, ...usedTickets];
                usedCount = usedTickets.length;
            }

            // Apply filter
            if (filter === 'USED') {
                setTickets(allTickets.filter(t => t.status === 'USED'));
            } else if (filter === 'NOT_USED') {
                setTickets(allTickets.filter(t => t.status === 'VERIFIED'));
            } else {
                setTickets(allTickets);
            }

            setStats({ total: allTickets.length, used: usedCount });
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

    if (authLoading) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <div className="text-[#D4AF37] text-xl tracking-widest animate-pulse font-playfair">LOADING...</div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-[#050505] text-gray-200 font-sans">
            {/* Header */}
            <header className="bg-black/50 backdrop-blur-md border-b border-[#D4AF37]/20 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 border border-[#D4AF37] flex items-center justify-center">
                            <span className="text-[#D4AF37] font-bold text-xs">AAA</span>
                        </div>
                        <div>
                            <span className="text-[#D4AF37] text-xs tracking-widest uppercase">Admin Dashboard</span>
                            <h1 className="text-white font-playfair text-lg hidden md:block">An Audio Affair</h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => router.push('/admin/scan')}
                            className="flex items-center gap-2 px-4 py-2 bg-[#D4AF37] text-black hover:bg-[#FADA5E] transition-all text-sm font-bold tracking-widest uppercase"
                        >
                            <QrCode size={16} />
                            <span className="hidden md:inline">Scanner</span>
                        </button>
                        <button
                            onClick={() => signOut()}
                            className="flex items-center gap-2 px-3 py-2 border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all text-sm"
                        >
                            <LogOut size={16} />
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-black/40 border border-[#D4AF37]/20 p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#D4AF37]/10 flex items-center justify-center">
                                <Ticket size={20} className="text-[#D4AF37]" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white">{stats.total}</p>
                                <p className="text-xs text-gray-500 uppercase tracking-wider">Tickets Sold</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-black/40 border border-blue-500/20 p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-500/10 flex items-center justify-center">
                                <Users size={20} className="text-blue-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white">{stats.used}</p>
                                <p className="text-xs text-gray-500 uppercase tracking-wider">Checked In</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Title & Filters */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div>
                        <h2 className="text-xl font-playfair text-white">Sold Tickets</h2>
                        <p className="text-gray-500 text-sm">View all ticket bookings</p>
                    </div>

                    <div className="flex gap-2 bg-white/5 p-1 border border-[#D4AF37]/20">
                        {[
                            { key: 'ALL', label: 'All' },
                            { key: 'NOT_USED', label: 'Not Used' },
                            { key: 'USED', label: 'Used' }
                        ].map((item) => (
                            <button
                                key={item.key}
                                onClick={() => setFilter(item.key)}
                                className={`px-4 py-2 text-xs font-medium transition-all ${filter === item.key
                                    ? 'bg-[#D4AF37] text-black'
                                    : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-48 bg-white/5 border border-white/5"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {tickets.map((ticket) => (
                            <div
                                key={ticket.ticket_id}
                                className="bg-black/40 border border-[#D4AF37]/20 hover:border-[#D4AF37]/50 transition-all overflow-hidden"
                            >
                                {/* Header */}
                                <div className="p-4 border-b border-[#D4AF37]/10">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-lg font-playfair text-white">{ticket.name}</h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-xs text-[#D4AF37] px-2 py-0.5 border border-[#D4AF37]/30">{ticket.ticket_type}</span>
                                                <span className="text-xs text-gray-500">₹{ticket.price}</span>
                                            </div>
                                        </div>
                                        <span className={`text-xs px-2 py-1 ${ticket.status === 'USED'
                                                ? 'bg-blue-900/50 text-blue-400'
                                                : 'bg-green-900/50 text-green-400'
                                            }`}>
                                            {ticket.status === 'USED' ? 'USED' : 'NOT USED'}
                                        </span>
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="p-4 space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-gray-400">
                                        <Phone size={12} className="text-[#D4AF37]" />
                                        <span>{ticket.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-400">
                                        <Mail size={12} className="text-[#D4AF37]" />
                                        <span className="truncate">{ticket.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-400">
                                        <Calendar size={12} className="text-[#D4AF37]" />
                                        <span>{new Date(ticket.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="bg-white/5 px-4 py-3 flex justify-between items-center">
                                    <span className="font-mono text-xs text-[#D4AF37]">#{ticket.ticket_id}</span>
                                    <button
                                        onClick={() => setSelectedTicket(selectedTicket === ticket.ticket_id ? null : ticket.ticket_id)}
                                        className="text-gray-500 hover:text-[#D4AF37] transition-colors"
                                    >
                                        <QrCode size={16} />
                                    </button>
                                </div>

                                {/* QR Code Reveal */}
                                {selectedTicket === ticket.ticket_id && (
                                    <div className="p-4 bg-white flex flex-col items-center justify-center animate-in zoom-in-95 duration-200">
                                        <img
                                            src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${ticket.ticket_id}`}
                                            alt="Ticket QR"
                                            className="w-24 h-24 mb-2"
                                        />
                                        <p className="text-black text-xs font-mono">{ticket.ticket_id}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {!loading && tickets.length === 0 && (
                    <div className="text-center py-16">
                        <div className="w-16 h-16 border border-[#D4AF37]/30 flex items-center justify-center mx-auto mb-4">
                            <Ticket size={24} className="text-[#D4AF37]" />
                        </div>
                        <h3 className="text-xl font-playfair text-white mb-2">No tickets found</h3>
                        <p className="text-gray-500">No {filter === 'ALL' ? '' : filter.toLowerCase().replace('_', ' ')} tickets yet.</p>
                    </div>
                )}
            </main>
        </div>
    );
}
