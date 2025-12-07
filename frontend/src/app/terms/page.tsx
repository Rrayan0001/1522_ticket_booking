export default function TermsPage() {
    return (
        <div className="min-h-screen p-4 md:p-8 lg:p-12">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8 md:mb-12">
                    <h1 className="text-3xl md:text-5xl font-bold text-[#D4AF37] mb-4 tracking-widest font-playfair">
                        TERMS & CONDITIONS
                    </h1>
                    <p className="text-gray-400 text-sm md:text-base">
                        Last updated: December 2025
                    </p>
                </div>

                <div className="space-y-8 text-gray-300 leading-relaxed">
                    <section>
                        <h2 className="text-xl md:text-2xl font-bold text-[#D4AF37] mb-4 font-playfair">
                            1. Acceptance of Terms
                        </h2>
                        <p>
                            By accessing and using the 1522 ticket booking service, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these terms, please do not use our service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl md:text-2xl font-bold text-[#D4AF37] mb-4 font-playfair">
                            2. Ticket Purchase
                        </h2>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>All ticket sales are final and non-refundable unless the event is cancelled.</li>
                            <li>Tickets are non-transferable without prior authorization from 1522.</li>
                            <li>You must be 18 years or older to purchase tickets.</li>
                            <li>Prices are subject to change without notice.</li>
                            <li>Payment must be made in full at the time of booking.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl md:text-2xl font-bold text-[#D4AF37] mb-4 font-playfair">
                            3. Entry Requirements
                        </h2>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>Valid government-issued photo ID required for entry.</li>
                            <li>Entry is at the discretion of venue management.</li>
                            <li>We reserve the right to refuse entry without refund.</li>
                            <li>Dress code must be adhered to as specified by the venue.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl md:text-2xl font-bold text-[#D4AF37] mb-4 font-playfair">
                            4. Cancellation & Refund Policy
                        </h2>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>In case of event cancellation, full refunds will be issued within 7-10 business days.</li>
                            <li>No refunds for no-shows or late arrivals.</li>
                            <li>Partial refunds may be considered on a case-by-case basis for extenuating circumstances.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl md:text-2xl font-bold text-[#D4AF37] mb-4 font-playfair">
                            5. Code of Conduct
                        </h2>
                        <p className="mb-3">By attending our events, you agree to:</p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>Behave respectfully towards staff, artists, and other guests.</li>
                            <li>Not engage in any illegal activities on the premises.</li>
                            <li>Follow all venue rules and regulations.</li>
                            <li>Not bring prohibited items (weapons, illegal substances, outside food/beverages).</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl md:text-2xl font-bold text-[#D4AF37] mb-4 font-playfair">
                            6. Liability
                        </h2>
                        <p>
                            1522 and its partners are not liable for any loss, injury, or damage to persons or property during the event. Attendees participate at their own risk.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl md:text-2xl font-bold text-[#D4AF37] mb-4 font-playfair">
                            7. Privacy
                        </h2>
                        <p>
                            We collect and process personal information in accordance with our Privacy Policy. Your data is used solely for booking management and event communication.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl md:text-2xl font-bold text-[#D4AF37] mb-4 font-playfair">
                            8. Contact
                        </h2>
                        <p>
                            For questions or concerns regarding these terms, please contact us at:
                        </p>
                        <div className="mt-3 p-4 bg-white/5 border border-[#D4AF37]/20 rounded-lg">
                            <p><strong>Email:</strong> anaudioaffair@gmail.com</p>
                            <p><strong>Phone:</strong> +91 99864 93391</p>
                            <p><strong>Address:</strong> 1522, Sahakaranagar, Bangalore</p>
                        </div>
                    </section>
                </div>

            </div>
        </div>
    );
}
