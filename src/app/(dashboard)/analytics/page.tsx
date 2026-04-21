'use client';

import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  MousePointer2,
  Calendar,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function AnalyticsPage() {
  const [stats, setStats] = useState<{ total_reels: number; configured: number; using_default: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch('/api/stats');
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (e) {
        console.error("Failed to load stats", e);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
     return (
       <div className="flex justify-center items-center h-screen">
         <Loader2 className="w-10 h-10 animate-spin text-brand" />
       </div>
     );
  }

  const mainStats = [
    { label: 'Total Instagram Reels', value: stats?.total_reels || 0, trend: 'up' },
    { label: 'Reels w/ Active Automations', value: stats?.configured || 0, trend: 'up' },
    { label: 'Reels using Default Config', value: stats?.using_default || 0, trend: 'down' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-slideIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-accent italic">Analytics</h1>
          <p className="text-gray-500 mt-1">Deep dive into your automation performance and growth.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mainStats.map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="card"
          >
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
            <div className="mt-4 flex items-end justify-between">
              <h3 className="text-3xl font-bold text-accent">{stat.value}</h3>
              <span className={`text-xs font-bold px-2 py-1 rounded-lg flex items-center ${
                stat.trend === 'up' ? 'text-green-500 bg-green-50' : 'text-red-500 bg-red-50'
              }`}>
                {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                Active
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="card p-10 text-center space-y-4">
         <BarChart3 className="w-12 h-12 text-gray-300 mx-auto" />
         <h3 className="font-bold text-accent">Detailed Metrics Coming Soon</h3>
         <p className="text-gray-500 text-sm max-w-sm mx-auto">
           Currently our backend only tracks your reel automation coverage. Deep conversation tracking, conversion percentage, and user retention charts will be unlocked in the next database update.
         </p>
      </div>

    </div>
  );
}
