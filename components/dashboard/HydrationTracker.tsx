'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Droplets, Plus, Sparkles, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { NumberCountUp, TactileButton } from '../motion/MotionPrimitives';

interface HydrationTrackerProps {
  currentLiters: number;
  targetLiters: number;
  onAddWater: (amount: number) => void;
}

export default function HydrationTracker({
  currentLiters,
  targetLiters,
  onAddWater,
}: HydrationTrackerProps) {
  const percent = Math.min(100, Math.round((currentLiters / targetLiters) * 100));
  const isTargetMet = currentLiters >= targetLiters;

  const handleQuickAdd = (amount: number) => {
    onAddWater(amount);
    if (currentLiters + amount >= targetLiters && !isTargetMet) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#38BDF8', '#0284C7', '#BAE6FD'],
      });
    }
  };

  return (
    <div className="bg-[#16120E] border border-[#2A241E] rounded-3xl p-5 relative overflow-hidden shadow-card-dark">
      {/* Ambient water blue accent glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-cyan-950/60 border border-cyan-700/50 flex items-center justify-center text-cyan-400">
            <Droplets className="w-4 h-4 fill-cyan-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">Hydration Tracker</h3>
            <span className="text-[10px] text-[#8A8279]">
              {isTargetMet ? 'Goal accomplished for today!' : 'Steady water intake boosts stamina'}
            </span>
          </div>
        </div>

        {isTargetMet ? (
          <span className="text-[10px] font-bold text-cyan-300 bg-cyan-950/80 border border-cyan-600/60 px-2.5 py-1 rounded-full flex items-center space-x-1">
            <Check className="w-3 h-3 stroke-[3]" />
            <span>Target Hit</span>
          </span>
        ) : (
          <span className="text-[10px] font-bold text-[#8A8279] bg-[#1E1914] px-2.5 py-1 rounded-full border border-[#2A241E]">
            {percent}% Completed
          </span>
        )}
      </div>

      {/* Liquid Progress Bar with smooth wave animation */}
      <div className="relative h-6 bg-[#110D0A] rounded-2xl border border-[#2A241E] overflow-hidden p-0.5">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          className="h-full rounded-xl bg-gradient-to-r from-cyan-600 to-sky-400 relative overflow-hidden shadow-[0_0_12px_rgba(56,189,248,0.35)]"
        >
          {/* Animated subtle shimmer wave across the liquid bar */}
          <motion.div
            animate={{ x: ['-100%', '200%'] }}
            transition={{ repeat: Infinity, duration: 2.4, ease: 'linear' }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent w-1/2"
          />
        </motion.div>
      </div>

      {/* Volume readout */}
      <div className="flex items-center justify-between text-xs mt-2 text-[#A8A096]">
        <span>
          Current:{' '}
          <strong className="text-white font-black text-sm">
            <NumberCountUp value={currentLiters} decimals={2} />L
          </strong>
        </span>
        <span>
          Daily Target: <strong className="text-[#FAF8F5]">{targetLiters.toFixed(1)}L</strong>
        </span>
      </div>

      {/* Quick Add Buttons */}
      <div className="grid grid-cols-2 gap-2 mt-4">
        <TactileButton
          onClick={() => handleQuickAdd(0.25)}
          className="py-2 px-3 rounded-xl bg-[#1E1914] hover:bg-[#25201A] border border-[#2A241E] flex items-center justify-center space-x-1.5 text-xs text-cyan-200"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+250 ml Glass</span>
        </TactileButton>

        <TactileButton
          onClick={() => handleQuickAdd(0.5)}
          className="py-2 px-3 rounded-xl bg-[#1E1914] hover:bg-[#25201A] border border-[#2A241E] flex items-center justify-center space-x-1.5 text-xs text-cyan-200"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+500 ml Bottle</span>
        </TactileButton>
      </div>
    </div>
  );
}
