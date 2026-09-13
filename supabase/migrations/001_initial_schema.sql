-- ==============================================================================
-- FITPOCKET PRODUCTION DATABASE SCHEMA MIGRATION (001_initial_schema.sql)
-- Supabase PostgreSQL with UUIDs, foreign keys, timestamps, indexes & constraints
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. USER PROFILES
-- Extends Supabase auth.users with fitness parameters, BMI classification & roles
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    age INTEGER NOT NULL CHECK (age >= 18), -- Adult screening threshold (PRD Section 6)
    gender TEXT NOT NULL CHECK (gender IN ('male', 'female', 'other')),
    height_cm NUMERIC(5,2) NOT NULL CHECK (height_cm > 50 AND height_cm < 300),
    weight_kg NUMERIC(5,2) NOT NULL CHECK (weight_kg > 20 AND weight_kg < 500),
    target_weight_kg NUMERIC(5,2),
    bmi NUMERIC(4,1) NOT NULL,
    bmi_category TEXT NOT NULL CHECK (bmi_category IN ('underweight', 'normal', 'overweight', 'obese')),
    fitness_plan_type TEXT NOT NULL CHECK (fitness_plan_type IN ('underweight', 'normal_weight', 'overweight', 'postpartum')),
    fitness_level TEXT NOT NULL DEFAULT 'beginner' CHECK (fitness_level IN ('beginner', 'intermediate', 'expert')),
    workout_environment TEXT NOT NULL DEFAULT 'home' CHECK (workout_environment IN ('home', 'gym')),
    preferred_workout_time TEXT NOT NULL DEFAULT '07:30',
    wake_up_time TEXT NOT NULL DEFAULT '06:30',
    sleep_time TEXT NOT NULL DEFAULT '22:30',
    is_postpartum BOOLEAN DEFAULT FALSE,
    postpartum_timeframe TEXT,
    postpartum_cleared BOOLEAN DEFAULT FALSE,
    allergies TEXT[] DEFAULT '{}',
    dietary_restrictions TEXT[] DEFAULT '{}',
    foods_not_eaten TEXT[] DEFAULT '{}',
    goals TEXT[] DEFAULT '{}',
    primary_goal TEXT NOT NULL DEFAULT 'build_strength',
    points INTEGER NOT NULL DEFAULT 0,
    current_streak INTEGER NOT NULL DEFAULT 0,
    longest_streak INTEGER NOT NULL DEFAULT 0,
    rank_title TEXT NOT NULL DEFAULT 'Beginner • Consistency Seeker',
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin', 'owner')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_points ON public.profiles(points DESC);

-- ------------------------------------------------------------------------------
-- 2. BMI RECORDS (Historical Progress Tracking)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.bmi_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    height_cm NUMERIC(5,2) NOT NULL,
    weight_kg NUMERIC(5,2) NOT NULL,
    bmi NUMERIC(4,1) NOT NULL,
    classification TEXT NOT NULL CHECK (classification IN ('underweight', 'normal', 'overweight', 'obese')),
    notes TEXT,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bmi_records_user ON public.bmi_records(user_id, recorded_at DESC);

-- ------------------------------------------------------------------------------
-- 3. EXERCISES (Owner-Approved Movement Library)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.exercises (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('lower_body', 'upper_body', 'core_mobility', 'low_impact_cardio', 'full_body_compound', 'gym_compound', 'gym_isolation', 'gym_cardio')),
    environment TEXT NOT NULL DEFAULT 'both' CHECK (environment IN ('home', 'gym', 'both')),
    works TEXT NOT NULL,
    instruction TEXT NOT NULL,
    safety_note TEXT,
    target_muscles TEXT[] DEFAULT '{}',
    difficulty_levels TEXT[] DEFAULT '{beginner,intermediate,expert}',
    fitness_types TEXT[] DEFAULT '{underweight,normal_weight,overweight,postpartum}',
    equipment_required TEXT[] DEFAULT '{}',
    default_sets INTEGER DEFAULT 3,
    default_reps TEXT DEFAULT '10-12',
    default_duration_sec INTEGER,
    default_rest_sec INTEGER DEFAULT 60,
    media_url TEXT,
    cloudinary_public_id TEXT,
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'review', 'published', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_exercises_status ON public.exercises(status);
CREATE INDEX IF NOT EXISTS idx_exercises_category ON public.exercises(category);

-- ------------------------------------------------------------------------------
-- 4. WORKOUTS & WORKOUT EXERCISES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.workouts (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    fitness_plan_type TEXT NOT NULL CHECK (fitness_plan_type IN ('underweight', 'normal_weight', 'overweight', 'postpartum')),
    environment TEXT NOT NULL CHECK (environment IN ('home', 'gym')),
    fitness_level TEXT NOT NULL CHECK (fitness_level IN ('beginner', 'intermediate', 'expert')),
    day_of_week TEXT CHECK (day_of_week IN ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday')),
    estimated_duration_min INTEGER NOT NULL DEFAULT 35,
    equipment_required TEXT[] DEFAULT '{}',
    is_rest_day BOOLEAN DEFAULT FALSE,
    cover_image_url TEXT,
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'review', 'published', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.workout_exercises (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workout_id TEXT NOT NULL REFERENCES public.workouts(id) ON DELETE CASCADE,
    exercise_id TEXT NOT NULL REFERENCES public.exercises(id) ON DELETE RESTRICT,
    exercise_order INTEGER NOT NULL,
    sets INTEGER NOT NULL DEFAULT 3,
    reps_or_duration TEXT NOT NULL DEFAULT '10-12',
    rest_seconds INTEGER NOT NULL DEFAULT 60,
    notes TEXT,
    UNIQUE(workout_id, exercise_order)
);

CREATE INDEX IF NOT EXISTS idx_workout_exercises_wid ON public.workout_exercises(workout_id, exercise_order);

-- ------------------------------------------------------------------------------
-- 5. NIGERIAN MEALS & FRUITS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.meals (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('breakfast', 'lunch', 'dinner', 'snack')),
    description TEXT NOT NULL,
    portion TEXT NOT NULL,
    calories_est INTEGER NOT NULL,
    protein_grams INTEGER NOT NULL,
    carbs_grams INTEGER NOT NULL,
    fat_grams INTEGER NOT NULL,
    fiber_grams INTEGER DEFAULT 0,
    is_nigerian_local BOOLEAN DEFAULT TRUE,
    ingredients TEXT[] DEFAULT '{}',
    allergens TEXT[] DEFAULT '{}',
    approved_alternatives TEXT[] DEFAULT '{}',
    image_url TEXT,
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.fruits (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    serving_size TEXT NOT NULL,
    calories_est INTEGER NOT NULL,
    benefits TEXT NOT NULL,
    is_locally_available BOOLEAN DEFAULT TRUE,
    image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 6. DAILY PLANS & MEAL COMPLETIONS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.daily_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    assigned_workout_id TEXT NOT NULL REFERENCES public.workouts(id),
    workout_completed BOOLEAN DEFAULT FALSE,
    workout_completed_at TIMESTAMPTZ,
    fruit_id TEXT REFERENCES public.fruits(id),
    fruit_completed BOOLEAN DEFAULT FALSE,
    fruit_completed_at TIMESTAMPTZ,
    hydration_target_liters NUMERIC(3,1) NOT NULL DEFAULT 2.5,
    hydration_logged_liters NUMERIC(4,2) NOT NULL DEFAULT 0.0,
    hydration_last_logged_at TIMESTAMPTZ,
    contextual_motivation TEXT,
    healthy_habit_day BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, date)
);

CREATE TABLE IF NOT EXISTS public.meal_completions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    meal_id TEXT NOT NULL REFERENCES public.meals(id),
    meal_type TEXT NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
    completed BOOLEAN DEFAULT TRUE,
    completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, date, meal_type)
);

CREATE INDEX IF NOT EXISTS idx_daily_plans_user_date ON public.daily_plans(user_id, date);

-- ------------------------------------------------------------------------------
-- 7. AUDITABLE POINTS LEDGER
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.point_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    reference_id TEXT,
    points INTEGER NOT NULL CHECK (points >= 0),
    description TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_point_events_user ON public.point_events(user_id, created_at DESC);

-- ------------------------------------------------------------------------------
-- 8. LEAGUES & DIVISIONS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.league_tiers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    min_points INTEGER NOT NULL DEFAULT 0,
    icon TEXT NOT NULL,
    color TEXT NOT NULL,
    badge_bg TEXT NOT NULL,
    promotion_threshold_xp INTEGER NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 1
);

-- ------------------------------------------------------------------------------
-- 9. PUSH NOTIFICATION SUBSCRIPTIONS & IN-APP NOTIFICATIONS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.push_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    endpoint TEXT NOT NULL UNIQUE,
    p256dh TEXT NOT NULL,
    auth TEXT NOT NULL,
    device_name TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_used_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_push_subs_user ON public.push_subscriptions(user_id);

CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('workout', 'meal', 'fruit', 'water', 'streak', 'achievement', 'league', 'system')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    deep_link TEXT,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON public.notifications(user_id, read, created_at DESC);
