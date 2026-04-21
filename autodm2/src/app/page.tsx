'use client';

import { 
  Bot, 
  ArrowRight, 
  Camera, 
  Zap, 
  MessageCircle, 
  BarChart3, 
  ShieldCheck,
  ChevronDown,
  Code
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white selection:bg-brand/20">
      {/* Navigation */}
      <nav className="h-20 border-b border-gray-50 flex items-center justify-between px-8 lg:px-20 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-accent rounded-xl flex items-center justify-center">
            <Bot className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tight italic">InstaAuto</span>
        </div>
        
        <div className="hidden md:flex items-center gap-10">
          <a href="#features" className="text-sm font-bold text-gray-500 hover:text-accent transition-colors">Features</a>
          <a href="#demo" className="text-sm font-bold text-gray-500 hover:text-accent transition-colors">How it Works</a>
          <Link href="/login" className="text-sm font-bold text-accent">Login</Link>
          <Link href="/signup" className="btn-primary py-2 px-5 text-sm italic">Get Started Free</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-24 px-8 lg:px-20 text-center relative overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto space-y-8 relative z-10"
        >
          <div className="inline-flex items-center gap-2 bg-secondary px-4 py-2 rounded-full border border-gray-100">
            <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
            <span className="text-xs font-bold text-accent italic uppercase tracking-widest">New: AI Message Suggestions</span>
          </div>
          
          <h1 className="text-6xl lg:text-8xl font-bold text-accent leading-[1.1] italic">
            Talk to Every <br />
            <span className="text-brand">Commenter</span> Instantly.
          </h1>
          
          <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Stop losing leads in your comments. Automate personalized DMs for every keyword, mention, and new follower.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/signup" className="btn-primary px-8 py-4 text-lg italic flex items-center gap-3 shadow-2xl shadow-brand/20">
              Start Automating Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <button className="btn-secondary px-8 py-4 text-lg flex items-center gap-3 bg-white border border-gray-100 italic">
              <Camera className="w-5 h-5" />
              Watch Demo
            </button>
          </div>

          <div className="flex items-center justify-center gap-12 pt-12 opacity-40">
            <Code className="w-6 h-6 hover:text-brand cursor-pointer" />
            <span className="font-bold text-accent text-lg">ProductHunt</span>
            <span className="font-bold text-accent text-lg italic tracking-widest underline">Trustpilot</span>
          </div>
        </motion.div>

        {/* Abstract Background Decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-brand/5 rounded-full blur-[120px] -z-10" />
      </section>

      {/* Feature Grid */}
      <section id="features" className="py-24 px-8 lg:px-20 bg-secondary/30 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-bold text-accent italic">Everything you need to grow.</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Powerful tools designed for creators who value their time.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: 'Instant Triggers', desc: 'Real-time keyword detection and message delivery.' },
              { icon: MessageCircle, title: 'Smart Replies', desc: 'Context-aware responses that sound like you.' },
              { icon: BarChart3, title: 'Advanced Data', desc: 'Track conversion rates and ROI for every reel.' },
              { icon: ShieldCheck, title: 'Meta Verified', desc: 'Secure connection via official Meta API.' },
              { icon: Bot, title: '24/7 Automation', desc: 'Your business never sleeps, even when you do.' },
              { icon: Camera, title: 'Native Feel', desc: 'Seamless integration with your IG Business account.' },
            ].map((f, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -5 }}
                className="bg-white p-8 rounded-3xl border border-gray-50 shadow-soft"
              >
                <div className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center mb-6">
                  <f.icon className="w-6 h-6 text-brand" />
                </div>
                <h3 className="text-xl font-bold text-accent mb-3 italic">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-8 lg:px-20">
        <div className="max-w-5xl mx-auto card bg-accent text-white border-none p-16 relative overflow-hidden flex flex-col items-center text-center">
           <div className="relative z-10 space-y-6">
            <h2 className="text-5xl font-bold italic leading-tight">Ready to turn <br /> comments into sales?</h2>
            <p className="text-gray-400 max-w-md mx-auto">Join thousands of creators using InstaAuto to scale their business.</p>
            <Link href="/signup" className="btn-primary bg-white text-accent px-10 py-4 text-xl inline-block shadow-2xl italic">
              Start Free Trial
            </Link>
           </div>
           
           <div className="absolute top-0 right-0 w-64 h-64 bg-brand/20 rounded-full blur-[100px]" />
           <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand/10 rounded-full blur-[100px]" />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-8 lg:px-20 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
            <Bot className="text-accent w-4 h-4" />
          </div>
          <span className="font-bold text-lg italic">InstaAuto</span>
        </div>
        <p className="text-sm text-gray-400">© 2026 InstaAuto. Built with Love for Creators.</p>
        <div className="flex gap-8">
          <a href="#" className="text-xs font-bold text-gray-400 hover:text-accent">Privacy Policy</a>
          <a href="#" className="text-xs font-bold text-gray-400 hover:text-accent">Terms of Service</a>
        </div>
      </footer>
    </div>
  );
}
