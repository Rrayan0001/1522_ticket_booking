"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Search,
    MapPin,
    Calendar,
    Clock,
    ChevronLeft,
    Star,
    Ticket,
    Armchair,
    Info,
    CreditCard,
    CheckCircle2,
    Users,
    Film,
    Music,
    PartyPopper,
    Copy,
    Mic2
} from 'lucide-react';
import TicketCard from '@/components/TicketCard';

// --- Mock Data ---

const EVENTS = [
    {
        id: 1,
        title: "Stereo Sutra",
        genre: ["Folk-Electronica", "Live Music"],
        rating: 4.9,
        duration: "4h 00m",
        date: "21 DEC",
        time: "8 PM - 12 AM",
        venue: "The Pub, 1522 Sahakaranagar",
        image: "/assets/stereo-sutra.jpg",
        backdrop: "/assets/stereo-sutra.jpg",
        description: "Experience an electrifying night of Folk-Electronica at its finest! Presented by An Audio Affair in association with 1522. Enjoy unlimited food & drinks while grooving to premium live music.",
        artist: "Stereo Sutra Band",
        features: ["Unlimited Food & Drinks", "Folk-Electronica Fusion", "Premium Live Performance"]
    }
];

const DATES = [
    { day: "Today", date: "14" },
    { day: "Fri", date: "15" },
    { day: "Sat", date: "16" },
    { day: "Sun", date: "17" },
    { day: "Mon", date: "18" },
];

const TIMES = ["19:00", "20:30", "22:00"];

const TICKET_TYPES: any = {
    'STAG': { price: 2000, label: 'Stag Entry' },
    'COUPLE': { price: 3000, label: 'Couple Entry' },
    'VIP': { price: 5000, label: 'VIP Entry' }
};

// --- Components ---

const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false }: any) => {
    const baseStyle = "min-h-[48px] px-6 py-3 md:py-4 rounded-none font-semibold transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-2 tracking-widest uppercase font-playfair text-sm md:text-base";
    const variants: any = {
        primary: "bg-gradient-to-r from-[#D4AF37] to-[#FADA5E] text-black shadow-lg shadow-[#D4AF37]/30 hover:shadow-[#D4AF37]/50 active:shadow-[#D4AF37]/70",
        secondary: "bg-white/10 text-white backdrop-blur-md hover:bg-white/20 border border-white/10 active:bg-white/30",
        outline: "border-2 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37]/10 active:bg-[#D4AF37]/20",
        ghost: "text-gray-400 hover:text-white active:text-[#D4AF37]"
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyle} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
        >
            {children}
        </button>
    );
};

const Seat = ({ status, type, onClick, isSelected }: any) => {
    const getSeatColor = () => {
        if (status === 'occupied') return 'bg-gray-800 text-gray-900 cursor-not-allowed border-none';
        if (isSelected) return 'bg-[#D4AF37] text-black shadow-[0_0_15px_rgba(212,175,55,0.5)] border-[#D4AF37]';
        if (type === 'vip') return 'bg-[#D4AF37]/20 border-[#D4AF37]/50 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black hover:shadow-[0_0_10px_rgba(212,175,55,0.5)]';
        return 'bg-white/10 border-white/20 text-gray-400 hover:bg-white hover:text-black hover:shadow-[0_0_10px_rgba(255,255,255,0.5)]';
    };

    return (
        <button
            onClick={onClick}
            disabled={status === 'occupied'}
            className={`
        w-8 h-8 md:w-10 md:h-10 m-1 md:m-1.5 rounded-sm border transition-all duration-300 
        flex items-center justify-center text-[10px] md:text-xs font-medium relative group
        ${getSeatColor()}
      `}
        >
            <span className="font-playfair">{type === 'vip' ? 'V' : ''}</span>
            {status !== 'occupied' && (
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-[#D4AF37] text-[10px] py-1 px-2 border border-[#D4AF37] opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-10">
                    ₹{type === 'vip' ? '5000' : '2000'}
                </div>
            )}
        </button>
    );
};

const EventCard = ({ event, onClick, className = '' }: any) => (
    <div
        onClick={() => onClick(event)}
        className={`group relative flex-shrink-0 cursor-pointer snap-start ${className || 'w-64 md:w-72 lg:w-80'}`}
    >
        <div className="aspect-[2/3] overflow-hidden relative mb-4 shadow-2xl transition-transform duration-300 group-hover:-translate-y-2 group-active:translate-y-0 border border-[#D4AF37]/20">
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80 z-10" />
            <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute top-3 right-3 z-20 bg-black/60 backdrop-blur-md px-2 py-1 border border-[#D4AF37]/30 flex items-center gap-1">
                <Star size={12} className="text-[#D4AF37] fill-[#D4AF37]" />
                <span className="text-xs font-bold text-white">{event.rating}</span>
            </div>
        </div>
        <h3 className="text-[#D4AF37] font-bold text-base md:text-lg lg:text-xl truncate font-playfair group-hover:text-white transition-colors">{event.title}</h3>
        <p className="text-gray-400 text-sm md:text-base">{event.genre.join(", ")}</p>
    </div>
);

// --- Views ---

const HomeView = ({ setView, setSelectedEvent }: any) => {
    const [userName, setUserName] = useState('Guest');

    useEffect(() => {
        const saved = localStorage.getItem('userProfile');
        if (saved) {
            try {
                const profile = JSON.parse(saved);
                setUserName(profile.name || 'Guest');
            } catch (e) {
                setUserName('Guest');
            }
        }
    }, []);

    const handleEventClick = (event: any) => {
        setSelectedEvent(event);
        setView('detail');
    };

    return (
        <div className="pb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <header className="flex justify-between items-center p-6 md:p-8">
                <div className="flex flex-col">
                    <span className="text-[#D4AF37] text-xs font-medium mb-1 tracking-[0.2em] uppercase animate-in slide-in-from-left-4 duration-700 delay-100">Welcome to 1522</span>
                    <h1 className="text-2xl font-bold text-white font-playfair animate-in slide-in-from-left-4 duration-700 delay-200">{userName}</h1>
                </div>
                <button
                    onClick={() => setView('profile')}
                    className="w-12 h-12 rounded-full border border-[#D4AF37] p-[2px] shadow-[0_0_15px_rgba(212,175,55,0.3)] hover:shadow-[0_0_25px_rgba(212,175,55,0.5)] transition-all duration-300 animate-pulse hover:animate-none cursor-pointer"
                >
                    <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                        <img src="/assets/logo.png" alt="1522" className="w-full h-full object-contain" />
                    </div>
                </button>
            </header>

            {/* Search */}
            <div className="px-6 md:px-8 mb-8">
                <div className="relative group transition-all duration-300 focus-within:scale-[1.02]">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#D4AF37] transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Search events..."
                        className="w-full bg-white/5 border border-[#D4AF37]/30 rounded-none py-4 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] focus:shadow-[0_0_20px_rgba(212,175,55,0.1)] transition-all duration-300 font-inter"
                    />
                </div>
            </div>

            {/* Single Event Display */}
            <div className="px-6 md:px-8 pb-8 animate-in zoom-in-95 duration-700 delay-300">
                <EventCard
                    event={EVENTS[0]}
                    onClick={handleEventClick}
                    className="w-full max-w-sm mx-auto"
                />
            </div>
        </div>
    );
};

const EventDetailView = ({ selectedEvent, setView }: any) => (
    <div className="relative min-h-screen bg-[#050505] pb-48 animate-in slide-in-from-bottom-8 duration-500">
        {/* Backdrop */}
        <div className="relative h-[45vh] w-full">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/60 to-[#050505] z-10" />
            <img
                src={selectedEvent.backdrop}
                alt="Backdrop"
                className="w-full h-full object-cover"
            />
            <button
                onClick={() => setView('home')}
                className="absolute top-6 left-6 z-20 w-10 h-10 bg-black/40 backdrop-blur-md border border-[#D4AF37]/30 flex items-center justify-center text-white hover:bg-black/60 transition-all"
            >
                <ChevronLeft size={24} />
            </button>
        </div>

        {/* Content */}
        <div className="px-6 md:px-8 -mt-20 relative z-20">
            <div className="flex justify-between items-start mb-6 animate-in slide-in-from-bottom-8 duration-700 delay-100">
                <div className="w-2/3">
                    <h1 className="text-3xl md:text-4xl font-bold text-[#D4AF37] mb-2 leading-tight font-playfair">{selectedEvent.title}</h1>
                    <div className="flex flex-wrap gap-2 text-gray-400 text-sm mb-4">
                        {selectedEvent.genre.map((g: string) => (
                            <span key={g} className="px-2 py-0.5 border border-[#D4AF37]/20 bg-[#D4AF37]/5 text-[#D4AF37] text-xs uppercase tracking-wider">{g}</span>
                        ))}
                        <span className="flex items-center gap-1 text-white"><Clock size={14} /> {selectedEvent.duration}</span>
                    </div>
                </div>
                <div className="flex flex-col items-center justify-center bg-black/40 backdrop-blur-md border border-[#D4AF37]/30 p-3 shadow-[0_0_15px_rgba(212,175,55,0.1)]">
                    <Star className="text-[#D4AF37] fill-[#D4AF37] mb-1" size={24} />
                    <span className="text-xl font-bold text-white">{selectedEvent.rating}</span>
                </div>
            </div>

            <p className="text-gray-300 leading-relaxed mb-8 text-sm md:text-base font-inter border-l-2 border-[#D4AF37] pl-4 animate-in slide-in-from-bottom-8 duration-700 delay-200">
                {selectedEvent.description}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8 animate-in slide-in-from-bottom-8 duration-700 delay-300">
                <div className="bg-white/5 p-4 border border-[#D4AF37]/20 hover:bg-white/10 transition-colors duration-300">
                    <span className="text-[#D4AF37] text-xs block mb-1 uppercase tracking-widest">Date & Time</span>
                    <span className="text-white font-medium">{selectedEvent.date}</span>
                    <span className="text-gray-400 text-xs block mt-1">{selectedEvent.time}</span>
                </div>
                <div className="bg-white/5 p-4 border border-[#D4AF37]/20 hover:bg-white/10 transition-colors duration-300">
                    <span className="text-[#D4AF37] text-xs block mb-1 uppercase tracking-widest">Artist</span>
                    <span className="text-white font-medium">{selectedEvent.artist}</span>
                </div>
            </div>

            <div className="bg-white/5 p-4 border border-[#D4AF37]/20 mb-8 animate-in slide-in-from-bottom-8 duration-700 delay-400">
                <span className="text-[#D4AF37] text-xs block mb-2 uppercase tracking-widest">Venue</span>
                <span className="text-white font-medium">{selectedEvent.venue}</span>
            </div>

            {selectedEvent.features && (
                <div className="mb-8 animate-in slide-in-from-bottom-8 duration-700 delay-500">
                    <span className="text-[#D4AF37] text-xs block mb-3 uppercase tracking-widest">Event Features</span>
                    <div className="flex flex-wrap gap-2">
                        {selectedEvent.features.map((feature: string) => (
                            <span key={feature} className="px-3 py-1 bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs">
                                ✓ {feature}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>

        <div className="fixed bottom-24 left-0 right-0 p-6 bg-gradient-to-t from-black via-black to-transparent z-30">
            <Button onClick={() => setView('checkout')} className="w-full text-lg shadow-xl shadow-[#D4AF37]/20">
                Book Access
            </Button>
        </div>
    </div>
);

const CheckoutView = ({ setView, setTicketData }: any) => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: ''
    });
    const [ticketType, setTicketType] = useState<keyof typeof TICKET_TYPES>('STAG');
    const [file, setFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    // NEW: UTR extraction states
    const [extractedUTR, setExtractedUTR] = useState<string | null>(null);
    const [isExtractingUTR, setIsExtractingUTR] = useState(false);
    const [extractionError, setExtractionError] = useState('');

    useEffect(() => {
        const savedProfile = localStorage.getItem('userProfile');
        if (savedProfile) {
            setFormData(JSON.parse(savedProfile));
        }
    }, []);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setExtractedUTR(null);
            setExtractionError('');

            // Extract UTR immediately
            setIsExtractingUTR(true);
            try {
                const formData = new FormData();
                formData.append('screenshot', selectedFile);

                const res = await fetch('http://localhost:5001/api/tickets/extract-utr', {
                    method: 'POST',
                    body: formData
                });

                const result = await res.json();

                if (res.ok && result.utr_number) {
                    setExtractedUTR(result.utr_number);
                } else {
                    // Handle validation errors from backend
                    const errorMessage = result.message || result.error || 'Could not find UTR number in screenshot';
                    setExtractionError(errorMessage);
                    // Clear the file on validation error
                    setFile(null);
                }
            } catch (err) {
                console.error('UTR extraction error:', err);
                setExtractionError('Error extracting UTR from image');
                setFile(null);
            } finally {
                setIsExtractingUTR(false);
            }
        }
    };

    const handleChangeScreenshot = () => {
        setFile(null);
        setExtractedUTR(null);
        setExtractionError('');
        // Trigger file input click
        document.getElementById('screenshot-upload')?.click();
    };

    const handleCopy = () => {
        navigator.clipboard.writeText('1522@upi');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        // Validation
        if (!/^\d{10}$/.test(formData.phone)) {
            setError('Please enter a valid 10-digit phone number');
            setIsSubmitting(false);
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            setError('Please enter a valid email address');
            setIsSubmitting(false);
            return;
        }

        if (!file) {
            setError('Please upload a payment screenshot');
            setIsSubmitting(false);
            return;
        }

        // Save Profile
        localStorage.setItem('userProfile', JSON.stringify(formData));

        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('phone', formData.phone);
            data.append('email', formData.email);
            data.append('ticket_type', ticketType as string);
            data.append('price', TICKET_TYPES[ticketType].price.toString());
            data.append('screenshot', file);
            if (extractedUTR) {
                data.append('utr_number', extractedUTR); // Send extracted UTR
            }

            const res = await fetch('http://localhost:5001/api/tickets', {
                method: 'POST',
                body: data
            });

            if (res.ok) {
                const result = await res.json();
                setTicketData(result);

                // Save to localStorage
                const stored = JSON.parse(localStorage.getItem('tickets') || '[]');
                localStorage.setItem('tickets', JSON.stringify([...stored, result.ticket_id]));

                setView('success');
            } else {
                const err = await res.json();
                setError(err.error || 'Failed to book ticket');
            }
        } catch (err) {
            console.error(err);
            setError('Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col animate-in slide-in-from-right-8 duration-500 bg-[#050505]">
            {/* Header */}
            <div className="p-6 flex items-center gap-4 bg-[#050505] z-20 border-b border-[#D4AF37]/10">
                <button
                    onClick={() => setView('detail')}
                    className="w-10 h-10 bg-white/5 border border-[#D4AF37]/20 flex items-center justify-center text-white hover:bg-white/10 transition-all"
                >
                    <ChevronLeft size={24} />
                </button>
                <div>
                    <h2 className="text-[#D4AF37] font-bold text-lg font-playfair">Checkout</h2>
                    <p className="text-gray-400 text-xs tracking-wider">SELECT TICKET & PAY</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 md:p-8 pb-48">
                <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-6">
                    {error && (
                        <div className="bg-red-900/20 border border-red-500/50 text-red-400 p-4 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Ticket Selection */}
                    <div>
                        <label className="block text-[#D4AF37] text-xs font-bold uppercase tracking-widest mb-2">Select Ticket Type</label>
                        <div className="grid grid-cols-1 gap-3">
                            {Object.entries(TICKET_TYPES).map(([type, details]: [string, any]) => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => setTicketType(type as any)}
                                    className={`flex justify-between items-center p-4 border transition-all ${ticketType === type ? 'bg-[#D4AF37] border-[#D4AF37] text-black' : 'bg-white/5 border-[#D4AF37]/20 text-gray-400 hover:bg-white/10'}`}
                                >
                                    <span className="font-bold font-playfair">{details.label}</span>
                                    <span className="font-mono">₹{details.price}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="group">
                            <label className="block text-[#D4AF37] text-[10px] md:text-xs font-bold uppercase tracking-widest mb-2 group-focus-within:text-[#FADA5E] transition-colors">Full Name</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="input-premium w-full bg-white/5 border border-[#D4AF37]/30 p-3 md:p-4 text-white text-base focus:outline-none focus:border-[#D4AF37] focus:shadow-[0_0_15px_rgba(212,175,55,0.15)] transition-all duration-300 rounded-sm"
                                placeholder="Enter your name"
                            />
                        </div>
                        <div className="group">
                            <label className="block text-[#D4AF37] text-[10px] md:text-xs font-bold uppercase tracking-widest mb-2 group-focus-within:text-[#FADA5E] transition-colors">Phone Number</label>
                            <input
                                type="tel"
                                required
                                value={formData.phone}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                className="input-premium w-full bg-white/5 border border-[#D4AF37]/30 p-3 md:p-4 text-white text-base focus:outline-none focus:border-[#D4AF37] focus:shadow-[0_0_15px_rgba(212,175,55,0.15)] transition-all duration-300 rounded-sm"
                                placeholder="Enter your phone"
                            />
                        </div>
                        <div className="group">
                            <label className="block text-[#D4AF37] text-[10px] md:text-xs font-bold uppercase tracking-widest mb-2 group-focus-within:text-[#FADA5E] transition-colors">Email Address</label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                className="input-premium w-full bg-white/5 border border-[#D4AF37]/30 p-3 md:p-4 text-white text-base focus:outline-none focus:border-[#D4AF37] focus:shadow-[0_0_15px_rgba(212,175,55,0.15)] transition-all duration-300 rounded-sm"
                                placeholder="Enter your email"
                            />
                        </div>
                    </div>

                    <div className="pt-6 border-t border-[#D4AF37]/20">
                        <h3 className="text-[#D4AF37] font-bold text-lg font-playfair mb-4">Payment</h3>

                        {/* QR Code Display */}
                        <div className="bg-white p-4 mb-6 rounded-sm max-w-[200px] mx-auto">
                            <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=1522@upi&pn=1522&am=2000&cu=INR" alt="Payment QR" className="w-full h-full" />
                        </div>

                        <div className="bg-white/5 p-4 border border-[#D4AF37]/20 mb-6 text-center">
                            <p className="text-gray-400 text-sm mb-2">Scan to pay <span className="text-white font-bold">₹{TICKET_TYPES[ticketType].price}</span></p>
                            <div className="flex items-center justify-center gap-2 bg-black/40 p-2 border border-[#D4AF37]/10 inline-flex mx-auto">
                                <span className="font-mono text-[#D4AF37]">1522@upi</span>
                                <button
                                    type="button"
                                    onClick={handleCopy}
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    {copied ? <CheckCircle2 size={16} className="text-green-500" /> : <Copy size={16} />}
                                </button>
                            </div>
                        </div>

                        <label className="block text-[#D4AF37] text-xs font-bold uppercase tracking-widest mb-2">Upload Payment Screenshot</label>
                        <div className="relative">
                            <input
                                type="file"
                                accept="image/*"
                                capture="environment"
                                onChange={handleFileChange}
                                className="hidden"
                                id="screenshot-upload"
                            />
                            <label
                                htmlFor="screenshot-upload"
                                className={`flex items-center justify-center gap-2 w-full p-4 md:p-4 border-2 border-dashed transition-all cursor-pointer ${file ? 'border-[#D4AF37] bg-[#D4AF37]/10' : 'border-gray-600 hover:border-[#D4AF37] hover:bg-white/5'} min-h-[60px] touch-manipulation`}
                            >
                                {file ? (
                                    <span className="text-[#D4AF37] font-medium truncate">{file.name}</span>
                                ) : (
                                    <>
                                        <CreditCard size={20} className="text-gray-400" />
                                        <span className="text-gray-400 text-sm">Tap to upload or take photo</span>
                                    </>
                                )}
                            </label>
                        </div>

                        {/* UTR Extraction Display */}
                        {file && (
                            <div className="mt-4 p-4 bg-white/5 border border-[#D4AF37]/20">
                                {isExtractingUTR && (
                                    <div className="flex items-center gap-3">
                                        <div className="w-5 h-5 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
                                        <span className="text-gray-400 text-sm">Extracting UTR from screenshot...</span>
                                    </div>
                                )}

                                {!isExtractingUTR && extractedUTR && (
                                    <div className="space-y-2">
                                        <p className="text-xs text-gray-400 uppercase tracking-wider">Extracted UTR Number</p>
                                        <div className="bg-black/40 p-3 border border-[#D4AF37]/30">
                                            <span className="text-[#D4AF37] font-mono text-lg font-bold">{extractedUTR}</span>
                                        </div>
                                        <p className="text-xs text-green-500">✓ UTR verified and will be saved with your booking</p>
                                        <button
                                            type="button"
                                            onClick={handleChangeScreenshot}
                                            className="w-full mt-2 px-4 py-2 bg-white/5 border border-[#D4AF37]/30 text-gray-300 hover:text-white hover:bg-white/10 transition-all text-sm"
                                        >
                                            Change Screenshot
                                        </button>
                                    </div>
                                )}

                                {!isExtractingUTR && extractionError && (
                                    <div className="space-y-3">
                                        <div className="bg-red-900/20 border border-red-500/50 p-3">
                                            <p className="text-red-400 text-sm font-semibold">⚠ Invalid Payment Screenshot</p>
                                            <p className="text-red-300 text-xs mt-1">{extractionError}</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleChangeScreenshot}
                                            className="w-full px-4 py-2 bg-[#D4AF37] text-black font-semibold hover:bg-[#FADA5E] transition-all"
                                        >
                                            Upload Different Screenshot
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <Button
                        disabled={isSubmitting}
                        className="w-full mt-8"
                    >
                        {isSubmitting ? 'Processing...' : 'Confirm Booking'}
                    </Button>
                </form>
            </div>
        </div>
    );
};

const SuccessView = ({ selectedEvent, ticketData, setView }: any) => (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center animate-in zoom-in-95 duration-500 bg-[#050505]">
        <div className="w-24 h-24 rounded-full flex items-center justify-center border-2 border-[#D4AF37] shadow-[0_0_50px_rgba(212,175,55,0.2)] mb-8">
            <CheckCircle2 size={48} className="text-[#D4AF37]" />
        </div>

        <h2 className="text-3xl font-bold text-[#D4AF37] mb-2 font-playfair">Booking Confirmed!</h2>
        <p className="text-gray-400 mb-8 max-w-xs mx-auto">Your ticket for <span className="text-white">{selectedEvent.title}</span> has been created.</p>

        {/* Ticket Card Stub */}
        <div className="bg-white text-black w-full max-w-sm overflow-hidden shadow-2xl relative mb-8">
            {/* Tear Line */}
            <div className="absolute top-2/3 left-0 w-4 h-4 bg-[#050505] rounded-r-full -ml-2"></div>
            <div className="absolute top-2/3 right-0 w-4 h-4 bg-[#050505] rounded-l-full -mr-2"></div>
            <div className="absolute top-2/3 left-4 right-4 border-t-2 border-dashed border-gray-300"></div>

            <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="font-bold text-xl mb-1 font-playfair">{selectedEvent.title}</h3>
                        <p className="text-gray-500 text-sm">Time: {TIMES[0]}</p>
                    </div>
                    <img src={selectedEvent.image} alt="poster" className="w-12 h-16 object-cover shadow-md border border-gray-200" />
                </div>
                <div className="flex gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar size={16} /> <span>Oct {DATES[0].date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Ticket size={16} /> <span>{ticketData?.ticket_type || 'General Entry'}</span>
                    </div>
                </div>
            </div>

            <div className="bg-gray-100 p-6 flex justify-between items-center">
                <div className="flex flex-col text-left">
                    <span className="text-xs text-gray-500 uppercase tracking-wide">Ticket ID</span>
                    <span className="font-bold text-lg font-mono">{ticketData?.ticket_id || 'PENDING'}</span>
                </div>
                <div className="h-12 w-12 bg-black flex items-center justify-center text-[#D4AF37]">
                    <img src="/assets/logo.png" alt="1522" className="w-8 h-8 object-contain" />
                </div>
            </div>
        </div>

        <div className="flex flex-col gap-3 w-full max-w-sm">
            <Link href="/ticket_cart" className="btn-gold px-6 py-3 flex items-center justify-center text-sm tracking-widest">
                VIEW MY TICKETS
            </Link>
            <Button variant="secondary" onClick={() => {
                setView('home');
            }} className="w-full">
                Book Another
            </Button>
        </div>
    </div>
);

const TicketsView = ({ setView }: any) => {
    const [ticketIds, setTicketIds] = useState<string[]>([]);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('tickets') || '[]');
        setTicketIds(stored);
    }, []);

    return (
        <div className="min-h-screen pb-24 animate-in fade-in duration-500">
            <div className="p-6 md:p-8 border-b border-[#D4AF37]/10 mb-6">
                <h1 className="text-2xl font-bold text-[#D4AF37] font-playfair">My Tickets</h1>
            </div>

            <div className="px-6 md:px-8">
                {ticketIds.length === 0 ? (
                    <div className="text-center py-20">
                        <Ticket size={48} className="mx-auto text-gray-600 mb-4" />
                        <p className="text-gray-400 text-lg mb-6 tracking-wide">No active tickets found</p>
                        <Button onClick={() => setView('home')}>
                            BOOK NOW
                        </Button>
                    </div>
                ) : (
                    <div className="grid gap-6 grid-cols-1">
                        {ticketIds.map((id) => (
                            <TicketCard key={id} ticketId={id} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const ProfileView = ({ setView }: any) => {
    const [profile, setProfile] = useState({ name: 'Guest User', email: 'guest@example.com', phone: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({ name: '', email: '', phone: '' });

    useEffect(() => {
        const saved = localStorage.getItem('userProfile');
        if (saved) {
            const parsed = JSON.parse(saved);
            setProfile(parsed);
            setEditForm(parsed);
        }
    }, []);

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to log out?')) {
            localStorage.removeItem('userProfile');
            setProfile({ name: 'Guest User', email: 'guest@example.com', phone: '' });
            // Redirect to login page
            window.location.href = '/auth/customer';
        }
    };

    const handleEditClick = () => {
        setEditForm(profile);
        setIsEditing(true);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setProfile(editForm);
        localStorage.setItem('userProfile', JSON.stringify(editForm));
        setIsEditing(false);
    };

    return (
        <div className="min-h-screen pb-24 animate-in fade-in duration-500">
            <div className="p-6 md:p-8 border-b border-[#D4AF37]/10 mb-6">
                <h1 className="text-2xl font-bold text-[#D4AF37] font-playfair">Profile</h1>
            </div>

            <div className="px-6 md:px-8 space-y-6">
                {!isEditing ? (
                    <>
                        <div className="flex items-center gap-6 bg-gradient-to-r from-white/5 to-transparent p-6 border border-[#D4AF37]/20 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-[#D4AF37]/5 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-700" />
                            <div className="w-20 h-20 rounded-full bg-black border-2 border-[#D4AF37] flex items-center justify-center text-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.2)] relative z-10">
                                <Users size={32} />
                            </div>
                            <div className="relative z-10">
                                <h3 className="text-white font-bold text-xl mb-1 font-playfair">{profile.name}</h3>
                                <p className="text-[#D4AF37] text-sm tracking-wide mb-1">{profile.email}</p>
                                {profile.phone && <p className="text-gray-500 text-xs font-mono">{profile.phone}</p>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <button
                                onClick={handleEditClick}
                                className="w-full flex items-center justify-between p-4 bg-white/5 border border-[#D4AF37]/10 hover:border-[#D4AF37]/30 transition-all group"
                            >
                                <span className="text-gray-300 group-hover:text-white transition-colors">Edit Profile</span>
                                <ChevronLeft className="rotate-180 text-gray-500 group-hover:text-[#D4AF37] transition-colors" size={20} />
                            </button>
                        </div>

                        <Button variant="outline" className="w-full mt-8" onClick={handleLogout}>
                            Log Out
                        </Button>
                    </>
                ) : (
                    <form onSubmit={handleSave} className="space-y-6 animate-in slide-in-from-right-8 duration-300">
                        <div className="space-y-4">
                            <div className="group">
                                <label className="block text-[#D4AF37] text-[10px] font-bold uppercase tracking-widest mb-2">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    value={editForm.name}
                                    onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                                    className="input-premium w-full bg-white/5 border border-[#D4AF37]/30 p-4 text-white focus:outline-none focus:border-[#D4AF37] transition-all"
                                />
                            </div>
                            <div className="group">
                                <label className="block text-[#D4AF37] text-[10px] font-bold uppercase tracking-widest mb-2">Phone Number</label>
                                <input
                                    type="tel"
                                    required
                                    value={editForm.phone}
                                    onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                                    className="input-premium w-full bg-white/5 border border-[#D4AF37]/30 p-4 text-white focus:outline-none focus:border-[#D4AF37] transition-all"
                                />
                            </div>
                            <div className="group">
                                <label className="block text-[#D4AF37] text-[10px] font-bold uppercase tracking-widest mb-2">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    value={editForm.email}
                                    onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                                    className="input-premium w-full bg-white/5 border border-[#D4AF37]/30 p-4 text-white focus:outline-none focus:border-[#D4AF37] transition-all"
                                />
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <Button className="flex-1">Save Changes</Button>
                            <Button type="button" variant="ghost" onClick={() => setIsEditing(false)} className="flex-1">Cancel</Button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

// --- Main Application ---

const EventBookingApp = () => {
    const [view, setView] = useState('home'); // home, detail, booking, checkout, success, tickets, profile
    const [selectedEvent, setSelectedEvent] = useState<any>(null);
    const [ticketData, setTicketData] = useState<any>(null);

    return (
        <div className="bg-[#050505] min-h-screen text-white font-inter selection:bg-[#D4AF37] selection:text-black">
            <div className="max-w-md lg:max-w-2xl mx-auto min-h-screen bg-[#050505] md:shadow-2xl md:border-x md:border-[#D4AF37]/20 relative overflow-hidden">

                {/* Background Gradients */}
                <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
                    <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#D4AF37]/10 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#C21E56]/10 rounded-full blur-[120px]" />
                </div>

                <div className="relative z-10">
                    {view === 'home' && <HomeView setView={setView} setSelectedEvent={setSelectedEvent} />}
                    {view === 'detail' && <EventDetailView selectedEvent={selectedEvent} setView={setView} />}
                    {view === 'checkout' && <CheckoutView setView={setView} setTicketData={setTicketData} />}
                    {view === 'success' && <SuccessView selectedEvent={selectedEvent} ticketData={ticketData} setView={setView} />}
                    {view === 'tickets' && <TicketsView setView={setView} />}
                    {view === 'profile' && <ProfileView setView={setView} />}
                </div>

                {/* Bottom Nav */}
                <div className="fixed bottom-0 left-0 right-0 p-3 md:p-4 z-40">
                    <nav className="mx-auto max-w-md lg:max-w-2xl bg-black/90 backdrop-blur-xl border border-[#D4AF37]/30 px-4 md:px-8 py-3 md:py-4 flex justify-around items-center shadow-lg shadow-black/50 rounded-lg md:rounded-none">
                        <button
                            onClick={() => setView('home')}
                            className={`${view === 'home' ? 'text-[#D4AF37]' : 'text-gray-400'} hover:text-white active:text-[#D4AF37] transition-colors flex flex-col items-center gap-1 min-w-[60px] md:min-w-[80px] py-2`}
                        >
                            <PartyPopper size={24} className="md:w-6 md:h-6" />
                            <span className="text-[9px] md:text-[10px] font-medium uppercase tracking-wider">Events</span>
                        </button>
                        <button
                            onClick={() => setView('tickets')}
                            className={`${view === 'tickets' ? 'text-[#D4AF37]' : 'text-gray-400'} hover:text-white active:text-[#D4AF37] transition-colors flex flex-col items-center gap-1 min-w-[60px] md:min-w-[80px] py-2`}
                        >
                            <Ticket size={24} className="md:w-6 md:h-6" />
                            <span className="text-[9px] md:text-[10px] font-medium uppercase tracking-wider">Tickets</span>
                        </button>
                        <button
                            onClick={() => setView('profile')}
                            className={`${view === 'profile' ? 'text-[#D4AF37]' : 'text-gray-400'} hover:text-white active:text-[#D4AF37] transition-colors flex flex-col items-center gap-1 min-w-[60px] md:min-w-[80px] py-2`}
                        >
                            <Users size={24} className="md:w-6 md:h-6" />
                            <span className="text-[9px] md:text-[10px] font-medium uppercase tracking-wider">Profile</span>
                        </button>
                    </nav>
                </div>
            </div>
        </div>
    );
};

export default EventBookingApp;
