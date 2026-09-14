'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Flame,
  ArrowRight,
  ArrowLeft,
  Check,
  AlertCircle,
  ShieldCheck,
  Scale,
  Clock,
  Home,
  Building2,
} from 'lucide-react';
import {
  calculateBMI,
  getBMICategory,
  getBMILabel,
  validateAdultEligibility,
  getHealthyWeightRange,
  recommendGoals,
} from '@/lib/engine/bmi';
import { generateDailyPlan } from '@/lib/engine/plan-engine';
import { getLocalStore, saveLocalStore } from '@/lib/storage/store';
import { GoalType, FitnessLevel, WorkoutEnvironment, Gender } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';

export default function OnboardingWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [signupError, setSignupError] = useState('');

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState<number>(27);
  const [gender, setGender] = useState<Gender>('female');
  const [heightCm, setHeightCm] = useState<number>(168);
  const [weightKg, setWeightKg] = useState<number>(64);
  const [targetWeightKg, setTargetWeightKg] = useState<number>(58);

  const [isPostpartum, setIsPostpartum] = useState<boolean>(false);
  const [postpartumTimeframe, setPostpartumTimeframe] = useState<string>('3-6 months');
  const [postpartumCleared, setPostpartumCleared] = useState<boolean>(false);

  const [fitnessLevel, setFitnessLevel] = useState<FitnessLevel>('beginner');
  const [workoutEnvironment, setWorkoutEnvironment] = useState<WorkoutEnvironment>('home');
  const [preferredWorkoutTime, setPreferredWorkoutTime] = useState('07:30');
  const [wakeUpTime, setWakeUpTime] = useState('06:30');
  const [sleepTime, setSleepTime] = useState('22:30');
  const [selectedGoal, setSelectedGoal] = useState<GoalType>('build_strength');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  const bmi = calculateBMI(weightKg, heightCm);
  const bmiCategory = getBMICategory(bmi);
  const adultValidation = validateAdultEligibility(age);
  const healthyRange = getHealthyWeightRange(heightCm);
  const goalRecommendation = recommendGoals(bmiCategory, isPostpartum);

  const handleNext = () => {
    setSignupError('');
    if (step === 2 && !adultValidation.isEligible) {
      return;
    }
    if (step === 4 && gender === 'female' && isPostpartum && !postpartumCleared) {
      alert('Medical clearance is required to assign postpartum fitness routines. Please verify doctor clearance.');
      return;
    }
    setStep((prev) => Math.min(prev + 1, 6));
  };

  const handleComplete = async () => {
    setLoading(true);
    setSignupError('');

    const store = getLocalStore();
    const planType = isPostpartum
      ? ('postpartum' as const)
      : bmiCategory === 'underweight'
      ? ('underweight' as const)
      : bmiCategory === 'overweight' || bmiCategory === 'obese'
      ? ('overweight' as const)
      : ('normal_weight' as const);

    const newUser = {
      ...store.currentUser,
      name,
      email,
      age,
      gender,
      heightCm,
      weightKg,
      targetWeightKg,
      bmi,
      bmiCategory,
      fitnessPlanType: planType,
      fitnessLevel,
      workoutEnvironment,
      preferredWorkoutTime,
      wakeUpTime,
      sleepTime,
      isPostpartum,
      postpartumTimeframe: isPostpartum ? postpartumTimeframe : undefined,
      postpartumCleared: isPostpartum ? postpartumCleared : undefined,
      primaryGoal: selectedGoal,
      goals: [selectedGoal],
    };

    const todayStr = new Date().toISOString().split('T')[0];
    const newPlan = generateDailyPlan(newUser, todayStr);

    store.currentUser = newUser;
    store.currentPlan = newPlan;
    saveLocalStore(store);

    const supabase = createClient();
    if (supabase) {
      try {
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
          email,
          password: password || 'Pokketfit2026!',
          options: {
            data: { name, gender },
          },
        });

        if (signUpError) {
          setSignupError(signUpError.message || 'We could not create your account. Please try again.');
          setLoading(false);
          return;
        }

        if (authData?.user && !authData?.session) {
          setSignupError('Account created — please check your email to verify your account before continuing.');
          setLoading(false);
          return;
        }

        if (!authData?.user && !authData?.session) {
          setSignupError('We could not complete your account setup. Please try again.');
          setLoading(false);
          return;
        }

        if (authData?.user && authData?.session) {
          await supabase.from('profiles').upsert({
            id: authData.user.id,
            name,
            email,
            age,
            gender,
            height_cm: heightCm,
            weight_kg: weightKg,
            target_weight_kg: targetWeightKg,
            bmi,
            bmi_category: bmiCategory,
            fitness_plan_type: planType,
            fitness_level: fitnessLevel,
            workout_environment: workoutEnvironment,
            wake_up_time: wakeUpTime,
            sleep_time: sleepTime,
            is_postpartum: isPostpartum,
            postpartum_cleared: postpartumCleared,
            goals: [selectedGoal],
            primary_goal: selectedGoal,
            role: 'user',
          });

          await supabase.from('bmi_records').insert({
            user_id: authData.user.id,
            height_cm: heightCm,
            weight_kg: weightKg,
            bmi,
            classification: bmiCategory,
            notes: 'Initial onboarding baseline',
          });
        }
      } catch (err: any) {
        setSignupError(err?.message || 'We could not complete your account setup. Please try again.');
        setLoading(false);
        return;
      }
    }

    router.push('/dashboard');
  };

  return (
    <div className="min-h-[100dvh] flex flex-col justify-between bg-[#0A0705] text-[#FAF8F5] p-6 max-w-md mx-auto relative">
      <div>
        <div className="flex items-center justify-between mb-6">
          {step > 1 ? (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="p-2 rounded-xl bg-[#16120E] text-[#FAF8F5] border border-[#2A241E]"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          ) : (
            <div className="w-9" />
          )}
          <div className="flex items-center space-x-1.5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-colors duration-300 ${
                  i === step ? 'w-6 bg-[#E37210]' : i < step ? 'w-3 bg-[#E37210]/60' : 'w-3 bg-[#2A241E]'
                }`}
              />
            ))}
          </div>
          <div className="text-xs font-semibold text-[#8A8279]">Step {step} of 6</div>
        </div>

        {/* STEP 1: ACCOUNT */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white tracking-tight">Create your account</h2>
            <p className="text-xs text-[#A8A096]">Sign up to unlock your personalized fitness plan and daily habit tracking.</p>

            <div className="space-y-3 pt-2">
              <div>
                <label className="text-xs text-[#C7BFB5] block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full bg-[#16120E] border border-[#2A241E] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#E37210]"
                />
              </div>
              <div>
                <label className="text-xs text-[#C7BFB5] block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full bg-[#16120E] border border-[#2A241E] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#E37210]"
                />
              </div>
              <div>
                <label className="text-xs text-[#C7BFB5] block mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+234 800 000 0000"
                  className="w-full bg-[#16120E] border border-[#2A241E] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#E37210]"
                />
              </div>
              <div>
                <label className="text-xs text-[#C7BFB5] block mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Choose a secure password"
                  className="w-full bg-[#16120E] border border-[#2A241E] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#E37210]"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: BODY METRICS */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white tracking-tight">Your Body Metrics</h2>
            <p className="text-xs text-[#A8A096]">Adult BMI is screened using WHO standards (Weight ÷ Height²). Age and gender personalize safety rules.</p>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="text-xs text-[#C7BFB5] block mb-1">Age</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full bg-[#16120E] border border-[#2A241E] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#E37210]"
                />
              </div>
              <div>
                <label className="text-xs text-[#C7BFB5] block mb-1">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as Gender)}
                  className="w-full bg-[#16120E] border border-[#2A241E] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#E37210]"
                >
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-[#C7BFB5] block mb-1">Height (cm)</label>
                <input
                  type="number"
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                  className="w-full bg-[#16120E] border border-[#2A241E] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#E37210]"
                />
              </div>
              <div>
                <label className="text-xs text-[#C7BFB5] block mb-1">Weight (kg)</label>
                <input
                  type="number"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full bg-[#16120E] border border-[#2A241E] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#E37210]"
                />
              </div>
            </div>
            {!adultValidation.isEligible && (
              <div className="bg-red-950/60 border border-red-800/80 p-3.5 rounded-2xl flex items-start space-x-2 text-xs text-red-300">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{adultValidation.message}</span>
              </div>
            )}
            {adultValidation.isEligible && (
              <div className="bg-[#16120E] border border-[#2A241E] rounded-2xl p-4 mt-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-[#8A8279] uppercase font-bold tracking-wider">Calculated BMI</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-[#E37210]/20 text-[#FDBA74] border border-[#E37210]/30">
                    {getBMILabel(bmiCategory)}
                  </span>
                </div>
                <div className="text-3xl font-extrabold text-white">{bmi} <span className="text-xs text-[#8A8279] font-normal">kg/m²</span></div>
                <p className="text-[11px] text-[#8A8279] mt-2">
                  BMI is an adult screening guideline, not a diagnostic measure. Healthy weight for your height is {healthyRange.minKg}kg – {healthyRange.maxKg}kg.
                </p>
              </div>
            )}
          </div>
        )}

        {/* STEP 3: GOALS */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white tracking-tight">Goals & Target Weight</h2>
            <p className="text-xs text-[#A8A096]">{goalRecommendation.reason} You have full freedom to override system suggestions.</p>
            <div className="space-y-2 pt-2">
              {[
                { id: 'build_strength', label: 'Build Strength & Healthy Tone' },
                { id: 'lose_weight', label: 'Sustainable Fat & Weight Management' },
                { id: 'gain_weight', label: 'Healthy Weight Gain & Muscular Mass' },
                { id: 'recomposition', label: 'Improve Body Composition' },
                { id: 'improve_fitness', label: 'General Cardiovascular & Stamina' },
              ].map((g) => (
                <button
                  key={g.id}
                  onClick={() => setSelectedGoal(g.id as GoalType)}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-colors flex items-center justify-between ${
                    selectedGoal === g.id ? 'bg-[#E37210]/15 border-[#E37210] text-white' : 'bg-[#16120E] border-[#2A241E] text-[#C7BFB5] hover:border-[#3F3730]'
                  }`}
                >
                  <span className="text-sm font-medium">{g.label}</span>
                  {selectedGoal === g.id && <Check className="w-4 h-4 text-[#E37210]" />}
                </button>
              ))}
            </div>
            <div className="pt-3">
              <label className="text-xs text-[#C7BFB5] block mb-1">Suggested Target Weight (Healthy range: {healthyRange.minKg} - {healthyRange.maxKg} kg)</label>
              <input
                type="number"
                value={targetWeightKg}
                onChange={(e) => setTargetWeightKg(Number(e.target.value))}
                className="w-full bg-[#16120E] border border-[#2A241E] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#E37210]"
              />
            </div>
          </div>
        )}

        {/* STEP 4: POSTPARTUM */}
        {step === 4 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white tracking-tight">Special Conditioning</h2>
            <p className="text-xs text-[#A8A096]">FitPocket tailors gentle pathways when postpartum is selected.</p>
            {gender === 'female' ? (
              <div className="space-y-4 pt-2">
                <div className="bg-[#16120E] border border-[#2A241E] rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-white">Are you currently postpartum?</span>
                    <button
                      onClick={() => setIsPostpartum(!isPostpartum)}
                      className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${isPostpartum ? 'bg-[#E37210]' : 'bg-[#2A241E]'}`}
                    >
                      <div className={`w-5 h-5 rounded-full bg-white transition-transform ${isPostpartum ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                  </div>
                  {isPostpartum && (
                    <div className="space-y-3 pt-2 border-t border-[#2A241E]">
                      <div>
                        <label className="text-xs text-[#8A8279] block mb-1">Time since delivery</label>
                        <select
                          value={postpartumTimeframe}
                          onChange={(e) => setPostpartumTimeframe(e.target.value)}
                          className="w-full bg-[#110D0A] border border-[#2A241E] rounded-xl p-2 text-xs text-white"
                        >
                          <option value="6-12 weeks">6–12 weeks</option>
                          <option value="3-6 months">3–6 months</option>
                          <option value="6-12 months">6–12 months</option>
                          <option value="12+ months">12+ months</option>
                        </select>
                      </div>
                      <div className="flex items-start space-x-2 pt-2">
                        <input
                          type="checkbox"
                          id="clearance"
                          checked={postpartumCleared}
                          onChange={(e) => setPostpartumCleared(e.target.checked)}
                          className="mt-0.5 rounded border-[#2A241E] text-[#E37210] focus:ring-0"
                        />
                        <label htmlFor="clearance" className="text-[11px] text-[#A8A096] leading-snug">
                          <strong>Medical Clearance:</strong> I confirm I have been cleared by my physician for physical exercise.
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-[#16120E] border border-[#2A241E] rounded-2xl p-4 text-xs text-[#A8A096]">
                No special conditions required for your profile. Continue to setup.
              </div>
            )}
          </div>
        )}

        {/* STEP 5: ENVIRONMENT */}
        {step === 5 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white tracking-tight">Workout Environment</h2>
            <p className="text-xs text-[#A8A096]">Choose where you train. Beginner level is preselected for safety.</p>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setWorkoutEnvironment('home')}
                className={`p-4 rounded-2xl border text-left transition-colors ${workoutEnvironment === 'home' ? 'bg-[#E37210]/15 border-[#E37210]' : 'bg-[#16120E] border-[#2A241E]'}`}
              >
                <Home className="w-6 h-6 text-[#E37210] mb-2" />
                <div className="text-sm font-semibold text-white">Home Workouts</div>
                <div className="text-[11px] text-[#8A8279]">No dedicated equipment needed</div>
              </button>
              <button
                onClick={() => setWorkoutEnvironment('gym')}
                className={`p-4 rounded-2xl border text-left transition-colors ${workoutEnvironment === 'gym' ? 'bg-[#E37210]/15 border-[#E37210]' : 'bg-[#16120E] border-[#2A241E]'}`}
              >
                <Building2 className="w-6 h-6 text-[#E37210] mb-2" />
                <div className="text-sm font-semibold text-white">Gym Workouts</div>
                <div className="text-[11px] text-[#8A8279]">Full equipment access</div>
              </button>
            </div>
            <div className="pt-3">
              <label className="text-xs text-[#C7BFB5] block mb-2 font-semibold">Experience Level</label>
              <div className="grid grid-cols-3 gap-2">
                {(['beginner', 'intermediate', 'expert'] as FitnessLevel[]).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setFitnessLevel(lvl)}
                    className={`py-2.5 rounded-xl border text-xs font-semibold capitalize transition-colors ${fitnessLevel === lvl ? 'bg-[#E37210] border-[#E37210] text-white' : 'bg-[#16120E] border-[#2A241E] text-[#8A8279]'}`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: SCHEDULE */}
        {step === 6 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white tracking-tight">Your Daily Rhythm</h2>
            <p className="text-xs text-[#A8A096]">Notifications stop during sleep hours. Reminders recur while awake until completed.</p>
            <div className="space-y-3 pt-2">
              <div>
                <label className="text-xs text-[#C7BFB5] block mb-1">Preferred Workout Time</label>
                <input
                  type="time"
                  value={preferredWorkoutTime}
                  onChange={(e) => setPreferredWorkoutTime(e.target.value)}
                  className="w-full bg-[#16120E] border border-[#2A241E] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#E37210]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[#C7BFB5] block mb-1">Wake-up Time</label>
                  <input
                    type="time"
                    value={wakeUpTime}
                    onChange={(e) => setWakeUpTime(e.target.value)}
                    className="w-full bg-[#16120E] border border-[#2A241E] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#E37210]"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#C7BFB5] block mb-1">Bedtime</label>
                  <input
                    type="time"
                    value={sleepTime}
                    onChange={(e) => setSleepTime(e.target.value)}
                    className="w-full bg-[#16120E] border border-[#2A241E] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#E37210]"
                  />
                </div>
              </div>
            </div>
            <div className="bg-[#16120E] border border-[#2A241E] rounded-2xl p-4 text-xs text-[#8A8279] space-y-1 mt-2">
              <div className="font-semibold text-white">Plan Summary</div>
              <div>• Environment: {workoutEnvironment === 'home' ? 'Home' : 'Gym'}</div>
              <div>• Level: {fitnessLevel.toUpperCase()}</div>
              <div>• BMI: {bmi} ({getBMILabel(bmiCategory)})</div>
              <div>• Hydration target: ~2.5 Liters</div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="pt-6">
        {step < 6 ? (
          <button
            onClick={handleNext}
            className={`w-full py-3.5 px-6 rounded-2xl font-bold flex items-center justify-center space-x-2 transition-colors ${step === 2 && !adultValidation.isEligible ? 'bg-[#2A241E] text-[#8A8279] cursor-not-allowed' : 'bg-[#E37210] text-white hover:bg-[#F2801E]'}`}
            disabled={step === 2 && !adultValidation.isEligible}
          >
            <span>Continue</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={handleComplete}
            disabled={loading}
            className="w-full py-4 px-6 rounded-2xl bg-[#E37210] hover:bg-[#F2801E] text-white font-bold flex items-center justify-center space-x-2 transition-colors"
          >
            {loading ? (
              <span>Creating account...</span>
            ) : (
              <>
                <Flame className="w-5 h-5 fill-white" />
                <span>Generate My Personal Plan</span>
              </>
            )}
          </button>
        )}
        {signupError && (
          <div className="mt-3 bg-rose-950/40 border border-rose-800/50 p-3 rounded-2xl text-xs text-rose-300">
            <AlertCircle className="w-4 h-4 inline mr-2" />
            <span>{signupError}</span>
          </div>
        )}
      </div>
    </div>
  );
}
