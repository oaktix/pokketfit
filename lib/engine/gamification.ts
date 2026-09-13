import { UserProfile, Badge, LeagueTier } from '../types';
import { CONFIGURABLE_LEAGUE_TIERS, getLeagueTierForPoints } from './leagues';

export const LEAGUE_TIERS: LeagueTier[] = CONFIGURABLE_LEAGUE_TIERS;

export const AVAILABLE_BADGES: Badge[] = [
  {
    id: 'badge-first-workout',
    title: 'First Step Taken',
    description: 'Completed your very first scheduled workout.',
    iconName: 'Flame',
    category: 'workouts',
  },
  {
    id: 'badge-streak-3',
    title: 'Momentum Builder',
    description: 'Maintained a 3-day active habit streak.',
    iconName: 'Zap',
    category: 'streak',
  },
  {
    id: 'badge-streak-7',
    title: 'Unstoppable 7',
    description: 'Completed all workouts for a full consecutive week.',
    iconName: 'ShieldCheck',
    category: 'streak',
  },
  {
    id: 'badge-hydration-master',
    title: 'Hydration Hero',
    description: 'Met 100% of your daily water intake goal.',
    iconName: 'Droplets',
    category: 'hydration',
  },
  {
    id: 'badge-fruit-lover',
    title: 'Fruit & Vitality',
    description: 'Logged your fresh fruit portion 5 days in a row.',
    iconName: 'Apple',
    category: 'nutrition',
  },
];

export function calculatePointsReward(activityType: 'workout' | 'meal' | 'water' | 'fruit' | 'checkin'): number {
  switch (activityType) {
    case 'workout':
      return 50; // Workouts award significant consistency points
    case 'meal':
      return 15;
    case 'water':
      return 10;
    case 'fruit':
      return 10;
    case 'checkin':
      return 25;
    default:
      return 5;
  }
}

export function getCurrentLeague(points: number): LeagueTier {
  for (let i = LEAGUE_TIERS.length - 1; i >= 0; i--) {
    if (points >= LEAGUE_TIERS[i].minPoints) {
      return LEAGUE_TIERS[i];
    }
  }
  return LEAGUE_TIERS[0];
}

export function evaluateMilestoneBadges(user: UserProfile, completedWorkoutsCount: number): Badge[] {
  const earned: Badge[] = [];
  if (completedWorkoutsCount >= 1) {
    earned.push({ ...AVAILABLE_BADGES[0], unlockedAt: new Date().toISOString() });
  }
  if (user.currentStreak >= 3) {
    earned.push({ ...AVAILABLE_BADGES[1], unlockedAt: new Date().toISOString() });
  }
  if (user.currentStreak >= 7) {
    earned.push({ ...AVAILABLE_BADGES[2], unlockedAt: new Date().toISOString() });
  }
  return earned;
}
