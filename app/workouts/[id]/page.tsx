'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MobileShell from '@/components/layout/MobileShell';
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  ChevronRight, 
  AlertTriangle,
  Flame,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { getLocalStore, saveLocalStore, queueOfflineMutation } from '@/lib/storage/store';
import { calculatePointsReward, evaluateMilestoneBadges } from '@/lib/engine/gamification';
import { playSound } from '@/lib/notifications/sound';
import { recordPointEvent } from '@/lib/engine/points-ledger';
import CelebrationModal from '@/components/gamification/CelebrationModal';
import { TactileButton } from '@/components/motion/MotionPrimitives';
import ExerciseVideoPlayer from '@/components/media/ExerciseVideoPlayer';

export default function WorkoutPlayerPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [store, setStore] = useState(getLocalStore());
  const workout = store.currentPlan.assignedWorkout;

  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [isResting, setIsResting] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(60);
  const [timerActive, setTimerActive] = useState(false);
  const [isCompletedModalOpen, setIsCompletedModalOpen] = useState(false);

  const currentExercise = workout.exercises[currentExerciseIndex]?.exercise || workout.exercises[0]?.exercise;
  const totalSets = workout.exercises[currentExerciseIndex]?.sets || 3;

  useEffect(() => {
    let interval: any = null;
    if (timerActive && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((sec) => sec - 1);
      }, 1000);
    } else if (timerSeconds === 0 && timerActive) {
      setTimerActive(false);
      setIsResting(false);
      // Advance to next set or next exercise
      if (currentSet < totalSets) {
        setCurrentSet((s) => s + 1);
      } else if (currentExerciseIndex < workout.exercises.length - 1) {
        setCurrentExerciseIndex((i) => i + 1);
        setCurrentSet(1);
      }
    }
    return () => clearInterval(interval);
  }, [timerActive, timerSeconds, currentSet, totalSets, currentExerciseIndex, workout.exercises.length]);

  const handleCompleteSet = () => {
    if (currentSet < totalSets) {
      setIsResting(true);
      setTimerSeconds(workout.exercises[currentExerciseIndex]?.restSeconds || 60);
      setTimerActive(true);
    } else if (currentExerciseIndex < workout.exercises.length - 1) {
      setIsResting(true);
      setTimerSeconds(workout.exercises[currentExerciseIndex]?.restSeconds || 60);
      setTimerActive(true);
    } else {
      // All exercises finished!
      handleFinishWorkout();
    }
  };

  const handleFinishWorkout = () => {
    const earnedPoints = store.pointsConfig?.workoutPoints || 50;
    const newPoints = store.currentUser.points + earnedPoints;
    const newStreak = store.currentUser.currentStreak + 1;

    const newEvent = recordPointEvent(
      store.currentUser.id,
      'workout_completed',
      earnedPoints,
      `Finished ${workout.title} (${workout.exercises.length} movements)`,
      workout.id
    );

    const updatedPlan = {
      ...store.currentPlan,
      workoutCompleted: true,
      workoutCompletedAt: new Date().toISOString(),
      healthyHabitDay: true,
    };

    const updatedUser = {
      ...store.currentUser,
      points: newPoints,
      currentStreak: newStreak,
      longestStreak: Math.max(newStreak, store.currentUser.longestStreak),
    };

    const updatedStore = {
      ...store,
      currentPlan: updatedPlan,
      currentUser: updatedUser,
      pointEvents: [newEvent, ...(store.pointEvents || [])],
    };

    setStore(updatedStore);
    saveLocalStore(updatedStore);

    // Queue idempotent offline mutation (PRD Section 28 & 45)
    queueOfflineMutation('WORKOUT_COMPLETED', {
      workoutId: workout.id,
      completedAt: new Date().toISOString(),
      pointsEarned: earnedPoints,
    });

    playSound('applause');
    setIsCompletedModalOpen(true);
  };

  if (!currentExercise) return null;

  return (
    <MobileShell backHref="/workouts">
      <div className="min-h-[100dvh] flex flex-col justify-between p-4 bg-[#0A0705]">
        {/* Top Header */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => router.push('/dashboard')}
            className="p-2 rounded-xl bg-[#16120E] border border-[#2A241E] text-[#FAF8F5]"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="text-center">
            <span className="text-[10px] text-[#E37210] uppercase font-bold tracking-widest">
              Live Session
            </span>
            <div className="text-xs font-bold text-white">
              Exercise {currentExerciseIndex + 1} of {workout.exercises.length}
            </div>
          </div>
          <div className="w-9" />
        </div>

        {/* Central Exercise Guide & Rest Screen */}
        <div className="my-auto space-y-4">
          {isResting ? (
            <div className="bg-[#16120E] border border-[#E37210]/40 rounded-3xl p-8 text-center space-y-4 shadow-glow-orange">
              <span className="text-xs font-bold text-[#E37210] uppercase tracking-widest">
                Active Rest Interval
              </span>
              <div className="text-6xl font-black text-white font-mono">
                {timerSeconds}s
              </div>
              <p className="text-xs text-[#8A8279]">
                Catch your breath, sip some water, and prep for the next set.
              </p>
              <button
                onClick={() => {
                  setTimerActive(false);
                  setIsResting(false);
                  if (currentSet < totalSets) {
                    setCurrentSet((s) => s + 1);
                  } else if (currentExerciseIndex < workout.exercises.length - 1) {
                    setCurrentExerciseIndex((i) => i + 1);
                    setCurrentSet(1);
                  }
                }}
                className="py-2 px-5 rounded-full bg-[#1E1914] border border-[#2A241E] text-xs font-bold text-[#FDBA74] active:scale-95"
              >
                Skip Rest & Continue
              </button>
            </div>
          ) : (
            <div className="bg-[#16120E] border border-[#2A241E] rounded-3xl p-6 space-y-4 shadow-card-dark">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-[#E37210] uppercase tracking-wider bg-[#E37210]/15 px-3 py-1 rounded-full">
                  Set {currentSet} of {totalSets}
                </span>
                <span className="text-xs font-semibold text-[#8A8279]">
                  {workout.exercises[currentExerciseIndex]?.repsOrDuration} Reps
                </span>
              </div>

              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">
                  {currentExercise.name}
                </h2>
                <div className="text-xs text-[#8A8279] mt-1 font-medium">
                  Primary Focus: <span className="text-[#FAF8F5]">{currentExercise.works}</span>
                </div>
              </div>

              {/* Cloudinary-Powered Exercise Demonstration Video Player */}
              <ExerciseVideoPlayer
                videoUrl={currentExercise.mediaUrl}
                exerciseName={currentExercise.name}
                targetMuscles={currentExercise.targetMuscles}
              />

              <div className="bg-[#110D0A] border border-[#2A241E] rounded-2xl p-4 text-xs text-[#C7BFB5] leading-relaxed">
                <strong className="text-white block mb-1">Form Technique:</strong>
                {currentExercise.instruction}
              </div>

              {currentExercise.safetyNote && (
                <div className="text-[11px] text-amber-300 bg-amber-950/40 border border-amber-800/50 p-3 rounded-xl flex items-start space-x-2">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-400" />
                  <span>{currentExercise.safetyNote}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom CTA to log current set */}
        {!isResting && (
          <div className="space-y-2 pt-4">
            <button
              onClick={handleCompleteSet}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#E37210] to-[#F2801E] text-white font-bold flex items-center justify-center space-x-2 shadow-glow-orange hover:brightness-110 active:scale-[0.98] transition-all"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>
                {currentSet === totalSets && currentExerciseIndex === workout.exercises.length - 1
                  ? 'Finish Complete Workout'
                  : `Complete Set ${currentSet}`}
              </span>
            </button>
          </div>
        )}

        {/* Workout Complete Celebration Modal */}
        <CelebrationModal
          isOpen={isCompletedModalOpen}
          onClose={() => router.push('/dashboard')}
          title="Workout Finished!"
          subtitle="Another solid win in the books. Consistency is your superpower."
          badgeIcon="🔥"
          pointsEarned={store.pointsConfig?.workoutPoints || 50}
          streakCount={store.currentUser.currentStreak}
          onShare={() => router.push('/leaderboard')}
        />
      </div>
    </MobileShell>
  );
}
