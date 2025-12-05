export default function ContactPage() {
    return (
        <div className="min-h-screen p-4 md:p-8 lg:p-12">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8 md:mb-12">
                    <h1 className="text-3xl md:text-5xl font-bold text-[#D4AF37] mb-4 tracking-widest font-playfair">
                        CONTACT US
                    </h1>
                    <p className="text-gray-400 text-sm md:text-base">
                        We'd love to hear from you
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 mb-12">
                    {/* Location Card */}
                    <div className="p-6 bg-white/5 border border-[#D4AF37]/20 rounded-lg">
                        <div className="w-12 h-12 rounded-full bg-[#D4AF37]/20 flex items-center justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#D4AF37]">
                                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                                <circle cx="12" cy="10" r="3" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 font-playfair">Visit Us</h3>
                        <p className="text-gray-400">
                            1522, The Pub<br />
                            Sahakar Nagar<br />
                            Bangalore, Karnataka 560092
                        </p>
                    </div>

                    {/* Phone Card */}
                    <div className="p-6 bg-white/5 border border-[#D4AF37]/20 rounded-lg">
                        <div className="w-12 h-12 rounded-full bg-[#D4AF37]/20 flex items-center justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#D4AF37]">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 font-playfair">Call Us</h3>
                        <p className="text-gray-400">
                            +91 98765 43210<br />
                            <span className="text-sm">Mon - Sun: 12 PM - 12 AM</span>
                        </p>
                    </div>

                    {/* Email Card */}
                    <div className="p-6 bg-white/5 border border-[#D4AF37]/20 rounded-lg">
                        <div className="w-12 h-12 rounded-full bg-[#D4AF37]/20 flex items-center justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#D4AF37]">
                                <rect width="20" height="16" x="2" y="4" rx="2" />
                                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 font-playfair">Email Us</h3>
                        <p className="text-gray-400">
                            support@1522thepub.com<br />
                            <span className="text-sm">We reply within 24 hours</span>
                        </p>
                    </div>

                    {/* Instagram Card */}
                    <div className="p-6 bg-white/5 border border-[#D4AF37]/20 rounded-lg">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#833AB4] via-[#C21E56] to-[#F77737] flex items-center justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 font-playfair">Follow Us</h3>
                        <a href="https://instagram.com/1522thepub" target="_blank" rel="noopener noreferrer" className="text-[#C21E56] hover:underline">
                            @1522thepub
                        </a>
                    </div>
                </div>

                <div className="p-6 bg-gradient-to-r from-[#D4AF37]/10 to-transparent border border-[#D4AF37]/20 rounded-lg mb-8">
                    <h3 className="text-xl font-bold text-[#D4AF37] mb-4 font-playfair">Business Information</h3>
                    <div className="space-y-2 text-gray-300">
                        <p><strong>Business Name:</strong> 1522, The Pub</p>
                        <p><strong>GSTIN:</strong> [Your GSTIN if applicable]</p>
                        <p><strong>Business Type:</strong> Restaurant & Event Venue</p>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-[#D4AF37]/20">
                    <a
                        href="/"
                        className="inline-block px-8 py-3 bg-gradient-to-r from-[#D4AF37] to-[#FADA5E] text-black font-bold tracking-widest hover:shadow-lg transition-all"
                    >
                        BACK TO HOME
                    </a>
                </div>
            </div>
        </div>
    );
}
