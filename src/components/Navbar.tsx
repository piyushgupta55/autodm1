"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";

export default function Navbar() {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    return scrollY.onChange((latest) => {
      setIsScrolled(latest > 20);
    });
  }, [scrollY]);

  // Framer motion styles
  const backgroundColor = useTransform(
    scrollY,
    [0, 50],
    ["rgba(5, 5, 5, 0)", "rgba(5, 5, 5, 0.75)"]
  );

  const backdropFilter = useTransform(
    scrollY,
    [0, 50],
    ["blur(0px)", "blur(12px)"]
  );

  const borderBottom = useTransform(
    scrollY,
    [0, 50],
    ["1px solid rgba(255, 255, 255, 0)", "1px solid rgba(255, 255, 255, 0.05)"]
  );

  return (
    <motion.nav
      style={{
        backgroundColor,
        backdropFilter,
        borderBottom,
      }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 h-16 flex items-center justify-center px-6 md:px-12"
    >
      <div className="w-full max-w-7xl flex items-center justify-between">
        {/* Left - Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center shadow-[0_0_15px_rgba(0,80,255,0.5)]">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          </div>
          <span className="font-semibold text-[rgba(255,255,255,0.9)] tracking-tight text-lg">
            AutoDM
          </span>
        </Link>

        {/* Center - Links (Hidden on mobile) */}
        <div className="hidden md:flex items-center justify-center space-x-8">
          {["Overview", "Features", "Automation", "Pricing", "FAQ"].map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-sm text-[rgba(255,255,255,0.6)] hover:text-white transition-colors duration-200"
            >
              {item}
            </Link>
          ))}
        </div>

        {/* Right - CTA */}
        <div className="flex items-center">
          <button className="h-9 px-4 rounded-full bg-white text-black font-medium text-sm hover:scale-105 active:scale-95 transition-all duration-200 shadow-[0_0_20px_rgba(255,255,255,0.15)] glow-button">
            Get Unlimited
          </button>
        </div>
      </div>
    </motion.nav>
  );
}
