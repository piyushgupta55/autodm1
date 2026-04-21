'use client';
export const dynamic = 'force-dynamic';

import { 
  Camera, 
  ArrowRight, 
  Lock, 
  Mail,
  Bot,
  User
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const router = useRouter();


  const handleSignUp = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    // Pass full_name to Supabase user metadata
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: {
          full_name: name,
        }
      }
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
    } else {
      setSuccess("Account created successfully! You can now log in.");
      setIsLoading(false);
      // Optional: Redirect them string to login or wait a few seconds
      setTimeout(() => {
        router.push('/login');
      }, 2500);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side: Branding */}
      <div className="hidden lg:flex bg-accent flex-col justify-between p-16 text-white relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center">
              <Bot className="text-white w-6 h-6" />
            </div>
            <span className="font-bold text-2xl tracking-tight">InstaAuto</span>
          </div>
          
          <div className="mt-32 space-y-6 max-w-md">
            <h1 className="text-5xl font-bold leading-tight italic">
              Scale your <br />
              <span className="text-brand">influence</span> without the effort.
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed">
              Automated workflows that work while you sleep. Join 10k+ creators today.
            </p>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-8 opacity-50">
          <div className="flex -space-x-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-10 h-10 rounded-full border-2 border-accent bg-gray-200" />
            ))}
          </div>
          <p className="text-sm">Trusted by 10,000+ creators worldwide</p>
        </div>

        {/* Decorative Circles */}
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-brand/20 rounded-full blur-3xl" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-brand/10 rounded-full blur-3xl" />
      </div>

      {/* Right Side: Form */}
      <div className="flex items-center justify-center p-8 bg-white">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md space-y-10"
        >
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-accent italic">Create Account</h2>
            <p className="text-gray-400 mt-2">Start your 14-day free trial today.</p>
          </div>

          <div className="space-y-4">
            <button className="w-full bg-[#111111] text-white flex items-center justify-center gap-3 py-4 rounded-xl font-bold hover:bg-black transition-all group">
              <Camera className="w-5 h-5" />
              Sign up with Instagram
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </button>

            <div className="relative flex items-center gap-4 py-4">
              <div className="flex-1 h-[1px] bg-gray-100" />
              <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">or email</span>
              <div className="flex-1 h-[1px] bg-gray-100" />
            </div>

            <div className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 text-red-500 text-sm font-medium rounded-lg">
                  {error}
                </div>
              )}
              {success && (
                <div className="p-3 bg-green-50 text-green-600 text-sm font-medium rounded-lg">
                  {success}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-bold text-accent uppercase tracking-wider ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Tejas Adhiya" 
                    className="input pl-10"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-accent uppercase tracking-wider ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="email" 
                    placeholder="tejas@example.com" 
                    className="input pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-accent uppercase tracking-wider ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    className="input pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <button 
              onClick={handleSignUp}
              disabled={isLoading}
              className="btn-primary w-full py-4 mt-4 font-bold text-lg disabled:opacity-50"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>

            <p className="text-center text-sm text-gray-400 pt-4">
              Already have an account? <Link href="/login" className="text-accent font-bold hover:underline italic">Sign in</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
