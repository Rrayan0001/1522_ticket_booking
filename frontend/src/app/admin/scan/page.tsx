'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import QRScanner from '@/components/QRScanner';
import { useAuth } from '@/contexts/AuthContext';

// API URL - uses environment variable in production, localhost in development
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

interface ScanResult {
    result: 'VALID' | 'USED' | 'INVALID' | 'PENDING' | 'REJECTED' | 'VERIFIED';
    message: string;
    ticket?: {
        name: string;
        ticket_type: string;
        ticket_id: string;
    };
}

export default function ScanPage() {
    const router = useRouter();
    const { user, loading: authLoading, signOut, getToken } = useAuth();
    const [scanResult, setScanResult] = useState<ScanResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [lastScanned, setLastScanned] = useState<string>('');

    // Admin Email Check
    const ADMIN_EMAILS = ['admin@1522.in', 'mrrayan0407@gmail.com'];

    useEffect(() => {
        if (!authLoading) {
            if (!user) {
                router.push('/admin/scan/login');
            } else if (user.email && !ADMIN_EMAILS.includes(user.email)) {
                // Redirect non-admin users
                alert('Access Denied: Admin privileges required.');
                router.push('/');
            }
        }
    }, [user, authLoading, router]);

    const handleScan = async (decodedText: string) => {
        if (decodedText === lastScanned || loading) return;
        setLastScanned(decodedText);
        setLoading(true);

        try {
            const token = await getToken();
            const res = await fetch(`${API_URL}/api/scan/scan`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ ticket_id: decodedText, gate_id: 'GATE_1', device_id: 'DEVICE_1' }),
            });

            if (res.ok) {
                const data = await res.json();
                setScanResult(data);
            } else {
                setScanResult({ result: 'INVALID', message: 'Scan Failed' });
            }
        } catch (err) {
            console.error(err);
            setScanResult({ result: 'INVALID', message: 'Error Scanning' });
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
                setScanResult({ result: 'USED', message: 'Entry Confirmed' });
                setLastScanned(''); // Allow re-scan if needed (though it's used now)
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
    };

    if (authLoading) {
        return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>;
    }

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-black text-white p-4 flex flex-col items-center">
            <div className="w-full max-w-md flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-purple-500">Gate Scanner</h1>
                <button
                    onClick={() => signOut()}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm transition-colors"
                >
                    Sign Out
                </button>
            </div>

            {!scanResult ? (
                <div className="w-full max-w-md">
                    <QRScanner onScan={handleScan} />
                    <p className="text-center text-gray-500 mt-4 mb-8">Point camera at ticket QR code</p>

                    <div className="border-t border-gray-800 pt-6">
                        <p className="text-center text-gray-500 text-sm mb-4">OR ENTER MANUALLY</p>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const input = (e.target as HTMLFormElement).elements.namedItem('manualId') as HTMLInputElement;
                            if (input.value) handleScan(input.value);
                        }} className="flex gap-2">
                            <input
                                name="manualId"
                                type="text"
                                placeholder="Enter Ticket ID"
                                className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-3 rounded-lg transition-colors disabled:opacity-50"
                            >
                                Verify
                            </button>
                        </form>
                    </div>
                </div>
            ) : (
                <div className="w-full max-w-md bg-gray-900 p-8 rounded-2xl border border-gray-700 text-center">
                    <div className={`text-3xl font-bold mb-4 ${scanResult.result === 'VERIFIED' ? 'text-green-500' :
                        scanResult.result === 'USED' ? 'text-blue-500' :
                            'text-red-500'
                        }`}>
                        {scanResult.message}
                    </div>

                    {scanResult.ticket && (
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-white">{scanResult.ticket.name}</h2>
                            <p className="text-purple-400 text-xl mt-2">{scanResult.ticket.ticket_type}</p>
                            <p className="text-gray-500 mt-1">#{scanResult.ticket.ticket_id}</p>
                        </div>
                    )}

                    {scanResult.result === 'VERIFIED' && (
                        <button
                            onClick={handleConfirmEntry}
                            disabled={loading}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl text-xl transition-colors mb-4"
                        >
                            CONFIRM ENTRY
                        </button>
                    )}

                    <button
                        onClick={resetScanner}
                        className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-xl transition-colors"
                    >
                        Scan Next
                    </button>
                </div>
            )}
        </div>
    );
}
