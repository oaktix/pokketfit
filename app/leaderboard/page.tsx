'use client';

import React, { useState, useEffect } from 'react';
import MobileShell from '@/components/layout/MobileShell';
import { 
  Trophy, 
  Flame, 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  ChevronRight, 
  Calendar, 
  Info,
  ShieldCheck,
  Share2,
  Medal,
  Crown,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getLocalStore, saveLocalStore } from '@/lib/storage/store';
import { 
  CONFIGURABLE_LEAGUE_TIERS, 
  getLeagueTierForPoints, 
  getLeagueRoster, 
  getNextLeagueTier 
} from '@/lib/engine/leagues';
import { calculateWeeklyPoints } from '@/lib/engine/points-ledger';
import { StaggerContainer, StaggerItem, TactileButton, NumberCountUp, FadeSlideUp } from '@/components/motion/MotionPrimitives';
import ShareAchievementModal from '@/components/gamification/ShareAchievementModal';
import CelebrationModal from '@/components/gamification/CelebrationModal';
import { LeagueCompetitor, LeagueTier } from '@/lib/types';

export default function LeaderboardPage() {
  const [store, setStore] = useState(getLocalStore());
  const [cycle, setCycle] = useState<'this_week' | 'last_week'>('this_week');
  const [showShareModal, setShowShareModal] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isSeededMode, setIsSeededMode] = useState(true);

  const { currentUser, pointEvents } = store;
  const currentTier = getLeagueTierForPoints(currentUser.points);
  const nextTier = getNextLeagueTier(currentTier.id);
  const weeklyXP = calculateWeeklyPoints(pointEvents, currentUser.id);

  const roster: LeagueCompetitor[] = getLeagueRoster(currentUser, weeklyXP, currentTier, cycle);
  const currentUserInRoster = roster.find((c) => c.isCurrentUser) || roster[0];

  // Points required for next league
  const pointsToNextLeague = nextTier ? Math.max(0, nextTier.minPoints - currentUser.points) : 0;
  const progressToNextLeaguePercent = nextTier 
    ? Math.min(100, Math.round(((currentUser.points - currentTier.minPoints) / (nextTier.minPoints - currentTier.minPoints)) * 100))
    : 100;

  return (
    <MobileShell>
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="pt-2 flex items-center justify-between">
          <div>
            <div className="text-xs text-[#8A8279] uppercase font-bold tracking-wider">
              Health & Consistency Leagues
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">Leaderboard</h1>
          </div>

          <TactileButton
            onClick={() => setShowShareModal(true)}
            className="p-2 rounded-xl bg-[#16120E] border border-[#2A241E] text-[#E37210] hover:text-white"
          >
            <Share2 className="w-4 h-4" />
          </TactileButton>
        </div>

        {/* Safety & Integrity Guarantee Banner (PRD Section 23 & Appendices: Never rank by BMI/Weight/Appearance) */}
        <div className="bg-[#16120E] border border-[#2A241E] p-3 rounded-2xl flex items-center space-x-2 text-[11px] text-[#A8A096]">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            Ranked strictly by <strong>daily habit consistency</strong> and activity XP. Never by weight, BMI, or appearance.
          </span>
        </div>

        {/* CURRENT LEAGUE HERO CARD */}
        <div className="bg-[#16120E] border border-[#2A241E] rounded-2xl p-5 relative overflow-hidden">
          {/* Subtle warm ambient halo */}
          <div 
            className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-20 pointer-events-none"
            style={{ backgroundColor: currentTier.color }}
          />

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-[#110D0A] border border-[#2A241E] flex items-center justify-center text-2xl">
                {currentTier.icon}
              </div>
              <div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${currentTier.badgeBg}`}>
                  Active League
                </span>
                <h3 className="text-lg font-black text-white tracking-tight mt-0.5">
                  {currentTier.name}
                </h3>
              </div>
            </div>

            <div className="text-right">
              <div className="text-[10px] text-[#8A8279] uppercase font-bold">Your Rank</div>
              <div className="text-xl font-black text-[#E37210]">
                #{currentUserInRoster.rank}
              </div>
            </div>
          </div>

          {/* League Progression Bar towards Next League */}
          {nextTier ? (
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#A8A096]">
                  Progress to <strong className="text-white">{nextTier.name}</strong>
                </span>
                <span className="text-xs font-black text-white">
                  {pointsToNextLeague} XP remaining
                </span>
              </div>

              <div className="w-full bg-[#110D0A] h-2.5 rounded-full overflow-hidden border border-[#2A241E] p-0.5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressToNextLeaguePercent}%` }}
                  transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                  className="h-full rounded-full bg-[#E37210]"
                />
              </div>
            </div>
          ) : (
            <div className="text-xs text-amber-300 font-semibold bg-amber-950/40 border border-amber-800/40 p-2.5 rounded-xl text-center">
              👑 You have attained the highest Obsidian Elite division!
            </div>
          )}

          {/* User Fast Stats */}
          <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-[#2A241E]">
            <div className="bg-[#110D0A] p-2.5 rounded-xl text-center">
              <div className="text-[10px] text-[#8A8279]">Week XP</div>
              <div className="text-xs font-black text-white mt-0.5">
                <NumberCountUp value={currentUserInRoster.weeklyPoints} />
              </div>
            </div>

            <div className="bg-[#110D0A] p-2.5 rounded-xl text-center">
              <div className="text-[10px] text-[#8A8279]">Total XP</div>
              <div className="text-xs font-black text-[#E37210] mt-0.5">
                <NumberCountUp value={currentUser.points} />
              </div>
            </div>

            <div className="bg-[#110D0A] p-2.5 rounded-xl text-center">
              <div className="text-[10px] text-[#8A8279]">Rank Movement</div>
              <div className="text-xs font-black text-emerald-400 flex items-center justify-center mt-0.5 space-x-0.5">
                {currentUserInRoster.rankDelta > 0 ? (
                  <>
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>+{currentUserInRoster.rankDelta}</span>
                  </>
                ) : currentUserInRoster.rankDelta < 0 ? (
                  <>
                    <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
                    <span className="text-rose-400">{currentUserInRoster.rankDelta}</span>
                  </>
                ) : (
                  <>
                    <Minus className="w-3.5 h-3.5 text-[#8A8279]" />
                    <span className="text-[#8A8279]">0</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* CYCLE SELECTOR TABS & DEMO ROSTER TOGGLE */}
        <div className="flex items-center justify-between">
          <div className="flex space-x-1.5 bg-[#16120E] p-1 rounded-2xl border border-[#2A241E]">
            <button
              onClick={() => setCycle('this_week')}
              className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-colors ${
                cycle === 'this_week'
                  ? 'bg-[#E37210] text-white'
                  : 'text-[#8A8279] hover:text-white'
              }`}
            >
              This Week
            </button>
            <button
              onClick={() => setCycle('last_week')}
              className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-colors ${
                cycle === 'last_week'
                  ? 'bg-[#E37210] text-white'
                  : 'text-[#8A8279] hover:text-white'
              }`}
            >
              Last Week
            </button>
          </div>

          <button
            onClick={() => setIsSeededMode(!isSeededMode)}
            className="text-[11px] font-semibold text-[#8A8279] hover:text-[#C7BFB5] flex items-center space-x-1"
          >
            <Users className="w-3.5 h-3.5" />
            <span>{isSeededMode ? 'Seeded Mode' : 'Warm-up Mode'}</span>
          </button>
        </div>

        {/* EMPTY STATE HANDLING (PRD Section 4: If not enough users, show friendly warm-up notice) */}
        {!isSeededMode ? (
          <div className="bg-[#16120E] border border-[#2A241E] rounded-2xl p-8 text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-full bg-[#1E1914] flex items-center justify-center text-2xl">
              🌱
            </div>
            <h3 className="text-base font-bold text-white">Your league is warming up!</h3>
            <p className="text-xs text-[#8A8279] max-w-xs mx-auto leading-relaxed">
              Keep completing your daily workouts, hydration, and nutrition. Your competitors will be joining soon for this week's cohort.
            </p>
            <TactileButton
              onClick={() => setIsSeededMode(true)}
              className="py-2 px-4 rounded-xl bg-[#1E1914] text-xs font-bold text-[#E37210] border border-[#2A241E]"
            >
              Toggle Cohort Preview
            </TactileButton>
          </div>
        ) : (
          /* LEAGUE COMPETITORS LIST (Duolingo & Strava inspired, clean HealthRich styling) */
          <div className="space-y-2">
            <div className="flex items-center justify-between px-2 text-[10px] text-[#8A8279] uppercase font-bold tracking-wider">
              <span>Member</span>
              <span>Points</span>
            </div>

            <StaggerContainer className="space-y-2">
              {roster.map((competitor, idx) => {
                const isUser = competitor.isCurrentUser;
                const isPromotionZone = competitor.rank <= 3;

                return (
                  <StaggerItem key={competitor.id}>
                    <div
                      className={`p-3.5 rounded-2xl flex items-center justify-between border transition-colors ${
                        isUser
                          ? 'bg-[#16120E] border-[#E37210]/40'
                          : 'bg-[#16120E] border-[#2A241E] hover:border-[#383129]'
                      }`}
                    >
                      {/* Left: Rank & Avatar & Name */}
                      <div className="flex items-center space-x-3">
                        {/* Rank Badge */}
                        <div className="w-7 text-center font-black text-sm">
                          {competitor.rank === 1 ? (
                            <span className="text-xl">🥇</span>
                          ) : competitor.rank === 2 ? (
                            <span className="text-xl">🥈</span>
                          ) : competitor.rank === 3 ? (
                            <span className="text-xl">🥉</span>
                          ) : (
                            <span className={isUser ? 'text-[#E37210]' : 'text-[#8A8279]'}>
                              #{competitor.rank}
                            </span>
                          )}
                        </div>

                        {/* Avatar */}
                        <div className={`w-9 h-9 rounded-xl p-0.5 flex items-center justify-center font-bold text-xs ${
                          isUser 
                            ? 'bg-[#E37210] text-white' 
                            : 'bg-[#1E1914] border border-[#2A241E] text-[#C7BFB5]'
                        }`}>
                          {competitor.avatarInitials}
                        </div>

                        {/* Name & Streak */}
                        <div>
                          <div className="flex items-center space-x-1.5">
                            <span className={`text-xs font-bold ${isUser ? 'text-white' : 'text-[#FAF8F5]'}`}>
                              {competitor.name}
                            </span>
                            {isUser && (
                              <span className="text-[9px] font-black bg-[#E37210] text-white px-1.5 py-0.2 rounded-md">
                                YOU
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 text-[10px] text-[#8A8279] mt-0.5">
                            <span className="flex items-center space-x-0.5 text-amber-500">
                              <Flame className="w-2.5 h-2.5 fill-amber-500" />
                              <span>{competitor.currentStreak}d</span>
                            </span>
                            <span>•</span>
                            <span>{competitor.achievementsCount} badges</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Movement & Weekly Points */}
                      <div className="flex items-center space-x-3">
                        {/* Rank delta indicator */}
                        <div className="text-[10px] font-bold">
                          {competitor.rankDelta > 0 ? (
                            <span className="text-emerald-400 flex items-center space-x-0.5">
                              <TrendingUp className="w-3 h-3" />
                              <span>+{competitor.rankDelta}</span>
                            </span>
                          ) : competitor.rankDelta < 0 ? (
                            <span className="text-rose-400 flex items-center space-x-0.5">
                              <TrendingDown className="w-3 h-3" />
                              <span>{competitor.rankDelta}</span>
                            </span>
                          ) : (
                            <span className="text-[#8A8279]">--</span>
                          )}
                        </div>

                        <div className="text-right min-w-[65px]">
                          <div className="text-xs font-black text-white">
                            <NumberCountUp value={competitor.weeklyPoints} />
                          </div>
                          <div className="text-[9px] text-[#8A8279] uppercase font-semibold">
                            Weekly XP
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Promotion Cutoff divider line after top 3 */}
                    {idx === 2 && (
                      <div className="my-2 flex items-center justify-between text-[10px] font-bold text-emerald-400 px-3 py-1 bg-emerald-950/30 border border-emerald-800/40 rounded-xl">
                        <span>▲ PROMOTION ZONE (Top 3 qualify for next division)</span>
                        <Crown className="w-3 h-3" />
                      </div>
                    )}
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          </div>
        )}

        {/* Modals */}
        <ShareAchievementModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          user={currentUser}
          tier={currentTier}
        />

        <CelebrationModal
          isOpen={showCelebration}
          onClose={() => setShowCelebration(false)}
          title="League Promotion Ready!"
          subtitle={`You are currently climbing the ranks of ${currentTier.name}! Keep crushing daily habits.`}
          badgeIcon={currentTier.icon}
          pointsEarned={weeklyXP}
          streakCount={currentUser.currentStreak}
          leagueName={currentTier.name}
          onShare={() => {
            setShowCelebration(false);
            setShowShareModal(true);
          }}
        />
      </div>
    </MobileShell>
  );
}
