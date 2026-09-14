'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Flame, 
  ArrowRight, 
  Dumbbell, 
  Apple, 
  Droplets, 
  Trophy, 
  CheckCircle2, 
  Sparkles, 
  Play, 
  ShieldCheck, 
  Activity, 
  ChevronRight,
  TrendingUp,
  Award,
  Zap,
  Moon,
  Clock,
  Check
} from 'lucide-react';
import { motion } from 'motion/react';
import LandingHeader from '@/components/navigation/LandingHeader';
import FloatingFitnessIcons from '@/components/ambient/FloatingFitnessIcons';
import { TactileButton, NumberCountUp } from '@/components/motion/MotionPrimitives';

export default function LandingPage() {
  return (
    <div className="min-h-[100dvh] bg-[#0A0705] text-[#FAF8F5] relative selection:bg-[#E37210]/30 selection:text-[#FDBA74] overflow-x-hidden font-sans">
      {/* Responsive Navigation Header */}
      <LandingHeader />

      {/* ========================================================================= */}
      {/* 1. HERO SECTION */}
      {/* ========================================================================= */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 px-4 sm:px-6 z-10">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          {/* Solid high-contrast headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.08] max-w-3xl mx-auto">
            A fitness coach that fits in your pocket.
          </h1>

          {/* Supporting copy */}
          <p className="text-base sm:text-lg md:text-xl text-[#A8A096] max-w-2xl mx-auto leading-relaxed font-normal">
            Personalized workouts, Nigerian-friendly nutrition, hydration coaching, habits, and progress tracking built around your daily routine.
          </p>

          {/* Action CTAs: Solid button styling without diffuse glow or jelly scale */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 max-w-md mx-auto">
            <Link
              href="/onboarding"
              className="w-full sm:w-auto min-h-[48px] px-7 py-3 rounded-xl bg-[#E37210] hover:bg-[#F2801E] text-white text-sm font-bold flex items-center justify-center space-x-2 transition-colors"
            >
              <span>Start My Fitness Journey</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

          </div>

          {/* ===================================================================== */}
          {/* HERO VISUAL: Clean Mobile Mockup (Solid surfaces, precise radius) */}
          {/* ===================================================================== */}
          <div className="pt-10 md:pt-14 relative max-w-2xl mx-auto">
            {/* Phone container with proper 24px corner radius */}
            <div className="relative mx-auto max-w-[340px] sm:max-w-[360px] bg-[#110D0A] border border-white/[0.1] rounded-3xl p-5 shadow-card-dark text-left overflow-hidden">
              {/* Top Speaker Pill */}
              <div className="w-20 h-3.5 bg-[#0A0705] rounded-full mx-auto mb-4 border border-white/[0.05]" />

              {/* Greeting & Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-[11px] text-[#8A8279] font-medium">Daily Coach</div>
                  <div className="text-sm font-bold text-white">Your Routine Today</div>
                </div>
                <div className="flex items-center space-x-1.5 bg-[#1E1914] border border-white/[0.08] px-2.5 py-1 rounded-lg text-[11px] font-bold text-[#FDBA74]">
                  <Flame className="w-3.5 h-3.5 text-[#E37210] fill-[#E37210]" />
                  <span>14d streak</span>
                </div>
              </div>

              {/* Daily Progress Card */}
              <div className="bg-[#16120E] border border-white/[0.06] rounded-2xl p-4 mb-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-white">Today's Progress</span>
                  <span className="text-xs font-bold text-[#E37210] tabular-nums">75%</span>
                </div>
                {/* Progress Multi-Pill */}
                <div className="w-full bg-[#1F1A15] h-2 rounded-full overflow-hidden flex">
                  <div className="bg-[#E37210] h-full w-[40%]" />
                  <div className="bg-cyan-500 h-full w-[20%]" />
                  <div className="bg-emerald-500 h-full w-[15%]" />
                </div>
                <div className="flex items-center justify-between text-[10px] text-[#8A8279] mt-2">
                  <span className="flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E37210]" />
                    <span>Workout</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    <span>Hydration</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>Meals</span>
                  </span>
                </div>
              </div>

              {/* Active Exercise Movement Tile */}
              <div className="bg-[#16120E] border border-white/[0.06] rounded-2xl p-3.5 flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#1E1914] flex items-center justify-center text-[#E37210] shrink-0">
                  <Dumbbell className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-white truncate">Chair Squats & Glute Bridge</div>
                  <div className="text-[10px] text-[#8A8279]">3 sets • 12 reps • Form demonstration</div>
                </div>
                <span className="text-[10px] font-bold text-[#E37210] bg-[#E37210]/15 px-2 py-1 rounded-full">
                  Start
                </span>
              </div>

              {/* Nigerian Meal Plan Tile */}
              <div className="bg-[#16120E] border border-white/[0.06] rounded-2xl p-3.5 flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-[#1E1914] flex items-center justify-center text-emerald-400 shrink-0">
                  <Apple className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-white truncate">Steamed Moi-Moi & Papaya</div>
                  <div className="text-[10px] text-[#8A8279]">High protein • 380 kcal • Balanced</div>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              </div>
            </div>

            {/* Floating Highlights (Neutral surfaces, purposeful icons) */}
            <div className="hidden md:flex absolute top-12 -left-12 bg-[#16120E] border border-white/[0.08] rounded-xl p-3 shadow-card-dark items-center space-x-3 max-w-[200px] text-left">
              <div className="w-8 h-8 rounded-lg bg-[#1E1914] flex items-center justify-center text-[#E37210] shrink-0">
                <Droplets className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[11px] font-semibold text-white">2.5L Hydration</div>
                <div className="text-[10px] text-[#8A8279]">Target reached today</div>
              </div>
            </div>

            <div className="hidden md:flex absolute top-24 -right-12 bg-[#16120E] border border-white/[0.08] rounded-xl p-3 shadow-card-dark items-center space-x-3 max-w-[200px] text-left">
              <div className="w-8 h-8 rounded-lg bg-[#1E1914] flex items-center justify-center text-[#E37210] shrink-0">
                <Trophy className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[11px] font-semibold text-white">Gold League</div>
                <div className="text-[10px] text-[#8A8279]">Top 15% consistency</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. PERSONALIZED FOR YOU */}
      {/* ========================================================================= */}
      <section id="features" className="py-20 md:py-24 px-4 sm:px-6 border-t border-white/[0.06] relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2.5">
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Built specifically around your body and life
            </h2>
            <p className="text-sm sm:text-base text-[#8A8279]">
              Every body is unique. PokketFit calculates your physical baseline and prescribes routines designed for sustainable lifestyle progression.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Card 1 */}
            <div className="bg-[#120E0B] border border-white/[0.06] rounded-2xl p-6 space-y-3 hover:border-white/[0.12] transition-colors">
              <div className="w-9 h-9 rounded-lg bg-[#1E1914] flex items-center justify-center text-[#E37210]">
                <Activity className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-white">Adult Assessment</h3>
              <p className="text-xs text-[#8A8279] leading-relaxed">
                Evidence-based BMI stratification with safe healthy weight ranges tailored exclusively to mature physiology (18+).
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-[#120E0B] border border-white/[0.06] rounded-2xl p-6 space-y-3 hover:border-white/[0.12] transition-colors">
              <div className="w-9 h-9 rounded-lg bg-[#1E1914] flex items-center justify-center text-[#E37210]">
                <Zap className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-white">Home or Gym Routine</h3>
              <p className="text-xs text-[#8A8279] leading-relaxed">
                Whether you train on a living room yoga mat with bodyweight or in a fully equipped gym, your coach adapts seamlessly.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-[#120E0B] border border-white/[0.06] rounded-2xl p-6 space-y-3 hover:border-white/[0.12] transition-colors">
              <div className="w-9 h-9 rounded-lg bg-[#1E1914] flex items-center justify-center text-[#E37210]">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-white">Postpartum Care</h3>
              <p className="text-xs text-[#8A8279] leading-relaxed">
                Dedicated recovery protocols focusing on gentle core restoration, pelvic stability, and doctor-cleared progress.
              </p>
            </div>
          </div>
        </div>
        </section>
      {/* ========================================================================= */}
      {/* 3. WORKOUTS (Form Guidance & Video Demo) */}
      {/* ========================================================================= */}
      <section id="workouts" className="py-20 md:py-24 px-4 sm:px-6 bg-[#0E0B08]/60 border-t border-white/[0.06] relative z-10">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
              Form demonstration videos with zero guesswork
            </h2>
            <p className="text-sm text-[#8A8279] leading-relaxed">
              Never wonder if you're doing a movement correctly. Every exercise comes with HD video demonstrations, biomechanical focus cues, and prescribed sets and reps.
            </p>

            <div className="space-y-2.5 pt-2">
              <div className="flex items-center space-x-3 text-xs font-medium text-[#D5D1CB]">
                <div className="w-5 h-5 rounded-md bg-[#1E1914] flex items-center justify-center text-[#E37210]">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <span>Lower Body, Upper Body, Core, and Cardio splits</span>
              </div>
              <div className="flex items-center space-x-3 text-xs font-medium text-[#D5D1CB]">
                <div className="w-5 h-5 rounded-md bg-[#1E1914] flex items-center justify-center text-[#E37210]">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <span>Integrated rest timer with countdown alerts</span>
              </div>
              <div className="flex items-center space-x-3 text-xs font-medium text-[#D5D1CB]">
                <div className="w-5 h-5 rounded-md bg-[#1E1914] flex items-center justify-center text-[#E37210]">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <span>Full offline execution and automatic background sync</span>
              </div>
            </div>

            <div className="pt-3">
              <Link
                href="/onboarding"
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#E37210] hover:text-[#F2801E] group"
              >
                <span>View workout library</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Video preview mock */}
          <div className="bg-[#16120E] border border-white/[0.08] rounded-2xl p-5 shadow-card-dark relative overflow-hidden">
            <div className="aspect-video bg-black rounded-xl overflow-hidden relative flex items-center justify-center group border border-white/[0.06]">
              <div className="w-12 h-12 rounded-full bg-[#E37210] flex items-center justify-center text-white z-20">
                <Play className="w-5 h-5 fill-white ml-0.5" />
              </div>
              <div className="absolute bottom-3 left-4 z-20">
                <div className="text-xs font-semibold text-white">Chair Squats Demonstration</div>
                <div className="text-[10px] text-[#A8A096]">Quads • Glutes • Core stability</div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-semibold text-[#E37210] bg-[#1E1914] border border-white/[0.08] px-2 py-0.5 rounded-md">
                  Set 1 of 3
                </span>
                <h4 className="text-sm font-semibold text-white mt-1">12 Repetitions</h4>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-[#8A8279]">Rest Interval</div>
                <div className="text-xs font-bold text-white tabular-nums">60s Between Sets</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. EAT BETTER (Nigerian-Friendly Nutrition) */}
      {/* ========================================================================= */}
      <section id="nutrition" className="py-20 md:py-24 px-4 sm:px-6 border-t border-white/[0.06] relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2.5">
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Everyday Nigerian food, portioned for your goal
            </h2>
            <p className="text-sm sm:text-base text-[#8A8279]">
              No foreign diet plans or hard-to-find ingredients. PokketFit features authentic Nigerian staples with straightforward portion sizing, protein goals, and fresh local fruits.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Meal 1 */}
            <div className="bg-[#120E0B] border border-white/[0.06] rounded-2xl p-5 space-y-2 hover:border-white/[0.12] transition-colors">
              <span className="text-[10px] font-semibold text-[#D5D1CB] bg-[#1E1914] px-2 py-0.5 rounded-md">
                Breakfast
              </span>
              <h4 className="text-sm font-semibold text-white">Akara & Steamed Pap</h4>
              <p className="text-xs text-[#8A8279]">4 bean cakes with warm fortified corn pap.</p>
              <div className="text-xs font-medium text-[#D5D1CB] pt-1 tabular-nums">320 kcal • 18g Protein</div>
            </div>

            {/* Meal 2 */}
            <div className="bg-[#120E0B] border border-white/[0.06] rounded-2xl p-5 space-y-2 hover:border-white/[0.12] transition-colors">
              <span className="text-[10px] font-semibold text-[#D5D1CB] bg-[#1E1914] px-2 py-0.5 rounded-md">
                Lunch
              </span>
              <h4 className="text-sm font-semibold text-white">Party Jollof Rice</h4>
              <p className="text-xs text-[#8A8279]">1 medium portion with grilled chicken breast.</p>
              <div className="text-xs font-medium text-[#D5D1CB] pt-1 tabular-nums">540 kcal • 32g Protein</div>
            </div>

            {/* Meal 3 */}
            <div className="bg-[#120E0B] border border-white/[0.06] rounded-2xl p-5 space-y-2 hover:border-white/[0.12] transition-colors">
              <span className="text-[10px] font-semibold text-[#D5D1CB] bg-[#1E1914] px-2 py-0.5 rounded-md">
                Dinner
              </span>
              <h4 className="text-sm font-semibold text-white">Steamed Moi-Moi</h4>
              <p className="text-xs text-[#8A8279]">Steamed black-eyed bean pudding with boiled egg.</p>
              <div className="text-xs font-medium text-[#D5D1CB] pt-1 tabular-nums">380 kcal • 24g Protein</div>
            </div>

            {/* Meal 4: Fruits */}
            <div className="bg-[#120E0B] border border-white/[0.06] rounded-2xl p-5 space-y-2 hover:border-white/[0.12] transition-colors">
              <span className="text-[10px] font-semibold text-[#D5D1CB] bg-[#1E1914] px-2 py-0.5 rounded-md">
                Daily Fruit
              </span>
              <h4 className="text-sm font-semibold text-white">Fresh Papaya & Orange</h4>
              <p className="text-xs text-[#8A8279]">Micronutrients, digestion vitality, and fiber.</p>
              <div className="text-xs font-medium text-[#D5D1CB] pt-1 tabular-nums">60 kcal • 3g Fiber</div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. HABITS (Hydration & Sleep Window) */}
      {/* ========================================================================= */}
      <section id="habits" className="py-20 md:py-24 px-4 sm:px-6 bg-[#0E0B08]/60 border-t border-white/[0.06] relative z-10">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Habits that stick without guilt or burnout
            </h2>
            <p className="text-sm text-[#8A8279] leading-relaxed">
              Fitness is won in the small moments. Log your hydration with a single tap, track your fruit portions, and receive reminders tuned to your waking hours.
            </p>

            <div className="bg-[#120E0B] border border-white/[0.06] rounded-xl p-4 flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-[#1E1914] flex items-center justify-center text-[#E37210] shrink-0">
                <Moon className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white">Bedtime Notification Suppression</h4>
                <p className="text-[11px] text-[#8A8279]">
                  PokketFit completely silences all push notifications during your sleep window to protect rest.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#16120E] border border-white/[0.08] rounded-2xl p-6 space-y-4 shadow-card-dark">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Droplets className="w-4 h-4 text-[#E37210]" />
                <h4 className="text-sm font-semibold text-white">Daily Hydration Tracking</h4>
              </div>
              <span className="text-xs font-semibold text-white bg-[#1E1914] border border-white/[0.08] px-2.5 py-1 rounded-md tabular-nums">
                2.0L / 2.5L
              </span>
            </div>

            <div className="w-full bg-[#110D0A] h-2.5 rounded-full overflow-hidden">
              <div className="bg-[#E37210] h-full w-[80%] rounded-full" />
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2">
              <div className="bg-[#1E1914] p-2.5 rounded-lg text-center text-xs font-medium text-white border border-white/[0.05]">
                +250ml Glass
              </div>
              <div className="bg-[#1E1914] p-2.5 rounded-lg text-center text-xs font-medium text-white border border-white/[0.05]">
                +500ml Bottle
              </div>
              <div className="bg-[#1E1914] p-2.5 rounded-lg text-center text-xs font-medium text-white border border-white/[0.05]">
                +750ml Sachet
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. LEAGUES */}
      {/* ========================================================================= */}
      <section id="leagues" className="py-20 md:py-24 px-4 sm:px-6 border-t border-white/[0.06] relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2.5">
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Ranked by consistency, never by body size
            </h2>
            <p className="text-sm sm:text-base text-[#8A8279]">
              Compete fairly in Bronze, Silver, Gold, Platinum, Diamond, and Master leagues. Points are awarded solely for workout completion, hydration, and healthy lifestyle choices.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { name: 'Bronze', pts: '0 XP' },
              { name: 'Silver', pts: '500 XP' },
              { name: 'Gold', pts: '1,500 XP' },
              { name: 'Platinum', pts: '3,000 XP' },
              { name: 'Diamond', pts: '5,000 XP' },
              { name: 'Master', pts: '10,000 XP' },
            ].map((tier) => (
              <div 
                key={tier.name}
                className="bg-[#120E0B] border border-white/[0.06] rounded-xl p-4 text-center space-y-1"
              >
                <Trophy className="w-4 h-4 mx-auto mb-1 text-[#E37210]" />
                <div className="text-xs font-semibold text-white">{tier.name}</div>
                <div className="text-[10px] text-[#8A8279] tabular-nums">{tier.pts}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. FINAL CTA */}
      {/* ========================================================================= */}
      <section className="py-20 md:py-28 px-4 sm:px-6 border-t border-white/[0.06] relative z-10 text-center">
        <div className="max-w-2xl mx-auto space-y-5">
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
            Your fitness routine doesn't need to be complicated
          </h2>
          <p className="text-base text-[#A8A096] max-w-lg mx-auto">
            Take the 2-minute assessment, get a workout and meal structure tailored to you, and start building consistency.
          </p>

          <div className="pt-2">
            <Link
              href="/onboarding"
              className="inline-flex items-center space-x-2 text-sm font-bold text-white bg-[#E37210] hover:bg-[#F2801E] px-8 py-3.5 rounded-xl transition-colors"
            >
              <span>Start With PokketFit</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* FOOTER */}
      {/* ========================================================================= */}
      <footer className="border-t border-white/[0.06] py-10 px-4 sm:px-6 z-10 relative">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#706760]">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-lg bg-[#E37210] flex items-center justify-center text-white">
              <Flame className="w-3.5 h-3.5 fill-white" />
            </div>
            <span className="font-bold text-white">POKKETFIT</span>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/login" className="hover:text-white transition-colors">Member Login</Link>
            <Link href="/onboarding" className="hover:text-white transition-colors">Get Started</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
          </div>

          <div className="flex items-center space-x-1 text-[10px]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#E37210]" />
            <span>Wellness coaching tool. Not clinical medical advice.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
