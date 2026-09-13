'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import MobileShell from '@/components/layout/MobileShell';
import { 
  Dumbbell, 
  Clock, 
  Flame, 
  Play, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { getLocalStore } from '@/lib/storage/store';
import { SEED_HOME_EXERCISES } from '@/lib/seed/data';

export default function WorkoutsIndexPage() {
  const store = getLocalStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Routines' },
    { id: 'lower_body', label: 'Lower Body' },
    { id: 'upper_body', label: 'Upper Body' },
    { id: 'core_mobility', label: 'Core & Mobility' },
    { id: 'low_impact_cardio', label: 'Cardio' },
    { id: 'full_body_compound', label: 'Compound' },
  ];

  const filteredExercises = selectedCategory === 'all'
    ? SEED_HOME_EXERCISES
    : SEED_HOME_EXERCISES.filter((ex) => ex.category === selectedCategory);

  return (
    <MobileShell>
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="pt-2">
          <div className="text-xs text-[#8A8279] uppercase font-bold tracking-wider">Owner Library</div>
          <h1 className="text-2xl font-black text-white tracking-tight">Prescribed Workouts</h1>
          <p className="text-xs text-[#A8A096] mt-0.5">
            Structured home and gym movements with precise form cues and sets.
          </p>
        </div>

        {/* Today's Active Session Banner */}
        <div className="bg-gradient-to-r from-[#E37210]/20 via-[#E37210]/10 to-[#16120E] border border-[#E37210]/40 rounded-3xl p-5 shadow-glow-subtle">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#E37210] bg-[#E37210]/20 px-2 py-0.5 rounded-full">
              Today's Focus
            </span>
            <div className="flex items-center space-x-1 text-xs text-[#FDBA74]">
              <Clock className="w-3.5 h-3.5" />
              <span>{store.currentPlan.assignedWorkout.estimatedDurationMin} mins</span>
            </div>
          </div>

          <h3 className="text-lg font-bold text-white mb-1">
            {store.currentPlan.assignedWorkout.title}
          </h3>
          <p className="text-xs text-[#A8A096] mb-4">
            {store.currentPlan.assignedWorkout.description}
          </p>

          <Link
            href={`/workouts/${store.currentPlan.assignedWorkout.id}`}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#E37210] to-[#F2801E] text-white text-xs font-bold flex items-center justify-center space-x-2 shadow-glow-orange hover:brightness-110 active:scale-95 transition-all"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Launch Interactive Workout Player</span>
          </Link>
        </div>

        {/* Safety Note Alert (PRD Section 17) */}
        <div className="bg-[#16120E] border border-amber-500/25 p-3.5 rounded-2xl flex items-start space-x-3 text-xs text-amber-200/90">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <span>
            <strong>Safety Guidance:</strong> Mild muscle fatigue can occur during exercise. Stop immediately if you experience sharp, severe or unusual pain and seek professional guidance.
          </span>
        </div>

        {/* Category Horizontal Filter Pill Tabs */}
        <div className="flex space-x-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-[#E37210] text-white shadow-glow-subtle'
                  : 'bg-[#16120E] text-[#8A8279] border border-[#2A241E] hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Exercise List */}
        <div className="space-y-2.5">
          {filteredExercises.map((ex) => (
            <div
              key={ex.id}
              className="bg-[#16120E] border border-[#2A241E] rounded-2xl p-4 transition-all hover:border-[#3F3730]"
            >
              <div className="flex items-center justify-between mb-1.5">
                <h4 className="text-sm font-bold text-white">{ex.name}</h4>
                <span className="text-[10px] text-[#E37210] uppercase font-bold bg-[#E37210]/10 px-2 py-0.5 rounded-full">
                  {ex.defaultSets} sets • {ex.defaultReps}
                </span>
              </div>

              <div className="text-xs text-[#8A8279] mb-2 font-medium">
                Targets: <span className="text-[#C7BFB5]">{ex.works}</span>
              </div>

              <p className="text-xs text-[#A8A096] leading-relaxed">
                {ex.instruction}
              </p>

              {ex.safetyNote && (
                <div className="mt-2 pt-2 border-t border-[#2A241E] text-[11px] text-[#FDBA74] flex items-center space-x-1">
                  <span>💡 Note: {ex.safetyNote}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </MobileShell>
  );
}
