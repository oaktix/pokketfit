import { HabitTask, UserProfile, DailyPlan } from '../types';

export interface ReminderNotification {
  id: string;
  taskId: string;
  type: HabitTask['type'];
  title: string;
  message: string;
  time: string;
  isDelivered: boolean;
}

/**
 * Checks if a given timestamp or time string falls within the user's sleep window.
 * PRD Section 20: "Recurring reminders repeat every 30 minutes until completed, except during sleep hours."
 */
export function isWithinSleepHours(currentTimeStr: string, wakeUpTimeStr: string, sleepTimeStr: string): boolean {
  // Expected formats "HH:MM" (24-hour)
  const toMinutes = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
  };

  const currentM = toMinutes(currentTimeStr);
  const wakeM = toMinutes(wakeUpTimeStr);
  const sleepM = toMinutes(sleepTimeStr);

  if (sleepM > wakeM) {
    // Normal sleep cycle within same day, e.g. sleep at 22:00, wake at 06:00
    // If sleep window crosses midnight:
    return currentM >= sleepM || currentM < wakeM;
  } else {
    // Sleep window entirely during the daytime or standard
    return currentM >= sleepM && currentM < wakeM;
  }
}

/**
 * Generates or refreshes habit tasks for the day based on the daily plan.
 */
export function evaluateDailyReminders(
  user: UserProfile,
  plan: DailyPlan,
  currentTimeStr: string
): ReminderNotification[] {
  // If inside sleep window, all notifications are strictly suppressed
  if (isWithinSleepHours(currentTimeStr, user.wakeUpTime, user.sleepTime)) {
    return [];
  }

  const notifications: ReminderNotification[] = [];

  // 1. Water Intake Check: stops recurring once daily target is reached (PRD Section 19)
  if (plan.hydrationLoggedLiters < plan.hydrationTargetLiters) {
    const remaining = Math.round((plan.hydrationTargetLiters - plan.hydrationLoggedLiters) * 10) / 10;
    notifications.push({
      id: `rem-water-${plan.date}`,
      taskId: 'task-water',
      type: 'water',
      title: 'Hydration Coach Check-in',
      message: `Time for a fresh glass of water! You have ${remaining}L remaining to hit today's ${plan.hydrationTargetLiters}L goal.`,
      time: currentTimeStr,
      isDelivered: true,
    });
  }

  // 2. Workout Check: Beginning of day + end of day reminders, stops if completed (PRD Section 20)
  if (!plan.workoutCompleted && !plan.assignedWorkout.isRestDay) {
    notifications.push({
      id: `rem-workout-${plan.date}`,
      taskId: 'task-workout',
      type: 'workout',
      title: `Today's Workout: ${plan.assignedWorkout.title}`,
      message: `Your coach is ready! Complete your ${plan.assignedWorkout.estimatedDurationMin}-min session today to keep your ${user.currentStreak}-day streak alive.`,
      time: currentTimeStr,
      isDelivered: true,
    });
  }

  // 3. Fruit Intake Check
  if (!plan.fruit.completed) {
    notifications.push({
      id: `rem-fruit-${plan.date}`,
      taskId: 'task-fruit',
      type: 'fruit',
      title: 'Daily Fresh Fruit Intake',
      message: `Enjoy your recommended portion of ${plan.fruit.item.name} today for vital micronutrients and hydration.`,
      time: currentTimeStr,
      isDelivered: true,
    });
  }

  // 4. Meals Check
  if (!plan.meals.lunch.completed && currentTimeStr >= '12:30' && currentTimeStr <= '15:00') {
    notifications.push({
      id: `rem-lunch-${plan.date}`,
      taskId: 'task-lunch',
      type: 'meal_lunch',
      title: 'Lunch Reminder',
      message: `Time to nourish! Today's assigned dish: ${plan.meals.lunch.meal.name}.`,
      time: currentTimeStr,
      isDelivered: true,
    });
  }

  return notifications;
}
