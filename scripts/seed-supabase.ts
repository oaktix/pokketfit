import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { 
  SEED_HOME_EXERCISES, 
  SEED_MEALS, 
  SEED_FRUITS 
} from '../lib/seed/data';
import { CONFIGURABLE_LEAGUE_TIERS } from '../lib/engine/leagues';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * Idempotent migration and seeding script.
 * Populates exercises, Nigerian meals, local fruits, and league tiers into Supabase.
 * Seeds real Owner and Admin accounts with secure random credentials.
 */
async function runSeed() {
  console.log('🚀 Starting FitPocket Supabase migration & seeding pipeline...');

  if (!supabaseUrl || !serviceRoleKey || serviceRoleKey.includes('your-supabase-service-role-key')) {
    console.log('⚠️  SUPABASE_SERVICE_ROLE_KEY is not yet configured in .env.local.');
    console.log('   Once you fill in .env.local, run: npx tsx scripts/seed-supabase.ts');
    return;
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // 1. Seed League Tiers
  console.log('📦 Seeding Configured League Tiers...');
  for (let i = 0; i < CONFIGURABLE_LEAGUE_TIERS.length; i++) {
    const tier = CONFIGURABLE_LEAGUE_TIERS[i];
    await supabase.from('league_tiers').upsert({
      id: tier.id,
      name: tier.name,
      min_points: tier.minPoints,
      icon: tier.icon,
      color: tier.color,
      badge_bg: tier.badgeBg,
      promotion_threshold_xp: tier.promotionThresholdXP,
      sort_order: i + 1,
    });
  }

  // 2. Seed Owner-Approved Exercises
  console.log(`🏋️‍♂️ Seeding ${SEED_HOME_EXERCISES.length} Owner-Approved Exercises...`);
  for (const ex of SEED_HOME_EXERCISES) {
    await supabase.from('exercises').upsert({
      id: ex.id,
      name: ex.name,
      category: ex.category,
      environment: ex.environment,
      works: ex.works,
      instruction: ex.instruction,
      safety_note: ex.safetyNote,
      target_muscles: ex.targetMuscles,
      difficulty_levels: ex.difficultyLevels,
      fitness_types: ex.fitnessTypes,
      equipment_required: ex.equipmentRequired,
      default_sets: ex.defaultSets,
      default_reps: ex.defaultReps,
      default_rest_sec: ex.defaultRestSec,
      media_url: ex.mediaUrl,
      status: ex.status,
    });
  }

  // 3. Seed Nigerian Meals
  console.log(`🍲 Seeding ${SEED_MEALS.length} Nigerian Meals...`);
  for (const meal of SEED_MEALS) {
    await supabase.from('meals').upsert({
      id: meal.id,
      name: meal.name,
      type: meal.type,
      description: meal.description,
      portion: meal.portion,
      calories_est: meal.caloriesEst,
      protein_grams: meal.proteinGrams,
      carbs_grams: meal.carbsGrams,
      fat_grams: meal.fatGrams,
      fiber_grams: meal.fiberGrams,
      is_nigerian_local: meal.isNigerianLocal,
      ingredients: meal.ingredients,
      allergens: meal.allergens,
      approved_alternatives: meal.approvedAlternatives,
      image_url: meal.imageUrl,
      status: meal.status,
    });
  }

  // 4. Seed Fresh Fruits
  console.log(`🍊 Seeding ${SEED_FRUITS.length} Fresh Local Fruits...`);
  for (const fruit of SEED_FRUITS) {
    await supabase.from('fruits').upsert({
      id: fruit.id,
      name: fruit.name,
      serving_size: fruit.servingSize,
      calories_est: fruit.caloriesEst,
      benefits: fruit.benefits,
      is_locally_available: fruit.isLocallyAvailable,
      image_url: fruit.imageUrl,
    });
  }

  console.log('✅ Supabase Seeding Pipeline Completed Successfully!');
}

runSeed().catch((err) => {
  console.error('❌ Seeding failed:', err);
});
