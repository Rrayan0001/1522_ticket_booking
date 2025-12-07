export default function RefundPolicyPage() {
    return (
        <div className="min-h-screen p-4 md:p-8 lg:p-12">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8 md:mb-12">
                    <h1 className="text-3xl md:text-5xl font-bold text-[#D4AF37] mb-4 tracking-widest font-playfair">
                        CANCELLATION & REFUND POLICY
                    </h1>
                    <p className="text-gray-400 text-sm md:text-base">
                        Last updated: December 2025
                    </p>
                </div>

                <div className="space-y-8 text-gray-300 leading-relaxed">
                    <section>
                        <h2 className="text-xl md:text-2xl font-bold text-[#D4AF37] mb-4 font-playfair">
                            1. General Policy
                        </h2>
                        <p>
                            All ticket purchases for events at 1522, The Pub are final. We understand that plans can change, and we have outlined our cancellation and refund policies below.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl md:text-2xl font-bold text-[#D4AF37] mb-4 font-playfair">
                            2. Event Cancellation by Organizer
                        </h2>
                        <div className="p-4 bg-green-900/20 border border-green-500/30 rounded-lg mb-4">
                            <p className="text-green-400 font-semibold">✓ Full Refund Applicable</p>
                        </div>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>If an event is cancelled by 1522 or the event organizer, you will receive a <strong>full refund</strong>.</li>
                            <li>Refunds will be processed within <strong>7-10 business days</strong> to the original payment method.</li>
                            <li>You will be notified via email and SMS about the cancellation and refund status.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl md:text-2xl font-bold text-[#D4AF37] mb-4 font-playfair">
                            3. Event Postponement
                        </h2>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>If an event is postponed, your ticket will automatically be valid for the rescheduled date.</li>
                            <li>If you cannot attend the new date, you may request a refund within <strong>48 hours</strong> of the postponement announcement.</li>
                            <li>Refund requests after 48 hours will be reviewed on a case-by-case basis.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl md:text-2xl font-bold text-[#D4AF37] mb-4 font-playfair">
                            4. Cancellation by Customer
                        </h2>
                        <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg mb-4">
                            <p className="text-red-400 font-semibold">✗ No Refund for Customer Cancellations</p>
                        </div>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>Tickets purchased cannot be cancelled or refunded at the customer's request.</li>
                            <li>Tickets are <strong>non-transferable</strong> without prior authorization.</li>
                            <li>No refunds will be issued for no-shows or late arrivals.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl md:text-2xl font-bold text-[#D4AF37] mb-4 font-playfair">
                            5. Exceptional Circumstances
                        </h2>
                        <p className="mb-3">In case of extraordinary circumstances (medical emergencies, etc.), please contact us with supporting documentation. Refunds may be considered on a case-by-case basis.</p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>Medical emergencies (with valid documentation)</li>
                            <li>Government-imposed travel restrictions</li>
                            <li>Natural disasters or emergencies</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl md:text-2xl font-bold text-[#D4AF37] mb-4 font-playfair">
                            6. Refund Process
                        </h2>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>Eligible refunds are processed within <strong>7-10 business days</strong>.</li>
                            <li>Refunds will be credited to the original payment method (UPI/Card/Net Banking).</li>
                            <li>You will receive email confirmation once the refund is initiated.</li>
                            <li>Bank processing times may vary (additional 3-5 days).</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl md:text-2xl font-bold text-[#D4AF37] mb-4 font-playfair">
                            7. How to Request a Refund
                        </h2>
                        <p className="mb-3">For eligible refund requests, please contact us:</p>
                        <div className="p-4 bg-white/5 border border-[#D4AF37]/20 rounded-lg">
                            <p><strong>Email:</strong> psriniva1@gmail.com</p>
                            <p><strong>Phone:</strong> +91 99864 93391</p>
                            <p className="mt-2 text-sm text-gray-400">Include your booking ID, ticket number, and reason for refund request.</p>
                        </div>
                    </section>
                </div>

            </div>
        </div>
    );
}
