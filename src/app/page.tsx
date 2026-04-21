import Scrollytelling from "@/components/Scrollytelling";
import Problem from "@/components/Problem";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import FinalCTA from "@/components/FinalCTA";

export default function Home() {
  return (
    <main className="min-h-screen bg-background-primary flex flex-col w-full overflow-x-clip">
      {/* 1. Cinematic Scroll Story */}
      <Scrollytelling />

      {/* 2. Problem Statement */}
      <Problem />

      {/* 3. Features Map */}
      <Features />

      {/* 4. How It Works */}
      <HowItWorks />

      {/* 5. Pricing Structure */}
      <Pricing />

      {/* 6. Frequently Asked Questions */}
      <FAQ />

      {/* 7. Final Call to Action */}
      <FinalCTA />
      
      <footer className="py-12 px-6 md:px-12 text-center border-t border-[rgba(255,255,255,0.05)] bg-background-primary">
        <p className="text-[rgba(255,255,255,0.4)] text-sm">
          © {new Date().getFullYear()} AutoDM. All rights reserved. Premium automation for modern creators.
        </p>
      </footer>
    </main>
  );
}
