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
      {/* Background Ambience: Subtle Radial Depth & Ambient Floating Icons */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[650px] md:w-[900px] h-[500px] bg-gradient-to-b from-[#E37210]/15 via-[#E37210]/5 to-transparent rounded-full blur-[140px] pointer-events-none z-0" 
      />
      <FloatingFitnessIcons />

      {/* Responsive Navigation Header */}
      <LandingHeader />

      {/* ========================================================================= */}
      {/* 1. HERO SECTION */}
      {/* ========================================================================= */}
      <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 px-4 sm:px-6 z-10">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          {/* Eyebrow badge with Apple-like restraint */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            className="inline-flex items-center space-x-2 bg-[#16120E] border border-white/[0.08] px-4 py-1.5 rounded-full text-xs font-semibold text-[#FDBA74]"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#E37210] animate-pulse" />
            <span className="tracking-wide uppercase text-[10px] font-bold text-[#E37210]">
              YOUR PERSONAL FITNESS COACH
            </span>
          </motion.div>

          {/* Large confident display headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.08] max-w-4xl mx-auto"
          >
            A fitness coach that fits in{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E37210] via-[#FB923C] to-[#FED7AA]">
              your pocket.
            </span>
          </motion.h1>

          {/* Supporting copy */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="text-base sm:text-lg md:text-xl text-[#A8A096] max-w-2xl mx-auto leading-relaxed font-normal"
          >
            Personalized workouts, Nigerian-friendly nutrition, hydration coaching, habits, and progress tracking, built around your routine.
          </motion.p>

          {/* Action CTAs */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 max-w-md mx-auto"
          >
            <Link
              href="/onboarding"
              className="w-full sm:w-auto min-h-[50px] px-8 py-3.5 rounded-full bg-gradient-to-r from-[#E37210] to-[#F2801E] hover:from-[#EA7A15] hover:to-[#F88B2A] text-white text-sm font-bold flex items-center justify-center space-x-2 shadow-glow-orange hover:shadow-glow-subtle active:scale-[0.97] transition-all"
            >
              <span>Start My Fitness Journey</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/dashboard"
              className="w-full sm:w-auto min-h-[50px] px-7 py-3.5 rounded-full bg-[#16120E] hover:bg-[#1E1914] border border-white/[0.08] text-sm font-semibold text-[#D5D1CB] hover:text-white flex items-center justify-center active:scale-[0.97] transition-all"
            >
              <span>Explore PokketFit</span>
            </Link>
          </motion.div>

          {/* ===================================================================== */}
          {/* HERO VISUAL: Orbiting Interactive Dashboard Composition */}
          {/* ===================================================================== */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="pt-12 md:pt-16 relative max-w-4xl mx-auto"
          >
            {/* Ambient Center Glow */}
            <div className="absolute inset-0 bg-[#E37210]/10 blur-3xl -z-10 rounded-3xl" />

            {/* Simulated Mobile Mockup in center with orbiting highlights */}
            <div className="relative mx-auto max-w-[340px] sm:max-w-[360px] bg-[#110D0A] border border-white/[0.1] rounded-[36px] p-5 shadow-2xl text-left overflow-hidden">
              {/* Phone Speaker Notch */}
              <div className="w-24 h-4 bg-[#0A0705] rounded-full mx-auto mb-4 border border-white/[0.05]" />

              {/* Greeting & Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-[11px] text-[#8A8279] font-medium">Daily Fitness Coach</div>
                  <div className="text-sm font-bold text-white">Good Morning, Athlete</div>
                </div>
                <div className="flex items-center space-x-1 bg-[#1E1914] border border-[#E37210]/40 px-2.5 py-1 rounded-full text-[11px] font-bold text-[#FDBA74]">
                  <Flame className="w-3.5 h-3.5 text-[#E37210] fill-[#E37210]" />
                  <span>14d Streak</span>
                </div>
              </div>

              {/* Daily Progress Card */}
              <div className="bg-[#16120E] border border-white/[0.06] rounded-2xl p-4 mb-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-white">Today's Progress</span>
                  <span className="text-xs font-black text-[#E37210]">75% Complete</span>
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
                <div className="w-10 h-10 rounded-xl bg-[#E37210]/15 flex items-center justify-center text-[#E37210] shrink-0">
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
                <div className="w-10 h-10 rounded-xl bg-emerald-950/60 flex items-center justify-center text-emerald-400 shrink-0">
                  <Apple className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-white truncate">Steamed Moi-Moi & Papaya</div>
                  <div className="text-[10px] text-[#8A8279]">High protein • 380 kcal • Balanced</div>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              </div>
            </div>

            {/* Orbiting Feature Badges (Desktop & Tablet) */}
            <motion.div 
              animate={{ y: [-4, 4, -4] }} 
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="hidden md:flex absolute top-12 left-6 bg-[#16120E]/90 border border-white/[0.1] backdrop-blur-md rounded-2xl p-3 shadow-xl items-center space-x-3 max-w-[210px] text-left"
            >
              <div className="w-9 h-9 rounded-xl bg-cyan-950/60 flex items-center justify-center text-cyan-400 shrink-0">
                <Droplets className="w-5 h-5 fill-cyan-400" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-white">2.5L Hydration</div>
                <div className="text-[10px] text-[#8A8279]">Target reached today</div>
              </div>
            </motion.div>

            <motion.div 
              animate={{ y: [4, -4, 4] }} 
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              className="hidden md:flex absolute top-24 right-6 bg-[#16120E]/90 border border-white/[0.1] backdrop-blur-md rounded-2xl p-3 shadow-xl items-center space-x-3 max-w-[210px] text-left"
            >
              <div className="w-9 h-9 rounded-xl bg-amber-950/60 flex items-center justify-center text-amber-400 shrink-0">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-white">Gold League</div>
                <div className="text-[10px] text-[#8A8279]">Top 15% consistency</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. PERSONALIZED FOR YOU (Fitness Assessment & Goal Routing) */}
      {/* ========================================================================= */}
      <section id="features" className="py-20 md:py-28 px-4 sm:px-6 border-t border-white/[0.06] relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#E37210]">
              Customized Protocol
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Built specifically around your body and life.
            </h2>
            <p className="text-sm sm:text-base text-[#8A8279]">
              Every body is unique. PokketFit calculates your physical baseline and prescribes routines designed for sustainable lifestyle progression.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Card 1 */}
            <div className="bg-[#120E0B] border border-white/[0.06] rounded-3xl p-6 space-y-3 hover:border-[#E37210]/30 transition-colors">
              <div className="w-10 h-10 rounded-2xl bg-[#1E1914] flex items-center justify-center text-[#E37210]">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Adult Assessment</h3>
              <p className="text-xs text-[#8A8279] leading-relaxed">
                Evidence-based BMI stratification with safe healthy weight ranges tailored exclusively to mature physiology (18+).
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-[#120E0B] border border-white/[0.06] rounded-3xl p-6 space-y-3 hover:border-[#E37210]/30 transition-colors">
              <div className="w-10 h-10 rounded-2xl bg-[#1E1914] flex items-center justify-center text-[#E37210]">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Home or Gym Routine</h3>
              <p className="text-xs text-[#8A8279] leading-relaxed">
                Whether you train on a living room yoga mat with bodyweight or in a fully equipped gym, your coach adapts seamlessly.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-[#120E0B] border border-white/[0.06] rounded-3xl p-6 space-y-3 hover:border-[#E37210]/30 transition-colors">
              <div className="w-10 h-10 rounded-2xl bg-[#1E1914] flex items-center justify-center text-[#E37210]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Postpartum Care</h3>
              <p className="text-xs text-[#8A8279] leading-relaxed">
                Dedicated recovery protocols focusing on gentle core restoration, pelvic stability, and doctor-cleared progress.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. TRAIN YOUR WAY (Home & Gym Splits + Visual Guidance) */}
      {/* ========================================================================= */}
      <section id="workouts" className="py-20 md:py-28 px-4 sm:px-6 bg-[#0E0B08]/60 border-t border-white/[0.06] relative z-10">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#E37210]">
              Exercise Intelligence
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              Form demonstration videos with zero guesswork.
            </h2>
            <p className="text-sm text-[#8A8279] leading-relaxed">
              Never wonder if you're doing a movement correctly. Every exercise comes with HD Cloudinary video playback, biomechanical focus cues, and prescribed sets and reps.
            </p>

            <div className="space-y-2.5 pt-2">
              <div className="flex items-center space-x-3 text-xs font-semibold text-[#D5D1CB]">
                <div className="w-5 h-5 rounded-full bg-[#E37210]/20 flex items-center justify-center text-[#E37210]">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <span>Lower Body, Upper Body, Core, and Cardio splits</span>
              </div>
              <div className="flex items-center space-x-3 text-xs font-semibold text-[#D5D1CB]">
                <div className="w-5 h-5 rounded-full bg-[#E37210]/20 flex items-center justify-center text-[#E37210]">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <span>Integrated rest timer with countdown alerts</span>
              </div>
              <div className="flex items-center space-x-3 text-xs font-semibold text-[#D5D1CB]">
                <div className="w-5 h-5 rounded-full bg-[#E37210]/20 flex items-center justify-center text-[#E37210]">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <span>Full offline execution and automatic background sync</span>
              </div>
            </div>

            <div className="pt-3">
              <Link
                href="/onboarding"
                className="inline-flex items-center space-x-2 text-xs font-bold text-[#E37210] hover:text-[#F2801E] group"
              >
                <span>View workout library</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Video preview mock */}
          <div className="bg-[#16120E] border border-white/[0.08] rounded-3xl p-6 shadow-2xl relative overflow-hidden">
            <div className="aspect-video bg-black rounded-2xl overflow-hidden relative flex items-center justify-center group border border-white/[0.06]">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
              <div className="w-14 h-14 rounded-full bg-[#E37210] flex items-center justify-center text-white shadow-glow-orange group-hover:scale-110 transition-transform z-20">
                <Play className="w-6 h-6 fill-white ml-0.5" />
              </div>
              <div className="absolute bottom-3 left-4 z-20">
                <div className="text-xs font-bold text-white">Chair Squats Demonstration</div>
                <div className="text-[10px] text-[#A8A096]">Quads • Glutes • Core stability</div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#E37210] uppercase tracking-wider bg-[#E37210]/15 px-2.5 py-0.5 rounded-full">
                  Set 1 of 3
                </span>
                <h4 className="text-sm font-bold text-white mt-1">12 Repetitions</h4>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-[#8A8279]">Rest Interval</div>
                <div className="text-xs font-mono font-bold text-[#FDBA74]">60s Between Sets</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. EAT BETTER (Nigerian-Friendly Nutrition) */}
      {/* ========================================================================= */}
      <section id="nutrition" className="py-20 md:py-28 px-4 sm:px-6 border-t border-white/[0.06] relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-400">
              Culturally Tailored Nutrition
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Eat food you actually love.
            </h2>
            <p className="text-sm sm:text-base text-[#8A8279]">
              No foreign meal plans or inaccessible ingredients. PokketFit features authentic Nigerian staples with exact portion guidance, macro ratios, and fresh local fruits.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Meal 1 */}
            <div className="bg-[#120E0B] border border-white/[0.06] rounded-3xl p-5 space-y-2 hover:border-emerald-500/30 transition-colors">
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full">
                Breakfast
              </span>
              <h4 className="text-sm font-bold text-white">Akara & Steamed Pap</h4>
              <p className="text-xs text-[#8A8279]">4 bean cakes with warm fortified corn pap.</p>
              <div className="text-[11px] font-mono text-[#FAF8F5] pt-1">320 kcal • 18g Protein</div>
            </div>

            {/* Meal 2 */}
            <div className="bg-[#120E0B] border border-white/[0.06] rounded-3xl p-5 space-y-2 hover:border-emerald-500/30 transition-colors">
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full">
                Lunch
              </span>
              <h4 className="text-sm font-bold text-white">Party Jollof Rice</h4>
              <p className="text-xs text-[#8A8279]">1 medium portion with grilled chicken breast.</p>
              <div className="text-[11px] font-mono text-[#FAF8F5] pt-1">540 kcal • 32g Protein</div>
            </div>

            {/* Meal 3 */}
            <div className="bg-[#120E0B] border border-white/[0.06] rounded-3xl p-5 space-y-2 hover:border-emerald-500/30 transition-colors">
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full">
                Dinner
              </span>
              <h4 className="text-sm font-bold text-white">Steamed Moi-Moi</h4>
              <p className="text-xs text-[#8A8279]">Steamed black-eyed bean pudding with boiled egg.</p>
              <div className="text-[11px] font-mono text-[#FAF8F5] pt-1">380 kcal • 24g Protein</div>
            </div>

            {/* Meal 4: Fruits */}
            <div className="bg-[#120E0B] border border-white/[0.06] rounded-3xl p-5 space-y-2 hover:border-emerald-500/30 transition-colors">
              <span className="text-[10px] font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-full">
                Daily Fruit
              </span>
              <h4 className="text-sm font-bold text-white">Fresh Papaya & Orange</h4>
              <p className="text-xs text-[#8A8279]">Micronutrients, digestion vitality, and fiber.</p>
              <div className="text-[11px] font-mono text-[#FAF8F5] pt-1">60 kcal • 3g Fiber</div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. BUILD BETTER HABITS (Hydration & Sleep Window) */}
      {/* ========================================================================= */}
      <section id="habits" className="py-20 md:py-28 px-4 sm:px-6 bg-[#0E0B08]/60 border-t border-white/[0.06] relative z-10">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-cyan-400">
              Daily Consistency
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Habits that stick without guilt or burnout.
            </h2>
            <p className="text-sm text-[#8A8279] leading-relaxed">
              Fitness is won in the small moments. Log your hydration with a single tap, track your fruit portions, and receive web push reminders tuned to your exact waking hours.
            </p>

            <div className="bg-[#120E0B] border border-white/[0.06] rounded-2xl p-4 flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-purple-950/60 flex items-center justify-center text-purple-400 shrink-0">
                <Moon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Bedtime Notification Suppression</h4>
                <p className="text-[11px] text-[#8A8279]">
                  PokketFit completely silences all push notifications during your sleep window to protect rest.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#16120E] border border-white/[0.08] rounded-3xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Droplets className="w-5 h-5 text-cyan-400" />
                <h4 className="text-sm font-bold text-white">Daily Hydration Tracking</h4>
              </div>
              <span className="text-xs font-bold text-cyan-300 bg-cyan-950/80 px-2.5 py-1 rounded-full">
                2.0L / 2.5L
              </span>
            </div>

            <div className="w-full bg-[#110D0A] h-3 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-cyan-500 to-sky-400 h-full w-[80%] rounded-full" />
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2">
              <div className="bg-[#1E1914] p-2.5 rounded-xl text-center text-xs font-bold text-white border border-white/[0.05]">
                +250ml Glass
              </div>
              <div className="bg-[#1E1914] p-2.5 rounded-xl text-center text-xs font-bold text-white border border-white/[0.05]">
                +500ml Bottle
              </div>
              <div className="bg-[#1E1914] p-2.5 rounded-xl text-center text-xs font-bold text-white border border-white/[0.05]">
                +750ml Sachet
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. STAY MOTIVATED & LEAGUES (Activity & Habit Ranking) */}
      {/* ========================================================================= */}
      <section id="leagues" className="py-20 md:py-28 px-4 sm:px-6 border-t border-white/[0.06] relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-400">
              Community Leagues
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Ranked by consistency, never by body size.
            </h2>
            <p className="text-sm sm:text-base text-[#8A8279]">
              Compete fairly in Bronze, Silver, Gold, Platinum, Diamond, and Master leagues. Points are awarded solely for workout completion, hydration, and healthy lifestyle choices.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { name: 'Bronze', pts: '0 XP', color: 'border-amber-700/40 text-amber-600' },
              { name: 'Silver', pts: '500 XP', color: 'border-slate-400/40 text-slate-300' },
              { name: 'Gold', pts: '1,500 XP', color: 'border-yellow-500/40 text-yellow-400' },
              { name: 'Platinum', pts: '3,000 XP', color: 'border-cyan-400/40 text-cyan-300' },
              { name: 'Diamond', pts: '5,000 XP', color: 'border-blue-400/40 text-blue-300' },
              { name: 'Master', pts: '10,000 XP', color: 'border-orange-500/40 text-[#E37210]' },
            ].map((tier) => (
              <div 
                key={tier.name}
                className={`bg-[#120E0B] border ${tier.color} rounded-2xl p-4 text-center space-y-1`}
              >
                <Trophy className="w-5 h-5 mx-auto mb-1" />
                <div className="text-xs font-bold text-white">{tier.name}</div>
                <div className="text-[10px] text-[#8A8279]">{tier.pts}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. FINAL HIGH-CONVERTING CTA */}
      {/* ========================================================================= */}
      <section className="py-24 md:py-32 px-4 sm:px-6 bg-gradient-to-b from-[#0E0B08] to-[#0A0705] border-t border-white/[0.06] relative z-10 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Your fitness journey doesn't need to be complicated.
          </h2>
          <p className="text-base sm:text-lg text-[#A8A096] max-w-xl mx-auto">
            Take the initial 2-minute assessment, unlock your personalized workout and meal split, and build habits that stick.
          </p>

          <div className="pt-2">
            <Link
              href="/onboarding"
              className="inline-flex items-center space-x-2 text-sm sm:text-base font-bold text-white bg-gradient-to-r from-[#E37210] to-[#F2801E] hover:from-[#EA7A15] hover:to-[#F88B2A] px-9 py-4 rounded-full shadow-glow-orange hover:shadow-glow-subtle active:scale-[0.97] transition-all"
            >
              <span>Start With PokketFit</span>
              <ArrowRight className="w-5 h-5" />
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
            <span>• Your Personal Fitness Coach</span>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/login" className="hover:text-white transition-colors">Athlete Login</Link>
            <Link href="/onboarding" className="hover:text-white transition-colors">Get Started</Link>
            <Link href="/admin" className="hover:text-white transition-colors">Admin CMS</Link>
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
