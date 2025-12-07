export default function PrivacyPage() {
    return (
        <div className="min-h-screen p-4 md:p-8 lg:p-12">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8 md:mb-12">
                    <h1 className="text-3xl md:text-5xl font-bold text-[#D4AF37] mb-4 tracking-widest font-playfair">
                        PRIVACY POLICY
                    </h1>
                    <p className="text-gray-400 text-sm md:text-base">
                        Last updated: December 2025
                    </p>
                </div>

                <div className="space-y-8 text-gray-300 leading-relaxed">
                    <section>
                        <h2 className="text-xl md:text-2xl font-bold text-[#D4AF37] mb-4 font-playfair">
                            1. Information We Collect
                        </h2>
                        <p className="mb-3">We collect the following information when you book tickets:</p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li><strong>Personal Information:</strong> Name, email address, phone number</li>
                            <li><strong>Payment Information:</strong> UPI transaction details, payment screenshots</li>
                            <li><strong>Usage Data:</strong> Browser type, device information, IP address</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl md:text-2xl font-bold text-[#D4AF37] mb-4 font-playfair">
                            2. How We Use Your Information
                        </h2>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>To process and confirm your ticket bookings</li>
                            <li>To send booking confirmations and event updates</li>
                            <li>To verify payment transactions</li>
                            <li>To improve our services and user experience</li>
                            <li>To comply with legal obligations</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl md:text-2xl font-bold text-[#D4AF37] mb-4 font-playfair">
                            3. Data Security
                        </h2>
                        <p>
                            We implement industry-standard security measures to protect your personal information. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl md:text-2xl font-bold text-[#D4AF37] mb-4 font-playfair">
                            4. Data Sharing
                        </h2>
                        <p className="mb-3">We do not sell your personal information. We may share data with:</p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>Payment processors for transaction verification</li>
                            <li>Event partners and venue management</li>
                            <li>Legal authorities when required by law</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl md:text-2xl font-bold text-[#D4AF37] mb-4 font-playfair">
                            5. Your Rights
                        </h2>
                        <p className="mb-3">You have the right to:</p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>Access your personal data</li>
                            <li>Request correction of inaccurate data</li>
                            <li>Request deletion of your data (subject to legal obligations)</li>
                            <li>Opt-out of marketing communications</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl md:text-2xl font-bold text-[#D4AF37] mb-4 font-playfair">
                            6. Contact Us
                        </h2>
                        <p>
                            For privacy-related inquiries, contact us at:
                        </p>
                        <div className="mt-3 p-4 bg-white/5 border border-[#D4AF37]/20 rounded-lg">
                            <p><strong>Email:</strong> anaudioaffair@gmail.com</p>
                            <p className="mt-2"><strong>Registered Address:</strong><br />
                                Mathangi Entertainment LLP<br />
                                NO 94 GROUND FLOOR GRACE 3RD MAIN 1ST BLOCK<br />
                                R T NAGAR, BANGALORE, KARNATAKA 560032</p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
