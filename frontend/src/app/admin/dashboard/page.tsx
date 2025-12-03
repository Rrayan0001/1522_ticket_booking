'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

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
}

export default function AdminDashboard() {
    const router = useRouter();
    const { user, loading: authLoading, signOut, getToken } = useAuth();
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('PENDING');

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/admin/login');
        }
    }, [user, authLoading, router]);

    const fetchTickets = async () => {
        setLoading(true);
        try {
            const token = await getToken();
            const res = await fetch(`http://localhost:5001/api/admin/tickets?status=${filter}`, {
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
            const res = await fetch('http://localhost:5001/api/admin/verify', {
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
        return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Loading...</div>;
    }

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <button
                    onClick={() => signOut()}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded transition-colors"
                >
                    Sign Out
                </button>
            </div>

            <div className="mb-6 flex gap-4">
                <button
                    onClick={() => setFilter('PENDING')}
                    className={`px-4 py-2 rounded ${filter === 'PENDING' ? 'bg-purple-600' : 'bg-gray-700'}`}
                >
                    Pending
                </button>
                <button
                    onClick={() => setFilter('VERIFIED')}
                    className={`px-4 py-2 rounded ${filter === 'VERIFIED' ? 'bg-green-600' : 'bg-gray-700'}`}
                >
                    Verified
                </button>
                <button
                    onClick={() => setFilter('REJECTED')}
                    className={`px-4 py-2 rounded ${filter === 'REJECTED' ? 'bg-red-600' : 'bg-gray-700'}`}
                >
                    Rejected
                </button>
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="grid gap-6">
                    {tickets.map((ticket) => (
                        <div key={ticket.ticket_id} className="bg-gray-800 p-6 rounded-lg border border-gray-700 flex flex-col md:flex-row gap-6">
                            <div className="w-full md:w-1/3">
                                <a href={ticket.screenshot_url} target="_blank" rel="noopener noreferrer">
                                    <img src={ticket.screenshot_url} alt="Payment Screenshot" className="w-full h-48 object-cover rounded-lg border border-gray-600 hover:opacity-90 transition-opacity" />
                                </a>
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold">{ticket.name}</h3>
                                        <p className="text-gray-400">{ticket.email} | {ticket.phone}</p>
                                    </div>
                                    <span className="bg-gray-700 px-2 py-1 rounded text-sm">{ticket.ticket_type}</span>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                                    <div>
                                        <p className="text-gray-500">Ticket ID</p>
                                        <p>{ticket.ticket_id}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Price</p>
                                        <p>₹{ticket.price}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Created At</p>
                                        <p>{new Date(ticket.created_at).toLocaleString()}</p>
                                    </div>
                                </div>

                                {ticket.status === 'PENDING' && (
                                    <div className="flex gap-4 mt-4">
                                        <button
                                            onClick={() => handleAction(ticket.ticket_id, 'VERIFY')}
                                            className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded font-bold transition-colors"
                                        >
                                            Verify
                                        </button>
                                        <button
                                            onClick={() => handleAction(ticket.ticket_id, 'REJECT')}
                                            className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded font-bold transition-colors"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {tickets.length === 0 && <p className="text-gray-400">No tickets found.</p>}
                </div>
            )}
        </div>
    );
}
