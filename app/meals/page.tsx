'use client';

import React, { useState } from 'react';
import MobileShell from '@/components/layout/MobileShell';
import { 
  Utensils, 
  Apple, 
  Check, 
  Flame, 
  Sparkles,
  Info,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { getLocalStore, saveLocalStore } from '@/lib/storage/store';
import { SEED_MEALS, SEED_FRUITS } from '@/lib/seed/data';
import { calculatePointsReward } from '@/lib/engine/gamification';
import { recordPointEvent } from '@/lib/engine/points-ledger';
import { TactileButton, AnimatedCheckmark, FadeSlideUp, StaggerContainer, StaggerItem } from '@/components/motion/MotionPrimitives';

export default function MealsNutritionPage() {
  const [store, setStore] = useState(getLocalStore());
  const [selectedMealType, setSelectedMealType] = useState<'all' | 'breakfast' | 'lunch' | 'dinner'>('all');

  const filteredMeals = selectedMealType === 'all'
    ? SEED_MEALS
    : SEED_MEALS.filter((m) => m.type === selectedMealType);

  const handleFruitLogged = (fruitId: string) => {
    const earnedPoints = store.pointsConfig?.fruitPoints || 10;
    const newEvent = recordPointEvent(
      store.currentUser.id,
      'fruit_completed',
      earnedPoints,
      `Logged fruit portion`,
      fruitId
    );

    const updatedPlan = {
      ...store.currentPlan,
      fruit: {
        ...store.currentPlan.fruit,
        completed: true,
        completedAt: new Date().toISOString(),
      },
    };
    const updatedUser = {
      ...store.currentUser,
      points: store.currentUser.points + earnedPoints,
    };
    const updatedStore = {
      ...store,
      currentPlan: updatedPlan,
      currentUser: updatedUser,
      pointEvents: [newEvent, ...(store.pointEvents || [])],
    };
    setStore(updatedStore);
    saveLocalStore(updatedStore);
  };

  return (
    <MobileShell>
      <div className="p-4 space-y-4">
        {/* Top Header */}
        <div className="pt-2">
          <div className="text-xs text-[#8A8279] uppercase font-bold tracking-wider">Nutrition & Fuel</div>
          <h1 className="text-2xl font-black text-white tracking-tight">Nigerian Meal Plans</h1>
          <p className="text-xs text-[#A8A096] mt-0.5">
            Locally available, high-protein Nigerian staples with transparent macro portions.
          </p>
        </div>

        {/* Nutritional Guidance Alert (PRD Section 18) */}
        <div className="bg-[#16120E] border border-[#2A241E] p-3.5 rounded-2xl flex items-start space-x-2.5 text-xs text-[#C7BFB5]">
          <Info className="w-4 h-4 text-[#E37210] shrink-0 mt-0.5" />
          <span>
            Portions and macronutrients are carefully estimated from local Nigerian ingredients. Choose approved substitutions if you have food sensitivities.
          </span>
        </div>

        {/* Fresh Fruits Section (PRD Section 19) */}
        <div className="bg-[#16120E] border border-[#2A241E] rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Apple className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Locally Available Fresh Fruits</h3>
            </div>
            <span className="text-[10px] text-emerald-400 bg-emerald-950/50 border border-emerald-800/60 px-2 py-0.5 rounded-full font-semibold">
              Daily Target
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5 pt-1">
            {SEED_FRUITS.map((fruit) => (
              <div
                key={fruit.id}
                className="bg-[#110D0A] border border-[#2A241E] p-3 rounded-2xl flex flex-col justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-white mb-0.5">{fruit.name}</div>
                  <div className="text-[10px] text-[#E37210] font-semibold">{fruit.caloriesEst} kcal • {fruit.servingSize}</div>
                  <p className="text-[10px] text-[#8A8279] mt-1 leading-snug">{fruit.benefits}</p>
                </div>
                <button
                  onClick={() => handleFruitLogged(fruit.id)}
                  className="mt-3 w-full py-1.5 rounded-xl bg-[#1E1914] hover:bg-[#2A241E] text-[10px] font-bold text-emerald-300 border border-[#2A241E] flex items-center justify-center space-x-1 active:scale-95"
                >
                  <Check className="w-3 h-3" />
                  <span>Log Portion</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Meal Filter Tabs */}
        <div className="flex space-x-2 overflow-x-auto pb-1 scrollbar-none">
          {(['all', 'breakfast', 'lunch', 'dinner'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setSelectedMealType(type)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold capitalize transition-colors ${
                selectedMealType === type
                  ? 'bg-[#E37210] text-white'
                  : 'bg-[#16120E] text-[#8A8279] border border-[#2A241E]'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Meal List */}
        <div className="space-y-3">
          {filteredMeals.map((meal) => (
            <div
              key={meal.id}
              className="bg-[#16120E] border border-[#2A241E] rounded-2xl p-5 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-[#E37210] bg-[#E37210]/15 px-2.5 py-0.5 rounded-full">
                  {meal.type}
                </span>
                <span className="text-xs font-black text-white">
                  {meal.caloriesEst} kcal
                </span>
              </div>

              <div>
                <h4 className="text-base font-bold text-white">{meal.name}</h4>
                <p className="text-xs text-[#8A8279] mt-1 leading-relaxed">
                  {meal.description}
                </p>
              </div>

              {/* Macro breakdown pills */}
              <div className="grid grid-cols-3 gap-2 bg-[#110D0A] p-2.5 rounded-2xl border border-[#2A241E] text-center">
                <div>
                  <div className="text-xs font-black text-[#FAF8F5]">{meal.carbsGrams}g</div>
                  <div className="text-[9px] text-[#8A8279] uppercase font-semibold">Carbs</div>
                </div>
                <div>
                  <div className="text-xs font-black text-[#FAF8F5]">{meal.fatGrams}g</div>
                  <div className="text-[9px] text-[#8A8279] uppercase font-semibold">Fats</div>
                </div>
                <div>
                  <div className="text-xs font-black text-[#FAF8F5]">{meal.proteinGrams}g</div>
                  <div className="text-[9px] text-[#8A8279] uppercase font-semibold">Protein</div>
                </div>
              </div>

              <div className="text-[11px] text-[#8A8279]">
                <strong className="text-[#FAF8F5]">Serving Portion:</strong> {meal.portion}
              </div>

              {meal.approvedAlternatives && meal.approvedAlternatives.length > 0 && (
                <div className="pt-2 border-t border-[#2A241E] text-[11px] text-[#FDBA74]">
                  <strong>Approved Alternatives:</strong> {meal.approvedAlternatives.join(' • ')}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </MobileShell>
  );
}
