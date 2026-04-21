"use client";

import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";

export default function Scrollytelling() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // 1. HERO INTRO (0-15%)
  const introOpacity = useTransform(smoothProgress, [0, 0.1, 0.15], [1, 1, 0]);
  const introY = useTransform(smoothProgress, [0, 0.15], [0, -50]);

  // 2. COMMENT DETECTION (15-40%)
  const commentOpacity = useTransform(smoothProgress, [0.15, 0.2, 0.35, 0.4], [0, 1, 1, 0]);
  const commentY = useTransform(smoothProgress, [0.15, 0.2], [50, 0]);

  // 3. AUTOMATED DMS (40-65%)
  const dmOpacity = useTransform(smoothProgress, [0.4, 0.45, 0.6, 0.65], [0, 1, 1, 0]);
  const dmX = useTransform(smoothProgress, [0.4, 0.45], [50, 0]);

  // 4. AI AUTOMATION SYSTEM (65-85%)
  const aiOpacity = useTransform(smoothProgress, [0.65, 0.7, 0.8, 0.85], [0, 1, 1, 0]);
  const aiX = useTransform(smoothProgress, [0.65, 0.7], [-50, 0]);

  // 5. FINAL REVEAL (85-100%)
  const finalOpacity = useTransform(smoothProgress, [0.85, 0.9, 1], [0, 1, 1]);
  const finalScale = useTransform(smoothProgress, [0.85, 0.9], [0.95, 1]);

  // BACKGROUND VISUAL (Center Instagram Post)
  const postScale = useTransform(smoothProgress, [0, 0.15, 0.85, 1], [1, 0.8, 0.8, 1.1]);
  const postY = useTransform(smoothProgress, [0, 0.4, 0.65, 0.85, 1], [0, -100, 100, 0, 0]);
  const postX = useTransform(smoothProgress, [0, 0.35, 0.45, 0.6, 0.7, 0.85, 1], ["25vw", "25vw", "-25vw", "-25vw", "25vw", "0vw", "0vw"]);
  const postOpacity = useTransform(smoothProgress, [0, 0.85, 0.9, 1], [1, 1, 0, 0]);

  // AUTOMATION NODES
  const nodesOpacity = useTransform(smoothProgress, [0.15, 0.2, 0.8, 0.85], [0, 1, 1, 0]);
  const nodesScale = useTransform(smoothProgress, [0.15, 0.4], [0.8, 1.2]);

  // SCROLL INDICATOR
  const scrollIndicatorOpacity = useTransform(smoothProgress, [0, 0.85, 0.95], [0.5, 0.5, 0]);

  // MOUSE GLOW TRACKING
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 30, stiffness: 150 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - 400); // 400 is half the glow width (800px)
      mouseY.set(e.clientY - 400);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div ref={containerRef} className="relative h-[500vh] w-full bg-background-primary">
      {/* Sticky Container with grid */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden bg-radial-hero bg-grid relative">
        
        {/* MOUSE FOLLOWER GLOW */}
        <motion.div
          className="pointer-events-none absolute left-0 top-0 z-0 h-[800px] w-[800px] rounded-full opacity-60"
          style={{
            background: "radial-gradient(circle, rgba(120,50,255,0.15) 0%, rgba(0,0,0,0) 60%)",
            x: smoothMouseX,
            y: smoothMouseY,
          }}
        />
        
        {/* BACKGROUND VISUAL LAYER */}
        <motion.div 
          className="absolute z-10 w-[300px] h-[400px] md:w-[400px] md:h-[500px] bg-background-secondary rounded-2xl border border-[rgba(255,255,255,0.1)] shadow-[0_0_50px_rgba(0,80,255,0.15)] flex flex-col items-center justify-center p-6"
          style={{
            scale: postScale,
            y: postY,
            x: postX,
            opacity: postOpacity,
          }}
        >
          {/* Fake IG Post UI */}
          <div className="w-full flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-1/3 bg-[rgba(255,255,255,0.2)] rounded" />
              <div className="h-2 w-1/4 bg-[rgba(255,255,255,0.1)] rounded" />
            </div>
          </div>
          <div className="w-full flex-1 bg-[rgba(255,255,255,0.05)] rounded-xl mb-4" />
          <div className="w-full flex justify-between">
            <div className="flex gap-4">
              <div className="w-6 h-6 rounded-full border border-[rgba(255,255,255,0.3)]" />
              <div className="w-6 h-6 rounded-full border border-[rgba(255,255,255,0.3)]" />
              <div className="w-6 h-6 rounded-full border border-[rgba(255,255,255,0.3)]" />
            </div>
            <div className="w-6 h-6 rounded border border-[rgba(255,255,255,0.3)]" />
          </div>
        </motion.div>

        {/* NODES LAYER */}
        <motion.div
          className="absolute z-0 w-[600px] h-[600px] rounded-full border border-dashed border-[rgba(0,80,255,0.3)]"
          style={{
            opacity: nodesOpacity,
            scale: nodesScale,
            x: postX,
            y: postY,
          }}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-blue-500 shadow-[0_0_20px_#0050FF]" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-4 h-4 rounded-full bg-cyan-400 shadow-[0_0_20px_#00D6FF]" />
          <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-purple-500 shadow-[0_0_20px_purple]" />
          <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-pink-500 shadow-[0_0_20px_pink]" />
        </motion.div>


        {/* FOREGROUND TEXT LAYER */}
        
        {/* 1. HERO INTRO */}
        <motion.div 
          className="absolute z-20 flex flex-col justify-center items-start text-left px-8 md:px-24 w-full h-full max-w-7xl mx-auto"
          style={{ opacity: introOpacity, y: introY }}
        >
          <div className="max-w-xl pr-4 md:pr-10">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-text-primary mb-6">
              Turn Instagram <span className="text-gradient">comments</span> into <span className="accent-gradient">conversations</span>.
            </h1>
            <p className="text-xl md:text-2xl text-text-body mb-8">
              Automatically send direct messages when someone comments on your posts. Convert engagement into real conversations instantly.
            </p>
            <button className="px-8 py-4 rounded-full bg-white text-black font-semibold text-lg hover:scale-105 transition-transform duration-300 shadow-[0_0_30px_rgba(255,255,255,0.2)]">
              Start Free Trial
            </button>
          </div>
        </motion.div>

        {/* 2. COMMENT DETECTION */}
        <motion.div 
          className="absolute z-20 flex flex-col justify-center px-8 md:px-24 w-full h-full max-w-7xl mx-auto"
          style={{ opacity: commentOpacity, y: commentY }}
        >
          <div className="max-w-xl pr-4 md:pr-10">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-text-primary mb-4">
              Every comment becomes an opportunity.
            </h2>
            <p className="text-lg text-text-body">
              Your audience is engaging with your content every day. Our system instantly detects comments and prepares personalized responses.
            </p>
          </div>
        </motion.div>

        {/* 3. AUTOMATED DMS */}
        <motion.div 
          className="absolute z-20 flex flex-col justify-center items-end text-right px-8 md:px-24 w-full h-full max-w-7xl mx-auto"
          style={{ opacity: dmOpacity, x: dmX }}
        >
          <div className="max-w-md">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-text-primary mb-6">
              Automatic conversations at scale.
            </h2>
            <ul className="text-lg text-text-body space-y-4 text-left inline-block">
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500" /> Instant DM replies
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-cyan-400" /> Smart message personalization
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-purple-500" /> No missed leads
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-pink-500" /> Unlimited engagement
              </li>
            </ul>
          </div>
        </motion.div>

        {/* 4. AI AUTOMATION SYSTEM */}
        <motion.div 
          className="absolute z-20 flex flex-col justify-center px-8 md:px-24 w-full h-full max-w-7xl mx-auto"
          style={{ opacity: aiOpacity, x: aiX }}
        >
          <div className="max-w-xl pr-4 md:pr-10">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-text-primary mb-4">
              Powered by intelligent automation.
            </h2>
            <p className="text-lg text-text-body mb-4">
              Keyword triggers.<br />
              AI generated replies.<br />
              Automated follow ups.<br />
              Lead capture inside Instagram messages.
            </p>
            <div className="inline-block px-4 py-2 rounded-full border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.05)] text-sm text-[rgba(255,255,255,0.8)] backdrop-blur-md">
              Live Engine Active
            </div>
          </div>
        </motion.div>

        {/* 5. FINAL REVEAL */}
        <motion.div 
          className="absolute z-30 flex flex-col items-center text-center px-4 max-w-4xl"
          style={{ opacity: finalOpacity, scale: finalScale }}
        >
          <div className="w-24 h-24 mb-8 rounded-3xl bg-gradient-to-tr from-blue-600 to-cyan-400 shadow-[0_0_50px_rgba(0,130,255,0.4)] flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-text-primary mb-4">
            Your Instagram <br /> growth engine.
          </h1>
          <p className="text-xl md:text-2xl text-[rgba(255,255,255,0.8)] mb-8">
            Turn comments into leads.<br /> Turn conversations into customers.
          </p>
          <div className="flex gap-4">
            <button className="px-8 py-4 rounded-full bg-white text-black font-semibold text-lg hover:scale-105 transition-transform duration-300 shadow-[0_0_30px_rgba(255,255,255,0.2)]">
              Start Free Trial
            </button>
            <button className="px-8 py-4 rounded-full border border-[rgba(255,255,255,0.2)] text-white font-semibold text-lg hover:bg-[rgba(255,255,255,0.05)] transition-colors duration-300">
              See how it works
            </button>
          </div>
        </motion.div>

      </div>

      {/* Scroll indicator */}
      <motion.div 
        className="fixed bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-50 mix-blend-difference pointer-events-none"
        style={{ opacity: scrollIndicatorOpacity }}
      >
        <span className="text-xs tracking-widest uppercase text-white">Scroll to explore</span>
        <div className="w-[1px] h-8 bg-gradient-to-b from-white to-transparent" />
      </motion.div>

    </div>
  );
}
