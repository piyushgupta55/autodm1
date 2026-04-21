'use client';

import { useState, useEffect } from 'react';
import { 
  User, 
  Camera, 
  Bell, 
  Shield, 
  LogOut,
  ChevronRight,
  Globe,
  Mail,
  Loader
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function SettingsPage() {
  const [profile, setProfile] = useState<{ name: string; username: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch('/api/profile');
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
        }
      } catch (e) {
        console.error("Failed to load profile:", e);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-12 animate-slideIn pb-20">
      <div>
        <h1 className="text-3xl font-bold text-accent italic">Account Settings</h1>
        <p className="text-gray-500 mt-1">Manage your profile, IG connection and app preferences.</p>
      </div>

      {/* Profile Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <h2 className="text-xl font-bold text-accent">Profile Information</h2>
          <button className="btn-primary py-2 text-sm">Save Changes</button>
        </div>
        
        <div className="card space-y-8">
          <div className="flex items-center gap-6">
            <div className="relative group cursor-pointer">
              <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center overflow-hidden border-2 border-white shadow-soft group-hover:opacity-80 transition-all">
                <User className="w-10 h-10 text-gray-400" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                <Camera className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <h3 className="font-bold text-lg text-accent">
                {loading ? <Loader className="w-5 h-5 animate-spin" /> : profile?.name || 'Loading...'}
              </h3>
              <p className="text-sm text-gray-400">
                {profile?.username ? `@${profile.username}` : 'No username'}
              </p>
              <button className="text-xs font-bold text-brand hover:underline mt-2">Change Avatar</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-accent uppercase tracking-widest ml-1">Display Name</label>
              <input type="text" value={profile?.name || ''} readOnly className="input bg-gray-50" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-accent uppercase tracking-widest ml-1">Instagram Username</label>
              <input type="text" value={profile?.username ? `@${profile.username}` : ''} readOnly className="input bg-gray-50" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-accent uppercase tracking-widest ml-1">Website</label>
              <div className="relative">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" defaultValue="instaauto.com" className="input pl-10" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-accent uppercase tracking-widest ml-1">Timezone</label>
              <select className="input appearance-none">
                <option>(GMT+05:30) Mumbai, Kolkata</option>
                <option>(GMT-08:00) Pacific Time</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Instagram Connection */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold text-accent border-b border-gray-100 pb-4">Instagram Connection</h2>
        <div className="card flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#E1306C]/10 rounded-2xl flex items-center justify-center">
              <Camera className="text-[#E1306C] w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-accent">
                {loading ? 'Checking...' : profile?.username ? `@${profile.username}` : 'Not Connected'}
              </p>
              {profile?.username ? (
                <p className="text-xs text-green-500 font-medium">Successfully Connected • Business Account</p>
              ) : (
                <p className="text-xs text-gray-400 font-medium">Link your account to start automating DMs.</p>
              )}
            </div>
          </div>
          {profile?.username ? (
            <button 
              onClick={async () => {
                if (confirm('Are you sure you want to disconnect?')) {
                  await fetch('/api/auth/disconnect', { method: 'POST' });
                  window.location.reload();
                }
              }}
              className="btn-secondary py-2 text-red-500 hover:bg-red-50 hover:text-red-600 border border-transparent hover:border-red-100"
            >
              Disconnect Account
            </button>
          ) : (
            <button 
              onClick={() => window.location.href = '/api/auth/facebook'}
              className="btn-primary py-2 px-6"
            >
              Connect with Facebook
            </button>
          )}
        </div>
      </section>

      {/* Preferences */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold text-accent border-b border-gray-100 pb-4">Preferences</h2>
        <div className="card divide-y divide-gray-50 p-0 overflow-hidden">
          {[
            { icon: Bell, label: 'Email Notifications', desc: 'Get weekly performance summaries.', checked: true },
            { icon: Shield, label: 'Privacy Mode', desc: 'Hide automation stats from public dashboard.', checked: false },
            { icon: Mail, label: 'Marketing Emails', desc: 'New feature updates and pro tips.', checked: true },
          ].map((item, i) => (
            <div key={i} className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <p className="font-bold text-accent text-sm">{item.label}</p>
                  <p className="text-xs text-gray-400">{item.desc}</p>
                </div>
              </div>
              <div className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-all ${item.checked ? 'bg-brand' : 'bg-gray-200'}`}>
                <div className={`w-4 h-4 bg-white rounded-full transition-all shadow-sm ${item.checked ? 'translate-x-6' : 'translate-x-0'}`} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Danger Zone */}
      <section className="pt-8 border-t border-gray-100">
        <button className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors font-bold text-sm">
          <LogOut className="w-5 h-5" />
          Sign Out of InstaAuto
        </button>
      </section>
    </div>
  );
}
