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
  Repeat,
  Loader2,
  ExternalLink
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function AutomationsList() {
  const [reels, setReels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReels() {
      try {
        const res = await fetch('/api/reels');
        if (res.ok) {
          const data = await res.json();
          setReels(data.reels || []);
        }
      } catch (e) {
        console.error("Failed to load reels", e);
      } finally {
        setLoading(false);
      }
    }
    loadReels();
  }, []);

  const toggleStatus = async (id: string, currentConfig: any) => {
    // Optimistic UI update
    setReels(prev => prev.map(r => 
      r.id === id ? { ...r, config: { ...r.config, active: !r.config.active } } : r
    ));

    const updatedConfig = { ...currentConfig, active: !currentConfig.active };
    try {
      await fetch(`/api/reels/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedConfig)
      });
    } catch (e) {
      console.error("Failed to toggle config", e);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-slideIn pb-32">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-accent">Reel Automations</h1>
          <p className="text-gray-500 mt-1">Manage active comment-to-DM triggers on your Instagram posts.</p>
        </div>
        <Link href="/automations/create" className="btn-primary flex items-center justify-center gap-2">
          <Plus className="w-5 h-5" />
          Create New Automation
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-brand" />
        </div>
      ) : reels.length === 0 ? (
        <div className="text-center py-20 card">
          <p className="text-gray-500 font-medium">No Instagram Reels found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {reels.map((reel, i) => (
            <motion.div 
              key={reel.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card p-4 flex flex-col md:flex-row md:items-center justify-between border border-transparent hover:border-gray-200 transition-colors group relative overflow-hidden"
            >
              {/* Optional: Add left border based on status */}
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${reel.config?.active ? 'bg-green-500' : 'bg-gray-200'}`} />

              <div className="flex items-center gap-4 pl-2">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 relative group-hover:scale-105 transition-transform">
                   <img src={reel.thumbnail_url} alt="thumbnail" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-bold text-accent flex items-center gap-2 max-w-[200px] md:max-w-md truncate">
                    {reel.caption || "Instagram Reel"}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                     <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider ${reel.config?.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {reel.config?.active ? 'Active' : 'Paused'}
                     </span>
                     {reel.config?.trigger_keyword && (
                       <span className="text-xs text-brand font-medium bg-brand/10 px-2 py-0.5 rounded-md">
                         Keyword: "{reel.config.trigger_keyword}"
                       </span>
                     )}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6 mt-4 md:mt-0 pl-2">
                <div className="text-center md:text-left">
                  <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Responses</p>
                  <p className="font-bold text-accent">0</p>
                </div>
                
                <div className="flex items-center gap-2 border-l border-gray-100 pl-6 ml-2">
                  <button 
                    onClick={() => toggleStatus(reel.id, reel.config)}
                    className={`p-2 rounded-lg transition-colors ${
                      reel.config?.active 
                      ? 'text-yellow-600 hover:bg-yellow-50' 
                      : 'text-green-600 hover:bg-green-50'
                    }`}
                    title={reel.config?.active ? 'Pause' : 'Start'}
                  >
                    {reel.config?.active ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  </button>
                  <a href={reel.permalink} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-400 hover:text-accent hover:bg-gray-50 rounded-lg transition-colors" title="View on Instagram">
                    <ExternalLink className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
