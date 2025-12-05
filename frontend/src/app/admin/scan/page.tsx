'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import QRScanner from '@/components/QRScanner';
import { useAuth } from '@/contexts/AuthContext';
import { ChevronLeft, LogOut, QrCode, CheckCircle2, XCircle, AlertCircle, Keyboard, Camera } from 'lucide-react';

// API URL - uses environment variable in production, localhost in development
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

interface ScanResult {
    result: 'VALID' | 'USED' | 'INVALID' | 'PENDING' | 'REJECTED' | 'VERIFIED';
    message: string;
    ticket?: {
        name: string;
        ticket_type: string;
        ticket_id: string;
        price?: number;
    };
}

export default function ScanPage() {
    const router = useRouter();
    const { user, loading: authLoading, signOut, getToken } = useAuth();
    const [scanResult, setScanResult] = useState<ScanResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [lastScanned, setLastScanned] = useState<string>('');
    const [manualId, setManualId] = useState('');
    const [scanMode, setScanMode] = useState<'camera' | 'manual'>('camera');

    // Admin Email Check
    const ADMIN_EMAILS = ['admin@1522.in', 'mrrayan0407@gmail.com'];

    useEffect(() => {
        if (!authLoading) {
            if (!user) {
                router.push('/admin/scan/login');
            } else if (user.email && !ADMIN_EMAILS.includes(user.email)) {
                alert('Access Denied: Admin privileges required.');
                router.push('/');
            }
        }
    }, [user, authLoading, router]);

    const handleScan = async (ticketId: string) => {
        if (ticketId === lastScanned || loading || !ticketId.trim()) return;
        setLastScanned(ticketId);
        setLoading(true);

        try {
            const token = await getToken();
            const res = await fetch(`${API_URL}/api/scan/scan`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ ticket_id: ticketId.trim().toUpperCase(), gate_id: 'GATE_1', device_id: 'DEVICE_1' }),
            });

            if (res.ok) {
                const data = await res.json();
                // Normalize the result for UI
                if (data.result === 'VERIFIED') {
                    data.message = '✓ Valid Ticket - Allow Entry';
                } else if (data.result === 'USED') {
                    data.message = '⚠ Already Used - DO NOT ALLOW';
                } else if (data.result === 'INVALID') {
                    data.message = '✗ Invalid Ticket';
                }
                setScanResult(data);
            } else {
                setScanResult({ result: 'INVALID', message: '✗ Ticket Not Found' });
            }
        } catch (err) {
            console.error(err);
            setScanResult({ result: 'INVALID', message: '✗ Error - Try Again' });
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmEntry = async () => {
        if (!scanResult?.ticket?.ticket_id) return;
        setLoading(true);

        try {
            const token = await getToken();
            const res = await fetch(`${API_URL}/api/scan/confirm`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ ticket_id: scanResult.ticket.ticket_id, gate_id: 'GATE_1', device_id: 'DEVICE_1' }),
            });

            if (res.ok) {
                setScanResult({
                    result: 'USED',
                    message: '✓ Entry Confirmed!',
                    ticket: scanResult.ticket
                });
                setLastScanned('');
            } else {
                alert('Confirmation Failed');
            }
        } catch (err) {
            console.error(err);
            alert('Error Confirming Entry');
        } finally {
            setLoading(false);
        }
    };

    const resetScanner = () => {
        setScanResult(null);
        setLastScanned('');
        setManualId('');
    };

    const handleManualSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (manualId.trim()) {
            handleScan(manualId.trim());
        }
    };

    if (authLoading) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <div className="text-[#D4AF37] text-xl tracking-widest animate-pulse">LOADING...</div>
            </div>
        );
    }

    if (!user) return null;

    // Determine result styling
    const getResultStyle = () => {
        if (!scanResult) return {};
        if (scanResult.result === 'VERIFIED') {
            return { bg: 'bg-green-900/30', border: 'border-green-500', text: 'text-green-400', icon: <CheckCircle2 size={64} className="text-green-400" /> };
        }
        if (scanResult.result === 'USED') {
            return { bg: 'bg-red-900/30', border: 'border-red-500', text: 'text-red-400', icon: <XCircle size={64} className="text-red-400" /> };
        }
        return { bg: 'bg-red-900/30', border: 'border-red-500', text: 'text-red-400', icon: <XCircle size={64} className="text-red-400" /> };
    };

    const resultStyle = getResultStyle();

    return (
        <div className="min-h-screen bg-[#050505] text-white flex flex-col">
            {/* Header */}
            <header className="bg-black/50 backdrop-blur-md border-b border-[#D4AF37]/20 sticky top-0 z-50">
                <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
                    <button
                        onClick={() => router.push('/admin/dashboard')}
                        className="flex items-center gap-2 text-gray-400 hover:text-white"
                    >
                        <ChevronLeft size={20} />
                        <span className="text-sm">Dashboard</span>
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 border border-[#D4AF37] flex items-center justify-center">
                            <span className="text-[#D4AF37] font-bold text-[8px]">AAA</span>
                        </div>
                        <span className="text-[#D4AF37] text-sm font-playfair">Scanner</span>
                    </div>
                    <button
                        onClick={() => signOut()}
                        className="p-2 text-gray-400 hover:text-[#D4AF37]"
                    >
                        <LogOut size={18} />
                    </button>
                </div>
            </header>

            <main className="flex-1 flex flex-col max-w-md mx-auto w-full p-4">
                {!scanResult ? (
                    <>
                        {/* Mode Toggle */}
                        <div className="flex gap-2 mb-6 bg-white/5 p-1 border border-[#D4AF37]/20">
                            <button
                                onClick={() => setScanMode('camera')}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm transition-all ${scanMode === 'camera'
                                        ? 'bg-[#D4AF37] text-black font-bold'
                                        : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                <Camera size={16} />
                                Scan QR
                            </button>
                            <button
                                onClick={() => setScanMode('manual')}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm transition-all ${scanMode === 'manual'
                                        ? 'bg-[#D4AF37] text-black font-bold'
                                        : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                <Keyboard size={16} />
                                Enter ID
                            </button>
                        </div>

                        {scanMode === 'camera' ? (
                            /* Camera Scanner */
                            <div className="flex-1 flex flex-col">
                                <div className="border-2 border-[#D4AF37]/30 overflow-hidden relative aspect-square">
                                    <QRScanner onScan={handleScan} />
                                    <div className="absolute inset-0 border-[20px] border-black/50 pointer-events-none"></div>
                                    <div className="absolute top-0 left-0 w-full h-1 bg-[#D4AF37]/50 animate-scan"></div>

                                    {/* Corner Decorations */}
                                    <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-[#D4AF37]"></div>
                                    <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-[#D4AF37]"></div>
                                    <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-[#D4AF37]"></div>
                                    <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-[#D4AF37]"></div>
                                </div>
                                <p className="text-center text-[#D4AF37] mt-4 text-sm tracking-widest uppercase animate-pulse">
                                    {loading ? 'Checking...' : 'Point at QR Code'}
                                </p>
                            </div>
                        ) : (
                            /* Manual Entry */
                            <div className="flex-1 flex flex-col items-center justify-center">
                                <div className="w-20 h-20 border-2 border-[#D4AF37]/30 flex items-center justify-center mb-6">
                                    <Keyboard size={32} className="text-[#D4AF37]" />
                                </div>
                                <h2 className="text-xl font-playfair text-white mb-2">Enter Ticket ID</h2>
                                <p className="text-gray-500 text-sm mb-6 text-center">
                                    Type the ticket ID shown on guest's ticket
                                </p>

                                <form onSubmit={handleManualSubmit} className="w-full space-y-4">
                                    <input
                                        type="text"
                                        value={manualId}
                                        onChange={(e) => setManualId(e.target.value.toUpperCase())}
                                        placeholder="e.g., A1B2C3D4"
                                        className="w-full bg-white/5 border-2 border-[#D4AF37]/30 px-4 py-4 text-[#D4AF37] placeholder-gray-600 focus:border-[#D4AF37] focus:outline-none font-mono text-lg text-center uppercase tracking-widest"
                                    />
                                    <button
                                        type="submit"
                                        disabled={loading || !manualId.trim()}
                                        className="w-full bg-[#D4AF37] hover:bg-[#FADA5E] text-black font-bold py-4 text-sm tracking-widest uppercase transition-colors disabled:opacity-50"
                                    >
                                        {loading ? 'Checking...' : 'Check Ticket'}
                                    </button>
                                </form>
                            </div>
                        )}
                    </>
                ) : (
                    /* Scan Result */
                    <div className="flex-1 flex flex-col items-center justify-center">
                        {/* Result Icon */}
                        <div className={`w-28 h-28 rounded-full flex items-center justify-center mb-6 ${resultStyle.bg} border-4 ${resultStyle.border}`}>
                            {resultStyle.icon}
                        </div>

                        {/* Result Message */}
                        <h2 className={`text-2xl font-bold font-playfair mb-2 text-center ${resultStyle.text}`}>
                            {scanResult.message}
                        </h2>

                        {/* Warning for USED */}
                        {scanResult.result === 'USED' && (
                            <div className="bg-red-900/50 border-2 border-red-500 p-4 mt-4 mb-4 w-full text-center">
                                <p className="text-red-300 font-bold text-lg">⚠ DO NOT ALLOW ENTRY</p>
                                <p className="text-red-400 text-sm mt-1">This ticket has already been used</p>
                            </div>
                        )}

                        {/* Ticket Details */}
                        {scanResult.ticket && (
                            <div className="w-full bg-black/40 border border-[#D4AF37]/20 p-6 mt-4 mb-6">
                                <div className="text-center mb-4">
                                    <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Guest Name</p>
                                    <h3 className="text-xl font-playfair text-white">{scanResult.ticket.name}</h3>
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-center">
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Ticket Type</p>
                                        <p className="text-[#D4AF37] font-bold">{scanResult.ticket.ticket_type}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Ticket ID</p>
                                        <p className="font-mono text-white">{scanResult.ticket.ticket_id}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        {scanResult.result === 'VERIFIED' && (
                            <button
                                onClick={handleConfirmEntry}
                                disabled={loading}
                                className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-4 text-sm tracking-widest uppercase transition-colors mb-4 flex items-center justify-center gap-2"
                            >
                                <CheckCircle2 size={18} />
                                {loading ? 'Confirming...' : 'Allow Entry'}
                            </button>
                        )}

                        <button
                            onClick={resetScanner}
                            className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-3 text-sm tracking-widest uppercase transition-colors border border-white/10"
                        >
                            Scan Next
                        </button>
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="bg-black/50 border-t border-[#D4AF37]/10 py-3 text-center">
                <p className="text-gray-600 text-xs">An Audio Affair • Entry Scanner</p>
            </footer>
        </div>
    );
}
