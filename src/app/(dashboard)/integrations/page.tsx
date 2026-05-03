'use client';

import { Zap, ExternalLink, ShieldCheck, Box } from 'lucide-react';
import { motion } from 'framer-motion';

const apps = [
  { name: 'Zapier', desc: 'Connect with 5,000+ apps.', status: 'installed', icon: '⚡' },
  { name: 'Make.com', desc: 'Advanced workflow automation.', status: 'connect', icon: 'M' },
  { name: 'Shopify', desc: 'DM customers order updates.', status: 'connect', icon: 'S' },
  { name: 'Slack', desc: 'Get notifications for every DM.', status: 'installed', icon: 'S' },
  { name: 'Mailchimp', desc: 'Sync leads to your mail list.', status: 'connect', icon: 'M' },
  { name: 'Circle', desc: 'Automate community access.', status: 'connect', icon: 'C' },
];

export default function IntegrationsPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12 animate-slideIn">
       <div>
        <h1 className="text-3xl font-bold text-accent italic">Integrations</h1>
        <p className="text-gray-500 mt-1">Connect your favorite tools to supercharge your automation.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {apps.map((app, i) => (
          <motion.div 
            key={app.name}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="card group hover:border-brand/30 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center font-bold text-xl text-accent">
                  {app.icon}
                </div>
                {app.status === 'installed' && (
                  <span className="flex items-center gap-1.5 text-[10px] font-black text-green-500 bg-green-50 px-2 py-1 rounded-lg uppercase tracking-widest">
                    <ShieldCheck className="w-3 h-3" /> Connected
                  </span>
                )}
              </div>
              <h3 className="font-bold text-lg text-accent">{app.name}</h3>
              <p className="text-sm text-gray-500 mt-2">{app.desc}</p>
            </div>

            <button className={`mt-8 w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
              app.status === 'installed' ? 'bg-secondary text-accent hover:bg-gray-200' : 'btn-primary'
            }`}>
              {app.status === 'installed' ? 'Configure' : 'Connect App'}
              <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>
        ))}

        {/* Custom Webhook Card */}
        <div className="card border-dashed border-2 flex flex-col items-center justify-center text-center p-8 bg-secondary/10">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm">
            <Zap className="w-6 h-6 text-brand" />
          </div>
          <h3 className="font-bold text-accent">Custom Webhook</h3>
          <p className="text-xs text-gray-400 mt-2">Send data to your own server URL.</p>
          <button className="mt-4 text-sm font-bold text-brand hover:underline">Setup Webhook</button>
        </div>
      </div>
    </div>
  );
}

function ChevronRight(props: any) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}
    >
      <path d="m9 18 6-6-6-6"/>
    </svg>
  );
}
