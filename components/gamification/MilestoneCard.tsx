'use client';

import React from 'react';
import { Flame, Trophy, Sparkles } from 'lucide-react';

interface MilestoneCardProps {
  title: string;
  subtitle: string;
  pointsEarned?: number;
  streakCount?: number;
  badgeIcon?: string;
  leagueName?: string;
  userName?: string;
  userInitials?: string;
}

export default function MilestoneCard({
  title,
  subtitle,
  pointsEarned,
  streakCount,
  badgeIcon = '🏆',
  leagueName,
  userName = 'Fitness Athlete',
  userInitials = 'FA',
}: MilestoneCardProps) {
  return (
    <div
      className="w-full max-w-sm bg-gradient-to-br from-[#1A150E] to-[#0F0B05] border border-[#E37210]/30 rounded-3xl p-6 shadow-2xl text-center relative overflow-hidden"
      style={{
        backgroundImage:
          'radial-gradient(circle at 70% 30%, rgba(227, 114, 16, 0.15) 0%, transparent 60%), linear-gradient(to bottom right, #1A150E, #0F0B05)',
      }}
    >
      {/* Decorative gradient spotlight */}
      <div className="absolute -top-16 -right-16 w-40 h-40 bg-[#E37210]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-[#F97316]/15 rounded-full blur-2xl pointer-events-none" />

      {/* Brand */}
      <div className="flex items-center justify-center space-x-2 mb-4">
        <div className="w-7 h-7 rounded-xl bg-[#E37210] flex items-center justify-center shadow-lg shadow-[#E37210]/30">
          <Flame className="w-4 h-4 text-white fill-white" />
        </div>
        <span className="text-xs font-extrabold text-[#E37210] tracking-widest uppercase">Pokketfit</span>
      </div>

      {/* Badge */}
      <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-[#E37210] to-[#F97316] p-0.5 shadow-[0_0_30px_rgba(227,114,16,0.3)] mb-3">
        <div className="w-full h-full rounded-[20px] bg-[#110D0A] flex items-center justify-center text-3xl shadow-inner">
          {badgeIcon}
        </div>
      </div>

      {/* Title */}
      <h2 className="text-xl font-black text-white tracking-tight leading-tight mb-1">{title}</h2>
      <p className="text-xs text-[#A8A096] mb-5 leading-relaxed">{subtitle}</p>

      {/* Stats row */}
      <div className="flex items-center justify-center gap-3 mb-4">
        {pointsEarned !== undefined && (
          <div className="bg-[#16120E] border border-[#2A241E] px-3 py-1.5 rounded-xl flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#E37210]" />
            <span className="text-[11px] font-extrabold text-white">+{pointsEarned} XP</span>
          </div>
        )}
        {streakCount !== undefined && (
          <div className="bg-[#16120E] border border-[#2A241E] px-3 py-1.5 rounded-xl flex items-center space-x-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span className="text-[11px] font-extrabold text-white">{streakCount}-Day Streak</span>
          </div>
        )}
        {leagueName && (
          <div className="bg-[#16120E] border border-[#2A241E] px-3 py-1.5 rounded-xl flex items-center space-x-1.5">
            <Trophy className="w-3.5 h-3.5 text-yellow-500" />
            <span className="text-[11px] font-extrabold text-white">{leagueName}</span>
          </div>
        )}
      </div>

      {/* User identity */}
      <div className="flex items-center justify-center space-x-2 pt-3 border-t border-[#2A241E]/60">
        <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#E37210] to-[#F2801E] flex items-center justify-center text-[8px] font-extrabold text-white shadow-md">
          {userInitials}
        </div>
        <span className="text-[10px] text-[#706760] font-medium">{userName} • Wellness Milestone</span>
      </div>
    </div>
  );
}
