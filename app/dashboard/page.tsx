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
  Sparkles, 
  Trophy, 
  Bell, 
  Activity, 
  CheckCircle2,
  Calendar,
  Zap,
  Target
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
  TactileButton, 
  NumberCountUp, 
  FadeSlideUp,
  AnimatedCheckmark 
} from '@/components/motion/MotionPrimitives';

export default function DashboardPage() {
  const [store, setStore] = useState<AppStoreState | null>(null);
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

  // Daily Tasks Completion Metrics (Apple Health-inspired multi-pill meter)
  const isWorkoutDone = currentPlan.workoutCompleted;
  const isHydrationDone = currentPlan.hydrationLoggedLiters >= currentPlan.hydrationTargetLiters;
  const isFruitDone = currentPlan.fruit.completed;
  const mealsDoneCount = (currentPlan.meals.breakfast.completed ? 1 : 0) + 
                         (currentPlan.meals.lunch.completed ? 1 : 0) + 
                         (currentPlan.meals.dinner.completed ? 1 : 0);
  const isMealsDone = mealsDoneCount === 3;

  const completedTasksCount = (isWorkoutDone ? 1 : 0) + 
                              (isHydrationDone ? 1 : 0) + 
                              (isFruitDone ? 1 : 0) + 
                              (mealsDoneCount >= 2 ? 1 : 0);
  const totalTasks = 4;
  const completionPercentage = Math.round((completedTasksCount / totalTasks) * 100);

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
        `Logged ${mealKey}: ${currentPlan.meals[mealKey].meal.name}`
      );
      updatedEvents = [newEvent, ...updatedEvents];
      triggerToast(`Logged ${mealKey}`, pointsConfig.mealPoints);
    }

    const updatedStore = {
      ...store,
      currentPlan: updatedPlan,
      currentUser: { ...currentUser, points: newPoints },
      pointEvents: updatedEvents,
    };

    setStore(updatedStore);
    saveLocalStore(updatedStore);
  };

  // Quick action: toggle fruit
  const handleToggleFruit = () => {
    const isCompleted = !currentPlan.fruit.completed;
    const pointsDelta = isCompleted ? pointsConfig.fruitPoints : -pointsConfig.fruitPoints;
    const newPoints = Math.max(0, currentUser.points + pointsDelta);

    const updatedPlan = {
      ...currentPlan,
      fruit: {
        ...currentPlan.fruit,
        completed: isCompleted,
        completedAt: isCompleted ? new Date().toISOString() : undefined,
      },
    };

    let updatedEvents = store.pointEvents;
    if (isCompleted) {
      const newEvent = recordPointEvent(
        currentUser.id,
        'fruit_completed',
        pointsConfig.fruitPoints,
        `Logged daily fruit: ${currentPlan.fruit.item.name}`
      );
      updatedEvents = [newEvent, ...updatedEvents];
      triggerToast(`Logged ${currentPlan.fruit.item.name}`, pointsConfig.fruitPoints);
    }

    const updatedStore = {
      ...store,
      currentPlan: updatedPlan,
      currentUser: { ...currentUser, points: newPoints },
      pointEvents: updatedEvents,
    };

    setStore(updatedStore);
    saveLocalStore(updatedStore);
  };

  return (
    <MobileShell>
      <div className="p-4 sm:p-5 space-y-5">
        {/* Toast Feedback Notification */}
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

        {/* =================================================================== */}
        {/* TOP BAR: Coach Greeting, Streak & Notification Bell */}
        {/* =================================================================== */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center space-x-3">
            <Link 
              href="/profile" 
              className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#E37210] to-[#F97316] p-0.5 shadow-glow-subtle hover:scale-105 active:scale-95 transition-transform"
            >
              <div className="w-full h-full rounded-full bg-[#16120E] flex items-center justify-center text-xs font-extrabold text-white">
                {currentUser.name.split(' ').map((n) => n[0]).join('')}
              </div>
            </Link>
            <div>
              <div className="text-[11px] text-[#8A8279] font-medium tracking-tight">Personal Coach</div>
              <h2 className="text-base font-extrabold text-white tracking-tight leading-tight">
                {currentUser.name}
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 bg-[#16120E] border border-white/[0.08] px-2.5 py-1 rounded-full text-xs font-bold text-[#FDBA74]">
              <Flame className="w-3.5 h-3.5 text-[#E37210] fill-[#E37210]" />
              <span>{currentUser.currentStreak}d</span>
            </div>

            <button
              onClick={() => setIsNotificationDrawerOpen(true)}
              className="p-2 rounded-full bg-[#16120E] border border-white/[0.08] text-[#C7BFB5] hover:text-white transition-colors relative active:scale-95"
              aria-label="Open notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="w-2 h-2 rounded-full bg-[#E37210] absolute top-1 right-1" />
            </button>

            <Link 
              href="/leaderboard" 
              className="p-2 rounded-full bg-[#16120E] border border-white/[0.08] text-yellow-400 hover:text-white transition-colors active:scale-95"
              aria-label="View leagues"
            >
              <Trophy className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Motivational Coach Whispers */}
        <FadeSlideUp delay={0.05}>
          <div className="bg-gradient-to-r from-[#E37210]/12 via-[#E37210]/5 to-transparent border border-[#E37210]/20 rounded-2xl p-3 flex items-center space-x-2.5">
            <Sparkles className="w-4 h-4 text-[#E37210] shrink-0" />
            <p className="text-xs text-[#FAF8F5] leading-snug font-medium italic">
              "{currentPlan.contextualMotivation}"
            </p>
          </div>
        </FadeSlideUp>

        {/* =================================================================== */}
        {/* TODAY'S FOCUS: Apple Health-Inspired Multi-Ring Daily Progress */}
        {/* =================================================================== */}
        <FadeSlideUp delay={0.1}>
          <div className="bg-[#16120E] border border-white/[0.08] rounded-3xl p-5 shadow-card-dark relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#E37210]">
                  TODAY'S TARGET
                </span>
                <h3 className="text-lg font-black text-white tracking-tight mt-0.5">
                  {completionPercentage === 100 ? 'All Tasks Crushed! 🎉' : `${completionPercentage}% Completed`}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-xs font-extrabold text-white">
                  {completedTasksCount}/{totalTasks}
                </span>
                <span className="text-[10px] text-[#8A8279] block">Actions Done</span>
              </div>
            </div>

            {/* Segmented Multi-Color Progress Indicator */}
            <div className="w-full bg-[#1F1A15] h-3 rounded-full overflow-hidden flex p-0.5 gap-1 mb-3">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  isWorkoutDone ? 'bg-[#E37210]' : 'bg-[#2A241E]'
                }`}
                style={{ width: '25%' }}
              />
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  isHydrationDone ? 'bg-cyan-400' : 'bg-[#2A241E]'
                }`}
                style={{ width: '25%' }}
              />
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  isFruitDone ? 'bg-amber-400' : 'bg-[#2A241E]'
                }`}
                style={{ width: '25%' }}
              />
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  mealsDoneCount >= 2 ? 'bg-emerald-400' : 'bg-[#2A241E]'
                }`}
                style={{ width: '25%' }}
              />
            </div>

            {/* Quick Checklist Matrix */}
            <div className="grid grid-cols-4 gap-2 text-center pt-1 border-t border-white/[0.04]">
              <div className="flex flex-col items-center">
                <div className={`w-7 h-7 rounded-xl flex items-center justify-center mb-1 ${
                  isWorkoutDone ? 'bg-[#E37210]/20 text-[#E37210]' : 'bg-[#1E1914] text-[#8A8279]'
                }`}>
                  <Dumbbell className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] font-semibold text-white">Workout</span>
                <span className="text-[9px] text-[#8A8279]">{isWorkoutDone ? 'Done' : 'Pending'}</span>
              </div>

              <div className="flex flex-col items-center">
                <div className={`w-7 h-7 rounded-xl flex items-center justify-center mb-1 ${
                  isHydrationDone ? 'bg-cyan-950 text-cyan-400' : 'bg-[#1E1914] text-[#8A8279]'
                }`}>
                  <Droplets className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] font-semibold text-white">Water</span>
                <span className="text-[9px] text-[#8A8279]">{currentPlan.hydrationLoggedLiters}L</span>
              </div>

              <div className="flex flex-col items-center">
                <div className={`w-7 h-7 rounded-xl flex items-center justify-center mb-1 ${
                  isFruitDone ? 'bg-amber-950 text-amber-400' : 'bg-[#1E1914] text-[#8A8279]'
                }`}>
                  <Apple className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] font-semibold text-white">Fruit</span>
                <span className="text-[9px] text-[#8A8279]">{isFruitDone ? 'Eaten' : 'Pending'}</span>
              </div>

              <div className="flex flex-col items-center">
                <div className={`w-7 h-7 rounded-xl flex items-center justify-center mb-1 ${
                  mealsDoneCount >= 2 ? 'bg-emerald-950 text-emerald-400' : 'bg-[#1E1914] text-[#8A8279]'
                }`}>
                  <Utensils className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] font-semibold text-white">Meals</span>
                <span className="text-[9px] text-[#8A8279]">{mealsDoneCount}/3</span>
              </div>
            </div>
          </div>
        </FadeSlideUp>

        {/* =================================================================== */}
        {/* ASSIGNED WORKOUT CARD (Primary Action) */}
        {/* =================================================================== */}
        <FadeSlideUp delay={0.15}>
          <div className="bg-[#16120E] border border-white/[0.08] rounded-3xl p-5 shadow-card-dark space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-[#E37210]/15 flex items-center justify-center text-[#E37210]">
                  <Dumbbell className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#8A8279]">
                  Today's Session
                </span>
              </div>
              <span className="text-[11px] font-bold text-[#E37210] bg-[#E37210]/10 px-2.5 py-0.5 rounded-full">
                {currentPlan.assignedWorkout.estimatedDurationMin} mins
              </span>
            </div>

            <div>
              <h3 className="text-base font-extrabold text-white tracking-tight">
                {currentPlan.assignedWorkout.title}
              </h3>
              <p className="text-xs text-[#8A8279] line-clamp-2 mt-0.5 leading-relaxed">
                {currentPlan.assignedWorkout.description}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
              <div className="text-xs text-[#8A8279] font-medium">
                {currentPlan.assignedWorkout.exercises.length} movements with video
              </div>

              <Link
                href={`/workouts/${currentPlan.assignedWorkout.id}`}
                className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#E37210] to-[#F2801E] text-white text-xs font-bold flex items-center space-x-1.5 shadow-glow-subtle hover:brightness-110 active:scale-95 transition-all"
              >
                <span>{currentPlan.workoutCompleted ? 'Review Routine' : 'Start Session'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </FadeSlideUp>

        {/* =================================================================== */}
        {/* HYDRATION TRACKER */}
        {/* =================================================================== */}
        <FadeSlideUp delay={0.2}>
          <HydrationTracker
            currentLiters={currentPlan.hydrationLoggedLiters}
            targetLiters={currentPlan.hydrationTargetLiters}
            onAddWater={handleLogWater}
          />
        </FadeSlideUp>

        {/* =================================================================== */}
        {/* NIGERIAN NUTRITION & FRESH FRUITS CHECKLIST */}
        {/* =================================================================== */}
        <FadeSlideUp delay={0.25}>
          <div className="bg-[#16120E] border border-white/[0.08] rounded-3xl p-5 shadow-card-dark space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Utensils className="w-4 h-4 text-[#E37210]" />
                <span className="text-sm font-extrabold text-white">Today's Nutrition</span>
              </div>
              <Link href="/meals" className="text-xs text-[#E37210] font-bold flex items-center hover:underline">
                <span>All Meals</span>
                <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
              </Link>
            </div>

            {/* Daily Fruit Item */}
            <div className="bg-[#110D0A] border border-white/[0.06] rounded-2xl p-3 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-amber-950/60 flex items-center justify-center text-amber-400">
                  <Apple className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase text-amber-400">Daily Fruit</div>
                  <div className="text-xs font-bold text-white">{currentPlan.fruit.item.name}</div>
                  <div className="text-[10px] text-[#8A8279]">{currentPlan.fruit.item.servingSize}</div>
                </div>
              </div>

              <TactileButton
                onClick={handleToggleFruit}
                className={`py-1.5 px-3 rounded-xl text-xs font-bold ${
                  currentPlan.fruit.completed
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-700/60'
                    : 'bg-[#1E1914] text-[#D5D1CB] border border-white/[0.08]'
                }`}
              >
                {currentPlan.fruit.completed ? 'Eaten' : 'Log'}
              </TactileButton>
            </div>

            {/* Meals Checklist */}
            <div className="space-y-2">
              {(['breakfast', 'lunch', 'dinner'] as const).map((mealType) => {
                const mealItem = currentPlan.meals[mealType];
                return (
                  <div
                    key={mealType}
                    className="bg-[#110D0A] border border-white/[0.06] rounded-2xl p-3 flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <TactileButton
                        onClick={() => handleToggleMeal(mealType)}
                        className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all ${
                          mealItem.completed
                            ? 'bg-emerald-500 text-black shadow-glow-subtle'
                            : 'border border-white/[0.12] bg-[#16120E]'
                        }`}
                      >
                        {mealItem.completed && <AnimatedCheckmark size={15} strokeColor="#000000" />}
                      </TactileButton>
                      <div>
                        <div className="text-[10px] uppercase font-bold text-[#E37210]">
                          {mealType}
                        </div>
                        <div className="text-xs font-bold text-white line-clamp-1">
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
