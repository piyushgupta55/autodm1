'use client';

import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Play, 
  Pause, 
  Edit2, 
  Trash2,
  Calendar,
  Zap,
  MessageSquare,
  Repeat
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';

const initialAutomations = [
  { 
    id: 1, 
    name: 'Ebook Giveaway', 
    trigger: 'Comment: "Ebook"', 
    responses: 1240, 
    status: 'active',
    lastActive: '2m ago'
  },
  { 
    id: 2, 
    name: 'New Follower Welcome', 
    trigger: 'Event: New Follower', 
    responses: 842, 
    status: 'active',
    lastActive: '15m ago'
  },
  { 
    id: 3, 
    name: 'Discount Code DM', 
    trigger: 'Keyword: "PROMO"', 
    responses: 156, 
    status: 'paused',
    lastActive: '1d ago'
  },
  { 
    id: 4, 
    name: 'Webinar Registration', 
    trigger: 'Comment: "Join"', 
    responses: 24, 
    status: 'active',
    lastActive: '5h ago'
  },
];

export default function AutomationsList() {
  const [automations, setAutomations] = useState(initialAutomations);

  const toggleStatus = (id: number) => {
    setAutomations(prev => prev.map(a => 
      a.id === id ? { ...a, status: a.status === 'active' ? 'paused' : 'active' } : a
    ));
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-slideIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-accent">Automations</h1>
          <p className="text-gray-500 mt-1">Manage your active triggers and message flows.</p>
        </div>
        <Link href="/automations/create" className="btn-primary flex items-center justify-center gap-2">
          <Plus className="w-5 h-5" />
          Create New Automation
        </Link>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search automations..." 
            className="input pl-12"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button className="btn-secondary flex-1 md:flex-none py-2 text-sm">All</button>
          <button className="btn-secondary flex-1 md:flex-none py-2 text-sm bg-white border border-gray-100">Active</button>
          <button className="btn-secondary flex-1 md:flex-none py-2 text-sm bg-white border border-gray-100">Paused</button>
        </div>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 gap-4">
        {automations.map((automation, i) => (
          <motion.div 
            key={automation.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="card p-4 flex flex-col md:flex-row md:items-center justify-between hover:border-gray-200 transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                automation.status === 'active' ? 'bg-brand/10 text-brand' : 'bg-gray-100 text-gray-400'
              }`}>
                {automation.trigger.includes('Comment') ? <MessageSquare className="w-6 h-6" /> : 
                 automation.trigger.includes('Follower') ? <Zap className="w-6 h-6" /> : 
                 <Repeat className="w-6 h-6" />}
              </div>
              <div>
                <h3 className="font-bold text-accent flex items-center gap-2">
                  {automation.name}
                  {automation.status === 'active' && (
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  )}
                </h3>
                <p className="text-sm text-gray-500">{automation.trigger}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 mt-4 md:mt-0">
              <div className="text-center md:text-left">
                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Responses</p>
                <p className="font-bold text-accent">{automation.responses.toLocaleString()}</p>
              </div>
              <div className="text-center md:text-left">
                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Last Active</p>
                <p className="text-sm text-accent font-medium">{automation.lastActive}</p>
              </div>
              
              <div className="flex items-center gap-2 border-l border-gray-100 pl-6 ml-2">
                <button 
                  onClick={() => toggleStatus(automation.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    automation.status === 'active' 
                    ? 'text-yellow-600 hover:bg-yellow-50' 
                    : 'text-green-600 hover:bg-green-50'
                  }`}
                  title={automation.status === 'active' ? 'Pause' : 'Start'}
                >
                  {automation.status === 'active' ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </button>
                <button className="p-2 text-gray-400 hover:text-accent hover:bg-gray-50 rounded-lg transition-colors">
                  <Edit2 className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
