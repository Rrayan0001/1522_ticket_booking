'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function CustomerAuthPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
    });
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [verifyLoading, setVerifyLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSendOTP = async () => {
        if (!formData.email) {
            setMessage('Please enter your email');
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            const { error } = await supabase.auth.signInWithOtp({
                email: formData.email,
                options: {
                    shouldCreateUser: true,
                    data: {
                        name: formData.name,
                        phone: formData.phone,
                    }
                }
            });

            if (error) {
                setMessage('Error: ' + error.message);
            } else {
                setMessage('✓ OTP sent successfully');
                setOtpSent(true);
                // Save to userProfile for app-wide access
                localStorage.setItem('userProfile', JSON.stringify(formData));
            }
        } catch (err) {
            console.error(err);
            setMessage('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setVerifyLoading(true);
        setMessage('');

        try {
            const { error } = await supabase.auth.verifyOtp({
                email: formData.email,
                token: otp,
                type: 'email'
            });

            if (error) {
                setMessage('Error: ' + error.message);
                setVerifyLoading(false);
            } else {
                // Save profile data to localStorage
                localStorage.setItem('userProfile', JSON.stringify(formData));
                setMessage('✓ Verified! Welcome to 1522.');
                setTimeout(() => {
                    router.push('/book');
                }, 1000);
            }
        } catch (err) {
            console.error(err);
            setMessage('An error occurred. Please try again.');
            setVerifyLoading(false);
        }
    };

    const handleResendOTP = async () => {
        setLoading(true);
        setMessage('');

        try {
            const { error } = await supabase.auth.signInWithOtp({
                email: formData.email,
                options: {
                    shouldCreateUser: true,
                }
            });

            if (error) {
                setMessage('Error: ' + error.message);
            } else {
                setMessage('✓ New OTP sent');
                setOtp('');
            }
        } catch (err) {
            console.error(err);
            setMessage('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="glass-card p-6 md:p-12 rounded-none w-full max-w-lg relative overflow-hidden">
                {/* Decorative Corner Borders */}
                <div className="absolute top-0 left-0 w-12 h-12 md:w-16 md:h-16 border-t-2 border-l-2 border-[#D4AF37] opacity-50"></div>
                <div className="absolute bottom-0 right-0 w-12 h-12 md:w-16 md:h-16 border-b-2 border-r-2 border-[#D4AF37] opacity-50"></div>

                <div className="text-center mb-8 md:mb-10">
                    {/* Enhanced Logo Visibility */}
                    <div className="inline-block bg-white/10 backdrop-blur-sm border border-[#D4AF37]/30 p-5 md:p-6 rounded-lg  mb-6 md:mb-8">
                        <img
                            src="/assets/logo.png"
                            alt="1522 Logo"
                            className="h-20 md:h-28 lg:h-32 mx-auto drop-shadow-2xl brightness-125 contrast-125"
                        />
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold text-[#D4AF37] mb-3 tracking-widest">
                        1522
                    </h1>
                    <p className="text-sm md:text-base text-gray-400 font-light tracking-wide">
                        Enter your details to proceed with booking
                    </p>
                </div>

                <form onSubmit={handleVerifyOTP} className="space-y-6 md:space-y-8">
                    <div className="space-y-4 md:space-y-6">
                        <div className="relative group">
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                disabled={otpSent}
                                className="input-premium text-base md:text-lg"
                                placeholder="FULL NAME"
                            />
                        </div>

                        <div className="relative group">
                            <input
                                type="tel"
                                required
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                disabled={otpSent}
                                className="input-premium text-base md:text-lg"
                                placeholder="PHONE NUMBER"
                            />
                        </div>

                        <div className="relative group">
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                disabled={otpSent}
                                className="input-premium text-base md:text-lg"
                                placeholder="EMAIL ADDRESS"
                            />
                        </div>
                    </div>

                    {!otpSent ? (
                        <button
                            type="button"
                            onClick={handleSendOTP}
                            disabled={loading || !formData.name || !formData.phone || !formData.email}
                            className="btn-gold w-full py-3 md:py-4 text-base md:text-lg tracking-widest mt-4"
                        >
                            {loading ? 'GENERATING...' : 'GENERATE OTP'}
                        </button>
                    ) : (
                        <div className="animate-fade-in">
                            <div className="my-6 md:my-8 p-4 md:p-6 border border-[#D4AF37]/30 bg-black/40">
                                <label className="block text-[#D4AF37] text-xs md:text-sm mb-4 text-center tracking-widest">ENTER VERIFICATION CODE</label>
                                <input
                                    type="text"
                                    required
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 8))}
                                    className="w-full bg-transparent border-b-2 border-[#D4AF37] text-white text-center text-2xl md:text-3xl tracking-[0.5em] focus:outline-none py-2 font-mono"
                                    placeholder="••••••••"
                                    maxLength={8}
                                    autoFocus
                                />
                                <p className="text-xs text-gray-500 mt-4 text-center break-all">
                                    Sent to {formData.email}
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={verifyLoading || otp.length < 6}
                                className="btn-gold w-full py-3 md:py-4 text-base md:text-lg tracking-widest"
                            >
                                {verifyLoading ? 'VERIFYING...' : 'VERIFY & PROCEED'}
                            </button>

                            <div className="flex justify-between items-center text-xs mt-6 uppercase tracking-wider">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setOtpSent(false);
                                        setOtp('');
                                        setMessage('');
                                    }}
                                    className="text-gray-400 hover:text-[#D4AF37] transition-colors"
                                >
                                    Edit Details
                                </button>
                                <button
                                    type="button"
                                    onClick={handleResendOTP}
                                    disabled={loading}
                                    className="text-[#D4AF37] hover:text-white transition-colors disabled:opacity-50"
                                >
                                    Resend Code
                                </button>
                            </div>
                        </div>
                    )}

                    {message && (
                        <div className={`p-4 text-sm text-center tracking-wide border ${message.includes('Error')
                            ? 'border-red-900/50 text-red-400 bg-red-900/10'
                            : 'border-green-900/50 text-[#D4AF37] bg-green-900/10'
                            }`}>
                            {message}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}
