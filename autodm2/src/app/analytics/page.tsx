'use client';

import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  MousePointer2,
  Calendar,
  Download,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { motion } from 'framer-motion';

const mainStats = [
  { label: 'Conversations Started', value: '4,282', change: '+14%', trend: 'up' },
  { label: 'Avg. Reply Time', value: '1.2s', change: '-20%', trend: 'up' },
  { label: 'Link Click-through', value: '12.4%', change: '+2.1%', trend: 'up' },
  { label: 'User Retention', value: '84%', change: '-5%', trend: 'down' },
];

export default function AnalyticsPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-slideIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-accent italic">Analytics</h1>
          <p className="text-gray-500 mt-1">Deep dive into your automation performance and growth.</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4" />
            Last 30 Days
          </button>
          <button className="btn-primary flex items-center gap-2 text-sm">
            <Download className="w-4 h-4" />
            Export Data
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                {stat.change}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-accent">Engagement Growth</h3>
            <div className="flex gap-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400">
                <div className="w-2 h-2 rounded-full bg-brand" />
                This Month
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400">
                <div className="w-2 h-2 rounded-full bg-gray-200" />
                Prev Month
              </div>
            </div>
          </div>
          <div className="h-64 flex items-end gap-3 px-4">
            {[40, 60, 45, 90, 65, 80, 55, 70, 95, 50, 85, 100].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col gap-2 group cursor-pointer">
                <div className="relative flex-1 bg-secondary rounded-t-lg overflow-hidden flex flex-col justify-end">
                   <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ delay: 0.5 + i * 0.05, duration: 1 }}
                    className="w-full bg-brand group-hover:bg-accent transition-colors" 
                   />
                </div>
                <span className="text-[10px] font-bold text-gray-400 text-center">W{i+1}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card space-y-6">
          <h3 className="font-bold text-accent">Top Performing Keywords</h3>
          <div className="space-y-4">
            {[
              { keyword: 'EBOOK', count: 2482, percent: 85 },
              { keyword: 'JOIN', count: 1240, percent: 65 },
              { keyword: 'PRICE', count: 842, percent: 45 },
              { keyword: 'HELP', count: 156, percent: 15 },
            ].map((kw, i) => (
              <div key={kw.keyword} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-bold text-accent tracking-widest">{kw.keyword}</span>
                  <span className="text-gray-500">{kw.count} used</span>
                </div>
                <div className="w-full h-3 bg-secondary rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${kw.percent}%` }}
                    transition={{ delay: 0.8 + i * 0.1, duration: 1 }}
                    className="h-full bg-accent" 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Table */}
      <div className="card p-0 overflow-hidden">
        <div className="p-6 border-b border-gray-50">
          <h3 className="font-bold text-accent">Recent Conversions</h3>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="bg-secondary/50 text-xs font-bold text-gray-400 uppercase tracking-widest">
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Trigger</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Value</th>
              <th className="px-6 py-4 text-right">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {[
              { user: 'sarah_j', trigger: 'EBOOK', status: 'Completed', value: '$0.00', time: '2m ago' },
              { user: 'mike.dev', trigger: 'JOIN', status: 'Sent', value: '-', time: '15m ago' },
              { user: 'alex_growth', trigger: 'PRICE', status: 'Completed', value: '$49.00', time: '1h ago' },
              { user: 'design_daily', trigger: 'EBOOK', status: 'Completed', value: '$0.00', time: '3h ago' },
            ].map((row, i) => (
              <tr key={i} className="hover:bg-secondary/30 transition-colors text-sm">
                <td className="px-6 py-4 font-bold text-accent underline underline-offset-4 cursor-pointer">@{row.user}</td>
                <td className="px-6 py-4"><span className="bg-secondary px-2 py-1 rounded text-xs font-bold">{row.trigger}</span></td>
                <td className="px-6 py-4">
                  <span className={`flex items-center gap-1.5 ${row.status === 'Completed' ? 'text-green-500' : 'text-blue-500'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${row.status === 'Completed' ? 'bg-green-500' : 'bg-blue-500'}`} />
                    {row.status}
                  </span>
                </td>
                <td className="px-6 py-4 font-medium">{row.value}</td>
                <td className="px-6 py-4 text-right text-gray-400">{row.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
