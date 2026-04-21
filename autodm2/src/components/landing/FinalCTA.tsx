"use client";

export default function FinalCTA() {
  return (
    <section className="py-32 px-6 md:px-12 bg-background-primary relative overflow-hidden flex items-center justify-center min-h-[60vh]">
      
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] md:w-[40vw] h-[40vw] bg-accent-primary rounded-full blur-[150px] opacity-10 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] md:w-[20vw] h-[20vw] bg-accent-secondary rounded-full blur-[100px] opacity-10 pointer-events-none" />

      <div className="z-10 text-center max-w-4xl mx-auto">
        <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-8">
          Stop replying manually.<br />
          <span className="accent-gradient">Start automating for free.</span>
        </h2>
        <p className="text-xl text-[rgba(255,255,255,0.6)] mb-12 max-w-2xl mx-auto">
          Join thousands of creators who are scaling their engagement and building an automated sales machine on Instagram.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a 
            href="https://www.instagram.com/freelancerwith.piyush/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center h-14 px-10 rounded-full bg-white text-black font-semibold text-lg hover:scale-105 transition-transform duration-300 shadow-[0_0_40px_rgba(255,255,255,0.2)]"
          >
            Get Unlimited Access
          </a>
        </div>
        
        <p className="mt-8 text-sm text-[rgba(255,255,255,0.4)]">
          Follow @freelancerwith.piyush on Instagram to get lifetime access.
        </p>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.1)] to-transparent" />
    </section>
  );
}
