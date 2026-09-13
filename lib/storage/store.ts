import { UserProfile, DailyPlan, BMIRecord, OfflineMutation, PointEvent, PointsConfig } from '../types';
import { generateDailyPlan } from '../engine/plan-engine';
import { DEFAULT_POINTS_CONFIG, INITIAL_POINT_EVENTS } from '../engine/points-ledger';

const DEMO_USER_ID = 'usr-demo-001';

export const INITIAL_DEMO_USER: UserProfile = {
  id: DEMO_USER_ID,
  name: 'Ava Martinez',
  email: 'fitava.martinez@gmail.com',
  age: 27,
  gender: 'female',
  heightCm: 168,
  weightKg: 64,
  targetWeightKg: 58,
  bmi: 22.7,
  bmiCategory: 'normal',
  fitnessPlanType: 'normal_weight',
  fitnessLevel: 'intermediate',
  workoutEnvironment: 'home',
  preferredWorkoutTime: '07:30',
  wakeUpTime: '06:30',
  sleepTime: '22:30',
  isPostpartum: false,
  allergies: [],
  dietaryRestrictions: ['Moderation'],
  foodsNotEaten: [],
  goals: ['build_strength', 'improve_fitness'],
  primaryGoal: 'build_strength',
  points: 1240,
  currentStreak: 14,
  longestStreak: 21,
  rankTitle: 'Advanced • Rise & Grind',
  createdAt: '2026-08-01T00:00:00.000Z',
  role: 'user',
};

export const INITIAL_BMI_RECORDS: BMIRecord[] = [
  {
    id: 'bmi-rec-1',
    userId: DEMO_USER_ID,
    heightCm: 168,
    weightKg: 68.5,
    bmi: 24.3,
    classification: 'normal',
    recordedAt: '2026-07-01T08:00:00Z',
    notes: 'Initial program assessment baseline',
  },
  {
    id: 'bmi-rec-2',
    userId: DEMO_USER_ID,
    heightCm: 168,
    weightKg: 66.2,
    bmi: 23.5,
    classification: 'normal',
    recordedAt: '2026-08-01T08:00:00Z',
    notes: 'Month 1 check-in: increased muscle tone and stamina',
  },
  {
    id: 'bmi-rec-3',
    userId: DEMO_USER_ID,
    heightCm: 168,
    weightKg: 64.0,
    bmi: 22.7,
    classification: 'normal',
    recordedAt: '2026-09-01T08:00:00Z',
    notes: 'Month 2 check-in: strong core stability and regular hydration',
  },
];

export interface AppStoreState {
  currentUser: UserProfile;
  currentPlan: DailyPlan;
  bmiRecords: BMIRecord[];
  pointEvents: PointEvent[];
  pointsConfig: PointsConfig;
  offlineQueue: OfflineMutation[];
  isOffline: boolean;
  theme: 'system' | 'dark' | 'light';
}

const STORAGE_KEY = 'fitpocket_local_store_v1';

export function getLocalStore(): AppStoreState {
  if (typeof window === 'undefined') {
    const todayStr = new Date().toISOString().split('T')[0];
    return {
      currentUser: INITIAL_DEMO_USER,
      currentPlan: generateDailyPlan(INITIAL_DEMO_USER, todayStr),
      bmiRecords: INITIAL_BMI_RECORDS,
      pointEvents: INITIAL_POINT_EVENTS,
      pointsConfig: DEFAULT_POINTS_CONFIG,
      offlineQueue: [],
      isOffline: false,
      theme: 'dark',
    };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (!parsed.pointEvents) parsed.pointEvents = INITIAL_POINT_EVENTS;
      if (!parsed.pointsConfig) parsed.pointsConfig = DEFAULT_POINTS_CONFIG;
      return parsed;
    }
  } catch (e) {
    console.error('Failed to parse FitPocket local store:', e);
  }

  const todayStr = new Date().toISOString().split('T')[0];
  const initialState: AppStoreState = {
    currentUser: INITIAL_DEMO_USER,
    currentPlan: generateDailyPlan(INITIAL_DEMO_USER, todayStr),
    bmiRecords: INITIAL_BMI_RECORDS,
    pointEvents: INITIAL_POINT_EVENTS,
    pointsConfig: DEFAULT_POINTS_CONFIG,
    offlineQueue: [],
    isOffline: false,
    theme: 'dark',
  };
  saveLocalStore(initialState);
  return initialState;
}

export function saveLocalStore(state: AppStoreState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to persist FitPocket state to localStorage:', e);
  }
}

/**
 * Queues an offline mutation with an idempotent operation ID
 * PRD Section 28 & 45: "Give each offline mutation a unique operation ID and timestamp."
 */
export function queueOfflineMutation(type: string, payload: any): void {
  const store = getLocalStore();
  const mutation: OfflineMutation = {
    operationId: `op-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    type,
    payload,
    timestamp: new Date().toISOString(),
    synced: false,
  };
  store.offlineQueue.push(mutation);
  saveLocalStore(store);
}
