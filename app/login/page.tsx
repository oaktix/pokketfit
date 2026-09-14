'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Flame, 
  ArrowRight,
  ArrowLeft,
  Mail, 
  Lock, 
  AlertCircle, 
  CheckCircle2, 
  Loader2 
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { getLocalStore, saveLocalStore } from '@/lib/storage/store';
import { generateDailyPlan } from '@/lib/engine/plan-engine';
import { TactileButton } from '@/components/motion/MotionPrimitives';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    const supabase = createClient();

    // If Supabase credentials are configured, authenticate against real Supabase Auth
    if (supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setLoading(false);
        setErrorMessage(error.message || 'Invalid email or password.');
        return;
      }

      if (data.session) {
        // Profile loading is secondary — redirect regardless
        const store = getLocalStore();
        // Try to load profile if it exists, but don't block on it
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

          if (profile) {
            store.currentUser = {
              ...store.currentUser,
              id: profile.id,
              name: profile.name,
              email: profile.email,
              role: profile.role || 'user',
              points: profile.points || 0,
              currentStreak: profile.current_streak || 0,
            };
          }
          saveLocalStore(store);
        } catch {
          // Profile read blocked or missing — proceed anyway
        }

        if ((store.currentUser?.role === 'admin' || store.currentUser?.role === 'owner') && data.session) {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
        setLoading(false);
        return;
      } else {
        // Login succeeded but no session returned (email confirmation ON or token issue)
        setLoading(false);
        setErrorMessage('Login successful, but session was not established. Please check your email for verification or try again.');
        return;
      }
    } else {
      // Supabase not configured — show error instead of fake auth
      setLoading(false);
      setErrorMessage('Authentication service unavailable. Please try again later.');
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-between bg-[#0A0705] text-[#FAF8F5] px-6 py-10 relative overflow-hidden">
      {/* Header */}
      <div className="w-full flex items-center justify-between z-10 max-w-sm">
        <div className="flex flex-col space-y-2">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-2xl bg-[#E37210] flex items-center justify-center">
              <Flame className="w-5 h-5 text-white fill-white" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-white">POKKETFIT</span>
            </div>
          </Link>
          <Link href="/" className="text-xs text-[#8A8279] hover:text-[#E37210] transition-colors flex items-center space-x-1 ml-11">
            <ArrowLeft className="w-3 h-3" />
            <span>Back to PokketFit</span>
          </Link>
        </div>

        <Link
          href="/onboarding"
          className="text-xs text-[#E37210] hover:text-[#F2801E] font-bold"
        >
          Create Account
        </Link>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-sm bg-[#16120E] border border-[#2A241E] rounded-2xl p-6 shadow-card-dark z-10 my-auto">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-black text-white tracking-tight">Welcome Back</h1>
          <p className="text-xs text-[#8A8279] mt-1">
            Enter your credentials to access your daily fitness plan.
          </p>
        </div>

        {errorMessage && (
          <div className="bg-rose-950/40 border border-rose-800/50 p-3 rounded-2xl mb-4 flex items-start space-x-2 text-xs text-rose-300">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-[#C7BFB5] block mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full bg-[#110D0A] border border-[#2A241E] rounded-2xl pl-10 pr-4 py-3 text-xs text-white placeholder-[#706760] focus:outline-none focus:border-[#E37210]"
              />
              <Mail className="w-4 h-4 text-[#8A8279] absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-[#C7BFB5] block mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#110D0A] border border-[#2A241E] rounded-2xl pl-10 pr-4 py-3 text-xs text-white placeholder-[#706760] focus:outline-none focus:border-[#E37210]"
              />
              <Lock className="w-4 h-4 text-[#8A8279] absolute left-3.5 top-3.5" />
            </div>
          </div>

          <TactileButton
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-2xl bg-[#E37210] hover:bg-[#F2801E] text-white font-bold flex items-center justify-center space-x-2 transition-colors mt-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin text-white" />
            ) : (
              <>
                <span>Sign in to PokketFit</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </TactileButton>
        </form>

        <div className="mt-5 pt-4 border-t border-[#2A241E] text-center">
          <p className="text-xs text-[#8A8279]">
            Don't have an account?{' '}
            <Link href="/onboarding" className="text-[#E37210] font-bold hover:underline">
              Sign Up Now
            </Link>
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-[11px] text-[#706760] z-10">
        PokketFit • Wellness Coaching Tool
      </div>
    </div>
  );
}
