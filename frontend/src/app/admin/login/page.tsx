'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminLoginPage() {
    const router = useRouter();
    const { signIn } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const { error } = await signIn(email, password);

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            router.push('/admin/dashboard');
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
            <div className="bg-black/40 p-8 rounded-none border border-[#D4AF37]/30 w-full max-w-md relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-[#D4AF37]/50"></div>
                <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-[#D4AF37]/50"></div>

                <div className="text-center mb-8">
                    <div className="w-12 h-12 border border-[#D4AF37] flex items-center justify-center mb-4">
                        <span className="text-[#D4AF37] font-bold font-playfair text-xl">1522</span>
                    </div>
                    <h1 className="text-xl md:text-2xl font-playfair text-[#D4AF37] tracking-wider text-center">1522, The Pub Sahakar Nagar</h1>
                    <p className="text-[#D4AF37] text-[10px] md:text-xs tracking-[0.3em] uppercase mt-2">Admin Portal</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-[#D4AF37] text-xs font-bold uppercase tracking-widest mb-2">Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-black/50 border-b border-[#D4AF37]/30 text-[#D4AF37] p-3 focus:border-[#D4AF37] focus:outline-none transition-colors placeholder-gray-700"
                            placeholder="admin@1522.in"
                        />
                    </div>

                    <div>
                        <label className="block text-[#D4AF37] text-xs font-bold uppercase tracking-widest mb-2">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-black/50 border-b border-[#D4AF37]/30 text-[#D4AF37] p-3 focus:border-[#D4AF37] focus:outline-none transition-colors placeholder-gray-700"
                            placeholder="••••••••"
                        />
                    </div>

                    {error && (
                        <div className="bg-red-900/20 border border-red-500/50 text-red-400 p-3 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#D4AF37] text-black font-bold py-4 hover:bg-[#FADA5E] transition-all tracking-widest uppercase text-sm mt-4"
                    >
                        {loading ? 'AUTHENTICATING...' : 'ENTER DASHBOARD'}
                    </button>
                </form>
            </div>
        </div>
    );
}
