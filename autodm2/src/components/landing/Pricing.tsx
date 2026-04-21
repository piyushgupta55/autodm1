"use client";

export default function Pricing() {
  return (
    <section id="pricing" className="py-32 px-6 md:px-12 bg-background-primary">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-text-primary mb-6">
            Get Unlimited Access for Free.
          </h2>
          <p className="text-xl text-text-body max-w-2xl mx-auto">
            No more monthly subscriptions. Just one simple step to unlock every premium feature forever.
          </p>
        </div>

        <div className="max-w-xl mx-auto">
          <div className="relative p-10 rounded-[3rem] border border-blue-500 bg-[rgba(0,80,255,0.05)] shadow-[0_0_80px_rgba(0,80,255,0.15)] flex flex-col items-center text-center overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-600 rounded-full blur-[80px] opacity-20" />

            <div className="w-20 h-20 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center text-4xl mb-8 shadow-lg">
              ✨
            </div>

            <h3 className="text-3xl font-bold text-white mb-4">Unlimited Plan</h3>
            <div className="flex items-end gap-2 mb-6">
              <span className="text-6xl font-bold text-white">$0</span>
              <span className="text-xl text-blue-400 font-medium mb-2">/ Forever</span>
            </div>

            <p className="text-lg text-[rgba(255,255,255,0.7)] mb-10 leading-relaxed">
              Unlock unlimited DMs, AI message generation, advanced analytics, and multi-account support. All you need to do is follow me on Instagram.
            </p>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 text-left w-full">
              {[
                "Unlimited Automated DMs",
                "Advanced AI Triggers",
                "Priority Support",
                "Detailed Analytics",
                "Multi-Account Support",
                "Lifetime Updates"
              ].map((feat, index) => (
                <li key={index} className="flex items-center gap-3 text-sm text-[rgba(255,255,255,0.9)]">
                  <svg className="w-5 h-5 text-blue-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {feat}
                </li>
              ))}
            </ul>

            <a
              href="https://www.instagram.com/freelancewith.piyush/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-5 rounded-2xl bg-white text-black font-bold text-lg hover:scale-[1.02] transition-all duration-300 shadow-[0_20px_40px_rgba(255,255,255,0.1)] flex items-center justify-center gap-3"
            >
              Follow to Unlock Unlimited
            </a>

            <p className="mt-6 text-xs text-[rgba(255,255,255,0.4)]">
              After following, you'll receive instant access to the platform.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
