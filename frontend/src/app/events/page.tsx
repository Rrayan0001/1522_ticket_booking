'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EventsPage() {
    const router = useRouter();

    useEffect(() => {
        // Redirect to main booking page (events home)
        router.push('/book');
    }, [router]);

    return (
        <div className="bg-[#050505] min-h-screen flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
}
