'use client';

// API URL - uses environment variable in production, localhost in development
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function BookingForm() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        ticket_type: 'SILVER',
        price: 2000,
    });
    const [file, setFile] = useState<File | null>(null);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/auth/customer');
            return;
        }

        if (user?.email) {
            // Try to get stored data
            const stored = localStorage.getItem('customer_data');
            if (stored) {
                const data = JSON.parse(stored);
                setFormData(prev => ({ ...prev, ...data, email: user.email || '' }));
            } else {
                setFormData(prev => ({ ...prev, email: user.email || '' }));
            }
        }
    }, [user, authLoading, router]);

    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const type = e.target.value;
        let price = 2000;
        if (type === 'GOLD') price = 3500;
        if (type === 'VIP') price = 5000;
        setFormData({ ...formData, ticket_type: type, price });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return alert('Please upload payment screenshot');

        setLoading(true);
        const data = new FormData();
        data.append('name', formData.name);
        data.append('phone', formData.phone);
        data.append('email', formData.email);
        data.append('ticket_type', formData.ticket_type);
        data.append('price', formData.price.toString());
        data.append('screenshot', file);

        try {
            const res = await fetch(`${API_URL}/api/tickets`, {
                method: 'POST',
                body: data,
            });

            if (res.ok) {
                const ticket = await res.json();
                const existing = JSON.parse(localStorage.getItem('tickets') || '[]');
                localStorage.setItem('tickets', JSON.stringify([...existing, ticket.ticket_id]));
                router.push('/ticket_cart');
            } else {
                alert('Booking failed');
            }
        } catch (err) {
            console.error(err);
            alert('Error booking ticket');
        } finally {
            setLoading(false);
        }
    };

    if (authLoading) {
        return <div className="text-[#D4AF37] text-center tracking-widest animate-pulse">LOADING...</div>;
    }

    if (!user) return null;

    return (
        <div className="glass-card p-4 md:p-8 rounded-none w-full max-w-2xl relative">
            {/* Decorative Corner Borders */}
            <div className="absolute top-0 left-0 w-12 h-12 md:w-16 md:h-16 border-t-2 border-l-2 border-[#D4AF37] opacity-50"></div>
            <div className="absolute bottom-0 right-0 w-12 h-12 md:w-16 md:h-16 border-b-2 border-r-2 border-[#D4AF37] opacity-50"></div>

            <div className="text-center mb-6 md:mb-8">
                <h2 className="text-xl md:text-2xl font-bold text-[#D4AF37] tracking-widest mb-2">EVENT BOOKING</h2>
                <div className="h-1 w-16 md:w-24 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    <div className="space-y-4 md:space-y-6">
                        <div className="relative group">
                            <label className="text-[10px] md:text-xs text-[#D4AF37] tracking-widest mb-1 block">GUEST NAME</label>
                            <input
                                type="text"
                                required
                                className="input-premium text-base md:text-lg"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div className="relative group">
                            <label className="text-[10px] md:text-xs text-[#D4AF37] tracking-widest mb-1 block">CONTACT</label>
                            <input
                                type="tel"
                                required
                                className="input-premium text-base md:text-lg"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>

                        <div className="relative group">
                            <label className="text-[10px] md:text-xs text-[#D4AF37] tracking-widest mb-1 block">EMAIL</label>
                            <input
                                type="email"
                                required
                                className="input-premium text-base md:text-lg opacity-70 cursor-not-allowed"
                                value={formData.email}
                                readOnly
                            />
                        </div>
                    </div>

                    <div className="space-y-4 md:space-y-6">
                        <div>
                            <label className="text-[10px] md:text-xs text-[#D4AF37] tracking-widest mb-2 block">SELECT EXPERIENCE</label>
                            <select
                                className="input-premium bg-black/50 cursor-pointer text-base md:text-lg"
                                value={formData.ticket_type}
                                onChange={handleTypeChange}
                            >
                                <option value="SILVER" className="bg-gray-900 text-gray-300">SILVER ACCESS - ₹2000</option>
                                <option value="GOLD" className="bg-gray-900 text-[#FADA5E]">GOLD ACCESS - ₹3500</option>
                                <option value="VIP" className="bg-gray-900 text-[#D4AF37] font-bold">VIP EXPERIENCE - ₹5000</option>
                            </select>
                        </div>

                        <div className="bg-black/40 border border-[#D4AF37]/30 p-4 md:p-6 text-center">
                            <p className="text-gray-400 text-[10px] md:text-xs tracking-widest mb-2">TOTAL AMOUNT</p>
                            <p className="text-2xl md:text-3xl text-[#D4AF37] font-mono mb-4">₹{formData.price}</p>

                            <div className="w-32 h-32 md:w-40 md:h-40 bg-white mx-auto mb-3 p-2">
                                <img
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=merchant@upi&pn=1522_Pub&am=${formData.price}&cu=INR`}
                                    alt="UPI QR"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Scan to Pay via UPI</p>
                        </div>
                    </div>
                </div>

                <div className="border-t border-[#D4AF37]/20 pt-6">
                    <label className="text-[10px] md:text-xs text-[#D4AF37] tracking-widest mb-2 block">PAYMENT PROOF</label>
                    <div className="relative">
                        <input
                            type="file"
                            accept="image/*"
                            required
                            className="w-full text-gray-400 text-xs md:text-sm file:mr-4 file:py-2 file:px-4 md:file:py-3 md:file:px-6 file:border-0 file:text-[10px] md:file:text-xs file:font-bold file:bg-[#D4AF37] file:text-black hover:file:bg-[#FADA5E] file:cursor-pointer file:tracking-widest file:uppercase cursor-pointer bg-black/20 border border-[#D4AF37]/20"
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="btn-gold w-full py-3 md:py-4 text-base md:text-lg tracking-[0.2em]"
                >
                    {loading ? 'PROCESSING...' : 'CONFIRM BOOKING'}
                </button>
            </form>
        </div>
    );
}
