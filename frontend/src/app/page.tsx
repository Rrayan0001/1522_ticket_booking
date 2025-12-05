import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-retro-bg">
      {/* Retro Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-retro-orange rounded-full blur-[100px] opacity-10"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-retro-mustard rounded-full blur-[120px] opacity-5"></div>
      </div>

      <div className="glass-card w-full max-w-4xl relative z-10 text-center border-2 border-retro-mustard shadow-[8px_8px_0px_var(--color-retro-mustard)] overflow-hidden flex flex-col md:flex-row">

        {/* Left Side: Poster Image */}
        <div className="w-full md:w-1/2 bg-black/20 p-6 flex items-center justify-center border-b md:border-b-0 md:border-r border-retro-mustard/30">
          <div className="relative w-full h-full min-h-[400px] flex items-center justify-center">
            {/* Poster with padding to prevent zoom/cut-off */}
            <img
              src="/assets/event_poster.png"
              alt="Stereo Sutra Poster"
              className="max-w-full max-h-[600px] object-contain shadow-2xl rounded-sm border border-white/10"
            />
          </div>
        </div>

        {/* Right Side: Content */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center relative">
          {/* Decorative Corner Borders (Inner Right) */}
          <div className="absolute top-4 right-4 w-8 h-8 border-t-4 border-r-4 border-retro-orange"></div>
          <div className="absolute bottom-4 right-4 w-8 h-8 border-b-4 border-r-4 border-retro-orange"></div>

          {/* Logos Area */}
          <div className="mb-8 flex flex-col items-center">
            <p className="text-retro-mustard text-xs uppercase tracking-[0.3em] mb-4">Presented By</p>
            <img
              src="/assets/audio_affair_logo.png"
              alt="An Audio Affair"
              className="h-24 md:h-32 object-contain drop-shadow-xl mb-4 hover:scale-105 transition-transform duration-300"
            />
            <p className="text-retro-cream/60 text-[10px] uppercase tracking-widest">
              In Association With
            </p>
            <h3 className="text-retro-cream font-chonburi text-lg mt-1 tracking-wide">
              1522, The Pub Sahakar Nagar
            </h3>
          </div>

          {/* Event Title */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-chonburi text-retro-orange leading-none drop-shadow-[2px_2px_0px_rgba(0,0,0,0.5)] mb-2">
              STEREO
              <br />
              SUTRA
            </h1>
            <p className="font-space text-retro-mustard text-sm md:text-base tracking-wider border-y border-retro-mustard/30 py-2 inline-block">
              Folk - Electronica at its Finest
            </p>
          </div>

          {/* Event Details Grid */}
          <div className="mb-10 grid grid-cols-2 gap-4 font-space text-retro-cream text-left max-w-xs mx-auto">
            <div className="border-l-2 border-retro-orange pl-3">
              <span className="text-retro-mustard text-[10px] uppercase tracking-widest block">Date</span>
              <span className="font-bold text-lg">21 DEC</span>
            </div>
            <div className="border-l-2 border-retro-orange pl-3">
              <span className="text-retro-mustard text-[10px] uppercase tracking-widest block">Time</span>
              <span className="font-bold text-lg">8 PM - 12 AM</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <Link
              href="/auth/customer"
              className="btn-gold w-full text-lg py-4 hover:scale-[1.02] transition-transform shadow-[4px_4px_0px_rgba(0,0,0,0.3)]"
            >
              BOOK ACCESS
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

