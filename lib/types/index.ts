export type FitnessPlanType = 'underweight' | 'normal_weight' | 'overweight' | 'postpartum';
export type FitnessLevel = 'beginner' | 'intermediate' | 'expert';
export type WorkoutEnvironment = 'home' | 'gym';
export type Gender = 'male' | 'female' | 'other';
export type GoalType = 
  | 'lose_weight' 
  | 'gain_weight' 
  | 'maintain_weight' 
  | 'improve_fitness' 
  | 'build_strength' 
  | 'recomposition' 
  | 'general_wellness';

export type BMICategory = 'underweight' | 'normal' | 'overweight' | 'obese';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  age: number;
  gender: Gender;
  heightCm: number;
  weightKg: number;
  targetWeightKg?: number;
  bmi: number;
  bmiCategory: BMICategory;
  fitnessPlanType: FitnessPlanType;
  fitnessLevel: FitnessLevel;
  workoutEnvironment: WorkoutEnvironment;
  preferredWorkoutTime: string; // e.g. "07:00"
  wakeUpTime: string;           // e.g. "06:30"
  sleepTime: string;            // e.g. "22:30"
  isPostpartum?: boolean;
  postpartumTimeframe?: string; // e.g. "3-6 months"
  postpartumCleared?: boolean;  // Must be true to assign postpartum workouts
  allergies: string[];
  dietaryRestrictions: string[];
  foodsNotEaten: string[];
  goals: GoalType[];
  primaryGoal: GoalType;
  points: number;
  currentStreak: number;
  longestStreak: number;
  rankTitle: string; // e.g., "Advanced Rise & Grind"
  createdAt: string;
  role: 'user' | 'admin' | 'owner';
}

export interface BMIRecord {
  id: string;
  userId: string;
  heightCm: number;
  weightKg: number;
  bmi: number;
  classification: BMICategory;
  recordedAt: string;
  notes?: string;
}

export type HomeExerciseCategory = 
  | 'lower_body' 
  | 'upper_body' 
  | 'core_mobility' 
  | 'low_impact_cardio' 
  | 'full_body_compound';

export interface Exercise {
  id: string;
  name: string;
  category: HomeExerciseCategory | 'gym_compound' | 'gym_isolation' | 'gym_cardio';
  environment: WorkoutEnvironment | 'both';
  works: string; // e.g. "Quads, glutes, core"
  instruction: string;
  safetyNote?: string;
  targetMuscles: string[];
  difficultyLevels: FitnessLevel[];
  fitnessTypes: FitnessPlanType[];
  equipmentRequired: string[];
  defaultSets?: number;
  defaultReps?: string; // e.g. "10-12" or "30 sec"
  defaultDurationSec?: number;
  defaultRestSec: number;
  mediaUrl?: string;
  status: 'draft' | 'review' | 'published' | 'archived';
}

export interface WorkoutExerciseItem {
  exerciseId: string;
  exercise: Exercise;
  order: number;
  sets: number;
  repsOrDuration: string;
  restSeconds: number;
  notes?: string;
}

export interface Workout {
  id: string;
  title: string;
  description: string;
  fitnessPlanType: FitnessPlanType;
  environment: WorkoutEnvironment;
  fitnessLevel: FitnessLevel;
  dayOfWeek?: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  estimatedDurationMin: number;
  exercises: WorkoutExerciseItem[];
  equipmentRequired: string[];
  isRestDay?: boolean;
  status: 'draft' | 'review' | 'published' | 'archived';
  coverImageUrl?: string;
}

export interface Meal {
  id: string;
  name: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  description: string;
  portion: string;
  caloriesEst: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  fiberGrams?: number;
  isNigerianLocal: boolean;
  ingredients: string[];
  allergens: string[];
  approvedAlternatives?: string[];
  imageUrl?: string;
  status: 'draft' | 'published' | 'archived';
}

export interface FruitItem {
  id: string;
  name: string;
  servingSize: string;
  caloriesEst: number;
  benefits: string;
  isLocallyAvailable: boolean;
  imageUrl?: string;
}

export interface DailyPlan {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  assignedWorkout: Workout;
  workoutCompleted: boolean;
  workoutCompletedAt?: string;
  workoutMissed?: boolean;
  meals: {
    breakfast: { meal: Meal; completed: boolean; completedAt?: string };
    lunch: { meal: Meal; completed: boolean; completedAt?: string };
    dinner: { meal: Meal; completed: boolean; completedAt?: string };
    snack?: { meal: Meal; completed: boolean; completedAt?: string };
  };
  fruit: {
    item: FruitItem;
    completed: boolean;
    completedAt?: string;
  };
  hydrationTargetLiters: number;
  hydrationLoggedLiters: number;
  hydrationLastLoggedAt?: string;
  contextualMotivation: string;
  healthyHabitDay: boolean;
}

export interface HabitTask {
  id: string;
  userId: string;
  type: 'water' | 'workout' | 'meal_breakfast' | 'meal_lunch' | 'meal_dinner' | 'fruit' | 'check_in';
  title: string;
  scheduledTime: string;
  status: 'pending' | 'completed' | 'missed';
  completedAt?: string;
  lastReminderSentAt?: string;
  nextReminderDueAt?: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  iconName: string;
  category: 'streak' | 'workouts' | 'hydration' | 'nutrition' | 'milestone';
  unlockedAt?: string;
}

export type PointEventType = 
  | 'workout_completed' 
  | 'meal_completed' 
  | 'fruit_completed' 
  | 'hydration_target_met' 
  | 'hydration_logged' 
  | 'streak_bonus' 
  | 'monthly_checkin' 
  | 'achievement_unlocked';

export interface PointEvent {
  id: string;
  userId: string;
  eventType: PointEventType;
  referenceId?: string;
  points: number;
  description: string;
  createdAt: string;
  metadata?: Record<string, any>;
}

export interface PointsConfig {
  workoutPoints: number;
  mealPoints: number;
  fruitPoints: number;
  hydrationLogPoints: number;
  hydrationGoalBonus: number;
  monthlyCheckinPoints: number;
  streakMilestoneBonus: number;
  dailyMaxPoints?: number;
}

export interface LeagueTier {
  id: string;
  name: string; // e.g. "Bronze", "Silver", "Gold", "Platinum", "Diamond", "Elite"
  minPoints: number;
  icon: string;
  color: string;
  badgeBg: string;
  promotionThresholdXP: number;
}

export interface LeagueCompetitor {
  id: string;
  name: string;
  avatarUrl?: string;
  avatarInitials: string;
  leagueId: string;
  weeklyPoints: number;
  totalPoints: number;
  rank: number;
  rankDelta: number; // positive = climbed, negative = dropped, 0 = unchanged
  currentStreak: number;
  achievementsCount: number;
  isCurrentUser?: boolean;
}

export interface LeagueCycle {
  id: string;
  title: string; // e.g., "Week 37, 2026"
  startDate: string;
  endDate: string;
  status: 'active' | 'completed';
}

export interface OfflineMutation {
  operationId: string;
  type: string;
  payload: any;
  timestamp: string;
  synced: boolean;
}

