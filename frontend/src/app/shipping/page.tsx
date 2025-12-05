export default function ShippingPolicyPage() {
    return (
        <div className="min-h-screen p-4 md:p-8 lg:p-12">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8 md:mb-12">
                    <h1 className="text-3xl md:text-5xl font-bold text-[#D4AF37] mb-4 tracking-widest font-playfair">
                        SHIPPING & DELIVERY POLICY
                    </h1>
                    <p className="text-gray-400 text-sm md:text-base">
                        Last updated: December 2025
                    </p>
                </div>

                <div className="space-y-8 text-gray-300 leading-relaxed">
                    <section>
                        <div className="p-6 bg-gradient-to-r from-[#D4AF37]/10 to-transparent border border-[#D4AF37]/20 rounded-lg">
                            <h2 className="text-xl md:text-2xl font-bold text-[#D4AF37] mb-4 font-playfair">
                                Digital Tickets Only
                            </h2>
                            <p className="text-lg">
                                1522 provides <strong>digital tickets only</strong>. We do not ship any physical products. All tickets are delivered electronically.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl md:text-2xl font-bold text-[#D4AF37] mb-4 font-playfair">
                            Ticket Delivery
                        </h2>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>Upon successful payment, your digital ticket is generated <strong>instantly</strong>.</li>
                            <li>Tickets are accessible in the "My Tickets" section of your account.</li>
                            <li>A QR code is provided for venue entry verification.</li>
                            <li>No physical ticket is mailed or shipped.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl md:text-2xl font-bold text-[#D4AF37] mb-4 font-playfair">
                            How to Access Your Ticket
                        </h2>
                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="p-4 bg-white/5 border border-[#D4AF37]/20 rounded-lg text-center">
                                <div className="w-12 h-12 mx-auto rounded-full bg-[#D4AF37]/20 flex items-center justify-center mb-3">
                                    <span className="text-[#D4AF37] font-bold text-xl">1</span>
                                </div>
                                <p className="text-sm">Complete your payment</p>
                            </div>
                            <div className="p-4 bg-white/5 border border-[#D4AF37]/20 rounded-lg text-center">
                                <div className="w-12 h-12 mx-auto rounded-full bg-[#D4AF37]/20 flex items-center justify-center mb-3">
                                    <span className="text-[#D4AF37] font-bold text-xl">2</span>
                                </div>
                                <p className="text-sm">Go to "My Tickets"</p>
                            </div>
                            <div className="p-4 bg-white/5 border border-[#D4AF37]/20 rounded-lg text-center">
                                <div className="w-12 h-12 mx-auto rounded-full bg-[#D4AF37]/20 flex items-center justify-center mb-3">
                                    <span className="text-[#D4AF37] font-bold text-xl">3</span>
                                </div>
                                <p className="text-sm">Show QR code at venue</p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl md:text-2xl font-bold text-[#D4AF37] mb-4 font-playfair">
                            Important Notes
                        </h2>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>Ensure you have internet access to display your digital ticket.</li>
                            <li>Screenshots of tickets may not be accepted; please use the app.</li>
                            <li>Bring a valid government-issued photo ID for entry.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl md:text-2xl font-bold text-[#D4AF37] mb-4 font-playfair">
                            Contact for Support
                        </h2>
                        <p className="mb-3">If you're having trouble accessing your digital ticket, contact us:</p>
                        <div className="p-4 bg-white/5 border border-[#D4AF37]/20 rounded-lg">
                            <p><strong>Email:</strong> support@1522thepub.com</p>
                            <p><strong>Phone:</strong> +91 98765 43210</p>
                        </div>
                    </section>
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
