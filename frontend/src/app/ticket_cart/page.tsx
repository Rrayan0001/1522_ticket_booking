'use client';

import { useEffect, useState } from 'react';
import TicketCard from '@/components/TicketCard';
import Link from 'next/link';

export default function TicketCart() {
    const [ticketIds, setTicketIds] = useState<string[]>([]);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('tickets') || '[]');
        setTicketIds(stored);
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="glass-card p-6 md:p-12 rounded-none w-full max-w-5xl relative overflow-hidden min-h-[600px]">
                {/* Decorative Corner Borders */}
                <div className="absolute top-0 left-0 w-12 h-12 md:w-16 md:h-16 border-t-2 border-l-2 border-[#D4AF37] opacity-50"></div>
                <div className="absolute bottom-0 right-0 w-12 h-12 md:w-16 md:h-16 border-b-2 border-r-2 border-[#D4AF37] opacity-50"></div>

                <div className="flex justify-between items-center mb-8 md:mb-12 border-b border-[#D4AF37]/30 pb-4 md:pb-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-[#D4AF37] tracking-widest">MY TICKETS</h1>
                    <Link
                        href="/book"
                        className="text-xs md:text-sm text-gray-400 hover:text-[#D4AF37] uppercase tracking-wider transition-colors"
                    >
                        + Book New
                    </Link>
                </div>

                {ticketIds.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-gray-400 text-lg md:text-xl mb-6 tracking-wide">No active tickets found</p>
                        <Link
                            href="/book"
                            className="btn-gold px-6 py-3 md:px-8 md:py-3 inline-block text-sm tracking-widest"
                        >
                            BOOK NOW
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
                        {ticketIds.map((id) => (
                            <TicketCard key={id} ticketId={id} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
