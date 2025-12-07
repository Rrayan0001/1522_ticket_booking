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
                    {/* Email Card */}
                    <div className="p-6 bg-white/5 border border-[#D4AF37]/20 rounded-lg">
                        <div className="w-12 h-12 rounded-full bg-[#D4AF37]/20 flex items-center justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#D4AF37]">
                                <rect width="20" height="16" x="2" y="4" rx="2" />
                                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 font-playfair">Email Us</h3>
                        <a href="mailto:anaudioaffair@gmail.com" className="text-[#D4AF37] hover:underline">
                            anaudioaffair@gmail.com
                        </a>
                        <p className="text-gray-500 text-sm mt-2">We reply within 24 hours</p>
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
                        <a href="https://www.instagram.com/anaudioaffair/" target="_blank" rel="noopener noreferrer" className="text-[#C21E56] hover:underline">
                            @anaudioaffair
                        </a>
                        <p className="text-gray-500 text-sm mt-2">DM us for quick responses</p>
                    </div>
                </div>

            </div>
        </div>
    );
}

