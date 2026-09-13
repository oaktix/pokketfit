import Link from 'next/link';
import { Flame, ArrowRight, ShieldCheck, Dumbbell, Apple, HeartPulse } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-between bg-[#0A0705] text-[#FAF8F5] px-6 py-10 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-[-100px] left-1/2 transform -translate-x-1/2 w-[350px] h-[350px] bg-[#E37210]/20 rounded-full blur-[100px] pointer-events-none" />

      {/* Header / Brand Lockup */}
      <div className="w-full flex items-center justify-between z-10">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#E37210] to-[#F97316] flex items-center justify-center shadow-glow-orange">
            <Flame className="w-6 h-6 text-white fill-white" />
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight text-white">POKKETFIT</span>
            <span className="block text-[10px] text-[#E37210] uppercase tracking-widest font-semibold">Coach In Your Pocket</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            href="/login"
            className="text-xs text-[#FDBA74] hover:text-white border border-[#2A241E] px-3.5 py-1.5 rounded-full transition-colors font-semibold"
          >
            Log In
          </Link>
          <Link
            href="/onboarding"
            className="text-xs text-white bg-gradient-to-r from-[#E37210] to-[#F2801E] px-3.5 py-1.5 rounded-full transition-colors font-semibold shadow-glow-subtle"
          >
            Sign Up
          </Link>
        </div>
      </div>

      {/* Hero Visual & Catchphrase */}
      <div className="my-auto text-center z-10 max-w-sm">
        <div className="inline-flex items-center space-x-2 bg-[#1E1914] border border-[#2A241E] px-3.5 py-1.5 rounded-full text-xs text-[#FDBA74] mb-6">
          <span className="w-2 h-2 rounded-full bg-[#E37210] animate-ping" />
          <span>HealthRich Fitness Inspired Identity</span>
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight leading-[1.15] mb-4 text-white">
          Transform Your Body, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E37210] via-[#FB923C] to-[#FED7AA]">
            One Rep At A Time.
          </span>
        </h1>

        <p className="text-sm text-[#A8A096] leading-relaxed mb-8">
          Personalized workouts, local Nigerian nutrition, hydration coaching, and habits that stick. No guesswork.
        </p>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-2 gap-3 text-left mb-8">
          <div className="bg-[#16120E] border border-[#2A241E] p-3.5 rounded-2xl">
            <Dumbbell className="w-5 h-5 text-[#E37210] mb-1.5" />
            <div className="text-xs font-semibold text-white">Home & Gym Splits</div>
            <div className="text-[11px] text-[#8A8279]">5 body targets & owner programs</div>
          </div>
          <div className="bg-[#16120E] border border-[#2A241E] p-3.5 rounded-2xl">
            <Apple className="w-5 h-5 text-[#E37210] mb-1.5" />
            <div className="text-xs font-semibold text-white">Nigerian Meal Plans</div>
            <div className="text-[11px] text-[#8A8279]">Jollof, Moi-Moi, fresh fruits</div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full space-y-3 z-10 max-w-sm">
        <Link
          href="/onboarding"
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#E37210] to-[#F2801E] text-white font-bold flex items-center justify-center space-x-2 shadow-glow-orange hover:brightness-110 active:scale-[0.98] transition-all"
        >
          <span>Start Assessment & Build Plan</span>
          <ArrowRight className="w-5 h-5" />
        </Link>

        <Link
          href="/dashboard"
          className="w-full py-3.5 px-6 rounded-2xl bg-[#16120E] border border-[#2A241E] text-[#D5D1CB] font-medium flex items-center justify-center space-x-2 hover:bg-[#1E1914] active:scale-[0.98] transition-all text-sm"
        >
          <span>Explore Demo Dashboard</span>
        </Link>
      </div>

      {/* Safety Disclaimer Footer (PRD Section 35) */}
      <div className="w-full text-center pt-6 text-[10px] text-[#706760] z-10 flex items-center justify-center space-x-1">
        <ShieldCheck className="w-3 h-3 text-[#E37210]" />
        <span>FitPocket is a wellness coach. Not intended to diagnose or replace clinical medical advice.</span>
      </div>
    </div>
  );
}
