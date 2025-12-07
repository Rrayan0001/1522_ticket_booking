"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';
import { useRouter, usePathname } from 'next/navigation';

// API URL - uses environment variable in production, localhost in development
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

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
    Mic2,
    X,
    Sparkles,
    Instagram,
    ExternalLink
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
        venue: "1522, The Pub Sahakar Nagar",
        image: "/assets/event_poster.png",
        backdrop: "/assets/event_poster.png",
        description: "Experience an electrifying night of Folk-Electronica at its finest! Presented by An Audio Affair in association with 1522, The Pub Sahakar Nagar. Enjoy unlimited food & drinks while grooving to premium live music.",
        artist: "An Audio Affair",
        artists: [
            {
                name: "The Two Eyed Wizard",
                role: "Headliner"
            },
            {
                name: "The Isai Tonic Collective",
                role: "Opening Act"
            }
        ],
        features: [
            "Unlimited Food & Drinks",
            "Folk-Electronica Fusion",
            "Top Notch Visuals",
            "DJ Set",
            "Premium Live Performances"
        ],
        vibe: {
            dj: "DJ Set (Surprise)",
            instagram: "@1522thepub"
        },
        bandMembers: [
            { name: "Prasmatazz", handle: "prasmatazz", role: "Artist" },
            { name: "Abhishek Sebastian", handle: "abhishek.sebastian111", role: "Artist" },
            { name: "Brandon Colaco", handle: "brandoncolaco", role: "Artist" },
            { name: "Karthikeyn Zagora", handle: "karthikeyn.zagora", role: "Drums & Percussion" },
            { name: "An Audio Affair", handle: "anaudioaffair", role: "Event Partner" }
        ]
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

const GST_RATE = 0.18; // 18% GST for entertainment services in India

const TICKET_TYPES: any = {
    'BREW': {
        basePrice: 2500,
        price: Math.round(2500 * (1 + GST_RATE)), // 2950 with GST
        label: 'Stereo Sutra – Brew Pass (Unlimited Food + Unlimited Beer)'
    },
    'SPIRITS': {
        basePrice: 3000,
        price: Math.round(3000 * (1 + GST_RATE)), // 3540 with GST
        label: 'Stereo Sutra – Spirits Pass (Unlimited Food + Unlimited IMFL)'
    },
    'ELITE': {
        basePrice: 5000,
        price: Math.round(5000 * (1 + GST_RATE)), // 5900 with GST
        label: 'Stereo Sutra – Elite Pass (Unlimited Food + Unlimited Premium Liquor)'
    }
};

// --- Components ---

const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false, type = 'button', ...props }: any) => {
    const baseStyle = "min-h-[48px] px-6 py-3 md:py-4 rounded-none font-semibold transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-2 tracking-widest uppercase font-playfair text-sm md:text-base";
    const variants: any = {
        primary: "bg-gradient-to-r from-[#D4AF37] to-[#FADA5E] text-black shadow-lg shadow-[#D4AF37]/30 hover:shadow-[#D4AF37]/50 active:shadow-[#D4AF37]/70",
        secondary: "bg-white/10 text-white backdrop-blur-md hover:bg-white/20 border border-white/10 active:bg-white/30",
        outline: "border-2 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37]/10 active:bg-[#D4AF37]/20",
        ghost: "text-gray-400 hover:text-white active:text-[#D4AF37]"
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyle} ${variants[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            {...props}
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

// Policy Footer for Razorpay compliance
const PolicyFooter = () => (
    <div className="bg-black/60 border-t border-[#D4AF37]/20 py-6 px-4 mt-8 mb-24">
        <div className="max-w-md mx-auto text-center">
            <p className="text-gray-500 text-xs mb-3">An Audio Affair © 2024</p>
            <div className="flex flex-wrap justify-center gap-3 text-[10px] text-gray-400">
                <Link href="/contact" className="hover:text-[#D4AF37] transition-colors">Contact Us</Link>
                <span className="text-gray-600">•</span>
                <Link href="/terms" className="hover:text-[#D4AF37] transition-colors">Terms & Conditions</Link>
                <span className="text-gray-600">•</span>
                <Link href="/privacy" className="hover:text-[#D4AF37] transition-colors">Privacy Policy</Link>
                <span className="text-gray-600">•</span>
                <Link href="/refunds" className="hover:text-[#D4AF37] transition-colors">Refund Policy</Link>
                <span className="text-gray-600">•</span>
                <Link href="/shipping" className="hover:text-[#D4AF37] transition-colors">Shipping Policy</Link>
            </div>
        </div>
    </div>
);

const EventCard = ({ event, onClick, className = '' }: any) => (
    <div
        onClick={() => onClick(event)}
        className={`group relative flex-shrink-0 cursor-pointer snap-start ${className || 'w-64 md:w-72 lg:w-80'}`}
    >
        <div className="aspect-[2/3] overflow-hidden relative mb-4 shadow-2xl transition-transform duration-300 group-hover:-translate-y-2 group-active:translate-y-0 border-2 border-[#D4AF37]/40 animate-pulse-border">
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80 z-10" />
            <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-contain p-2 transform group-hover:scale-105 transition-transform duration-700"
            />
            {/* Tap hint overlay - visible on mobile */}
            <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/90 to-transparent p-4 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex items-center justify-center gap-2 text-[#D4AF37]">
                    <span className="text-2xl animate-bounce">👆</span>
                    <span className="text-sm font-semibold tracking-wider uppercase">Tap to view details</span>
                </div>
            </div>
        </div>
        <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">An Audio Affair brings you</p>
        <h3 className="text-[#D4AF37] font-bold text-base md:text-lg lg:text-xl truncate font-playfair group-hover:text-white transition-colors">{event.title}</h3>
        <p className="text-gray-400 text-sm md:text-base">{event.genre.join(", ")}</p>
    </div>
);

const OfferDetailBanner = () => (
    <div className="w-full bg-gradient-to-r from-[#D4AF37]/20 via-[#D4AF37]/10 to-[#D4AF37]/20 border-y border-[#D4AF37]/30 py-3 mb-6 relative overflow-hidden">
        <div className="flex items-center justify-center gap-3 animate-pulse">
            <Sparkles size={16} className="text-[#D4AF37]" />
            <span className="text-[#D4AF37] font-bold text-sm tracking-wider uppercase font-space text-center">
                Special Offer: Get ₹250 to ₹500 off with Student ID
            </span>
            <Sparkles size={16} className="text-[#D4AF37]" />
        </div>
    </div>
);

// Scrolling Offer Marquee - Like GoDaddy style ticker
const ScrollingOfferMarquee = () => {
    const offers = [
        "🎵 Student Discount: ₹250 - ₹500 OFF with Valid ID",
        "✨ Limited Seats Available - Book Now!",
        "🎫 Early Bird Discount Ending Soon",
        "🔥 Premium Experience at 1522, The Pub Sahakar Nagar",
        "🎶 Folk-Electronica Fusion with Stereo Sutra"
    ];

    return (
        <div className="w-full bg-gradient-to-r from-[#D4AF37] via-[#FADA5E] to-[#D4AF37] py-3 overflow-hidden relative">
            <div className="flex animate-marquee whitespace-nowrap">
                {[...offers, ...offers, ...offers].map((offer, index) => (
                    <span key={index} className="text-black font-bold text-sm mx-8 flex items-center gap-2">
                        {offer}
                        <span className="mx-4 text-[#8B6914]">•</span>
                    </span>
                ))}
            </div>
            <style jsx>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-33.33%); }
                }
                .animate-marquee {
                    animation: marquee 20s linear infinite;
                }
            `}</style>
        </div>
    );
};

// --- Views ---

const HomeView = ({ setView, setSelectedEvent }: any) => {
    const [userName, setUserName] = useState('');

    useEffect(() => {
        const saved = localStorage.getItem('userProfile');
        if (saved) {
            try {
                const profile = JSON.parse(saved);
                setUserName(profile.name || '');
            } catch (e) {
                setUserName('');
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
                    <span className="text-[#D4AF37] text-xs font-medium mb-1 tracking-[0.2em] uppercase animate-in slide-in-from-left-4 duration-700 delay-100">Welcome to An Audio Affair</span>
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

            {/* Scrolling Offer Ticker */}
            <ScrollingOfferMarquee />

            {/* Single Event Display */}
            <div className="px-6 md:px-8 pb-8 animate-in zoom-in-95 duration-700 delay-300">
                <EventCard
                    event={EVENTS[0]}
                    onClick={handleEventClick}
                    className="w-full max-w-sm mx-auto"
                />
            </div>

            {/* Policy Footer */}
            <PolicyFooter />
        </div>
    );
};

const EventDetailView = ({ selectedEvent, setView }: any) => {
    const [showArtistModal, setShowArtistModal] = useState(false);
    const [showInstagramModal, setShowInstagramModal] = useState(false);

    return (
        <div className="relative min-h-screen bg-[#050505] pb-48 animate-in slide-in-from-bottom-8 duration-500">
            {/* Artist Modal */}
            {showArtistModal && (
                <div
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in fade-in duration-300"
                    onClick={() => setShowArtistModal(false)}
                >
                    <div
                        className="bg-gradient-to-br from-[#0a0a0a] to-[#151515] border border-[#D4AF37]/30 w-full max-w-sm overflow-hidden shadow-2xl shadow-[#D4AF37]/10 animate-in zoom-in-95 slide-in-from-bottom-4 duration-500"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="relative bg-gradient-to-r from-[#D4AF37]/20 to-[#D4AF37]/5 p-6 border-b border-[#D4AF37]/20">
                            <button
                                onClick={() => setShowArtistModal(false)}
                                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/50 flex items-center justify-center">
                                    <Music size={20} className="text-[#D4AF37]" />
                                </div>
                                <div>
                                    <h3 className="text-[#D4AF37] font-bold text-xl font-playfair">Artists</h3>
                                    <p className="text-gray-400 text-xs tracking-wider uppercase">Performing Live</p>
                                </div>
                            </div>
                        </div>

                        {/* Artists List */}
                        <div className="p-6 space-y-4">
                            {selectedEvent.artists?.map((artist: any, index: number) => (
                                <div
                                    key={artist.name}
                                    className={`flex items-center gap-4 p-4 border transition-all duration-300 hover:scale-[1.02] ${artist.role === 'Headliner'
                                        ? 'bg-gradient-to-r from-[#D4AF37]/15 to-transparent border-[#D4AF37]/40'
                                        : 'bg-white/5 border-white/10'
                                        }`}
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    {/* Artist Avatar */}
                                    <div className={`w-16 h-16 rounded-full flex items-center justify-center overflow-hidden border-2 ${artist.role === 'Headliner'
                                        ? 'border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.3)] bg-gradient-to-br from-[#D4AF37]/30 to-[#D4AF37]/10'
                                        : 'border-white/20 bg-gradient-to-br from-white/10 to-transparent'
                                        }`}>
                                        <Music size={24} className={artist.role === 'Headliner' ? 'text-[#D4AF37]' : 'text-gray-400'} />
                                    </div>

                                    {/* Artist Info */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            {artist.role === 'Headliner' && (
                                                <Sparkles size={14} className="text-[#D4AF37]" />
                                            )}
                                            <span className={`text-[10px] uppercase tracking-widest font-bold ${artist.role === 'Headliner' ? 'text-[#D4AF37]' : 'text-gray-500'
                                                }`}>
                                                {artist.role}
                                            </span>
                                        </div>
                                        <h4 className={`font-bold text-lg font-playfair ${artist.role === 'Headliner' ? 'text-white' : 'text-gray-200'
                                            }`}>
                                            {artist.name}
                                        </h4>
                                    </div>

                                    {/* Decorative element for headliner */}
                                    {artist.role === 'Headliner' && (
                                        <div className="w-8 h-8 flex items-center justify-center">
                                            <Star size={20} className="text-[#D4AF37] fill-[#D4AF37]" />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 pb-6">
                            <button
                                onClick={() => setShowArtistModal(false)}
                                className="w-full py-3 bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] font-semibold uppercase tracking-wider text-sm hover:bg-[#D4AF37]/20 transition-all"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
                </div>

                <p className="text-gray-300 leading-relaxed mb-6 text-sm md:text-base font-inter border-l-2 border-[#D4AF37] pl-4 animate-in slide-in-from-bottom-8 duration-700 delay-200">
                    {selectedEvent.description}
                </p>

                {/* Offer Banner */}
                <OfferDetailBanner />

                <div className="grid grid-cols-2 gap-4 mb-8 animate-in slide-in-from-bottom-8 duration-700 delay-300">
                    <div className="bg-white/5 p-4 border border-[#D4AF37]/20 hover:bg-white/10 transition-colors duration-300">
                        <span className="text-[#D4AF37] text-xs block mb-1 uppercase tracking-widest">Date & Time</span>
                        <span className="text-white font-medium">{selectedEvent.date}</span>
                        <span className="text-gray-400 text-xs block mt-1">{selectedEvent.time}</span>
                    </div>
                    {/* Clickable Artist Section */}
                    <button
                        onClick={() => setShowArtistModal(true)}
                        className="bg-white/5 p-4 border border-[#D4AF37]/20 hover:bg-[#D4AF37]/10 hover:border-[#D4AF37]/50 transition-all duration-300 text-left group cursor-pointer relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/0 via-[#D4AF37]/5 to-[#D4AF37]/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                        <span className="text-[#D4AF37] text-xs block mb-1 uppercase tracking-widest flex items-center gap-2">
                            Artist
                            <span className="text-[10px] px-1.5 py-0.5 bg-[#D4AF37]/20 rounded text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-black transition-colors">TAP</span>
                        </span>
                        <span className="text-white font-medium group-hover:text-[#D4AF37] transition-colors">{selectedEvent.artist}</span>
                        <span className="text-gray-500 text-xs block mt-1 group-hover:text-gray-300 transition-colors">Tap to see lineup →</span>
                    </button>
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

                {/* Artist Details Section */}
                {selectedEvent.vibe && (
                    <div className="mb-8 animate-in slide-in-from-bottom-8 duration-700 delay-500">
                        <span className="text-[#D4AF37] text-xs block mb-3 uppercase tracking-widest">Artist Details</span>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-gradient-to-br from-[#D4AF37]/10 to-transparent border border-[#D4AF37]/20 text-center">
                                <div className="text-[#D4AF37] mb-2 flex justify-center"><Mic2 size={20} /></div>
                                <p className="text-white text-sm font-bold">{selectedEvent.vibe.dj}</p>
                            </div>
                            <button
                                onClick={() => setShowInstagramModal(true)}
                                className="p-4 bg-gradient-to-br from-[#C21E56]/10 to-transparent border border-[#C21E56]/20 text-center hover:from-[#C21E56]/20 hover:border-[#C21E56]/40 transition-all duration-300 group cursor-pointer"
                            >
                                <div className="text-[#C21E56] flex justify-center group-hover:scale-110 transition-transform duration-300">
                                    <Instagram size={28} />
                                </div>
                            </button>
                        </div>
                    </div>
                )}

                {/* Instagram Handles Modal */}
                {showInstagramModal && (
                    <div
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in fade-in duration-300"
                        onClick={() => setShowInstagramModal(false)}
                    >
                        <div
                            className="bg-gradient-to-br from-[#0a0a0a] to-[#151515] border border-[#C21E56]/30 w-full max-w-sm overflow-hidden shadow-2xl shadow-[#C21E56]/10 animate-in zoom-in-95 slide-in-from-bottom-4 duration-500"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="relative bg-gradient-to-r from-[#C21E56]/20 to-[#C21E56]/5 p-6 border-b border-[#C21E56]/20">
                                <button
                                    onClick={() => setShowInstagramModal(false)}
                                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                                >
                                    <X size={20} />
                                </button>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#833AB4] via-[#C21E56] to-[#F77737] flex items-center justify-center">
                                        <Instagram size={20} className="text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-bold text-xl font-playfair">Connect</h3>
                                        <p className="text-gray-400 text-xs tracking-wider uppercase">Follow The Artists</p>
                                    </div>
                                </div>
                            </div>

                            {/* Instagram Handles List */}
                            <div className="p-4 space-y-2 max-h-[50vh] overflow-y-auto">
                                {selectedEvent.bandMembers?.map((member: any, index: number) => (
                                    <a
                                        key={member.handle}
                                        href={`https://instagram.com/${member.handle}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 p-3 border border-white/5 hover:border-[#C21E56]/30 bg-white/5 hover:bg-gradient-to-r hover:from-[#C21E56]/10 hover:to-transparent transition-all duration-300 group"
                                        style={{ animationDelay: `${index * 50}ms` }}
                                    >
                                        {/* Instagram Gradient Avatar */}
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#833AB4] via-[#C21E56] to-[#F77737] p-[2px] flex-shrink-0">
                                            <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                                                <span className="text-white font-bold text-sm">{member.name.charAt(0)}</span>
                                            </div>
                                        </div>

                                        {/* Handle Info */}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white font-medium text-sm truncate group-hover:text-[#C21E56] transition-colors">@{member.handle}</p>
                                            <p className="text-gray-500 text-xs truncate">{member.role}</p>
                                        </div>

                                        {/* External Link Icon */}
                                        <ExternalLink size={16} className="text-gray-600 group-hover:text-[#C21E56] transition-colors flex-shrink-0" />
                                    </a>
                                ))}
                            </div>

                            {/* Modal Footer */}
                            <div className="px-4 pb-4">
                                <button
                                    onClick={() => setShowInstagramModal(false)}
                                    className="w-full py-3 bg-gradient-to-r from-[#833AB4]/20 via-[#C21E56]/20 to-[#F77737]/20 border border-[#C21E56]/30 text-white font-semibold uppercase tracking-wider text-sm hover:from-[#833AB4]/30 hover:via-[#C21E56]/30 hover:to-[#F77737]/30 transition-all"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="fixed bottom-24 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-black via-black to-transparent z-30">
                <div className="max-w-md lg:max-w-lg mx-auto">
                    <Button onClick={() => setView('checkout')} className="w-full text-base md:text-lg shadow-xl shadow-[#D4AF37]/20">
                        <Ticket size={20} className="mr-2" />
                        Get Tickets
                    </Button>
                </div>
            </div>
        </div>
    );
};

const CheckoutView = ({ setView, setTicketData }: any) => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: ''
    });
    const [ticketType, setTicketType] = useState<keyof typeof TICKET_TYPES>('BREW');
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');

    // Email OTP verification states
    const [step, setStep] = useState<'form' | 'otp' | 'payment'>('form');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [otpError, setOtpError] = useState('');
    const [emailVerified, setEmailVerified] = useState(false);
    const [ageConfirmed, setAgeConfirmed] = useState(false);

    // Student discount states
    const [studentIdFile, setStudentIdFile] = useState<File | null>(null);
    const [isVerifyingId, setIsVerifyingId] = useState(false);
    const [studentDiscount, setStudentDiscount] = useState<{
        isEligible: boolean;
        validTillYear: number | null;
        studentName: string | null;
        collegeName: string | null;
        message: string;
    } | null>(null);
    const [studentError, setStudentError] = useState('');

    // Calculate discount based on ticket type
    const getDiscount = (type: keyof typeof TICKET_TYPES) => {
        if (!studentDiscount?.isEligible) return 0;
        // BREW (₹2500) gets ₹500 off, SPIRITS (₹3000) and ELITE (₹5000) get ₹250 off
        if (type === 'BREW') return 500;
        return 250; // SPIRITS and ELITE
    };

    const getFinalPrice = () => {
        const basePrice = TICKET_TYPES[ticketType].price;
        const discount = getDiscount(ticketType);
        return basePrice - discount;
    };

    useEffect(() => {
        const savedProfile = localStorage.getItem('userProfile');
        if (savedProfile) {
            setFormData(JSON.parse(savedProfile));
        }

        // Load Razorpay script
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const handleStudentIdUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setStudentIdFile(file);
            setStudentDiscount(null);
            setStudentError('');
            setIsVerifyingId(true);

            try {
                const formData = new FormData();
                formData.append('id_card', file);

                const res = await fetch(`${API_URL}/api/student/verify-student-id`, {
                    method: 'POST',
                    body: formData
                });

                const result = await res.json();

                if (res.ok && result.success) {
                    setStudentDiscount({
                        isEligible: result.is_eligible,
                        validTillYear: result.valid_till_year,
                        studentName: result.student_name,
                        collegeName: result.college_name,
                        message: result.message
                    });
                } else {
                    setStudentError(result.details || result.error || 'Could not verify student ID');
                    setStudentIdFile(null);
                }
            } catch (err) {
                console.error('Student ID verification error:', err);
                setStudentError('Error verifying student ID. Please try again.');
                setStudentIdFile(null);
            } finally {
                setIsVerifyingId(false);
            }
        }
    };

    // Send OTP to email
    const handleSendOtp = async () => {
        setError('');
        setOtpError('');

        if (!formData.name.trim()) {
            setError('Please enter your name');
            return;
        }

        if (!/^[6-9]\d{9}$/.test(formData.phone)) {
            setError('Please enter a valid 10-digit Indian mobile number');
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            setError('Please enter a valid email address');
            return;
        }

        if (!ageConfirmed) {
            setError('Please confirm that you are 21+ years of age');
            return;
        }

        setIsProcessing(true);

        try {
            // Import supabase dynamically
            const { supabase } = await import('@/lib/supabase');

            const { error } = await supabase.auth.signInWithOtp({
                email: formData.email,
                options: {
                    shouldCreateUser: true
                }
            });

            if (error) {
                setOtpError(error.message);
            } else {
                setOtpSent(true);
                setStep('otp');
            }
        } catch (err) {
            console.error('OTP Error:', err);
            setOtpError('Failed to send OTP. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    // Verify OTP
    const handleVerifyOtp = async () => {
        if (!otp || otp.length !== 8) {
            setOtpError('Please enter a valid 8-digit OTP');
            return;
        }

        setIsProcessing(true);
        setOtpError('');

        try {
            const { supabase } = await import('@/lib/supabase');

            const { data, error } = await supabase.auth.verifyOtp({
                email: formData.email,
                token: otp,
                type: 'email'
            });

            if (error) {
                setOtpError(error.message);
            } else if (data?.user) {
                setEmailVerified(true);
                setStep('payment');
                // Save verified profile
                localStorage.setItem('userProfile', JSON.stringify(formData));
                localStorage.setItem('verifiedEmail', formData.email);
            }
        } catch (err) {
            console.error('OTP Verification Error:', err);
            setOtpError('Failed to verify OTP. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Ensure email is verified
        if (!emailVerified) {
            setError('Please verify your email first');
            return;
        }

        setIsProcessing(true);

        // Save profile
        localStorage.setItem('userProfile', JSON.stringify(formData));

        const finalAmount = getFinalPrice();

        try {
            // Step 1: Create order on backend
            const orderRes = await fetch(`${API_URL}/api/razorpay/create-order`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: finalAmount,
                    ticket_type: ticketType,
                    customer_name: formData.name,
                    customer_phone: formData.phone,
                    customer_email: formData.email
                })
            });

            const orderData = await orderRes.json();

            if (!orderRes.ok) {
                throw new Error(orderData.error || 'Failed to create order');
            }

            // Step 2: Open Razorpay checkout
            const options = {
                key: orderData.key_id,
                amount: orderData.amount,
                currency: orderData.currency,
                name: 'An Audio Affair',
                description: TICKET_TYPES[ticketType].label + (studentDiscount?.isEligible ? ' (Student Discount Applied)' : ''),
                order_id: orderData.order_id,
                prefill: {
                    name: formData.name,
                    email: formData.email,
                    contact: formData.phone
                },
                theme: {
                    color: '#D4AF37'
                },
                handler: async function (response: any) {
                    // Step 3: Verify payment on backend
                    try {
                        const verifyRes = await fetch(`${API_URL}/api/razorpay/verify-payment`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                customer_name: formData.name,
                                customer_phone: formData.phone,
                                customer_email: formData.email,
                                ticket_type: ticketType,
                                price: finalAmount
                            })
                        });

                        const verifyData = await verifyRes.json();

                        if (verifyRes.ok && verifyData.success) {
                            setTicketData(verifyData.ticket);

                            // Save to localStorage
                            const stored = JSON.parse(localStorage.getItem('tickets') || '[]');
                            localStorage.setItem('tickets', JSON.stringify([...stored, verifyData.ticket.ticket_id]));

                            setView('success');
                        } else {
                            setError(verifyData.error || 'Payment verification failed');
                        }
                    } catch (err) {
                        console.error('Verification error:', err);
                        setError('Payment verification failed. Please contact support.');
                    }
                    setIsProcessing(false);
                },
                modal: {
                    ondismiss: function () {
                        setIsProcessing(false);
                    }
                }
            };

            const razorpay = new (window as any).Razorpay(options);
            razorpay.on('payment.failed', function (response: any) {
                setError(`Payment failed: ${response.error.description}`);
                setIsProcessing(false);
            });
            razorpay.open();

        } catch (err: any) {
            console.error('Payment error:', err);
            setError(err.message || 'Something went wrong. Please try again.');
            setIsProcessing(false);
        }
    };

    return (
        <div className="h-screen flex flex-col animate-in slide-in-from-right-8 duration-500 bg-[#050505]">
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

            <div className="flex-1 overflow-y-auto p-6 md:p-8 pb-64">
                <form onSubmit={handlePayment} className="max-w-md mx-auto space-y-6">
                    {error && (
                        <div className="bg-red-900/20 border border-red-500/50 text-red-400 p-4 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Offer Banner */}
                    <OfferDetailBanner />

                    {/* Ticket Selection */}
                    <div>
                        <label className="block text-[#D4AF37] text-xs font-bold uppercase tracking-widest mb-2">Select Ticket Type</label>
                        <div className="grid grid-cols-1 gap-3">
                            {Object.entries(TICKET_TYPES).map(([type, details]: [string, any]) => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => setTicketType(type as any)}
                                    className={`flex flex-col p-4 border transition-all ${ticketType === type ? 'bg-[#D4AF37] border-[#D4AF37] text-black' : 'bg-white/5 border-[#D4AF37]/20 text-gray-400 hover:bg-white/10'}`}
                                >
                                    <div className="flex justify-between items-center w-full">
                                        <span className="font-bold font-playfair text-left text-sm">{details.label}</span>
                                    </div>
                                    <div className="flex justify-between items-center w-full mt-2 pt-2 border-t border-current/20">
                                        <span className={`text-xs ${ticketType === type ? 'text-black/70' : 'text-gray-500'}`}>
                                            ₹{details.basePrice} + 18% GST
                                        </span>
                                        <span className="font-mono font-bold text-lg">₹{details.price}</span>
                                    </div>
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
                                maxLength={10}
                                pattern="[6-9][0-9]{9}"
                                value={formData.phone}
                                onChange={e => {
                                    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                                    setFormData({ ...formData, phone: value });
                                }}
                                className="input-premium w-full bg-white/5 border border-[#D4AF37]/30 p-3 md:p-4 text-white text-base focus:outline-none focus:border-[#D4AF37] focus:shadow-[0_0_15px_rgba(212,175,55,0.15)] transition-all duration-300 rounded-sm"
                                placeholder="Enter 10-digit mobile number"
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

                        {/* Student ID Upload - Enhanced Offer Visibility */}
                        <div className="pt-4 border-t border-[#D4AF37]/30 bg-gradient-to-r from-[#D4AF37]/10 via-transparent to-[#D4AF37]/10 -mx-4 px-4 py-4 relative">
                            <div className="absolute -top-3 right-4 bg-gradient-to-r from-[#D4AF37] to-[#FADA5E] text-black text-[10px] font-bold px-3 py-1 rounded-full tracking-wider uppercase flex items-center gap-1">
                                <Sparkles size={10} />
                                Best Value
                            </div>
                            <label className="block text-[#D4AF37] text-[10px] md:text-xs font-bold uppercase tracking-widest mb-2">
                                🎓 Student Discount (Optional)
                            </label>
                            <p className="text-gray-400 text-xs mb-3 font-semibold">Get ₹250-₹500 off with a valid college ID! ✨</p>

                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleStudentIdUpload}
                                className="hidden"
                                id="student-id-upload"
                            />
                            <label
                                htmlFor="student-id-upload"
                                className={`flex items-center justify-center gap-2 w-full p-4 border-2 border-dashed transition-all cursor-pointer ${studentIdFile
                                    ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                                    : 'border-gray-600 hover:border-[#D4AF37] hover:bg-white/5'
                                    } min-h-[60px] touch-manipulation`}
                            >
                                {isVerifyingId ? (
                                    <span className="flex items-center gap-2 text-[#D4AF37]">
                                        <div className="w-5 h-5 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
                                        Verifying ID...
                                    </span>
                                ) : studentIdFile ? (
                                    <span className="text-[#D4AF37] font-medium truncate">{studentIdFile.name}</span>
                                ) : (
                                    <>
                                        <CreditCard size={20} className="text-gray-400" />
                                        <span className="text-gray-400 text-sm">Tap to upload Student ID</span>
                                    </>
                                )}
                            </label>

                            {/* Student verification result */}
                            {studentDiscount && (
                                <div className={`mt-3 p-3 border ${studentDiscount.isEligible ? 'bg-green-900/20 border-green-500/30' : 'bg-yellow-900/20 border-yellow-500/30'}`}>
                                    {studentDiscount.isEligible ? (
                                        <>
                                            <p className="text-green-400 text-sm font-semibold">✓ Student Discount Applied!</p>
                                            <p className="text-green-300 text-xs mt-1">{studentDiscount.message}</p>
                                            {studentDiscount.collegeName && (
                                                <p className="text-green-300/70 text-xs mt-1">{studentDiscount.collegeName}</p>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            <p className="text-yellow-400 text-sm font-semibold">⚠ Not Eligible</p>
                                            <p className="text-yellow-300 text-xs mt-1">{studentDiscount.message}</p>
                                        </>
                                    )}
                                </div>
                            )}

                            {studentError && (
                                <div className="mt-3 p-3 bg-red-900/20 border border-red-500/30">
                                    <p className="text-red-400 text-sm">{studentError}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="pt-6 border-t border-[#D4AF37]/20">
                        <h3 className="text-[#D4AF37] font-bold text-lg font-playfair mb-4">Order Summary</h3>
                        <div className="bg-white/5 p-4 border border-[#D4AF37]/20 space-y-3">
                            <div className="flex justify-between text-gray-400">
                                <span>Ticket Type</span>
                                <span className="text-white">{String(ticketType)}</span>
                            </div>
                            <div className="flex justify-between text-gray-400">
                                <span>Original Price</span>
                                <span className="text-white">₹{TICKET_TYPES[ticketType].price}</span>
                            </div>
                            {studentDiscount?.isEligible && (
                                <div className="flex justify-between text-green-400">
                                    <span>🎓 Student Discount</span>
                                    <span>-₹{getDiscount(ticketType)}</span>
                                </div>
                            )}
                            <div className="flex justify-between pt-2 border-t border-white/10">
                                <span className="text-white font-bold">Total</span>
                                <span className="text-[#D4AF37] font-bold text-xl">₹{getFinalPrice()}</span>
                            </div>
                        </div>

                        <div className="mt-4 p-3 bg-green-900/20 border border-green-500/30 text-center">
                            <p className="text-green-400 text-sm">🔒 Secure payment powered by Razorpay</p>
                        </div>
                    </div>

                    {/* Age Confirmation */}
                    {step === 'form' && (
                        <div className="flex items-start gap-3 p-4 bg-white/5 border border-[#D4AF37]/20">
                            <input
                                type="checkbox"
                                id="age-confirm"
                                checked={ageConfirmed}
                                onChange={(e) => setAgeConfirmed(e.target.checked)}
                                className="w-5 h-5 mt-1 accent-[#D4AF37]"
                            />
                            <label htmlFor="age-confirm" className="text-gray-300 text-sm">
                                I confirm that I am <span className="text-[#D4AF37] font-bold">21+ years</span> of age and agree to the terms and conditions.
                            </label>
                        </div>
                    )}

                    {/* OTP Step */}
                    {step === 'otp' && (
                        <div className="space-y-4 p-4 bg-[#D4AF37]/5 border border-[#D4AF37]/30">
                            <p className="text-center text-gray-300 text-sm">
                                We sent an 8-digit OTP to <span className="text-[#D4AF37] font-bold">{formData.email}</span>
                            </p>
                            <input
                                type="text"
                                maxLength={8}
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 8))}
                                className="w-full bg-white/5 border border-[#D4AF37]/30 p-4 text-white text-2xl text-center tracking-[0.5em] font-mono focus:outline-none focus:border-[#D4AF37]"
                                placeholder="• • • • • •"
                            />
                            {otpError && (
                                <p className="text-red-400 text-sm text-center">{otpError}</p>
                            )}
                            <button
                                type="button"
                                onClick={() => { setStep('form'); setOtp(''); setOtpError(''); }}
                                className="text-gray-400 text-sm underline"
                            >
                                ← Change email
                            </button>
                        </div>
                    )}

                    {/* Email Verified Badge */}
                    {emailVerified && (
                        <div className="flex items-center gap-2 p-3 bg-green-900/30 border border-green-500/50">
                            <CheckCircle2 size={20} className="text-green-400" />
                            <span className="text-green-400 text-sm">Email verified: {formData.email}</span>
                        </div>
                    )}

                    {/* Action Buttons based on step */}
                    {step === 'form' && (
                        <Button
                            type="button"
                            onClick={handleSendOtp}
                            disabled={isProcessing}
                            className="w-full mt-4"
                        >
                            {isProcessing ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                                    Sending OTP...
                                </span>
                            ) : (
                                'Verify Email & Continue'
                            )}
                        </Button>
                    )}

                    {step === 'otp' && (
                        <Button
                            type="button"
                            onClick={handleVerifyOtp}
                            disabled={isProcessing || otp.length !== 8}
                            className="w-full mt-4"
                        >
                            {isProcessing ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                                    Verifying...
                                </span>
                            ) : (
                                'Verify OTP'
                            )}
                        </Button>
                    )}

                    {step === 'payment' && (
                        <Button
                            type="submit"
                            disabled={isProcessing || isVerifyingId}
                            className="w-full mt-4"
                        >
                            {isProcessing ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                                    Processing...
                                </span>
                            ) : (
                                `Pay ₹${getFinalPrice()}`
                            )}
                        </Button>
                    )}
                </form>

                {/* TODO: Add content to this section */}
                <div className="mt-8 min-h-[200px] bg-[#050505]"></div>
            </div>
        </div>
    );
};


const FUNKY_QUOTES = [
    "🎵 \"Where words fail, music speaks\" – Let the beats take over!",
    "🎶 \"Life is one grand, sweet song, so start the music\" – Ready to groove?",
    "🔊 \"Music is the strongest form of magic\" – An Audio Affair awaits!",
    "🎧 \"One good thing about music, when it hits you, you feel no pain\"",
    "✨ \"Without music, life would be a mistake\" – Let's make it right tonight!",
    "🎵 \"Music is the divine way to tell beautiful things to the heart\"",
    "🔥 \"Turn up the volume, let the bass drop!\" – An Audio Affair is calling!",
    "🌟 \"Feel the rhythm, feel the sound\" – Your night of magic begins soon!"
];

const SuccessView = ({ selectedEvent, ticketData, setView }: any) => {
    const randomQuote = FUNKY_QUOTES[Math.floor(Math.random() * FUNKY_QUOTES.length)];

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center animate-in zoom-in-95 duration-500 bg-[#050505]">
            {/* Success Icon */}
            <div className="w-24 h-24 rounded-full flex items-center justify-center border-2 border-[#D4AF37] shadow-[0_0_50px_rgba(212,175,55,0.3)] mb-6 animate-pulse">
                <CheckCircle2 size={48} className="text-[#D4AF37]" />
            </div>

            <h2 className="text-3xl font-bold text-[#D4AF37] mb-2 font-playfair">Booking Confirmed!</h2>
            <p className="text-gray-400 mb-4 max-w-xs mx-auto">Your ticket for <span className="text-white font-semibold">{selectedEvent?.title || 'Stereo Sutra'}</span> has been created.</p>

            {/* Funky Quote */}
            <div className="bg-gradient-to-r from-[#D4AF37]/10 via-[#D4AF37]/20 to-[#D4AF37]/10 p-4 mb-6 border-l-4 border-[#D4AF37] max-w-sm">
                <p className="text-[#D4AF37] text-sm italic">{randomQuote}</p>
            </div>

            {/* Ticket Card */}
            <div className="bg-white text-black w-full max-w-sm overflow-hidden shadow-2xl relative mb-6">
                {/* Tear Line Effect */}
                <div className="absolute top-[65%] left-0 w-4 h-4 bg-[#050505] rounded-r-full -ml-2"></div>
                <div className="absolute top-[65%] right-0 w-4 h-4 bg-[#050505] rounded-l-full -mr-2"></div>
                <div className="absolute top-[65%] left-4 right-4 border-t-2 border-dashed border-gray-300"></div>

                <div className="p-5">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">An Audio Affair Presents</p>
                            <h3 className="font-bold text-xl font-playfair">{selectedEvent?.title || 'Stereo Sutra'}</h3>
                        </div>
                        <div className="bg-[#D4AF37] text-black px-2 py-1 text-xs font-bold">
                            {ticketData?.ticket_type || 'ENTRY'}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                        <div className="flex items-center gap-2 text-gray-600">
                            <Calendar size={14} /> <span>{selectedEvent?.date || '21 DEC'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                            <Clock size={14} /> <span>{selectedEvent?.time || '8 PM - 12 AM'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 col-span-2">
                            <MapPin size={14} /> <span>1522, The Pub, Sahakar Nagar</span>
                        </div>
                    </div>

                    <div className="bg-gray-100 p-3 text-xs text-gray-500 mb-3">
                        <p className="font-semibold text-gray-700 mb-1">📋 Entry Instructions:</p>
                        <ul className="space-y-1 list-disc list-inside">
                            <li>Show this ticket at the entrance</li>
                            <li>Carry a valid photo ID</li>
                            <li>Entry for 21+ only</li>
                        </ul>
                    </div>
                </div>

                <div className="bg-gray-100 p-5 flex justify-between items-center">
                    <div className="flex flex-col text-left">
                        <span className="text-[10px] text-gray-500 uppercase tracking-widest">Ticket ID</span>
                        <span className="font-bold text-lg font-mono tracking-wider">{ticketData?.ticket_id || 'PENDING'}</span>
                    </div>
                    <div className="flex flex-col items-center">
                        {ticketData?.ticket_id ? (
                            <QRCodeSVG
                                value={ticketData.ticket_id}
                                size={64}
                                bgColor="#f3f4f6"
                                fgColor="#000000"
                                level="M"
                            />
                        ) : (
                            <div className="h-16 w-16 bg-black flex items-center justify-center">
                                <span className="text-[#D4AF37] font-bold text-xs">AAA</span>
                            </div>
                        )}
                        <span className="text-[8px] text-gray-400 mt-1">SCAN FOR ENTRY</span>
                    </div>
                </div>
            </div>

            {/* Payment Info */}
            <div className="bg-green-900/20 border border-green-500/30 p-3 mb-6 w-full max-w-sm text-left">
                <p className="text-green-400 text-sm font-semibold">✓ Payment Successful</p>
                <p className="text-green-300/70 text-xs mt-1">Amount paid: ₹{ticketData?.price || 'N/A'}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 w-full max-w-sm">
                <button
                    onClick={() => setView('tickets')}
                    className="btn-gold px-6 py-3 flex items-center justify-center text-sm tracking-widest"
                >
                    VIEW MY TICKETS
                </button>
                <Button variant="secondary" onClick={() => {
                    setView('home');
                }} className="w-full">
                    Book Another Ticket
                </Button>
            </div>

            {/* Footer Note */}
            <p className="text-gray-500 text-xs mt-6 max-w-sm">
                A confirmation has been sent to your email. See you at the event! 🎉
            </p>
        </div>
    );
};


const TicketsView = ({ setView }: any) => {
    const [tickets, setTickets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserTickets = async () => {
            // Prefer verified email, fallback to profile email
            const verifiedEmail = localStorage.getItem('verifiedEmail');
            const savedProfile = localStorage.getItem('userProfile');

            let email = verifiedEmail;
            if (!email && savedProfile) {
                try {
                    email = JSON.parse(savedProfile).email;
                } catch { }
            }

            if (!email) {
                setLoading(false);
                return;
            }

            try {
                const res = await fetch(`${API_URL}/api/tickets/user/${email}`);
                if (res.ok) {
                    const data = await res.json();
                    setTickets(data);
                }
            } catch (err) {
                console.error('Failed to fetch tickets:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserTickets();
    }, []);

    return (
        <div className="min-h-screen pb-24 animate-in fade-in duration-500">
            <div className="p-6 md:p-8 border-b border-[#D4AF37]/10 mb-6">
                <h1 className="text-2xl font-bold text-[#D4AF37] font-playfair">My Tickets</h1>
            </div>

            <div className="px-6 md:px-8">
                {loading ? (
                    <div className="text-center py-20">
                        <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-400">Loading tickets...</p>
                    </div>
                ) : tickets.length === 0 ? (
                    <div className="text-center py-20">
                        <Ticket size={48} className="mx-auto text-gray-600 mb-4" />
                        <p className="text-gray-400 text-lg mb-6 tracking-wide">No active tickets found</p>
                        <Button onClick={() => setView('checkout')}>
                            BOOK NOW
                        </Button>
                    </div>
                ) : (
                    <div className="grid gap-6 grid-cols-1">
                        {tickets.map((ticket) => (
                            <TicketCard key={ticket.ticket_id} ticketId={ticket.ticket_id} data={ticket} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const ProfileView = ({ setView }: any) => {
    const [profile, setProfile] = useState({ name: '', email: '', phone: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({ name: '', email: '', phone: '' });
    const [showHelp, setShowHelp] = useState(false);

    // Email verification states
    const [emailVerificationStep, setEmailVerificationStep] = useState<'idle' | 'sending' | 'verify'>('idle');
    const [otp, setOtp] = useState('');
    const [otpError, setOtpError] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [originalEmail, setOriginalEmail] = useState('');

    useEffect(() => {
        const saved = localStorage.getItem('userProfile');
        if (saved) {
            const parsed = JSON.parse(saved);
            setProfile(parsed);
            setEditForm(parsed);
            setOriginalEmail(parsed.email || '');
        }
    }, []);

    const handleLogout = async () => {
        if (window.confirm('Are you sure you want to log out?')) {
            localStorage.removeItem('userProfile');
            localStorage.removeItem('verifiedEmail');

            try {
                const { supabase } = await import('@/lib/supabase');
                await supabase.auth.signOut();
            } catch (e) {
                console.log('No active session to sign out from');
            }

            setProfile({ name: '', email: '', phone: '' });
            setView('home');
        }
    };

    const handleEditClick = () => {
        setEditForm(profile);
        setOriginalEmail(profile.email);
        setEmailVerificationStep('idle');
        setOtp('');
        setOtpError('');
        setIsEditing(true);
    };

    const handleSendEmailOtp = async () => {
        if (!editForm.email || !/\S+@\S+\.\S+/.test(editForm.email)) {
            setOtpError('Please enter a valid email address');
            return;
        }

        setEmailVerificationStep('sending');
        setOtpError('');

        try {
            const { supabase } = await import('@/lib/supabase');
            const { error } = await supabase.auth.signInWithOtp({
                email: editForm.email,
                options: { shouldCreateUser: true }
            });

            if (error) throw error;
            setEmailVerificationStep('verify');
        } catch (err: any) {
            setOtpError(err.message || 'Failed to send OTP');
            setEmailVerificationStep('idle');
        }
    };

    const handleVerifyEmailOtp = async () => {
        if (otp.length !== 8) {
            setOtpError('Please enter the 8-digit OTP sent to your email');
            return;
        }

        setIsVerifying(true);
        setOtpError('');

        try {
            const { supabase } = await import('@/lib/supabase');
            const { error } = await supabase.auth.verifyOtp({
                email: editForm.email,
                token: otp,
                type: 'email'
            });

            if (error) throw error;

            // Email verified - save profile
            const newProfile = { ...editForm };
            setProfile(newProfile);
            localStorage.setItem('userProfile', JSON.stringify(newProfile));
            localStorage.setItem('verifiedEmail', editForm.email);

            setIsEditing(false);
            setEmailVerificationStep('idle');
            setOtp('');
        } catch (err: any) {
            setOtpError(err.message || 'Invalid OTP. Please try again.');
        } finally {
            setIsVerifying(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        // If email changed, require verification
        if (editForm.email !== originalEmail && editForm.email) {
            if (emailVerificationStep === 'idle') {
                await handleSendEmailOtp();
                return;
            } else if (emailVerificationStep === 'verify') {
                await handleVerifyEmailOtp();
                return;
            }
        } else {
            // Email not changed, save directly
            const newProfile = { ...editForm };
            setProfile(newProfile);
            localStorage.setItem('userProfile', JSON.stringify(newProfile));
            setIsEditing(false);
        }
    };

    const emailChanged = editForm.email !== originalEmail && editForm.email;

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
                                <h3 className="text-white font-bold text-xl mb-1 font-playfair">{profile.name || 'Guest'}</h3>
                                <p className="text-[#D4AF37] text-sm tracking-wide mb-1">{profile.email || 'No email set'}</p>
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

                            <button
                                onClick={() => setShowHelp(true)}
                                className="w-full flex items-center justify-between p-4 bg-white/5 border border-[#D4AF37]/10 hover:border-[#D4AF37]/30 transition-all group"
                            >
                                <span className="text-gray-300 group-hover:text-white transition-colors">How It Works</span>
                                <Info className="text-gray-500 group-hover:text-[#D4AF37] transition-colors" size={20} />
                            </button>
                        </div>

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
                                <label className="block text-[#D4AF37] text-[10px] font-bold uppercase tracking-widest mb-2">
                                    Email Address
                                    {emailChanged && <span className="text-yellow-500 ml-2">(verification required)</span>}
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={editForm.email}
                                    onChange={e => {
                                        setEditForm({ ...editForm, email: e.target.value });
                                        setEmailVerificationStep('idle');
                                        setOtp('');
                                    }}
                                    disabled={emailVerificationStep === 'verify'}
                                    className="input-premium w-full bg-white/5 border border-[#D4AF37]/30 p-4 text-white focus:outline-none focus:border-[#D4AF37] transition-all disabled:opacity-50"
                                />
                            </div>

                            {/* OTP Input - shown when verifying */}
                            {emailVerificationStep === 'verify' && (
                                <div className="group animate-in slide-in-from-bottom-4 duration-300">
                                    <label className="block text-[#D4AF37] text-[10px] font-bold uppercase tracking-widest mb-2">Enter 8-Digit OTP</label>
                                    <input
                                        type="text"
                                        maxLength={8}
                                        value={otp}
                                        onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                                        placeholder="Enter OTP from email"
                                        className="input-premium w-full bg-white/5 border border-[#D4AF37]/30 p-4 text-white text-center text-2xl tracking-[0.5em] font-mono focus:outline-none focus:border-[#D4AF37] transition-all"
                                    />
                                    <p className="text-gray-500 text-xs mt-2">Check your email for the 8-digit verification code</p>
                                </div>
                            )}

                            {otpError && (
                                <p className="text-red-400 text-sm">{otpError}</p>
                            )}
                        </div>

                        <div className="flex gap-4">
                            <Button variant="outline" onClick={() => {
                                setIsEditing(false);
                                setEmailVerificationStep('idle');
                                setOtp('');
                                setOtpError('');
                            }} className="flex-1">
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isVerifying || emailVerificationStep === 'sending'} className="flex-1">
                                {emailVerificationStep === 'sending' ? 'Sending OTP...' :
                                    emailVerificationStep === 'verify' ? 'Verify & Save' :
                                        emailChanged ? 'Verify Email' : 'Save Changes'}
                            </Button>
                        </div>
                    </form>
                )}

                {!isEditing && (
                    <div className="space-y-2 mt-4">
                        <button
                            onClick={() => setView('settings')}
                            className="w-full flex items-center justify-between p-4 bg-white/5 border border-[#D4AF37]/10 hover:border-[#D4AF37]/30 transition-all group"
                        >
                            <span className="text-gray-300 group-hover:text-white transition-colors">Settings & Policies</span>
                            <ChevronLeft className="rotate-180 text-gray-500 group-hover:text-[#D4AF37] transition-colors" size={20} />
                        </button>

                        <Button variant="outline" className="w-full mt-8" onClick={handleLogout}>
                            Log Out
                        </Button>
                    </div>
                )}
            </div>

            {/* How It Works Modal */}
            {showHelp && (
                <div
                    className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300"
                    onClick={() => setShowHelp(false)}
                >
                    <div
                        className="bg-[#0a0a0a] border border-[#D4AF37]/30 max-w-md w-full max-h-[80vh] overflow-y-auto"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="p-4 border-b border-[#D4AF37]/20 flex justify-between items-center sticky top-0 bg-[#0a0a0a]">
                            <h3 className="text-[#D4AF37] font-bold font-playfair">How It Works</h3>
                            <button onClick={() => setShowHelp(false)} className="text-gray-500 hover:text-white">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-4 space-y-6 text-sm">
                            {/* Booking Flow */}
                            <div>
                                <h4 className="text-[#D4AF37] font-bold mb-3 uppercase tracking-wider text-xs">🎫 Booking a Ticket</h4>
                                <div className="space-y-2 text-gray-400">
                                    <div className="flex items-start gap-3">
                                        <span className="text-[#D4AF37] font-bold">1.</span>
                                        <span>Tap on the event poster to view details</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <span className="text-[#D4AF37] font-bold">2.</span>
                                        <span>Click "Get Tickets" and select your ticket type</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <span className="text-[#D4AF37] font-bold">3.</span>
                                        <span>Enter your details and verify email with OTP</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <span className="text-[#D4AF37] font-bold">4.</span>
                                        <span>Complete payment via Razorpay</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <span className="text-[#D4AF37] font-bold">5.</span>
                                        <span>Ticket with QR code is generated instantly!</span>
                                    </div>
                                </div>
                            </div>

                            {/* View Tickets */}
                            <div>
                                <h4 className="text-[#D4AF37] font-bold mb-3 uppercase tracking-wider text-xs">📱 Viewing Your Tickets</h4>
                                <div className="space-y-2 text-gray-400">
                                    <p>After booking, your tickets appear in the <strong className="text-white">Tickets</strong> tab (bottom navigation).</p>
                                    <p>Each ticket shows a unique QR code for entry.</p>
                                </div>
                            </div>

                            {/* After Logout */}
                            <div>
                                <h4 className="text-[#D4AF37] font-bold mb-3 uppercase tracking-wider text-xs">🔐 After Logging Out</h4>
                                <div className="space-y-2 text-gray-400">
                                    <div className="flex items-start gap-3">
                                        <span className="text-[#D4AF37] font-bold">1.</span>
                                        <span>Go to Profile → Edit Profile</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <span className="text-[#D4AF37] font-bold">2.</span>
                                        <span>Enter the email used for booking</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <span className="text-[#D4AF37] font-bold">3.</span>
                                        <span>Verify with OTP sent to that email</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <span className="text-[#D4AF37] font-bold">4.</span>
                                        <span>Your tickets are restored in the Tickets tab!</span>
                                    </div>
                                </div>
                            </div>

                            {/* Security Note */}
                            <div className="bg-[#D4AF37]/10 p-3 border-l-2 border-[#D4AF37]">
                                <p className="text-[#D4AF37] text-xs">
                                    <strong>🔒 Security:</strong> Email verification ensures only you can access your tickets. We never share your data.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const SettingsView = ({ setView }: any) => {
    const settingsOptions = [
        { id: 'terms', label: 'Terms and Conditions', icon: FileText },
        { id: 'steps', label: 'Steps to Follow', icon: ListChecks },
        { id: 'refund', label: 'Refund Policy', icon: RefreshCcw },
        { id: 'organizer', label: 'Connect with Organizer', icon: MessageCircle }
    ];

    return (
        <div className="min-h-screen pb-24 animate-in fade-in duration-500">
            <div className="p-6 md:p-8 border-b border-[#D4AF37]/10 mb-6 flex items-center gap-4">
                <button
                    onClick={() => setView('profile')}
                    className="w-10 h-10 bg-white/5 border border-[#D4AF37]/20 flex items-center justify-center text-white hover:bg-white/10 transition-all"
                >
                    <ChevronLeft size={24} />
                </button>
                <h1 className="text-2xl font-bold text-[#D4AF37] font-playfair">Settings</h1>
            </div>

            <div className="px-6 md:px-8 space-y-4">
                {settingsOptions.map((option) => (
                    <button
                        key={option.id}
                        onClick={() => setView(option.id)}
                        className="w-full flex items-center justify-between p-4 bg-white/5 border border-[#D4AF37]/10 hover:border-[#D4AF37]/30 transition-all group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-black/40 flex items-center justify-center text-[#D4AF37]">
                                <option.icon size={20} />
                            </div>
                            <span className="text-gray-300 group-hover:text-white transition-colors font-medium">{option.label}</span>
                        </div>
                        <ChevronLeft className="rotate-180 text-gray-500 group-hover:text-[#D4AF37] transition-colors" size={20} />
                    </button>
                ))}
            </div>
        </div>
    );
};

const TermsView = ({ setView }: any) => (
    <div className="min-h-screen pb-24 animate-in fade-in duration-500">
        <div className="p-6 md:p-8 border-b border-[#D4AF37]/10 mb-6 flex items-center gap-4">
            <button
                onClick={() => setView('settings')}
                className="w-10 h-10 bg-white/5 border border-[#D4AF37]/20 flex items-center justify-center text-white hover:bg-white/10 transition-all"
            >
                <ChevronLeft size={24} />
            </button>
            <h1 className="text-xl font-bold text-[#D4AF37] font-playfair">Terms & Conditions</h1>
        </div>
        <div className="px-6 md:px-8 text-gray-300 space-y-4 text-sm leading-relaxed">
            <p>1. <strong>Entry:</strong> Admission rights reserved. Guests must be 21+ years of age. Valid ID proof is mandatory.</p>
            <p>2. <strong>Dress Code:</strong> Smart casuals. No slippers or shorts allowed for men.</p>
            <p>3. <strong>Behavior:</strong> Any misconduct or unruly behavior will lead to immediate removal from the premises without refund.</p>
            <p>4. <strong>Liability:</strong> The management is not responsible for loss or theft of personal belongings.</p>
            <p>5. <strong>Rights:</strong> The organizer reserves the right to change the artist line-up or event timings without prior notice.</p>
        </div>
    </div>
);

const StepsView = ({ setView }: any) => (
    <div className="min-h-screen pb-24 animate-in fade-in duration-500">
        <div className="p-6 md:p-8 border-b border-[#D4AF37]/10 mb-6 flex items-center gap-4">
            <button
                onClick={() => setView('settings')}
                className="w-10 h-10 bg-white/5 border border-[#D4AF37]/20 flex items-center justify-center text-white hover:bg-white/10 transition-all"
            >
                <ChevronLeft size={24} />
            </button>
            <h1 className="text-xl font-bold text-[#D4AF37] font-playfair">Steps to Follow</h1>
        </div>
        <div className="px-6 md:px-8 space-y-6">
            {[
                { title: "Book Your Ticket", desc: "Select your ticket type (Stag, Couple, VIP) and complete the payment." },
                { title: "Receive Confirmation", desc: "You will receive a digital ticket with a unique QR code." },
                { title: "Arrive at Venue", desc: "Show your QR code at the entrance for scanning." },
                { title: "Enjoy the Event", desc: "Get your wristband and enjoy the night!" }
            ].map((step, idx) => (
                <div key={idx} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#D4AF37] text-black font-bold flex items-center justify-center">
                        {idx + 1}
                    </div>
                    <div>
                        <h3 className="text-white font-bold mb-1">{step.title}</h3>
                        <p className="text-gray-400 text-sm">{step.desc}</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const RefundView = ({ setView }: any) => (
    <div className="min-h-screen pb-24 animate-in fade-in duration-500">
        <div className="p-6 md:p-8 border-b border-[#D4AF37]/10 mb-6 flex items-center gap-4">
            <button
                onClick={() => setView('settings')}
                className="w-10 h-10 bg-white/5 border border-[#D4AF37]/20 flex items-center justify-center text-white hover:bg-white/10 transition-all"
            >
                <ChevronLeft size={24} />
            </button>
            <h1 className="text-xl font-bold text-[#D4AF37] font-playfair">Refund Policy</h1>
        </div>
        <div className="px-6 md:px-8 text-gray-300 space-y-4 text-sm leading-relaxed">
            <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg mb-6">
                <p className="text-red-400 font-bold">Important: All ticket sales are final.</p>
            </div>
            <p>1. <strong>Cancellations:</strong> Tickets once booked cannot be cancelled or refunded.</p>
            <p>2. <strong>Event Cancellation:</strong> In the rare event that the show is cancelled by the organizers, a full refund will be processed within 7-10 working days.</p>
            <p>3. <strong>Transfers:</strong> Tickets are non-transferable unless approved by the management in writing.</p>
            <p>4. <strong>No Shows:</strong> No refunds will be issued for guests who do not attend the event.</p>
        </div>
    </div>
);

const OrganizerView = ({ setView }: any) => (
    <div className="min-h-screen pb-24 animate-in fade-in duration-500">
        <div className="p-6 md:p-8 border-b border-[#D4AF37]/10 mb-6 flex items-center gap-4">
            <button
                onClick={() => setView('settings')}
                className="w-10 h-10 bg-white/5 border border-[#D4AF37]/20 flex items-center justify-center text-white hover:bg-white/10 transition-all"
            >
                <ChevronLeft size={24} />
            </button>
            <h1 className="text-xl font-bold text-[#D4AF37] font-playfair">Connect with Organizer</h1>
        </div>
        <div className="px-6 md:px-8 space-y-6">
            <div className="bg-white/5 p-6 border border-[#D4AF37]/20 text-center">
                <div className="w-16 h-16 bg-[#C21E56]/10 rounded-full flex items-center justify-center mx-auto mb-4 text-[#C21E56]">
                    <Users size={32} />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">@anaudioaffair</h3>
                <p className="text-gray-400 text-sm mb-6">Have questions? DM us on Instagram for quick support.</p>
                <a href="https://ig.me/m/anaudioaffair" target="_blank" rel="noopener noreferrer" className="btn-gold w-full py-3 block">
                    DM US
                </a>
            </div>

            <div className="bg-white/5 p-6 border border-[#D4AF37]/20 text-center">
                <div className="w-16 h-16 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto mb-4 text-[#D4AF37]">
                    <Mail size={32} />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">Email Us</h3>
                <p className="text-gray-400 text-sm mb-6">Send us your queries and we'll get back to you.</p>
                <a href="mailto:psriniva1@gmail.com" className="btn-gold w-full py-3 block">
                    SEND EMAIL
                </a>
            </div>
        </div>
    </div>
);

import { FileText, ListChecks, RefreshCcw, MessageCircle, Phone, Mail } from 'lucide-react';
// --- Main Application ---

// URL path to view mapping
const VIEW_TO_PATH: Record<string, string> = {
    'home': '/book',
    'detail': '/event-details',
    'checkout': '/checkout',
    'success': '/booking-success',
    'tickets': '/my-tickets',
    'profile': '/profile',
    'settings': '/settings',
    'terms': '/terms',
    'steps': '/steps',
    'refund': '/refunds',
    'organizer': '/contact'
};

const PATH_TO_VIEW: Record<string, string> = {
    '/book': 'home',
    '/event-details': 'detail',
    '/checkout': 'checkout',
    '/booking-success': 'success',
    '/my-tickets': 'tickets',
    '/profile': 'profile',
    '/settings': 'settings',
    '/terms': 'terms',
    '/steps': 'steps',
    '/refunds': 'refund',
    '/contact': 'organizer'
};

interface EventBookingAppProps {
    initialView?: string;
}

const EventBookingApp = ({ initialView = 'home' }: EventBookingAppProps) => {
    const router = useRouter();
    const pathname = usePathname();

    // Determine initial view from URL path or prop
    const getInitialView = useCallback(() => {
        if (pathname && PATH_TO_VIEW[pathname]) {
            return PATH_TO_VIEW[pathname];
        }
        return initialView;
    }, [pathname, initialView]);

    const [view, setView] = useState(getInitialView);
    const [selectedEvent, setSelectedEvent] = useState<any>(EVENTS[0]);
    const [ticketData, setTicketData] = useState<any>(null);

    // Navigate function that updates both view state and URL
    const navigate = useCallback((newView: string) => {
        setView(newView);
        const path = VIEW_TO_PATH[newView];
        if (path && pathname !== path) {
            router.push(path, { scroll: false });
        }
    }, [router, pathname]);

    // Sync view with URL on path change
    useEffect(() => {
        if (pathname && PATH_TO_VIEW[pathname] && PATH_TO_VIEW[pathname] !== view) {
            setView(PATH_TO_VIEW[pathname]);
        }
    }, [pathname]);

    // No login redirect - users land directly on event page

    return (
        <div className="bg-[#050505] min-h-screen text-white font-inter selection:bg-[#D4AF37] selection:text-black">
            <div className="max-w-md lg:max-w-2xl mx-auto min-h-screen bg-[#050505] md:shadow-2xl md:border-x md:border-[#D4AF37]/20 relative overflow-hidden">

                {/* Background Gradients */}
                <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
                    <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#D4AF37]/10 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#C21E56]/10 rounded-full blur-[120px]" />
                </div>

                <div className="relative z-10">
                    {view === 'home' && <HomeView setView={navigate} setSelectedEvent={setSelectedEvent} />}
                    {view === 'detail' && <EventDetailView selectedEvent={selectedEvent} setView={navigate} />}
                    {view === 'checkout' && <CheckoutView setView={navigate} setTicketData={setTicketData} />}
                    {view === 'success' && <SuccessView selectedEvent={selectedEvent} ticketData={ticketData} setView={navigate} />}
                    {view === 'tickets' && <TicketsView setView={navigate} />}
                    {view === 'profile' && <ProfileView setView={navigate} />}
                    {view === 'settings' && <SettingsView setView={navigate} />}
                    {view === 'terms' && <TermsView setView={navigate} />}
                    {view === 'steps' && <StepsView setView={navigate} />}
                    {view === 'refund' && <RefundView setView={navigate} />}
                    {view === 'organizer' && <OrganizerView setView={navigate} />}
                </div>

                {/* Bottom Nav */}
                <div className="fixed bottom-0 left-0 right-0 p-3 md:p-4 z-40">
                    <nav className="mx-auto max-w-md lg:max-w-2xl bg-black/90 backdrop-blur-xl border border-[#D4AF37]/30 px-4 md:px-8 py-3 md:py-4 flex justify-around items-center shadow-lg shadow-black/50 rounded-lg md:rounded-none">
                        <button
                            onClick={() => navigate('home')}
                            className={`${view === 'home' ? 'text-[#D4AF37]' : 'text-gray-400'} hover:text-white active:text-[#D4AF37] transition-colors flex flex-col items-center gap-1 min-w-[60px] md:min-w-[80px] py-2`}
                        >
                            <PartyPopper size={24} className="md:w-6 md:h-6" />
                            <span className="text-[9px] md:text-[10px] font-medium uppercase tracking-wider">Events</span>
                        </button>
                        <button
                            onClick={() => navigate('tickets')}
                            className={`${view === 'tickets' ? 'text-[#D4AF37]' : 'text-gray-400'} hover:text-white active:text-[#D4AF37] transition-colors flex flex-col items-center gap-1 min-w-[60px] md:min-w-[80px] py-2`}
                        >
                            <Ticket size={24} className="md:w-6 md:h-6" />
                            <span className="text-[9px] md:text-[10px] font-medium uppercase tracking-wider">Tickets</span>
                        </button>
                        <button
                            onClick={() => navigate('profile')}
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
