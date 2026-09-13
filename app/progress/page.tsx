'use client';

import React, { useState } from 'react';
import MobileShell from '@/components/layout/MobileShell';
import { 
  LineChart, 
  Scale, 
  Calendar, 
  TrendingDown, 
  Check, 
  Flame, 
  Activity,
  Plus
} from 'lucide-react';
import { getLocalStore, saveLocalStore } from '@/lib/storage/store';
import { calculateBMI, getBMICategory, getBMILabel, calculateWeightProgressPercent } from '@/lib/engine/bmi';
import { recordPointEvent } from '@/lib/engine/points-ledger';
import { TactileButton, FadeSlideUp, NumberCountUp } from '@/components/motion/MotionPrimitives';

export default function ProgressPage() {
  const [store, setStore] = useState(getLocalStore());
  const { currentUser, bmiRecords } = store;

  const [newWeight, setNewWeight] = useState(currentUser.weightKg);
  const [checkInSuccess, setCheckInSuccess] = useState(false);

  const baselineRecord = bmiRecords[0] || {
    weightKg: 68.5,
    bmi: 24.3,
  };

  const progressPercent = calculateWeightProgressPercent(
    baselineRecord.weightKg,
    currentUser.weightKg,
    currentUser.targetWeightKg || 58
  );

  const handleMonthlyCheckIn = () => {
    const updatedBMI = calculateBMI(newWeight, currentUser.heightCm);
    const updatedCategory = getBMICategory(updatedBMI);
    const earnedPoints = store.pointsConfig?.monthlyCheckinPoints || 50;

    const newEvent = recordPointEvent(
      currentUser.id,
      'monthly_checkin',
      earnedPoints,
      `Completed monthly physical measurement (${newWeight}kg, BMI: ${updatedBMI})`
    );

    const newRecord = {
      id: `bmi-rec-${Date.now()}`,
      userId: currentUser.id,
      heightCm: currentUser.heightCm,
      weightKg: newWeight,
      bmi: updatedBMI,
      classification: updatedCategory,
      recordedAt: new Date().toISOString(),
      notes: 'Monthly physical progress check-in',
    };

    const updatedUser = {
      ...currentUser,
      weightKg: newWeight,
      bmi: updatedBMI,
      bmiCategory: updatedCategory,
      points: currentUser.points + earnedPoints,
    };

    const updatedStore = {
      ...store,
      currentUser: updatedUser,
      bmiRecords: [...bmiRecords, newRecord],
      pointEvents: [newEvent, ...(store.pointEvents || [])],
    };

    setStore(updatedStore);
    saveLocalStore(updatedStore);
    setCheckInSuccess(true);
    setTimeout(() => setCheckInSuccess(false), 3500);
  };

  return (
    <MobileShell>
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="pt-2">
          <div className="text-xs text-[#8A8279] uppercase font-bold tracking-wider">Transformation & Habits</div>
          <h1 className="text-2xl font-black text-white tracking-tight">Progress & Metrics</h1>
          <p className="text-xs text-[#A8A096] mt-0.5">
            Track your body composition milestones and habit consistency without shame.
          </p>
        </div>

        {/* CARD 1: OVERALL GOAL PROGRESS BAR (PRD Section 22: Capped at 100%) */}
        <div className="bg-[#16120E] border border-[#2A241E] rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Target Goal Progress
            </span>
            <span className="text-sm font-extrabold text-[#E37210]">
              {progressPercent}% Achieved
            </span>
          </div>

          <div className="w-full bg-[#1E1914] h-3 rounded-full overflow-hidden border border-[#2A241E]">
            <div
              className="bg-[#E37210] h-full rounded-full transition-colors duration-200"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="grid grid-cols-3 gap-2 text-center pt-1">
            <div className="bg-[#110D0A] p-2.5 rounded-xl border border-[#2A241E]">
              <div className="text-[10px] text-[#8A8279] uppercase font-semibold">Baseline</div>
              <div className="text-sm font-black text-white">{baselineRecord.weightKg} kg</div>
            </div>
            <div className="bg-[#110D0A] p-2.5 rounded-xl border border-[#E37210]/40">
              <div className="text-[10px] text-[#E37210] uppercase font-semibold">Current</div>
              <div className="text-sm font-black text-white">{currentUser.weightKg} kg</div>
            </div>
            <div className="bg-[#110D0A] p-2.5 rounded-xl border border-[#2A241E]">
              <div className="text-[10px] text-[#8A8279] uppercase font-semibold">Target</div>
              <div className="text-sm font-black text-white">{currentUser.targetWeightKg} kg</div>
            </div>
          </div>
        </div>

        {/* CARD 2: MONTHLY CHECK-IN FORM (PRD Section 22) */}
        <div className="bg-[#16120E] border border-[#2A241E] rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Scale className="w-5 h-5 text-[#E37210]" />
              <h3 className="text-sm font-bold text-white">Monthly Assessment Check-in</h3>
            </div>
            <span className="text-[10px] text-[#FDBA74] bg-[#E37210]/20 px-2 py-0.5 rounded-full font-semibold">
              +50 pts
            </span>
          </div>

          <p className="text-xs text-[#8A8279]">
            Update your weight to recalculate your adult screening BMI and store your historical progress.
          </p>

          <div className="flex items-center space-x-2 pt-1">
            <div className="relative flex-1">
              <input
                type="number"
                step="0.1"
                value={newWeight}
                onChange={(e) => setNewWeight(Number(e.target.value))}
                className="w-full bg-[#110D0A] border border-[#2A241E] rounded-2xl px-4 py-2.5 text-sm text-white font-bold focus:outline-none focus:border-[#E37210]"
              />
              <span className="absolute right-3.5 top-3 text-xs text-[#8A8279]">kg</span>
            </div>

            <button
              onClick={handleMonthlyCheckIn}
              className="py-2.5 px-5 rounded-2xl bg-[#E37210] hover:bg-[#F2801E] text-white text-xs font-bold transition-colors"
            >
              Record Check-in
            </button>
          </div>

          {checkInSuccess && (
            <div className="text-xs text-emerald-400 font-semibold flex items-center justify-center space-x-1 pt-1">
              <Check className="w-4 h-4" />
              <span>Assessment recorded! Check-in history updated.</span>
            </div>
          )}
        </div>

        {/* CARD 3: BMI & WEIGHT LOG TIMELINE */}
        <div className="bg-[#16120E] border border-[#2A241E] rounded-2xl p-5 space-y-3">
          <div className="text-sm font-bold text-white">Assessment Timeline</div>

          <div className="space-y-2 pt-1">
            {bmiRecords.map((rec) => (
              <div
                key={rec.id}
                className="bg-[#110D0A] border border-[#2A241E] rounded-2xl p-3 flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-white">
                    {rec.weightKg} kg • BMI {rec.bmi}
                  </div>
                  <div className="text-[10px] text-[#8A8279] mt-0.5">
                    {new Date(rec.recordedAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })} • {getBMILabel(rec.classification)}
                  </div>
                  {rec.notes && (
                    <div className="text-[10px] text-[#A8A096] italic mt-0.5">
                      "{rec.notes}"
                    </div>
                  )}
                </div>
                <span className="text-xs font-bold text-[#E37210]">Logged</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MobileShell>
  );
}
