'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { QrCode, Lock, Mail } from 'lucide-react';

export default function ScannerLoginPage() {
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
            router.push('/admin/scan');
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
            <div className="w-full max-w-sm">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 border-2 border-[#D4AF37] flex items-center justify-center mx-auto mb-4">
                        <QrCode size={32} className="text-[#D4AF37]" />
                    </div>
                    <h1 className="text-2xl font-bold text-[#D4AF37] font-playfair tracking-wider">Scanner Login</h1>
                    <p className="text-gray-500 text-sm mt-1">An Audio Affair • Entry Verification</p>
                </div>

                {/* Form */}
                <div className="bg-black/40 border border-[#D4AF37]/20 p-6">
                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label className="block text-[#D4AF37] text-xs uppercase tracking-widest mb-2">Email</label>
                            <div className="relative">
                                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white/5 border border-[#D4AF37]/30 px-4 py-3 pl-10 text-white focus:border-[#D4AF37] focus:outline-none"
                                    placeholder="admin@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[#D4AF37] text-xs uppercase tracking-widest mb-2">Password</label>
                            <div className="relative">
                                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white/5 border border-[#D4AF37]/30 px-4 py-3 pl-10 text-white focus:border-[#D4AF37] focus:outline-none"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-900/20 border border-red-500/50 text-red-400 p-3 text-sm">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#D4AF37] hover:bg-[#FADA5E] text-black font-bold py-4 text-sm tracking-widest uppercase transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>
                </div>

                {/* Footer */}
                <p className="text-center text-gray-600 text-xs mt-6">
                    Staff access only
                </p>
            </div>
        </div>
    );
}
