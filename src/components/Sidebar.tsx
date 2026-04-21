'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Bot, 
  MessageSquare, 
  BarChart3, 
  Settings, 
  CreditCard, 
  Zap,
  User,
  Loader
} from 'lucide-react';
import { useState, useEffect } from 'react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: Bot, label: 'Automations', href: '/automations' },
  { icon: MessageSquare, label: 'Messages', href: '/messages' },
  { icon: BarChart3, label: 'Analytics', href: '/analytics' },
  { icon: Zap, label: 'Integrations', href: '/integrations' },
  { icon: CreditCard, label: 'Billing', href: '/billing' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [profile, setProfile] = useState<{ name: string; username: string } | null>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch('/api/profile');
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
        }
      } catch (e) {
        // ignore
      }
    }
    loadProfile();
  }, []);

  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-100 flex flex-col fixed left-0 top-0">
      <div className="p-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center">
            <Bot className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tight">InstaAuto</span>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive 
                  ? 'bg-accent text-white font-medium shadow-soft' 
                  : 'text-gray-500 hover:bg-secondary hover:text-accent'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto border-t border-gray-100">
        <div className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-secondary rounded-xl transition-all">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
            {profile?.profile_picture_url ? (
               <img src={profile.profile_picture_url} className="w-full h-full object-cover" alt="" />
            ) : profile?.username ? (
               <img src={`https://unavatar.io/instagram/${profile.username}`} className="w-full h-full object-cover" alt="" />
            ) : (
               <User className="text-gray-400 w-5 h-5" />
            )}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium text-accent truncate">
              {profile ? profile.name : 'Not Connected'}
            </p>
            <p className="text-xs text-gray-400 truncate">
              {profile?.username ? `@${profile.username}` : 'Link IG Account'}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
