"use client";

import { motion } from "framer-motion";

export default function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Connect Instagram",
      desc: "Securely link your Instagram account with one click. No technical knowledge required.",
    },
    {
      num: "02",
      title: "Create automation rule",
      desc: "Set the keyword trigger and write the DM template you want your audience to receive.",
    },
    {
      num: "03",
      title: "Automatically reply",
      desc: "Watch the engine take over. We'll handle the comments, you collect the leads.",
    },
  ];

  return (
    <section id="automation" className="py-32 px-6 md:px-12 bg-background-secondary border-y border-[rgba(255,255,255,0.05)]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
        
        <div className="md:w-1/2">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-text-primary mb-8">
            Simple to set up.<br /> Powerful to run.
          </h2>
          
          <div className="space-y-12">
            {steps.map((step, i) => (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2, duration: 0.6 }}
                key={i} 
                className="flex gap-6 relative"
              >
                {i !== steps.length - 1 && (
                  <div className="absolute left-6 top-16 bottom-[-2rem] w-px bg-gradient-to-b from-[rgba(255,255,255,0.2)] to-transparent" />
                )}
                <div className="w-12 h-12 shrink-0 rounded-full border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.05)] flex items-center justify-center font-bold text-white text-lg z-10">
                  {step.num}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-text-primary mb-2">{step.title}</h3>
                  <p className="text-lg text-text-body">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Demo Visualization */}
        <div className="md:w-1/2 flex justify-center w-full">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-md aspect-[4/3] rounded-3xl bg-background-primary border border-[rgba(255,255,255,0.1)] shadow-[0_0_50px_rgba(0,0,0,0.5)] flex items-center justify-center p-8 overflow-hidden relative"
          >
            {/* Mock Chat Interface */}
            <div className="w-full h-full flex flex-col gap-4">
              <div className="w-3/4 py-3 px-4 rounded-2xl rounded-tl-sm bg-[rgba(255,255,255,0.05)] text-sm text-[rgba(255,255,255,0.7)] self-start border border-[rgba(255,255,255,0.02)]">
                Hey, I just saw your reel! Can I get the LINK?
              </div>
              <div className="w-3/4 py-3 px-4 rounded-2xl rounded-tr-sm bg-blue-600 text-sm text-white self-end shadow-[0_5px_20px_rgba(0,80,255,0.3)]">
                Hey there! Here's the link you requested: example.com/growth
              </div>
              <div className="w-3/4 py-3 px-4 rounded-2xl rounded-tl-sm bg-[rgba(255,255,255,0.05)] text-sm text-[rgba(255,255,255,0.7)] self-start border border-[rgba(255,255,255,0.02)]">
                Wow, that was fast. Thanks!
              </div>
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-background-primary via-transparent to-transparent pointer-events-none" />
          </motion.div>
        </div>

      </div>
    </section>
  );
}
