'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Share2, Download, Check, X, Flame, Trophy, ShieldCheck, Sparkles } from 'lucide-react';
import { TactileButton, ScaleIn } from '../motion/MotionPrimitives';
import { UserProfile, LeagueTier } from '@/lib/types';

interface ShareAchievementModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  tier: LeagueTier;
  milestoneTitle?: string;
  milestoneSubtitle?: string;
  milestoneIcon?: string;
}

export default function ShareAchievementModal({
  isOpen,
  onClose,
  user,
  tier,
  milestoneTitle = 'Consistency Champion',
  milestoneSubtitle = '14-Day Streak Maintained',
  milestoneIcon = '🔥',
}: ShareAchievementModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(
      `I'm currently in ${tier.name} on FitPocket with a ${user.currentStreak}-day streak and ${user.points} XP! Building strong daily habits! #FitPocket #HealthRich`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'Pokketfit Milestone',
          text: `I just earned ${milestoneTitle} on Pokketfit! Ranked in ${tier.name} with ${user.points} XP!`,
          url: 'https://pokketfit.app',
        });
      } catch (e) {
        // Ignored if user dismissed share sheet
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 15 }}
          transition={{ duration: 0.26, ease: [0.23, 1, 0.32, 1] }}
          className="w-full max-w-sm bg-[#16120E] border border-[#2A241E] rounded-3xl p-5 relative shadow-2xl text-left"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#2A241E]">
            <div className="flex items-center space-x-2">
              <Share2 className="w-4 h-4 text-[#E37210]" />
              <h3 className="text-sm font-bold text-white tracking-tight">Share Milestone</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-[#1E1914] text-[#8A8279] hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Shareable Card Preview (Non-Sensitive: Never reveals weight or BMI - PRD Section 23 & Appendices) */}
          <div className="mt-4 p-5 rounded-2xl bg-gradient-to-br from-[#1E1914] via-[#16120E] to-[#0A0705] border border-[#E37210]/40 relative overflow-hidden shadow-card-dark">
            {/* Ambient Brand Accent Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#E37210]/15 rounded-full blur-2xl pointer-events-none" />

            {/* Brand badge */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-1.5">
                <div className="w-5 h-5 rounded-lg bg-[#E37210] flex items-center justify-center text-[10px] font-black text-white">
                  FP
                </div>
                <span className="text-[11px] font-black tracking-wider text-white uppercase">
                  FITPOCKET
                </span>
              </div>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#E37210]/20 text-[#FDBA74] border border-[#E37210]/30">
                ATHLETE VERIFIED
              </span>
            </div>

            {/* Athlete Details */}
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#E37210] to-[#F97316] p-0.5">
                <div className="w-full h-full rounded-[14px] bg-[#110D0A] flex items-center justify-center text-sm font-bold text-white">
                  {user.name.split(' ').map((n) => n[0]).join('')}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-black text-white">{user.name}</h4>
                <div className="text-[11px] text-[#A8A096] font-medium">{tier.name} Competitor</div>
              </div>
            </div>

            {/* Milestone Core Card */}
            <div className="bg-[#110D0A]/90 border border-[#2A241E] rounded-xl p-3 flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#1E1914] border border-[#2A241E] flex items-center justify-center text-xl shrink-0">
                {milestoneIcon}
              </div>
              <div>
                <div className="text-xs font-bold text-white">{milestoneTitle}</div>
                <div className="text-[10px] text-[#A8A096]">{milestoneSubtitle}</div>
              </div>
            </div>

            {/* Habit Stats Badges (Non-sensitive) */}
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-[#110D0A]/80 border border-[#2A241E] p-2 rounded-xl">
                <div className="text-[10px] text-[#8A8279] uppercase font-semibold">Active Streak</div>
                <div className="text-xs font-black text-amber-400 flex items-center justify-center mt-0.5 space-x-1">
                  <Flame className="w-3 h-3 fill-amber-400" />
                  <span>{user.currentStreak} Days</span>
                </div>
              </div>
              <div className="bg-[#110D0A]/80 border border-[#2A241E] p-2 rounded-xl">
                <div className="text-[10px] text-[#8A8279] uppercase font-semibold">Habit Points</div>
                <div className="text-xs font-black text-[#E37210] flex items-center justify-center mt-0.5 space-x-1">
                  <Sparkles className="w-3 h-3" />
                  <span>{user.points} XP</span>
                </div>
              </div>
            </div>

            {/* Privacy notice guarantee */}
            <div className="mt-3 pt-2 border-t border-[#2A241E]/60 text-[9px] text-[#8A8279] flex items-center space-x-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
              <span>Private biometric records (weight, BMI) are never exposed.</span>
            </div>
          </div>

          {/* Share Action Buttons */}
          <div className="mt-4 space-y-2">
            <TactileButton
              onClick={handleNativeShare}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#E37210] to-[#F2801E] text-white text-xs font-bold flex items-center justify-center space-x-2 shadow-glow-orange"
            >
              <Share2 className="w-4 h-4" />
              <span>Share to Socials or Stories</span>
            </TactileButton>

            <TactileButton
              onClick={handleCopyLink}
              className="w-full py-2.5 rounded-2xl bg-[#1E1914] hover:bg-[#2A241E] text-xs font-semibold text-[#FAF8F5] border border-[#2A241E] flex items-center justify-center space-x-1.5"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Copy Habit Summary Text</span>
                </>
              )}
            </TactileButton>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
