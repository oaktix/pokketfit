import { PointEvent, PointEventType, PointsConfig } from '../types';

export const DEFAULT_POINTS_CONFIG: PointsConfig = {
  workoutPoints: 50,
  mealPoints: 15,
  fruitPoints: 10,
  hydrationLogPoints: 5,
  hydrationGoalBonus: 20,
  monthlyCheckinPoints: 50,
  streakMilestoneBonus: 30,
  dailyMaxPoints: 300,
};

export const INITIAL_POINT_EVENTS: PointEvent[] = [
  {
    id: 'pt-evt-1',
    userId: 'usr-demo-001',
    eventType: 'workout_completed',
    referenceId: 'wk-home-01',
    points: 50,
    description: 'Completed Lower Body Bodyweight Circuit',
    createdAt: '2026-09-11T08:15:00.000Z',
  },
  {
    id: 'pt-evt-2',
    userId: 'usr-demo-001',
    eventType: 'meal_completed',
    referenceId: 'meal-01',
    points: 15,
    description: 'Logged High-Protein Akara & Pap Breakfast',
    createdAt: '2026-09-11T09:30:00.000Z',
  },
  {
    id: 'pt-evt-3',
    userId: 'usr-demo-001',
    eventType: 'hydration_target_met',
    points: 20,
    description: 'Reached daily 2.5L hydration target',
    createdAt: '2026-09-11T17:45:00.000Z',
  },
  {
    id: 'pt-evt-4',
    userId: 'usr-demo-001',
    eventType: 'fruit_completed',
    referenceId: 'fruit-01',
    points: 10,
    description: 'Ate fresh Papaya serving',
    createdAt: '2026-09-12T11:00:00.000Z',
  },
  {
    id: 'pt-evt-5',
    userId: 'usr-demo-001',
    eventType: 'streak_bonus',
    points: 30,
    description: 'Achieved 14-Day Consistency Streak',
    createdAt: '2026-09-12T20:00:00.000Z',
  },
  {
    id: 'pt-evt-6',
    userId: 'usr-demo-001',
    eventType: 'workout_completed',
    referenceId: 'wk-home-02',
    points: 50,
    description: 'Completed Upper Body Posture & Press Session',
    createdAt: '2026-09-13T07:45:00.000Z',
  },
];

/**
 * Creates an auditable PointEvent record
 */
export function recordPointEvent(
  userId: string,
  eventType: PointEventType,
  points: number,
  description: string,
  referenceId?: string,
  metadata?: Record<string, any>
): PointEvent {
  return {
    id: `pt-evt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    userId,
    eventType,
    referenceId,
    points,
    description,
    createdAt: new Date().toISOString(),
    metadata,
  };
}

/**
 * Calculates current week's points from an auditable event ledger
 */
export function calculateWeeklyPoints(events: PointEvent[], userId: string): number {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 is Sunday
  const distanceToMonday = (dayOfWeek + 6) % 7;
  
  const mondayThisWeek = new Date(now);
  mondayThisWeek.setDate(now.getDate() - distanceToMonday);
  mondayThisWeek.setHours(0, 0, 0, 0);

  return events
    .filter((e) => e.userId === userId && new Date(e.createdAt) >= mondayThisWeek)
    .reduce((sum, e) => sum + e.points, 0);
}
