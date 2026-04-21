'use client';

import { 
  Users, 
  MessageCircle, 
  TrendingUp, 
  ArrowUpRight,
  Plus,
  Send,
  Camera,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const stats = [
  { label: 'Total Sent', value: '0', change: '0%', icon: Send },
  { label: 'New Followers', value: '0', change: '0%', icon: Users },
  { label: 'Reply Rate', value: '0%', change: '0%', icon: MessageCircle },
  { label: 'Growth', value: '0', change: '0%', icon: TrendingUp },
];

const recentActivity: any[] = [
  // Activity will be populated securely from your database later
];

export default function Dashboard() {
  const [integrations, setIntegrations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await fetch('/api/profile');
        if (res.ok) {
          const profile = await res.json();
          if (profile.username) {
            setIntegrations([
              {
                instagram_username: profile.username,
                is_integration_broken: false,
                auto_dm_count: 0
              }
            ]);
          }
        }
      } catch (err) {
        console.error("Failed to fetch dashboard integrations", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-slideIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-accent italic">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary flex items-center gap-2" onClick={() => router.push('/settings')}>
            <Camera className="w-5 h-5" />
            Connect Account
          </button>
          <button className="btn-primary flex items-center gap-2" onClick={() => router.push('/automations')}>
            <Plus className="w-5 h-5" />
            Create Automation
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="card group hover:border-brand/30 transition-colors"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center group-hover:bg-brand/10 transition-colors">
                <stat.icon className="w-5 h-5 text-gray-600 group-hover:text-brand" />
              </div>
              <span className="text-xs font-semibold text-green-500 bg-green-50 px-2 py-1 rounded-lg flex items-center">
                <ArrowUpRight className="w-3 h-3 mr-1" />
                {stat.change}
              </span>
            </div>
            <p className="text-sm text-gray-500">{stat.label}</p>
            <h3 className="text-2xl font-bold text-accent mt-1">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-accent">Recent Activity</h2>
            <button className="text-sm font-medium text-brand hover:underline">View All</button>
          </div>
          <div className="card divide-y divide-gray-50 p-0 overflow-hidden">
            {recentActivity.map((activity, i) => (
              <div key={i} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-secondary rounded-full flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-accent">
                      <span className="font-bold underline cursor-pointer">@{activity.user}</span> {activity.action}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{activity.time}</p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-accent p-2">
                  <MessageCircle className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Insights & Accounts */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-accent">Integrations</h2>
          
          <div className="card">
            <h4 className="font-bold text-accent mb-4">Connected Accounts</h4>
            
            {isLoading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="w-6 h-6 text-brand animate-spin" />
              </div>
            ) : integrations.length > 0 ? (
              <div className="space-y-3">
                {integrations.map((integration, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 transition-all hover:border-brand/30">
                    <div className="flex items-center gap-3">
                      {integration.instagram_profile_picture_url ? (
                        <img 
                          src={integration.instagram_profile_picture_url} 
                          alt="Profile" 
                          className="w-10 h-10 rounded-full border border-gray-200 object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-gray-500" />
                        </div>
                      )}
                      <div>
                        <span className="text-sm font-bold text-accent block">@{integration.instagram_username || 'Unknown'}</span>
                        <div className="flex items-center gap-2 mt-0.5">
                          {integration.is_integration_broken ? (
                            <span className="text-[10px] uppercase tracking-wider font-bold text-red-500 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> Error
                            </span>
                          ) : (
                            <span className="text-[10px] uppercase tracking-wider font-bold text-green-500 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Active
                            </span>
                          )}
                          <span className="text-[10px] text-gray-400">
                            • {integration.auto_dm_count} DMs
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Camera className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-gray-500 text-sm font-medium mb-4">No accounts connected yet.</p>
                <button className="btn-secondary w-full text-sm font-bold py-3 shadow-sm border border-gray-200">
                  Connect Instagram
                </button>
              </div>
            )}
          </div>

          <div className="card bg-accent text-white border-none shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <h4 className="font-bold text-lg">Pro Tip 💡</h4>
              <p className="text-gray-300 text-sm mt-2 leading-relaxed">
                Using "Direct" keywords in comments increases conversion by 40%. Try setting up a "Keyword" trigger today!
              </p>
              <button className="mt-4 bg-white text-accent px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-100 transition-colors">
                Learn More
              </button>
            </div>
            {/* Abstract Background Shape */}
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-brand rounded-full blur-3xl opacity-20" />
          </div>
        </div>
      </div>
    </div>
  );
}
