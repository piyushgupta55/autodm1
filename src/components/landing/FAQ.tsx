"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function FAQ() {
  const faqs = [
    {
      q: "Is it safe to use AutoDM with my Instagram account?",
      a: "Yes. AutoDM uses the official Instagram and Meta APIs. We strictly adhere to platform limits, ensuring your account is never banned or blocked for automation spam.",
    },
    {
      q: "Can I customize the automated responses?",
      a: "Absolutely. You can craft specific templates based on keywords, or use our context-aware AI to generate unique variations so the interaction feels human.",
    },
    {
      q: "What if a user replies back to the bot?",
      a: "The automation can handle basic follow-ups to gather emails or phone numbers. If the conversation becomes complex, the bot pauses and tags you so a human can step in effortlessly.",
    },
    {
      q: "Do I need technical skills to set this up?",
      a: "No coding required. If you can write an Instagram comment, you can set up AutoDM. Connect your account and create your first rule within 2 minutes.",
    },
  ];

  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="py-32 px-6 md:px-12 bg-background-secondary border-t border-[rgba(255,255,255,0.05)]">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-text-primary mb-12 text-center">
          Frequently asked questions.
        </h2>
        
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div 
              key={i} 
              className="border-b border-[rgba(255,255,255,0.05)] pb-4 overflow-hidden"
            >
              <button 
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full text-left py-4 flex items-center justify-between focus:outline-none group"
              >
                <span className="text-lg font-medium text-text-primary group-hover:text-white transition-colors">
                  {faq.q}
                </span>
                <span className={`w-6 h-6 flex items-center justify-center rounded-full bg-[rgba(255,255,255,0.05)] transition-transform duration-300 ${open === i ? 'rotate-180' : ''}`}>
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>
              
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="text-text-body pb-6">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
