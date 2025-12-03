import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-card p-6 md:p-12 rounded-none w-full max-w-2xl relative overflow-hidden text-center">
        {/* Decorative Corner Borders */}
        <div className="absolute top-0 left-0 w-12 h-12 md:w-16 md:h-16 border-t-2 border-l-2 border-[#D4AF37] opacity-50"></div>
        <div className="absolute bottom-0 right-0 w-12 h-12 md:w-16 md:h-16 border-b-2 border-r-2 border-[#D4AF37] opacity-50"></div>

        {/* An Audio Affair Logo */}
        <div className="mb-6 md:mb-8">
          <div className="inline-block bg-white/5 backdrop-blur-sm border border-[#D4AF37]/20 p-4 md:p-6 rounded-lg">
            <img
              src="/assets/logo.png"
              alt="An Audio Affair"
              className="h-16 md:h-20 lg:h-24 mx-auto drop-shadow-2xl brightness-110 contrast-125"
            />
          </div>
        </div>

        <div className="mb-8 md:mb-10">
          <h1 className="text-3xl md:text-5xl font-bold text-[#D4AF37] mb-4 tracking-widest">
            1522
          </h1>
          <p className="text-lg md:text-xl text-white font-light tracking-[0.2em] uppercase mb-2">
            The Pub
          </p>
          <div className="h-px w-16 md:w-24 bg-[#D4AF37]/50 mx-auto my-4 md:my-6"></div>
          <p className="text-sm md:text-base text-gray-400 font-light tracking-wide max-w-lg mx-auto">
            Experience the best parties in town. Book your tickets now and get ready for an unforgettable night.
          </p>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:gap-6 justify-center">
          <Link
            href="/auth/customer"
            className="btn-gold px-8 py-3 md:py-4 text-base md:text-lg tracking-widest w-full md:w-auto md:min-w-[200px]"
          >
            BOOK TICKETS
          </Link>
          <Link
            href="/ticket_cart"
            className="px-8 py-3 md:py-4 border border-[#D4AF37]/50 text-[#D4AF37] hover:bg-[#D4AF37]/10 hover:border-[#D4AF37] transition-all duration-300 uppercase tracking-widest text-sm font-bold flex items-center justify-center w-full md:w-auto md:min-w-[200px]"
          >
            MY TICKETS
          </Link>
        </div>
      </div>
    </div>
  );
}
