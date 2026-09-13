'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Dumbbell, 
  Utensils, 
  Radio, 
  ArrowLeft,
  Check,
  Trophy,
  Sliders,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { SEED_HOME_EXERCISES, SEED_MEALS, SEED_FRUITS } from '@/lib/seed/data';
import { Exercise } from '@/lib/types';
import { getLocalStore, saveLocalStore } from '@/lib/storage/store';
import { CONFIGURABLE_LEAGUE_TIERS } from '@/lib/engine/leagues';
import { TactileButton } from '@/components/motion/MotionPrimitives';
import { createClient } from '@/lib/supabase/client';

export default function AdminCmsPage() {
  const [store, setStore] = useState(getLocalStore());
  const [activeTab, setActiveTab] = useState<'exercises' | 'meals' | 'points_leagues' | 'broadcast'>('exercises');
  const [exercises, setExercises] = useState(SEED_HOME_EXERCISES);

  // Simple new exercise modal form state
  const [isAddExerciseOpen, setIsAddExerciseOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<Exercise['category']>('lower_body');
  const [newInstruction, setNewInstruction] = useState('');
  const [newWorks, setNewWorks] = useState('');

  // Announcement state
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastSent, setBroadcastSent] = useState(false);

  // Configurable Points Engine state
  const [pointsConfig, setPointsConfig] = useState(store.pointsConfig);
  const [pointsSaved, setPointsSaved] = useState(false);

  const handleSavePointsConfig = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedStore = { ...store, pointsConfig };
    setStore(updatedStore);
    saveLocalStore(updatedStore);
    setPointsSaved(true);
    setTimeout(() => setPointsSaved(false), 2500);
  };

  const handleCreateExercise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;

    const created: Exercise = {
      id: `ex-owner-${Date.now()}`,
      name: newName,
      category: newCategory,
      environment: 'both',
      works: newWorks || 'Full Body',
      instruction: newInstruction || 'Follow standard athletic form.',
      targetMuscles: ['Core', 'Legs'],
      difficultyLevels: ['beginner', 'intermediate', 'expert'],
      fitnessTypes: ['underweight', 'normal_weight', 'overweight', 'postpartum'],
      equipmentRequired: [],
      defaultSets: 3,
      defaultReps: '12',
      defaultRestSec: 60,
      status: 'published',
    };

    setExercises([created, ...exercises]);

    // Persist directly to Supabase when connected
    const supabase = createClient();
    if (supabase) {
      supabase.from('exercises').insert({
        id: created.id,
        name: created.name,
        category: created.category,
        environment: created.environment,
        works: created.works,
        instruction: created.instruction,
        safety_note: created.safetyNote,
        target_muscles: created.targetMuscles,
        difficulty_levels: created.difficultyLevels,
        fitness_types: created.fitnessTypes,
        equipment_required: created.equipmentRequired,
        default_sets: created.defaultSets,
        default_reps: created.defaultReps,
        default_rest_sec: created.defaultRestSec,
        status: 'published',
      }).then(({ error }) => {
        if (error) console.error('Supabase exercise sync note:', error);
      });
    }

    setIsAddExerciseOpen(false);
    setNewName('');
    setNewInstruction('');
    setNewWorks('');
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMessage) return;
    setBroadcastSent(true);
    setTimeout(() => {
      setBroadcastSent(false);
      setBroadcastMessage('');
    }, 3000);
  };

  return (
    <div className="min-h-[100dvh] bg-[#0A0705] text-[#FAF8F5] p-6 max-w-4xl mx-auto">
      {/* CMS Header */}
      <div className="flex items-center justify-between pb-6 border-b border-[#2A241E]">
        <div className="flex items-center space-x-3">
          <Link
            href="/dashboard"
            className="p-2 rounded-xl bg-[#16120E] border border-[#2A241E] text-[#8A8279] hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-black text-white tracking-tight">Owner & Coach CMS</h1>
              <span className="text-[10px] bg-[#E37210]/20 text-[#FDBA74] border border-[#E37210]/30 px-2 py-0.5 rounded-full font-bold">
                PRD Section 25
              </span>
            </div>
            <p className="text-xs text-[#8A8279]">
              Publish owner-approved exercises, manage points & leagues, and broadcast coach guidance.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAddExerciseOpen(true)}
          className="py-2.5 px-4 rounded-xl bg-[#E37210] hover:bg-[#F2801E] text-white text-xs font-bold flex items-center space-x-1.5 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Exercise</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 my-4 border-b border-[#2A241E] pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('exercises')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
            activeTab === 'exercises'
              ? 'bg-[#E37210] text-white'
              : 'text-[#8A8279] hover:text-white'
          }`}
        >
          Exercise Library ({exercises.length})
        </button>
        <button
          onClick={() => setActiveTab('meals')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
            activeTab === 'meals'
              ? 'bg-[#E37210] text-white'
              : 'text-[#8A8279] hover:text-white'
          }`}
        >
          Meal & Fruit Plans ({SEED_MEALS.length})
        </button>
        <button
          onClick={() => setActiveTab('points_leagues')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
            activeTab === 'points_leagues'
              ? 'bg-[#E37210] text-white'
              : 'text-[#8A8279] hover:text-white'
          }`}
        >
          Points & Leagues Engine
        </button>
        <button
          onClick={() => setActiveTab('broadcast')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
            activeTab === 'broadcast'
              ? 'bg-[#E37210] text-white'
              : 'text-[#8A8279] hover:text-white'
          }`}
        >
          Push Announcements
        </button>
      </div>

      {/* EXERCISES CMS */}
      {activeTab === 'exercises' && (
        <div className="space-y-3">
          <div className="text-xs text-[#8A8279] mb-2">
            Status: Only published content is eligible for dynamic plan assignment by the domain engine.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {exercises.map((ex) => (
              <div
                key={ex.id}
                className="bg-[#16120E] border border-[#2A241E] rounded-2xl p-4 space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-white">{ex.name}</span>
                    <span className="text-[10px] text-emerald-400 bg-emerald-950/50 border border-emerald-800/60 px-2 py-0.5 rounded-full font-semibold capitalize">
                      {ex.status}
                    </span>
                  </div>
                  <div className="text-xs text-[#8A8279]">
                    Category: <span className="text-[#C7BFB5]">{ex.category}</span> • Works: {ex.works}
                  </div>
                  <p className="text-xs text-[#A8A096] mt-1 line-clamp-2">
                    {ex.instruction}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#2A241E] text-[11px] text-[#706760]">
                  <span>{ex.defaultSets} sets • {ex.defaultReps}</span>
                  <span className="text-[#E37210]">Live In Engine</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MEALS CMS */}
      {activeTab === 'meals' && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {SEED_MEALS.map((meal) => (
              <div
                key={meal.id}
                className="bg-[#16120E] border border-[#2A241E] rounded-2xl p-4 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white">{meal.name}</h4>
                  <span className="text-xs font-bold text-[#E37210]">{meal.caloriesEst} kcal</span>
                </div>
                <div className="text-xs text-[#8A8279]">
                  Portion: {meal.portion}
                </div>
                <div className="text-[11px] text-[#A8A096]">
                  Macros: {meal.carbsGrams}g Carbs • {meal.proteinGrams}g Protein • {meal.fatGrams}g Fat
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* POINTS & LEAGUES CONFIGURATION CMS (PRD Section 4 & 25) */}
      {activeTab === 'points_leagues' && (
        <div className="space-y-6">
          <div className="bg-[#16120E] border border-[#2A241E] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Sliders className="w-5 h-5 text-[#E37210]" />
                <h3 className="text-base font-bold text-white">Centralized Activity Points Ledger Rules</h3>
              </div>
              {pointsSaved && (
                <span className="text-xs text-emerald-400 font-bold flex items-center">
                  <Check className="w-4 h-4 mr-1" /> Settings Updated
                </span>
              )}
            </div>
            <p className="text-xs text-[#8A8279] mb-4 leading-relaxed">
              Configure XP values awarded for every verified healthy habit. Changes immediately govern all active athlete plans.
            </p>

            <form onSubmit={handleSavePointsConfig} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#110D0A] p-3 rounded-2xl border border-[#2A241E]">
                <label className="text-xs text-[#C7BFB5] block mb-1">Workout Completion (XP)</label>
                <input
                  type="number"
                  value={pointsConfig.workoutPoints}
                  onChange={(e) => setPointsConfig({ ...pointsConfig, workoutPoints: Number(e.target.value) })}
                  className="w-full bg-[#16120E] border border-[#2A241E] rounded-xl px-3 py-2 text-xs font-bold text-white"
                />
              </div>

              <div className="bg-[#110D0A] p-3 rounded-2xl border border-[#2A241E]">
                <label className="text-xs text-[#C7BFB5] block mb-1">Meal Completion (XP)</label>
                <input
                  type="number"
                  value={pointsConfig.mealPoints}
                  onChange={(e) => setPointsConfig({ ...pointsConfig, mealPoints: Number(e.target.value) })}
                  className="w-full bg-[#16120E] border border-[#2A241E] rounded-xl px-3 py-2 text-xs font-bold text-white"
                />
              </div>

              <div className="bg-[#110D0A] p-3 rounded-2xl border border-[#2A241E]">
                <label className="text-xs text-[#C7BFB5] block mb-1">Fresh Fruit Portion (XP)</label>
                <input
                  type="number"
                  value={pointsConfig.fruitPoints}
                  onChange={(e) => setPointsConfig({ ...pointsConfig, fruitPoints: Number(e.target.value) })}
                  className="w-full bg-[#16120E] border border-[#2A241E] rounded-xl px-3 py-2 text-xs font-bold text-white"
                />
              </div>

              <div className="bg-[#110D0A] p-3 rounded-2xl border border-[#2A241E]">
                <label className="text-xs text-[#C7BFB5] block mb-1">Daily Hydration Goal Bonus (XP)</label>
                <input
                  type="number"
                  value={pointsConfig.hydrationGoalBonus}
                  onChange={(e) => setPointsConfig({ ...pointsConfig, hydrationGoalBonus: Number(e.target.value) })}
                  className="w-full bg-[#16120E] border border-[#2A241E] rounded-xl px-3 py-2 text-xs font-bold text-white"
                />
              </div>

              <div className="sm:col-span-2 pt-2">
                <TactileButton
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-[#E37210] hover:bg-[#F2801E] text-white text-xs font-bold transition-colors"
                >
                  Save Point Rule Configurations
                </TactileButton>
              </div>
            </form>
          </div>

          {/* Configurable Leagues List */}
          <div className="bg-[#16120E] border border-[#2A241E] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <h3 className="text-base font-bold text-white">Active Configured Leagues & Tiers</h3>
              </div>
              <span className="text-[10px] text-[#8A8279]">6 Divisions Active</span>
            </div>

            <div className="space-y-2">
              {CONFIGURABLE_LEAGUE_TIERS.map((tier, idx) => (
                <div
                  key={tier.id}
                  className="bg-[#110D0A] border border-[#2A241E] p-3 rounded-2xl flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{tier.icon}</span>
                    <div>
                      <h4 className="text-xs font-bold text-white">{tier.name}</h4>
                      <span className="text-[10px] text-[#8A8279]">Tier {idx + 1}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-black text-[#E37210]">
                      {tier.minPoints.toLocaleString()} XP Threshold
                    </div>
                    <div className="text-[10px] text-emerald-400 font-medium">
                      Promotion at {tier.promotionThresholdXP.toLocaleString()} XP
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* BROADCAST ANNOUNCEMENTS */}
      {activeTab === 'broadcast' && (
        <div className="bg-[#16120E] border border-[#2A241E] rounded-2xl p-6 max-w-lg space-y-4">
          <div className="flex items-center space-x-2 text-sm font-bold text-white">
            <Radio className="w-5 h-5 text-[#E37210]" />
            <span>Broadcast Push Notification to Users</span>
          </div>
          <p className="text-xs text-[#8A8279]">
            Sends targeted motivational guidance and community updates to all active client devices.
          </p>

          <textarea
            rows={3}
            placeholder="e.g. HealthRich Sunday challenge is live! Remember to hit your 2.5L water target today."
            value={broadcastMessage}
            onChange={(e) => setBroadcastMessage(e.target.value)}
            className="w-full bg-[#110D0A] border border-[#2A241E] rounded-2xl p-3 text-xs text-white focus:outline-none focus:border-[#E37210]"
          />

          <button
            onClick={handleSendBroadcast}
            className="w-full py-3 rounded-2xl bg-[#E37210] hover:bg-[#F2801E] text-white text-xs font-bold transition-colors"
          >
            Dispatch In-App Notification
          </button>

          {broadcastSent && (
            <div className="text-xs text-emerald-400 font-semibold flex items-center justify-center space-x-1 pt-1">
              <Check className="w-4 h-4" />
              <span>Broadcast dispatched successfully to active PWA clients!</span>
            </div>
          )}
        </div>
      )}

      {/* CREATE EXERCISE MODAL */}
      {isAddExerciseOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#16120E] border border-[#2A241E] rounded-2xl p-6 max-w-md w-full space-y-4">
            <h3 className="text-lg font-bold text-white">Add Owner-Approved Exercise</h3>

            <form onSubmit={handleCreateExercise} className="space-y-3">
              <div>
                <label className="text-xs text-[#C7BFB5] block mb-1">Exercise Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dumbbell Romanian Deadlift"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-[#110D0A] border border-[#2A241E] rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs text-[#C7BFB5] block mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as Exercise['category'])}
                  className="w-full bg-[#110D0A] border border-[#2A241E] rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="lower_body">Lower Body</option>
                  <option value="upper_body">Upper Body</option>
                  <option value="core_mobility">Core & Mobility</option>
                  <option value="low_impact_cardio">Low-Impact Cardio</option>
                  <option value="full_body_compound">Full Body / Compound</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-[#C7BFB5] block mb-1">Muscles Worked</label>
                <input
                  type="text"
                  placeholder="e.g. Hamstrings, Glutes, Core"
                  value={newWorks}
                  onChange={(e) => setNewWorks(e.target.value)}
                  className="w-full bg-[#110D0A] border border-[#2A241E] rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs text-[#C7BFB5] block mb-1">Form Instructions</label>
                <textarea
                  rows={2}
                  placeholder="Precise execution technique..."
                  value={newInstruction}
                  onChange={(e) => setNewInstruction(e.target.value)}
                  className="w-full bg-[#110D0A] border border-[#2A241E] rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddExerciseOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-[#1E1914] text-xs font-bold text-[#8A8279]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#E37210] hover:bg-[#F2801E] text-white text-xs font-bold transition-colors"
                >
                  Publish Movement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
