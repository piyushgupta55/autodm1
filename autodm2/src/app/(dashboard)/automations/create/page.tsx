'use client';

import { 
  ArrowLeft, 
  ChevronRight, 
  MessageCircle, 
  Zap, 
  UserPlus, 
  Image as ImageIcon,
  Send,
  Info,
  CheckCircle2
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AutomationBuilder() {
  const [step, setStep] = useState(1);
  const [trigger, setTrigger] = useState('');
  const [keyword, setKeyword] = useState('');
  const [message, setMessage] = useState('');
  const [previewName, setPreviewName] = useState('John Doe');

  const triggers = [
    { id: 'comment', label: 'Comment on Post', icon: MessageCircle, desc: 'Trigger when someone comments a specific keyword.' },
    { id: 'follower', label: 'New Follower', icon: UserPlus, desc: 'Send a welcome message to every new follower.' },
    { id: 'dm', label: 'DM Keyword', icon: Zap, desc: 'Reply instantly when a specific word is sent to your DM.' },
  ];

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Top Header */}
      <header className="h-16 border-b border-gray-100 flex items-center justify-between px-8 bg-white z-20">
        <div className="flex items-center gap-4">
          <Link href="/automations" className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-500" />
          </Link>
          <h2 className="font-bold text-accent italic">Create New Automation</h2>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary py-1.5 text-sm">Save Draft</button>
          <button 
            disabled={!trigger || (trigger === 'comment' && !keyword) || !message}
            className="btn-primary py-1.5 text-sm flex items-center gap-2"
          >
            Activate Automation
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: Builder */}
        <div className="w-full lg:w-[600px] border-r border-gray-100 overflow-y-auto p-12 bg-secondary/30">
          <div className="max-w-md mx-auto space-y-10">
            {/* Step 1: Select Trigger */}
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-accent text-white text-xs flex items-center justify-center font-bold">1</span>
                <h3 className="font-bold text-lg text-accent">Select Trigger</h3>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {triggers.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTrigger(t.id)}
                    className={`p-4 rounded-2xl border-2 text-left transition-all hover:shadow-md ${
                      trigger === t.id 
                      ? 'border-brand bg-white shadow-soft' 
                      : 'border-white bg-white/50 text-gray-500'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-1">
                      <t.icon className={`w-5 h-5 ${trigger === t.id ? 'text-brand' : ''}`} />
                      <span className={`font-bold ${trigger === t.id ? 'text-accent' : ''}`}>{t.label}</span>
                    </div>
                    <p className="text-xs">{t.desc}</p>
                  </button>
                ))}
              </div>
            </section>

            <AnimatePresence>
              {trigger && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-10"
                >
                  {/* Step 2: Configuration */}
                  {trigger === 'comment' && (
                    <section className="space-y-4">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-accent text-white text-xs flex items-center justify-center font-bold">2</span>
                        <h3 className="font-bold text-lg text-accent">Trigger Keyword</h3>
                      </div>
                      <div className="relative">
                        <input 
                          type="text" 
                          placeholder="e.g. HELP, INFO, PRICE" 
                          className="input uppercase font-bold tracking-widest placeholder:normal-case placeholder:font-normal"
                          value={keyword}
                          onChange={(e) => setKeyword(e.target.value)}
                        />
                        <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
                          <Info className="w-3 h-3" />
                          <span>Automation will trigger when someone comments exactly this word.</span>
                        </div>
                      </div>
                    </section>
                  )}

                  {/* Step 3: Message */}
                  <section className="space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-accent text-white text-xs flex items-center justify-center font-bold">
                        {trigger === 'follower' ? '2' : '3'}
                      </span>
                      <h3 className="font-bold text-lg text-accent">Automated Message</h3>
                    </div>
                    <div className="card border-2 border-transparent focus-within:border-brand transition-all p-0 overflow-hidden">
                      <textarea 
                        className="w-full h-40 p-4 outline-none resize-none bg-white text-sm"
                        placeholder="Hey {name}! Thanks for reaching out. Here is the link you requested..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                      />
                      <div className="p-3 bg-secondary/50 border-t border-gray-100 flex items-center justify-between">
                        <div className="flex gap-2">
                          <button className="px-2 py-1 bg-white rounded border border-gray-200 text-[10px] font-bold text-gray-400 hover:text-brand hover:border-brand transition-colors">
                            {'{name}'}
                          </button>
                        </div>
                        <div className="flex gap-3">
                          <button className="text-gray-400 hover:text-brand transition-colors">
                            <ImageIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </section>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Side: Preview */}
        <div className="flex-1 hidden lg:flex items-center justify-center bg-white p-20">
          <div className="relative">
            {/* Phone Frame */}
            <div className="w-[300px] h-[600px] bg-white rounded-[3rem] border-[8px] border-accent shadow-2xl overflow-hidden flex flex-col">
              {/* Phone Status Bar */}
              <div className="h-6 flex justify-between px-8 items-end pb-1">
                <span className="text-[10px] font-bold">9:41</span>
                <div className="flex gap-1">
                  <div className="w-3 h-2 bg-black rounded-sm" />
                </div>
              </div>

              {/* IG Header */}
              <div className="h-12 border-b border-gray-100 flex items-center px-4 gap-3">
                <ArrowLeft className="w-5 h-5" />
                <div className="w-7 h-7 bg-gray-200 rounded-full" />
                <div className="flex-1">
                  <p className="text-[10px] font-bold">InstaAuto</p>
                  <p className="text-[8px] text-gray-400">Active now</p>
                </div>
              </div>

              {/* Chat Body */}
              <div className="flex-1 p-4 space-y-4 bg-white overflow-y-auto">
                <div className="flex flex-col items-center py-6">
                  <div className="w-16 h-16 bg-gray-100 rounded-full mb-2" />
                  <p className="text-xs font-bold underline">InstaAuto</p>
                  <p className="text-[10px] text-gray-400">Instagram • 1.2M followers</p>
                </div>

                {/* User Message (Trigger) */}
                <AnimatePresence>
                  {trigger === 'comment' && keyword && (
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex justify-end"
                    >
                      <div className="bg-brand text-white text-[11px] px-3 py-2 rounded-2xl rounded-tr-sm max-w-[80%]">
                        {keyword}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Automated Response */}
                <AnimatePresence>
                  {message && (
                    <motion.div 
                      key={message}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                      className="flex gap-2"
                    >
                      <div className="w-7 h-7 bg-gray-200 rounded-full mt-auto" />
                      <div className="bg-secondary text-accent text-[11px] px-3 py-2 rounded-2xl rounded-bl-sm max-w-[80%] whitespace-pre-wrap">
                        {message.replace('{name}', previewName)}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t border-gray-100 flex items-center gap-3">
                <div className="w-8 h-8 bg-brand rounded-full flex items-center justify-center">
                  <ImageIcon className="text-white w-4 h-4" />
                </div>
                <div className="flex-1 bg-secondary rounded-full h-8 px-4 flex items-center text-[10px] text-gray-400">
                  Message...
                </div>
                <Send className="w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* Preview Tag */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-secondary/80 backdrop-blur px-4 py-1 rounded-full text-[10px] font-bold text-gray-500 border border-gray-100 flex items-center gap-2">
              <CheckCircle2 className="w-3 h-3 text-green-500" />
              LIVE PREVIEW
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
