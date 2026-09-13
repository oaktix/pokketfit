-- ==============================================================================
-- FITPOCKET ROW LEVEL SECURITY POLICIES (002_rls_policies.sql)
-- Strict user data isolation with secure RBAC for Admin and Owner operations
-- ==============================================================================

-- Helper function to check if current authenticated user has an administrative role
CREATE OR REPLACE FUNCTION public.is_admin_or_owner()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'owner')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ------------------------------------------------------------------------------
-- 1. PROFILES RLS
-- ------------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile; admins/owners can read all profiles for management
CREATE POLICY "Users can read own profile or admin" ON public.profiles
    FOR SELECT USING (auth.uid() = id OR public.is_admin_or_owner());

-- Users can update their own profile; admins/owners can update profiles
CREATE POLICY "Users can update own profile or admin" ON public.profiles
    FOR UPDATE USING (auth.uid() = id OR public.is_admin_or_owner());

-- Service role or trigger can insert profiles upon auth registration
CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id OR public.is_admin_or_owner());

-- ------------------------------------------------------------------------------
-- 2. BMI RECORDS RLS
-- ------------------------------------------------------------------------------
ALTER TABLE public.bmi_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own BMI records" ON public.bmi_records
    FOR SELECT USING (auth.uid() = user_id OR public.is_admin_or_owner());

CREATE POLICY "Users can insert own BMI records" ON public.bmi_records
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- 3. EXERCISES & WORKOUTS RLS (Public Read for published, Admin Write)
-- ------------------------------------------------------------------------------
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published exercises" ON public.exercises
    FOR SELECT USING (status = 'published' OR public.is_admin_or_owner());

CREATE POLICY "Admins can manage exercises" ON public.exercises
    FOR ALL USING (public.is_admin_or_owner());

ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published workouts" ON public.workouts
    FOR SELECT USING (status = 'published' OR public.is_admin_or_owner());

CREATE POLICY "Admins can manage workouts" ON public.workouts
    FOR ALL USING (public.is_admin_or_owner());

ALTER TABLE public.workout_exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view workout exercises" ON public.workout_exercises
    FOR SELECT USING (TRUE);

CREATE POLICY "Admins can manage workout exercises" ON public.workout_exercises
    FOR ALL USING (public.is_admin_or_owner());

-- ------------------------------------------------------------------------------
-- 4. MEALS & FRUITS RLS
-- ------------------------------------------------------------------------------
ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published meals" ON public.meals
    FOR SELECT USING (status = 'published' OR public.is_admin_or_owner());

CREATE POLICY "Admins can manage meals" ON public.meals
    FOR ALL USING (public.is_admin_or_owner());

ALTER TABLE public.fruits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view fruits" ON public.fruits
    FOR SELECT USING (TRUE);

CREATE POLICY "Admins can manage fruits" ON public.fruits
    FOR ALL USING (public.is_admin_or_owner());

-- ------------------------------------------------------------------------------
-- 5. DAILY PLANS & MEAL COMPLETIONS RLS
-- ------------------------------------------------------------------------------
ALTER TABLE public.daily_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own daily plans" ON public.daily_plans
    FOR ALL USING (auth.uid() = user_id OR public.is_admin_or_owner());

ALTER TABLE public.meal_completions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own meal completions" ON public.meal_completions
    FOR ALL USING (auth.uid() = user_id OR public.is_admin_or_owner());

-- ------------------------------------------------------------------------------
-- 6. POINTS LEDGER RLS
-- ------------------------------------------------------------------------------
ALTER TABLE public.point_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own point events" ON public.point_events
    FOR SELECT USING (auth.uid() = user_id OR public.is_admin_or_owner());

CREATE POLICY "Users can record own point events" ON public.point_events
    FOR INSERT WITH CHECK (auth.uid() = user_id OR public.is_admin_or_owner());

-- ------------------------------------------------------------------------------
-- 7. LEAGUE TIERS RLS
-- ------------------------------------------------------------------------------
ALTER TABLE public.league_tiers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view league tiers" ON public.league_tiers
    FOR SELECT USING (TRUE);

CREATE POLICY "Admins can manage league tiers" ON public.league_tiers
    FOR ALL USING (public.is_admin_or_owner());

-- ------------------------------------------------------------------------------
-- 8. PUSH SUBSCRIPTIONS & NOTIFICATIONS RLS
-- ------------------------------------------------------------------------------
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own push subscriptions" ON public.push_subscriptions
    FOR ALL USING (auth.uid() = user_id OR public.is_admin_or_owner());

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own notifications" ON public.notifications
    FOR ALL USING (auth.uid() = user_id OR public.is_admin_or_owner());
