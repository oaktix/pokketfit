'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import MobileShell from '@/components/layout/MobileShell';
import { 
  Flame, 
  Dumbbell, 
  Droplets, 
  Apple, 
  Utensils, 
  Check, 
  Plus, 
  ArrowRight, 
  ChevronRight,
  TrendingUp,
  Sparkles,
  Trophy,
  Bell,
  Activity,
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getLocalStore, saveLocalStore } from '@/lib/storage/store';
import { recordPointEvent, calculateWeeklyPoints } from '@/lib/engine/points-ledger';
import { getLeagueTierForPoints } from '@/lib/engine/leagues';
import { AppStoreState } from '@/lib/storage/store';
import HydrationTracker from '@/components/dashboard/HydrationTracker';
import CelebrationModal from '@/components/gamification/CelebrationModal';
import NotificationDrawer from '@/components/notifications/NotificationDrawer';
import { 
  StaggerContainer, 
  StaggerItem, 
  TactileButton, 
  NumberCountUp, 
  FadeSlideUp,
  AnimatedCheckmark 
} from '@/components/motion/MotionPrimitives';

export default function DashboardPage() {
  const [store, setStore] = useState<AppStoreState | null>(null);
  const [activeMetricTab, setActiveMetricTab] = useState<'today' | 'week' | 'month'>('today');
  const [toastNotification, setToastNotification] = useState<{ title: string; points: number } | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);

  useEffect(() => {
    setStore(getLocalStore());
  }, []);

  if (!store) return null;

  const { currentUser, currentPlan, pointEvents, pointsConfig } = store;
  const currentTier = getLeagueTierForPoints(currentUser.points);
  const weeklyXP = calculateWeeklyPoints(pointEvents, currentUser.id);

  const triggerToast = (title: string, points: number) => {
    setToastNotification({ title, points });
    setTimeout(() => setToastNotification(null), 2500);
  };

  // Quick action: log water
  const handleLogWater = (amountLiters: number) => {
    const newLogged = Math.min(
      currentPlan.hydrationTargetLiters + 1.0,
      Math.round((currentPlan.hydrationLoggedLiters + amountLiters) * 100) / 100
    );
    const targetJustMet = newLogged >= currentPlan.hydrationTargetLiters && currentPlan.hydrationLoggedLiters < currentPlan.hydrationTargetLiters;
    const pointsAwarded = targetJustMet ? pointsConfig.hydrationGoalBonus : pointsConfig.hydrationLogPoints;

    const newEvent = recordPointEvent(
      currentUser.id,
      targetJustMet ? 'hydration_target_met' : 'hydration_logged',
      pointsAwarded,
      targetJustMet ? 'Reached daily hydration target' : `Logged ${amountLiters}L water`
    );

    const updatedPlan = {
      ...currentPlan,
      hydrationLoggedLiters: newLogged,
      hydrationLastLoggedAt: new Date().toISOString(),
    };

    const updatedUser = {
      ...currentUser,
      points: currentUser.points + pointsAwarded,
    };

    const updatedStore = {
      ...store,
      currentPlan: updatedPlan,
      currentUser: updatedUser,
      pointEvents: [newEvent, ...store.pointEvents],
    };

    setStore(updatedStore);
    saveLocalStore(updatedStore);
    triggerToast(targetJustMet ? 'Hydration Target Achieved!' : `+${amountLiters * 1000}ml Logged`, pointsAwarded);
  };

  // Quick action: toggle meal completion
  const handleToggleMeal = (mealKey: 'breakfast' | 'lunch' | 'dinner') => {
    const isCompleted = !currentPlan.meals[mealKey].completed;
    const updatedPlan = {
      ...currentPlan,
      meals: {
        ...currentPlan.meals,
        [mealKey]: {
          ...currentPlan.meals[mealKey],
          completed: isCompleted,
          completedAt: isCompleted ? new Date().toISOString() : undefined,
        },
      },
    };

    const pointsDelta = isCompleted ? pointsConfig.mealPoints : -pointsConfig.mealPoints;
    const newPoints = Math.max(0, currentUser.points + pointsDelta);

    let updatedEvents = store.pointEvents;
    if (isCompleted) {
      const newEvent = recordPointEvent(
        currentUser.id,
        'meal_completed',
        pointsConfig.mealPoints,
        `Logged ${mealKey}: ${currentPlan.meals[mealKey].meal.name}`,
        currentPlan.meals[mealKey].meal.id
      );
      updatedEvents = [newEvent, ...store.pointEvents];
      triggerToast(`Completed ${mealKey}`, pointsConfig.mealPoints);
    }

    const updatedUser = { ...currentUser, points: newPoints };
    const updatedStore = {
      ...store,
      currentPlan: updatedPlan,
      currentUser: updatedUser,
      pointEvents: updatedEvents,
    };

    setStore(updatedStore);
    saveLocalStore(updatedStore);
  };

  // Quick action: toggle fruit completion
  const handleToggleFruit = () => {
    const isCompleted = !currentPlan.fruit.completed;
    const updatedPlan = {
      ...currentPlan,
      fruit: {
        ...currentPlan.fruit,
        completed: isCompleted,
        completedAt: isCompleted ? new Date().toISOString() : undefined,
      },
    };

    const pointsDelta = isCompleted ? pointsConfig.fruitPoints : -pointsConfig.fruitPoints;
    const newPoints = Math.max(0, currentUser.points + pointsDelta);

    let updatedEvents = store.pointEvents;
    if (isCompleted) {
      const newEvent = recordPointEvent(
        currentUser.id,
        'fruit_completed',
        pointsConfig.fruitPoints,
        `Ate fresh portion of ${currentPlan.fruit.item.name}`,
        currentPlan.fruit.item.id
      );
      updatedEvents = [newEvent, ...store.pointEvents];
      triggerToast('Fruit portion logged', pointsConfig.fruitPoints);
    }

    const updatedUser = { ...currentUser, points: newPoints };
    const updatedStore = {
      ...store,
      currentPlan: updatedPlan,
      currentUser: updatedUser,
      pointEvents: updatedEvents,
    };

    setStore(updatedStore);
    saveLocalStore(updatedStore);
  };

  return (
    <MobileShell>
      <div className="p-4 space-y-4">
        {/* Floating Success Pill Toast */}
        <AnimatePresence>
          {toastNotification && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
              className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#16120E]/95 border border-[#E37210]/60 backdrop-blur-md px-4 py-2 rounded-full shadow-glow-orange flex items-center space-x-2 text-xs font-bold text-white"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#E37210]" />
              <span>{toastNotification.title}</span>
              <span className="text-[#FDBA74] bg-[#E37210]/20 px-2 py-0.5 rounded-full text-[10px]">
                +{toastNotification.points} XP
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Top Header: Greeting & Profile Avatar */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-3">
            <Link href="/profile" className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#E37210] to-[#F97316] p-0.5 shadow-glow-subtle hover:scale-105 transition-transform">
              <div className="w-full h-full rounded-full bg-[#16120E] flex items-center justify-center text-sm font-bold text-white">
                {currentUser.name.split(' ').map((n) => n[0]).join('')}
              </div>
            </Link>
            <div>
              <div className="text-xs text-[#8A8279] font-medium">Good Morning</div>
              <h2 className="text-base font-bold text-white tracking-tight">{currentUser.name}</h2>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 bg-[#16120E] border border-[#2A241E] px-2.5 py-1 rounded-full text-xs font-semibold text-[#FDBA74]">
              <Flame className="w-3.5 h-3.5 text-[#E37210] fill-[#E37210]" />
              <span>{currentUser.currentStreak}d streak</span>
            </div>

            <button
              onClick={() => setIsNotificationDrawerOpen(true)}
              className="p-1.5 rounded-full bg-[#16120E] border border-[#2A241E] text-[#C7BFB5] hover:text-white transition-colors relative"
            >
              <Bell className="w-4 h-4" />
              <span className="w-2 h-2 rounded-full bg-[#E37210] absolute top-1 right-1" />
            </button>

            <Link href="/leaderboard" className="p-1.5 rounded-full bg-[#16120E] border border-[#2A241E] text-yellow-500 hover:text-white transition-colors">
              <Trophy className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Motivational Coach Banner */}
        <FadeSlideUp delay={0.05}>
          <div className="bg-gradient-to-r from-[#E37210]/15 via-[#E37210]/5 to-transparent border border-[#E37210]/25 rounded-2xl p-3.5 flex items-center space-x-3">
            <Sparkles className="w-5 h-5 text-[#E37210] shrink-0" />
            <p className="text-xs text-[#FAF8F5] leading-snug italic font-medium">
              "{currentPlan.contextualMotivation}"
            </p>
          </div>
        </FadeSlideUp>

        {/* CARD 1: RISE & GRIND / LEVEL PROGRESS CARD */}
        <FadeSlideUp delay={0.1}>
          <div className="bg-[#16120E] border border-[#2A241E] rounded-3xl p-5 relative overflow-hidden shadow-card-dark">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#E37210]/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex flex-col items-center text-center">
              {/* Pulsing Flame Icon */}
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#E37210]/20 to-[#F97316]/30 flex items-center justify-center mb-2 flame-active shadow-glow-subtle">
                <Flame className="w-9 h-9 text-[#E37210] fill-[#E37210]" />
              </div>

              <div className="text-lg font-extrabold text-white tracking-tight">
                {currentUser.rankTitle}
              </div>
              <div className="text-xs text-[#8A8279] mb-3">
                {currentTier.name} • <NumberCountUp value={currentUser.points} /> XP Earned
              </div>

              {/* Glowing Linear Progress Bar */}
              <div className="w-full bg-[#1E1914] h-2.5 rounded-full overflow-hidden mb-2 border border-[#2A241E] p-0.5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '74%' }}
                  transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                  className="bg-gradient-to-r from-[#E37210] to-[#F97316] h-full rounded-full shadow-glow-orange"
                />
              </div>
              <span className="text-[11px] text-[#A8A096]">
                Week XP: <strong className="text-white"><NumberCountUp value={weeklyXP} /></strong> • Ranked in top cohort
              </span>

              {/* 3 Macro Progress Doughnut Rings */}
              <div className="grid grid-cols-3 gap-2 w-full mt-5 pt-4 border-t border-[#2A241E]/70">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full border-[3px] border-[#3B82F6] flex items-center justify-center text-xs font-bold text-white shadow-sm">
                    72%
                  </div>
                  <span className="text-xs font-bold text-white mt-1.5">72/100</span>
                  <span className="text-[10px] text-[#8A8279]">Carbs (g)</span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full border-[3px] border-[#F59E0B] flex items-center justify-center text-xs font-bold text-white shadow-sm">
                    52%
                  </div>
                  <span className="text-xs font-bold text-white mt-1.5">52/100</span>
                  <span className="text-[10px] text-[#8A8279]">Fats (g)</span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full border-[3px] border-[#10B981] flex items-center justify-center text-xs font-bold text-white shadow-sm">
                    85%
                  </div>
                  <span className="text-xs font-bold text-white mt-1.5">112/150</span>
                  <span className="text-[10px] text-[#8A8279]">Muscle (g)</span>
                </div>
              </div>
            </div>
          </div>
        </FadeSlideUp>

        {/* CARD 2: TODAY'S ASSIGNED WORKOUT HERO */}
        <FadeSlideUp delay={0.15}>
          <div className="bg-[#16120E] border border-[#2A241E] rounded-3xl p-5 space-y-3 shadow-card-dark">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-[#E37210]/15 flex items-center justify-center text-[#E37210]">
                  <Dumbbell className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#8A8279]">
                  Assigned Workout
                </span>
              </div>
              <span className="text-[11px] font-semibold text-[#E37210] bg-[#E37210]/10 px-2 py-0.5 rounded-full">
                {currentPlan.assignedWorkout.estimatedDurationMin} mins
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-white">{currentPlan.assignedWorkout.title}</h3>
              <p className="text-xs text-[#8A8279] line-clamp-2 mt-0.5">
                {currentPlan.assignedWorkout.description}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#2A241E]">
              <div className="text-xs text-[#8A8279]">
                {currentPlan.assignedWorkout.exercises.length} prescribed movements
              </div>

              <Link
                href={`/workouts/${currentPlan.assignedWorkout.id}`}
                className="py-2 px-4 rounded-xl bg-gradient-to-r from-[#E37210] to-[#F2801E] text-white text-xs font-bold flex items-center space-x-1.5 shadow-glow-subtle hover:brightness-110 active:scale-95 transition-all"
              >
                <span>{currentPlan.workoutCompleted ? 'Review Session' : 'Start Workout'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </FadeSlideUp>

        {/* CARD 3: ACTIVITY TRACKER */}
        <FadeSlideUp delay={0.2}>
          <div className="bg-[#16120E] border border-[#2A241E] rounded-3xl p-5 shadow-card-dark">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-bold text-white">Activity Tracker</div>
              <div className="flex bg-[#1E1914] p-0.5 rounded-xl text-[11px] border border-[#2A241E]">
                {(['today', 'week', 'month'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveMetricTab(tab)}
                    className={`px-2.5 py-1 rounded-lg capitalize transition-all ${
                      activeMetricTab === tab
                        ? 'bg-[#E37210] text-white font-semibold'
                        : 'text-[#8A8279]'
                    }`}
                  >
                    {tab === 'today' ? 'Today' : tab === 'week' ? 'This Week' : 'This Month'}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-baseline space-x-2 mb-2">
              <span className="text-2xl font-black text-white">4,872</span>
              <span className="text-xs text-[#8A8279]">Steps</span>
            </div>

            <div className="relative h-28 w-full bg-[#110D0A] rounded-2xl p-2 border border-[#2A241E] flex flex-col justify-end overflow-hidden">
              <div className="absolute top-2 left-1/3 bg-[#3B82F6] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md pointer-events-none">
                520 kcal Burned
              </div>

              <svg viewBox="0 0 300 80" className="w-full h-20 overflow-visible">
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d="M 0 60 Q 40 10, 80 40 T 160 30 T 240 50 T 300 20 L 300 80 L 0 80 Z"
                  fill="url(#chartGradient)"
                />
                <path
                  d="M 0 60 Q 40 10, 80 40 T 160 30 T 240 50 T 300 20"
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <circle cx="100" cy="28" r="4" fill="#3B82F6" className="animate-pulse" />
              </svg>

              <div className="flex justify-between text-[9px] text-[#706760] pt-1 px-1">
                <span>08:00</span>
                <span>12:00</span>
                <span>16:00</span>
                <span>20:00</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 mt-3">
              <div className="bg-[#110D0A] p-3 rounded-2xl border border-[#2A241E]">
                <div className="flex items-center space-x-1.5 text-xs text-rose-400 font-semibold mb-1">
                  <Activity className="w-3.5 h-3.5" />
                  <span>Heart Rate</span>
                </div>
                <div className="text-lg font-black text-white">76 <span className="text-[10px] text-[#8A8279] font-normal">Bpm</span></div>
              </div>

              <div className="bg-[#110D0A] p-3 rounded-2xl border border-[#2A241E]">
                <div className="flex items-center space-x-1.5 text-xs text-amber-400 font-semibold mb-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Active Target</span>
                </div>
                <div className="text-lg font-black text-white">8,912 <span className="text-[10px] text-[#8A8279] font-normal">Steps/day</span></div>
              </div>
            </div>
          </div>
        </FadeSlideUp>

        {/* CARD 4: ANIMATED HYDRATION TRACKER WITH LIQUID REACTION */}
        <FadeSlideUp delay={0.25}>
          <HydrationTracker
            currentLiters={currentPlan.hydrationLoggedLiters}
            targetLiters={currentPlan.hydrationTargetLiters}
            onAddWater={handleLogWater}
          />
        </FadeSlideUp>

        {/* CARD 5: DAILY FRESH FRUIT INTAKE */}
        <FadeSlideUp delay={0.3}>
          <div className="bg-[#16120E] border border-[#2A241E] rounded-3xl p-4 shadow-card-dark flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-950/50 border border-emerald-800/50 flex items-center justify-center text-emerald-400">
                <Apple className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center space-x-1.5">
                  <span>Daily Fruit Portion</span>
                  {currentPlan.fruit.completed && (
                    <span className="text-[10px] bg-emerald-950 text-emerald-400 px-1.5 py-0.2 rounded border border-emerald-700/60 font-semibold">
                      Completed
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-[#8A8279]">
                  {currentPlan.fruit.item.name} • {currentPlan.fruit.item.servingSize}
                </div>
              </div>
            </div>

            <TactileButton
              onClick={handleToggleFruit}
              className={`py-2 px-3.5 rounded-xl text-xs font-bold flex items-center space-x-1 ${
                currentPlan.fruit.completed
                  ? 'bg-emerald-950/60 border border-emerald-800/80 text-emerald-300'
                  : 'bg-[#1E1914] border border-[#2A241E] text-[#D5D1CB] hover:bg-[#2A241E]'
              }`}
            >
              {currentPlan.fruit.completed ? (
                <>
                  <AnimatedCheckmark size={14} strokeColor="#6EE7B7" />
                  <span>Eaten</span>
                </>
              ) : (
                <span>Log Fruit</span>
              )}
            </TactileButton>
          </div>
        </FadeSlideUp>

        {/* CARD 6: TODAY'S NIGERIAN MEALS CHECKLIST */}
        <FadeSlideUp delay={0.35}>
          <div className="bg-[#16120E] border border-[#2A241E] rounded-3xl p-5 shadow-card-dark space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Utensils className="w-4 h-4 text-[#E37210]" />
                <span className="text-sm font-bold text-white">Today's Nigerian Nutrition</span>
              </div>
              <Link href="/meals" className="text-xs text-[#E37210] font-semibold flex items-center">
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
              </Link>
            </div>

            <div className="space-y-2">
              {(['breakfast', 'lunch', 'dinner'] as const).map((mealType) => {
                const mealItem = currentPlan.meals[mealKeyType(mealType)];
                return (
                  <div
                    key={mealType}
                    className="bg-[#110D0A] border border-[#2A241E] rounded-2xl p-3 flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <TactileButton
                        onClick={() => handleToggleMeal(mealKeyType(mealType))}
                        className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all ${
                          mealItem.completed
                            ? 'bg-emerald-500 text-black shadow-glow-subtle'
                            : 'border border-[#3F3730] bg-[#16120E]'
                        }`}
                      >
                        {mealItem.completed && <AnimatedCheckmark size={16} strokeColor="#000000" />}
                      </TactileButton>
                      <div>
                        <div className="text-[10px] uppercase font-bold text-[#E37210]">
                          {mealType}
                        </div>
                        <div className="text-xs font-semibold text-white line-clamp-1">
                          {mealItem.meal.name}
                        </div>
                        <div className="text-[10px] text-[#8A8279]">
                          {mealItem.meal.caloriesEst} kcal • {mealItem.meal.proteinGrams}g Protein
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </FadeSlideUp>

        {/* Milestone Celebration Modal */}
        <CelebrationModal
          isOpen={showCelebration}
          onClose={() => setShowCelebration(false)}
          title="Daily Habit Goal Crushed!"
          subtitle="You logged key nutrition, water, and workout items today. Consistency compounds into extraordinary stamina."
          badgeIcon="🔥"
          pointsEarned={pointsConfig.workoutPoints}
          streakCount={currentUser.currentStreak}
          leagueName={currentTier.name}
        />

        {/* In-App Notification Center Drawer */}
        <NotificationDrawer
          isOpen={isNotificationDrawerOpen}
          onClose={() => setIsNotificationDrawerOpen(false)}
        />
      </div>
    </MobileShell>
  );
}

function mealKeyType(type: 'breakfast' | 'lunch' | 'dinner'): 'breakfast' | 'lunch' | 'dinner' {
  return type;
}
