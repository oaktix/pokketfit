'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Flame, Zap, Sparkles, Share2, X, Check, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { TactileButton, ScaleIn, NumberCountUp } from '../motion/MotionPrimitives';
import { UserProfile, LeagueTier } from '@/lib/types';

interface CelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  badgeIcon?: string;
  pointsEarned?: number;
  streakCount?: number;
  leagueName?: string;
  onShare?: () => void;
}

export default function CelebrationModal({
  isOpen,
  onClose,
  title,
  subtitle,
  badgeIcon = '🏆',
  pointsEarned,
  streakCount,
  leagueName,
  onShare,
}: CelebrationModalProps) {
  React.useEffect(() => {
    if (isOpen) {
      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#E37210', '#F97316', '#FDBA74', '#FFFFFF'],
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 15 }}
          transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
          className="w-full max-w-sm bg-[#16120E] border border-[#E37210]/40 rounded-3xl p-6 relative overflow-hidden shadow-2xl text-center"
        >
          {/* Subtle warm radial spotlight behind icon */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#E37210]/20 rounded-full blur-3xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-[#1E1914] text-[#8A8279] hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Animated Badge Icon Container */}
          <motion.div
            initial={{ scale: 0, rotate: -15 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 350, damping: 22, delay: 0.1 }}
            className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-[#E37210] to-[#F97316] p-0.5 shadow-glow-orange flex items-center justify-center mb-4 mt-2"
          >
            <div className="w-full h-full rounded-[22px] bg-[#110D0A] flex items-center justify-center text-3xl">
              {badgeIcon}
            </div>
          </motion.div>

          {/* Title and Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
          >
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#E37210] bg-[#E37210]/15 px-2.5 py-0.5 rounded-full">
              Achievement Unlocked
            </span>
            <h3 className="text-xl font-black text-white mt-2 mb-1 tracking-tight">
              {title}
            </h3>
            <p className="text-xs text-[#A8A096] leading-relaxed px-2">
              {subtitle}
            </p>
          </motion.div>

          {/* Stat Badges */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24 }}
            className="flex items-center justify-center gap-3 my-5"
          >
            {pointsEarned && (
              <div className="bg-[#1E1914] border border-[#2A241E] px-3 py-1.5 rounded-xl flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#E37210]" />
                <span className="text-xs font-bold text-white">
                  +<NumberCountUp value={pointsEarned} /> XP
                </span>
              </div>
            )}
            {streakCount && (
              <div className="bg-[#1E1914] border border-[#2A241E] px-3 py-1.5 rounded-xl flex items-center space-x-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span className="text-xs font-bold text-white">
                  {streakCount} Day Streak
                </span>
              </div>
            )}
            {leagueName && (
              <div className="bg-[#1E1914] border border-[#2A241E] px-3 py-1.5 rounded-xl flex items-center space-x-1.5">
                <Trophy className="w-3.5 h-3.5 text-yellow-500" />
                <span className="text-xs font-bold text-white">
                  {leagueName}
                </span>
              </div>
            )}
          </motion.div>

          {/* Action CTAs */}
          <div className="space-y-2">
            {onShare && (
              <TactileButton
                onClick={onShare}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#E37210] to-[#F2801E] text-white text-xs font-bold flex items-center justify-center space-x-2 shadow-glow-orange"
              >
                <Share2 className="w-4 h-4" />
                <span>Share Milestone Card</span>
              </TactileButton>
            )}

            <TactileButton
              onClick={onClose}
              className="w-full py-2.5 rounded-2xl bg-[#1E1914] hover:bg-[#2A241E] text-xs font-semibold text-[#A8A096] hover:text-white border border-[#2A241E]"
            >
              Continue Routine
            </TactileButton>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
