import { BMICategory, FitnessPlanType, GoalType } from '../types';

/**
 * Calculates BMI according to WHO standard: weight(kg) / (height(m))^2
 * Note: Height is provided in centimeters.
 */
export function calculateBMI(weightKg: number, heightCm: number): number {
  if (weightKg <= 0 || heightCm <= 0) return 0;
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  return Math.round(bmi * 10) / 10;
}

/**
 * Classifies adult BMI according to WHO standard ranges:
 * <18.5: Underweight
 * 18.5 - 24.9: Normal / Healthy Weight
 * 25.0 - 29.9: Overweight
 * 30.0+: Obese
 */
export function getBMICategory(bmi: number): BMICategory {
  if (bmi < 18.5) return 'underweight';
  if (bmi <= 24.9) return 'normal';
  if (bmi <= 29.9) return 'overweight';
  return 'obese';
}

export function getBMILabel(category: BMICategory): string {
  switch (category) {
    case 'underweight':
      return 'Underweight';
    case 'normal':
      return 'Healthy / Normal Weight';
    case 'overweight':
      return 'Overweight';
    case 'obese':
      return 'Obese';
  }
}

/**
 * Validates adult eligibility. PRD Section 6 explicitly states:
 * "Do not apply adult BMI categories to children/teens; define an adult eligibility threshold for the initial product."
 */
export function validateAdultEligibility(age: number): {
  isEligible: boolean;
  message?: string;
} {
  if (age < 18) {
    return {
      isEligible: false,
      message:
        'Pokketfit adult BMI and structured training programs are designed for adults aged 18 and older. Younger individuals should follow pediatric growth standards and consult a healthcare professional.',
    };
  }
  return { isEligible: true };
}

/**
 * Recommends a healthy target weight range based on normal BMI bounds (18.5 - 24.9)
 */
export function getHealthyWeightRange(heightCm: number): { minKg: number; maxKg: number; suggestedMidKg: number } {
  const heightM = heightCm / 100;
  const minKg = Math.round(18.5 * (heightM * heightM) * 10) / 10;
  const maxKg = Math.round(24.9 * (heightM * heightM) * 10) / 10;
  const suggestedMidKg = Math.round(((minKg + maxKg) / 2) * 10) / 10;
  return { minKg, maxKg, suggestedMidKg };
}

/**
 * Suggests default goals based on BMI and condition, while always allowing user override.
 */
export function recommendGoals(
  bmiCategory: BMICategory,
  isPostpartum?: boolean
): { recommendedGoal: GoalType; reason: string } {
  if (isPostpartum) {
    return {
      recommendedGoal: 'improve_fitness',
      reason: 'Postpartum recovery focuses on gentle core activation, pelvic floor support, mobility, and sustainable stamina.',
    };
  }

  switch (bmiCategory) {
    case 'underweight':
      return {
        recommendedGoal: 'gain_weight',
        reason: 'Recommended focus: Building lean strength and nourishing caloric density.',
      };
    case 'overweight':
    case 'obese':
      return {
        recommendedGoal: 'lose_weight',
        reason: 'Recommended focus: Sustainable calorie management, low-impact cardio, and functional compound strength.',
      };
    case 'normal':
    default:
      return {
        recommendedGoal: 'build_strength',
        reason: 'Recommended focus: Enhancing functional muscle tone, stamina, and metabolic conditioning.',
      };
  }
}

/**
 * Calculates progress towards target weight, strictly capped at 100%.
 */
export function calculateWeightProgressPercent(
  baselineWeight: number,
  currentWeight: number,
  targetWeight: number
): number {
  if (baselineWeight === targetWeight) return 100;
  const totalDifference = Math.abs(targetWeight - baselineWeight);
  const achievedDifference = Math.abs(baselineWeight - currentWeight);
  const percentage = (achievedDifference / totalDifference) * 100;
  return Math.min(100, Math.max(0, Math.round(percentage)));
}
