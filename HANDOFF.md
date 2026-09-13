# FitPocket AI Hand-Off & Status Document

This document tracks all tasks, engineering decisions, and progress for the **FitPocket** project so that any AI or engineer can seamlessly inspect or pick up the build.

---

## 1. Project Overview & Identity
- **Product Name**: FitPocket
- **Tagline**: Your personal fitness coach in your pocket
- **Tech Stack**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Motion, Phosphor/Lucide Icons, PWA Web App Manifest, Supabase Schema Ready, LocalStorage sync queue.
- **Brand Identity**: HealthRich Fitness-inspired identity:
  - Primary Accent: Athletic Bold Orange (`#E37210` / `#F2801E`)
  - Ground Surfaces: Near-Black (`#0A0705`), Deep Charcoal (`#16120E`), Card Inset (`#1E1914`)
  - Light Ground: Soft Paper (`#F9F8F6`), Card Light (`#FFFFFF`), Inset (`#F0EDE8`)
  - Reference Screens Implemented:
    - **Rise & Grind level progress flame** (`bfe2e8e6a74eaf1c2514452750b13cf2.webp`)
    - **Macro rings (Carbs, Fats, Muscle/Protein)** (`bfe2e8e6a74eaf1c2514452750b13cf2.webp`)
    - **Activity Tracker interactive steps & calories burned curve** (`469087328da0398e576db78c23927c94.webp`)
    - **Health metrics cards (Heart Rate, Steps, Hydration)** (`3ce028c7d69cd2a286623018e8e9d41e.webp`)
    - **Full mobile shell with bottom navigation** (`5ae2fe945bc7a308cf574331ffba8b98.webp`)

---

## 2. Implementation Status Checklist

### Phase 1: Planning & Design Research
- [x] Read and analyze PRD & AI Builder Master Prompt (`FitPocket_PRD_and_AI_Builder_Master_Prompt.docx` / `doc_text.xml`)
- [x] Inspect UI/UX reference design screenshots
- [x] Consult skills library (`Product-Manager-Skills`, `emil-kowalski-skills`, `impeccable-design-skill`, `taste-skill`)
- [x] Create initial `HANDOFF.md` tracking document
- [x] Generate approved `implementation_plan.md` artifact

### Phase 2: Project Setup & Design System
- [x] Initialize Next.js project with App Router, TypeScript, and Tailwind CSS
- [x] Implement HealthRich design tokens in CSS variables (`app/globals.css`)
- [x] Configure font stack and responsive layout shell with mobile device frame simulation (`components/layout/MobileShell.tsx`)
- [x] Set up PWA web app manifest (`public/manifest.json`)
- [x] Configure `tsconfig.json` excluding external skill markdown trees

### Phase 3: Core Domain Engines & Seed Data
- [x] Define comprehensive TypeScript data models matching PRD Section 31 (`lib/types/index.ts`)
- [x] Build BMI Calculation & WHO Classification Engine (`lib/engine/bmi.ts`)
  - Formula: Weight(kg) / Height(m)²
  - Adult classification threshold (ages >= 18)
  - Healthy target weight range calculation (18.5 - 24.9 BMI)
  - Target weight percentage calculation capped at 100%
- [x] Build Personal Fitness Plan Assignment Engine (`lib/engine/plan-engine.ts`)
  - Deterministic priority: Safety -> Postpartum clearance -> Fitness Type -> Goal -> Level -> Environment -> Program Day -> Rest schedule
- [x] Build Persistent Reminder & Sleep Window Engine (`lib/engine/reminders.ts`)
  - Suppresses notifications during user's configured bedtime and wake-up window
  - 30-min recurring check for water, meals, fruit, and workouts
  - Halts reminder immediately once task is completed
- [x] Build Gamification & Points Ledger Engine (`lib/engine/gamification.ts`)
  - Activity points (+50 workout, +15 meal, +10 water/fruit, +50 monthly checkin)
  - Streak tracker
  - League tiers (Bronze, Silver, Gold, Obsidian Champion)
- [x] Populate Realistic Seed Data (`lib/seed/data.ts`):
  - Owner-approved home exercises (5 categories: Lower Body, Upper Body, Core & Mobility, Low-Impact Cardio, Full Body / Compound)
  - Local Nigerian meal plans (Breakfast, Lunch, Dinner with portions and macro estimates)
  - Locally available Nigerian fruits (Papaya, Watermelon, Mango, Orange, Guava)
  - Contextual motivational coach prompts

### Phase 4: User Flows & Application Features
- [x] Landing Page (`app/page.tsx`) with brand lockup, feature grid, Demo Login button, and safety disclaimer
- [x] **Demo Login & Role Switcher** (`app/login/page.tsx`):
  - **Client Athlete (`user`)**: Ava Martinez (`fitava.martinez@gmail.com`)
  - **Coach & Admin (`admin`)**: Coach Adeola (`coach.adeola@fitpocket.app`)
  - **Platform Owner (`owner`)**: Dr. HealthRich (`owner@healthrichfitness.com`)
  - Internal application-controlled OTP simulation (Default OTP: `7281` or `1234`)
- [x] Onboarding Wizard (`app/onboarding/page.tsx`):
  - Step 1: Internal application-controlled OTP verification
  - Step 2: Body metrics (Height, weight, age, gender) with live WHO BMI categorization and minor screening alert
  - Step 3: Goals with user override and target weight suggestion
  - Step 4: Special pathways (Postpartum medical clearance routing)
  - Step 5: Environment (Home vs Gym) & Fitness level (Beginner preselected)
  - Step 6: Daily rhythm (Wake-up time, sleep window, workout time) -> Personal plan generated
- [x] Coach Dashboard (`app/dashboard/page.tsx`):
  - Header greeting and streak badge
  - Rise & Grind rank card with flame progress bar and macro doughnut rings (72g Carbs, 52g Fats, 112g Muscle)
  - Daily Assigned Workout hero card with duration and launch CTA
  - Activity Tracker steps card with interactive calories burned wave chart
  - Quick-log hydration progress (+250ml, +500ml buttons)
  - Daily fruit check-in widget
  - Today's Nigerian meals checklist with interactive completion toggles
- [x] Workouts Library (`app/workouts/page.tsx`):
  - Home & Gym categorized filters (Lower, Upper, Core/Mobility, Cardio, Compound)
  - Exercise cards with targets, instructions, and safety notes
  - Today's workout launcher
- [x] Interactive Workout Player (`app/workouts/[id]/page.tsx`):
  - Step-by-step exercise guide with form cues
  - Rest interval timer countdown with skip option
  - Confetti celebration modal upon completion
  - Awards points (+50) and updates streak (+1)
  - Queues offline mutation
- [x] Nigerian Meals & Nutrition (`app/meals/page.tsx`):
  - Meals filtered by breakfast, lunch, dinner
  - Full macro breakdown (Protein, Carbs, Fats) and portion sizes
  - Approved alternative suggestions
  - Daily fruit logger
- [x] Progress Tracking (`app/progress/page.tsx`):
  - Overall target goal progress bar (capped at 100%)
  - Baseline vs Current vs Target weights
  - Monthly assessment check-in form recalculating BMI
  - Assessment history timeline
- [x] User Profile & Settings (`app/profile/page.tsx`):
  - User avatar and rank
  - Bedtime and wake-up sleep window editor
  - Offline sync queue inspector
  - NDPR / GDPR complete data export (JSON)
  - Account deletion and local reset
- [x] Owner & Coach CMS (`app/admin/page.tsx`):
  - Add and publish new owner-approved exercises directly into the plan engine
  - Inspect meal plans and fruits
  - Broadcast in-app push notifications to clients
- [x] Production Build & Local Server Verification:
  - `npm run build` verified: **0 errors, 11 static/dynamic routes prerendered cleanly**
  - Dev server running on `http://localhost:3000` with all routes returning `HTTP 200`

---

## 3. Architecture & Code Map for Succeeding AI
- **Primary Styles**: `app/globals.css` (Tailwind with custom CSS properties for dark/light themes and Emil Kowalski `:active` scale rules).
- **Core State**: `lib/storage/store.ts` (Persists user profile, current daily plan, BMI history, and offline queue to `localStorage` with initial seed demo defaults).
- **Plan Engine**: `lib/engine/plan-engine.ts` (Deterministic assignment respecting adult BMI, postpartum clearance, environment, and rest days).
- **Seed Data**: `lib/seed/data.ts` (Source of truth for owner-approved home exercises, Nigerian meals, and local fruits).
- **Admin CMS**: `app/admin/page.tsx` (Supports adding movements that immediately become eligible for plan assignment without code modifications).
- **Role Demo**: `app/login/page.tsx` (Direct switcher between Member, Coach, and Owner).
