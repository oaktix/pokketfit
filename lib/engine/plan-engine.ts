import { 
  UserProfile, 
  Workout, 
  WorkoutExerciseItem, 
  DailyPlan, 
  Meal, 
  FruitItem 
} from '../types';
import { SEED_HOME_EXERCISES, SEED_MEALS, SEED_FRUITS, MOTIVATIONAL_PROMPTS } from '../seed/data';

/**
 * Workout Assignment Engine (PRD Section 15 & 41)
 *
 * Priority order:
 * 1. Safety eligibility (Adult eligibility, pain tolerance)
 * 2. Postpartum / Special conditions (Strict clearance required)
 * 3. Fitness / plan type (Underweight, Normal Weight, Overweight, Postpartum)
 * 4. Goal (lose_weight, gain_weight, maintain, build_strength, recomposition, general_wellness)
 * 5. Fitness level (Beginner preselected, Intermediate, Expert)
 * 6. Environment (Home vs Gym)
 * 7. Program Day / Rest schedule (Rest days must be first-class)
 */
export function generateDailyWorkout(
  user: UserProfile,
  dayOfWeek: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'
): Workout {
  // Sunday is always designated Rest Day across all programs (PRD Section 13)
  if (dayOfWeek === 'sunday') {
    return {
      id: `workout-rest-${dayOfWeek}`,
      title: 'Active Rest & Recovery Day',
      description: 'Honor your nervous system. Prioritize restful sleep, light joint mobility, hydration, and nutritional replenishment.',
      fitnessPlanType: user.fitnessPlanType,
      environment: user.workoutEnvironment,
      fitnessLevel: user.fitnessLevel,
      dayOfWeek,
      estimatedDurationMin: 15,
      exercises: [],
      equipmentRequired: [],
      isRestDay: true,
      status: 'published',
    };
  }

  // 1. Postpartum Routing (PRD Section 2 & 15: Postpartum is a specialized medical modifier)
  if (user.isPostpartum) {
    const postpartumExercises: WorkoutExerciseItem[] = [
      {
        exerciseId: 'ex-dead-bug',
        exercise: SEED_HOME_EXERCISES.find(e => e.id === 'ex-dead-bug')!,
        order: 1,
        sets: 3,
        repsOrDuration: '8-10/side',
        restSeconds: 60,
        notes: 'Engage gentle pelvic floor contraction on exhale.',
      },
      {
        exerciseId: 'ex-bird-dog',
        exercise: SEED_HOME_EXERCISES.find(e => e.id === 'ex-bird-dog')!,
        order: 2,
        sets: 3,
        repsOrDuration: '8/side',
        restSeconds: 60,
      },
      {
        exerciseId: 'ex-glute-bridges',
        exercise: SEED_HOME_EXERCISES.find(e => e.id === 'ex-glute-bridges')!,
        order: 3,
        sets: 3,
        repsOrDuration: '10-12',
        restSeconds: 60,
      },
      {
        exerciseId: 'ex-cat-cow',
        exercise: SEED_HOME_EXERCISES.find(e => e.id === 'ex-cat-cow')!,
        order: 4,
        sets: 2,
        repsOrDuration: '10 cycles',
        restSeconds: 45,
      },
    ];

    return {
      id: `workout-postpartum-${dayOfWeek}`,
      title: 'Postpartum Core & Pelvic Reconditioning',
      description: 'Safe, restorative deep abdominal stabilization and pelvic floor connection. (Doctor cleared only).',
      fitnessPlanType: 'postpartum',
      environment: 'home',
      fitnessLevel: user.fitnessLevel,
      dayOfWeek,
      estimatedDurationMin: 25,
      exercises: postpartumExercises,
      equipmentRequired: ['Mat'],
      status: 'published',
    };
  }

  // 2. Overweight Guidance (PRD Section 11):
  // "Owner guidance: start with Chair Squats, Wall Push-ups, Glute Bridges, March in Place and Dead Bug"
  if (user.fitnessPlanType === 'overweight' && user.fitnessLevel === 'beginner') {
    const starterIds = ['ex-chair-squats', 'ex-wall-pushups', 'ex-glute-bridges', 'ex-march-in-place', 'ex-dead-bug'];
    const selectedExercises: WorkoutExerciseItem[] = starterIds.map((id, index) => {
      const ex = SEED_HOME_EXERCISES.find(e => e.id === id)!;
      return {
        exerciseId: id,
        exercise: ex,
        order: index + 1,
        sets: 3,
        repsOrDuration: ex.defaultReps || '10',
        restSeconds: 60,
        notes: 'Work at a smooth, steady cadence. Stop if feeling sharp pain.',
      };
    });

    return {
      id: `workout-overweight-starter-${dayOfWeek}`,
      title: 'Foundation Strength & Low-Impact Aerobic Routine',
      description: 'Owner-prescribed sustainable starter routine focusing on joint-friendly compound mechanics and cardiovascular endurance.',
      fitnessPlanType: 'overweight',
      environment: 'home',
      fitnessLevel: 'beginner',
      dayOfWeek,
      estimatedDurationMin: 35,
      exercises: selectedExercises,
      equipmentRequired: ['Sturdy chair', 'Mat', 'Wall space'],
      status: 'published',
    };
  }

  // 3. Underweight Routine (PRD Section 15: "Underweight plans prioritize strength/recovery rather than calorie-burning language")
  if (user.fitnessPlanType === 'underweight') {
    const strengthIds = ['ex-chair-squats', 'ex-backpack-rows', 'ex-glute-bridges', 'ex-incline-pushups', 'ex-good-mornings'];
    const selected = strengthIds.map((id, index) => {
      const ex = SEED_HOME_EXERCISES.find(e => e.id === id)!;
      return {
        exerciseId: id,
        exercise: ex,
        order: index + 1,
        sets: 3,
        repsOrDuration: '8-10',
        restSeconds: 75,
        notes: 'Controlled tempo. Focus on mind-muscle connection and muscular hypertrophy.',
      };
    });

    return {
      id: `workout-hypertrophy-${dayOfWeek}`,
      title: 'Hypertrophy & Strength Mass Builder',
      description: 'Targeted resistance training emphasizing progressive overload, posture, and muscular growth without excessive metabolic drain.',
      fitnessPlanType: 'underweight',
      environment: user.workoutEnvironment,
      fitnessLevel: user.fitnessLevel,
      dayOfWeek,
      estimatedDurationMin: 35,
      exercises: selected,
      equipmentRequired: ['Backpack/weights', 'Chair'],
      status: 'published',
    };
  }

  // 4. Default Balanced Program (Normal Weight / General Fitness)
  const fullBodyIds = ['ex-chair-squats', 'ex-wall-pushups', 'ex-backpack-rows', 'ex-bird-dog', 'ex-step-touch'];
  const fullBody = fullBodyIds.map((id, idx) => {
    const ex = SEED_HOME_EXERCISES.find(e => e.id === id)!;
    return {
      exerciseId: id,
      exercise: ex,
      order: idx + 1,
      sets: 3,
      repsOrDuration: ex.defaultReps || '12',
      restSeconds: 60,
    };
  });

  return {
    id: `workout-balanced-${dayOfWeek}`,
    title: 'Functional Full Body Athletic Conditioning',
    description: 'A harmonious blend of push, pull, knee flexion, and aerobic intervals designed to optimize body recomposition.',
    fitnessPlanType: 'normal_weight',
    environment: user.workoutEnvironment,
    fitnessLevel: user.fitnessLevel,
    dayOfWeek,
    estimatedDurationMin: 40,
    exercises: fullBody,
    equipmentRequired: ['Household objects', 'Mat'],
    status: 'published',
  };
}

/**
 * Generates the full DailyPlan for a user on a given date.
 */
export function generateDailyPlan(user: UserProfile, dateStr: string): DailyPlan {
  const dateObj = new Date(dateStr);
  const dayNames: Array<'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday'> = [
    'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'
  ];
  const dayOfWeek = dayNames[dateObj.getDay()];

  // Calculate hydration target: Base 35ml per kg of bodyweight, bounded between 2.0L and 3.5L
  const calcLiters = Math.round(((user.weightKg * 35) / 1000) * 10) / 10;
  const hydrationTarget = Math.max(2.0, Math.min(3.5, calcLiters));

  // Pick balanced Nigerian meals
  const breakfast = SEED_MEALS.find(m => m.type === 'breakfast') || SEED_MEALS[0];
  const lunch = SEED_MEALS.find(m => m.type === 'lunch') || SEED_MEALS[2];
  const dinner = SEED_MEALS.find(m => m.type === 'dinner') || SEED_MEALS[4];

  // Rotate fruit from seed list
  const fruitIndex = dateObj.getDate() % SEED_FRUITS.length;
  const fruit = SEED_FRUITS[fruitIndex];

  // Pick contextual motivational prompt
  const promptIndex = (dateObj.getDate() + dateObj.getMonth()) % MOTIVATIONAL_PROMPTS.length;
  const motivation = MOTIVATIONAL_PROMPTS[promptIndex];

  const assignedWorkout = generateDailyWorkout(user, dayOfWeek);

  return {
    id: `plan-${user.id}-${dateStr}`,
    userId: user.id,
    date: dateStr,
    assignedWorkout,
    workoutCompleted: false,
    meals: {
      breakfast: { meal: breakfast, completed: false },
      lunch: { meal: lunch, completed: false },
      dinner: { meal: dinner, completed: false },
    },
    fruit: {
      item: fruit,
      completed: false,
    },
    hydrationTargetLiters: hydrationTarget,
    hydrationLoggedLiters: 0,
    contextualMotivation: motivation,
    healthyHabitDay: false,
  };
}
