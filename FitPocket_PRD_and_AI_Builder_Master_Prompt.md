# **FITPOCKET** 

_Product Requirements Document + AI Builder Master Prompt_ 

Working title. Final product name to be decided later. 

Core promise: Your personal fitness coach in your pocket. 

Standalone responsive web application + Progressive Web App (PWA). 

Technology direction: Next.js + Supabase + Vercel + Cloudinary. 

Visual direction: HealthRich Fitness-inspired orange, black and white identity. 

## **PART I — PRODUCT REQUIREMENTS DOCUMENT** 

### **1. Product Vision** 

FitPocket is a personalized fitness and wellness platform that guides users through daily workouts, meals, hydration, fruit intake, reminders, habit tracking and progress. It should feel like a supportive personal fitness coach or friend in the user's pocket, not a static exercise library. 

Core loop: Assess → Personalize → Plan → Remind → Complete → Reward → Measure → Adapt → Repeat. 

### **2. Core Product Dimensions** 

|**Dimension**|**Values**|
|---|---|
|Fitness / plan type|Underweight; Normal Weight; Overweight; Postpartum|
|Fitness level|Beginner; Intermediate; Expert|
|Workout type|Home Workout; Gym Workout|
|Home categories|Lower Body; Upper Body; Core + Mobility; Low-Impact<br>Cardio; Full Body / Compound|



Postpartum is a special plan pathway/modifier, not a BMI category. A postpartum user can also have any BMI classification. 

### **3. Product Goals** 

- Personalize a daily plan from user profile, BMI, goals, fitness level, environment, preferences and special conditions. 

- Use WHO adult BMI categories correctly as a screening metric. 

- Provide owner-approved home and gym workouts. 

- Provide locally relevant Nigerian meal plans and fruits. 

- Keep users accountable through persistent reminders. 

- Make progress visible through monthly measurements, charts, progress bars and habit metrics. 

- Use streaks, points, badges and leagues to reward consistency. 

- Provide a complete owner/admin CMS. 

- Support PWA installation, push notifications and offline synchronization. 

- Remain ready for premium meal-plan features. 

### **4. User Accounts & Authentication** 

- Registration: name, email, phone number and password. 

- Email/password login. 

- Application-controlled internal email OTP verification; do not make Supabase's default OTP UI the product experience. 

FitPocket — PRD + AI Builder Master Prompt | Working document 

- Password reset/change, logout and account management. 

- Account deletion and data export. 

### **5. Onboarding** 

1. Create account and verify email. 

2. Collect name, age and gender. 

3. Collect height and weight. 

4. Calculate and show BMI classification. 

5. Recommend relevant goals, while allowing user selection/override. 

6. Suggest target weight; allow override. 

7. Preselect Beginner as fitness level; allow immediate change. 

8. Select Home or Gym. 

9. Set workout time. 

10. Set wake-up and sleep times. 

11. Collect allergies, dietary restrictions, foods not eaten and preferences. 

12. For female users, ask postpartum status. 

13. If postpartum, collect relevant timeframe and confirmation that the user has been cleared to exercise before assigning postpartum workouts. 

14. Generate the Personal Fitness Plan. 

### **6. BMI & Classification** 

For eligible adults: BMI = weight (kg) ÷ height (m)². Age and gender are collected for personalization and safety logic; they are not incorrectly inserted into the adult BMI formula. 

|**BMI**|**Classification**|
|---|---|
|<18.5|Underweight|
|18.5–24.9|Healthy / Normal Weight|
|25.0–29.9|Overweight|
|30.0+|Obese|



- Use WHO adult BMI ranges. 

- Recalculate when height/weight changes. 

- Store BMI history. 

- Explain BMI is a screening measure, not a diagnosis. 

- Do not apply adult BMI categories to children/teens; define an adult eligibility threshold for the initial product. 

- Recommend professional guidance where appropriate. 

### **7. Goals & Targets** 

- Lose/manage weight. 

- Gain healthy weight. 

- Maintain weight. 

- Improve fitness. 

- Build strength. 

- Body recomposition / strength while improving body composition. 

- General wellness. 

- The system may recommend goals, but users can override recommendations. 

- Suggest target weight from the healthy BMI range and allow user override. 

- Target BMI is based on the healthy range, not a universal fixed number. 

For body recomposition, use language such as 'build strength while working toward healthier body composition.' Never claim fat literally turns into muscle. 

### **8. Workout System** 

- Three user-facing levels: Beginner, Intermediate, Expert. 

FitPocket — PRD + AI Builder Master Prompt | Working document 

- Two environments: Home and Gym. 

- Home workouts generally require no dedicated gym equipment; approved household objects may be used. 

- Gym workouts show equipment requirements supplied by the owner. 

- Workout records contain exercise order, sets, reps, duration, rest, instructions and media. 

- Users cannot swap assigned workouts in the initial release. 

- Rest days are first-class plan items. 

### **9. Home Exercise Library** 

|**Category**|**Exercises**|
|---|---|
|Lower Body|Chair Squats; Glute Bridges; Wall Sits; Reverse Lunges;<br>Calf Raises; Step-ups|
|Upper Body|Wall Push-ups; Incline Push-ups; Chair Dips; Backpack<br>Rows; Shoulder Press; Plank Shoulder Taps|
|Core + Mobility|Dead Bug; Bird Dog; Standing Side Bends; Cat-Cow<br>Stretch; Wall Angels; Hip Flexor Stretch|
|Low-Impact Cardio|March in Place; Step Touch + Arm Swings; Shadow<br>Boxing; Seated Cardio; Dance|
|Full Body / Compound|Bodyweight Good Mornings; Bear Crawl; Squat to Press;<br>Plank|



### **10. Home Exercise Details** 

|**Exercise**|**Works**|**Instruction**|
|---|---|---|
|Chair Squats|Quads, glutes, core|Sit toward a stable chair and stand<br>without using hands where<br>comfortable.|
|Glute Bridges|Glutes, hamstrings|Lie on back, lift hips and contract<br>glutes.|
|Wall Sits|Quads, endurance|Back against wall; lower to a<br>comfortable seated position.|
|Reverse Lunges|Quads, glutes, balance|Step backward and bend knees in a<br>controlled range.|
|Calf Raises|Calves, ankle stability|Hold stable support and rise onto<br>toes.|
|Step-ups|Legs, conditioning|Use a sturdy low step and move with<br>control.|
|Wall Push-ups|Chest, shoulders, triceps|Hands on wall; bend and extend<br>arms.|
|Incline Push-ups|Chest, triceps, core|Hands on a stable elevated surface.|
|Chair Dips|Triceps, shoulders|Only use a stable chair and<br>controlled range.|
|Backpack Rows|Back, biceps, posture|Pull a safely loaded backpack toward<br>ribs.|
|Shoulder Press|Shoulders, arms|Press approved light household<br>weights/bands overhead.|
|Plank Shoulder Taps|Shoulders, core, stability|From a stable plank, tap the opposite<br>shoulder.|
|Dead Bug|Deep core, stability|On back, extend opposite arm and<br>leg with control.|
|Bird Dog|Core, back, balance|From all fours, extend opposite arm<br>and leg.|
|Standing Side Bends|Side/core muscles|Stand tall and gently bend side to<br>side.|
|Cat-Cow Stretch|Spine mobility|Alternate gentle rounding and<br>extension.|
|Wall Angels|Posture, shoulders|Slide arms up/down against or near<br>wall as comfortable.|
|Hip Flexor Stretch|Hip mobility|Supported lunge; gently shift<br>forward.|
|March in Place|Cardio, legs, coordination|March while moving arms at a|



FitPocket — PRD + AI Builder Master Prompt | Working document 

|||comfortable pace.|
|---|---|---|
|Step Touch + Arm Swings|Cardio, coordination|Step side to side with controlled arm<br>movement.|
|Shadow Boxing|Cardio, shoulders, core|Controlled punches with recovery<br>intervals.|
|Seated Cardio|Cardio, accessible movement|Seated punches and knee lifts.|
|Dance|Full-body cardio, enjoyment|Move to music at an appropriate<br>intensity.|
|Bodyweight Good Mornings|Hamstrings, glutes|Hinge at hips with comfortable<br>neutral back.|
|Bear Crawl|Full body, core, shoulders|Move using hands and feet/knees as<br>appropriate.|
|Squat to Press|Legs, shoulders|Squat then press light approved<br>weights overhead.|
|Plank|Core, shoulders|Hold a stable plank with appropriate<br>modification.|



### **11. Overweight Starter Guidance** 

Owner guidance: start with Chair Squats, Wall Push-ups, Glute Bridges, March in Place and Dead Bug. Suggested weekly structure: 3 strength sessions + 2 low-impact cardio sessions + regular daily movement/walking where appropriate. Progression: repetitions → duration → sets → light resistance. Treat this as owner content, not a medical prescription. 

### **12. Gym Workout Library** 

Equipment: barbell, dumbbells, machines, cable, leg press, bench, treadmill, bike, rowing machine, battle ropes, sled, foam roller and ab wheel as applicable. 

|**Level**|**Target session duration**|**Approach**|
|---|---|---|
|Beginner|35–40 min|Learn movement and equipment|
|Intermediate|45–50 min|Consistency and progressive<br>resistance|
|Expert|55–60 min|More demanding structured training|



Default strength rest: 60–90 seconds unless owner content specifies otherwise. 

### **13. Gym Weekly Schedule** 

|**Day**|**Program**|
|---|---|
|Monday|Full Body Strength A: Goblet/Barbell Squat; Dumbbell<br>Bench Press; Lat Pulldown; Romanian Deadlift; Cable<br>Woodchop/Hanging Knee Raise.|
|Tuesday|Low-Impact Cardio + Conditioning: Treadmill Incline<br>Walk; Stationary Bike; Rowing Machine.|
|Wednesday|Mobility + Core + Arms: Cable Face Pulls; Bird Dog with<br>band; Plank on bench; Dumbbell Bicep Curls; Rope<br>Tricep Pushdown.|
|Thursday|Full Body Strength B: Leg Press; Seated DB Shoulder<br>Press; Seated Cable Row; Walking Lunges with DB; Ab<br>Wheel/Cable Crunch.|
|Friday|Conditioning + Finisher: Bike intervals; Battle Ropes/Sled<br>Push; Core Circuit.|
|Saturday|Active Recovery: 30–45 min comfortable/brisk walk<br>where appropriate + 10 min stretching + optional foam<br>rolling.|
|Sunday|Rest.|



FitPocket — PRD + AI Builder Master Prompt | Working document 

### **14. Gym Prescriptions** 

|**Exercise**|**Beginner**|**Intermediate**|**Expert**|
|---|---|---|---|
|Goblet/Barbell Squat|3×10|4×12|4×10|
|Dumbbell Bench Press|3×10|4×12|4×10|
|Lat Pulldown|3×12|4×12|4×10|
|Romanian Deadlift|3×10|4×12|4×10|
|Cable Woodchop/Hanging<br>Knee Raise|2×12|3×15|3×15|
|Treadmill Incline Walk|15 min|20 min|25 min|
|Stationary Bike|10 min|15 min|20 min|
|Rowing Machine|3×3 min|3×4 min|4×4 min|
|Cable Face Pulls|3×15|3×15|4×15|
|Bird Dog with Band|3×10/side|3×12/side|3×15/side|
|Plank on Bench|3×30 sec|3×45 sec|3×60 sec|
|Dumbbell Bicep Curls|3×12|4×12|4×15|
|Rope Tricep Pushdown|3×12|4×12|4×15|
|Leg Press|3×12|4×15|4×12|
|Seated DB Shoulder Press|3×10|4×12|4×10|
|Seated Cable Row|3×12|4×12|4×10|
|Walking Lunges with DB|2×10/leg|3×12/leg|3×15/leg|
|Ab Wheel/Cable Crunch|2×12|3×15|3×15|
|Bike intervals|6 rounds 20s/40s|8 rounds 20s/40s|10 rounds 20s/40s|
|Battle Ropes/Sled Push|3×20 sec|4×20 sec|4×30 sec|
|Core Circuit|2 rounds|3 rounds|3 rounds|



### **15. Workout Assignment Engine** 

The owner supplies approved workouts/exercises. The live product selects and assigns from this content. It must not randomly invent workouts. 

Priority order: Safety eligibility → postpartum/special condition → fitness/plan type → goal → fitness level → environment → equipment → program week/day → rest schedule → recent history → variety → owner-defined progression. 

- Explicit owner schedules take precedence over generic variety. 

- Track recent categories/muscle groups to avoid unnecessary repetition. 

- Balance lower body, upper body, core, cardio, full body and mobility. 

- Rest days must not generate normal workouts. 

- Postpartum users use postpartum-approved content. 

- Underweight plans prioritize strength/recovery rather than calorie-burning language. 

- Overweight plans prioritize sustainable strength, low-impact cardio, conditioning and mobility. 

### **16. Workout Completion & Missed Workouts** 

- Beginning-of-day reminder for assigned workout. 

- End-of-day reminder if incomplete. 

- If not completed by the defined cutoff, status becomes Missed. 

- Missed workout ends the relevant streak according to configured rules. 

- No workout swapping in initial release. 

### **17. Workout Safety** 

- Do not use 'Muscle burn = Good'. 

- Use: 'Mild muscle fatigue can occur during exercise. Stop if you experience sharp, severe or unusual pain and seek appropriate guidance.' 

- Show warm-up guidance where appropriate. 

- Do not promise specific weight-loss outcomes. 

- Do not claim fat converts directly into muscle. 

- Use accurate, appropriately licensed exercise media. 

FitPocket — PRD + AI Builder Master Prompt | Working document 

### **18. Meal Plans** 

- Owner supplies complete meal plans. 

- Default structure: breakfast, snack/fruit, lunch, snack and dinner. 

- Prioritize locally available Nigerian foods and fruits. 

- Show portions. 

- Show estimated calories, protein, carbohydrates, fat and fibre where available. 

- System may generate estimates but must label them as estimates. 

- Owner supplies approved substitutions for allergies/preferences. 

- Postpartum users may receive separate owner-approved meal plans. 

### **19. Water, Meals & Fruits** 

- User sets wake/sleep times and meal/fruit times. 

- System calculates a configurable hydration target. 

- Users log water and see progress such as 1.5L / 2.5L. 

- Hydration reminders stop when the configured daily target is reached, subject to product rules. 

- Meal and fruit tasks require explicit completion. 

- Recurring reminders stop once the task is completed. 

### **20. Reminder Engine** 

Initial categories: water, workout, meals and fruit. Recurring reminders repeat every 30 minutes until completed, except during sleep hours. The system must use durable server-side scheduling logic rather than relying on a browser timer. 

At a new day, create new tasks while preserving history. Workout reminders are a beginning-of-day reminder plus an end-of-day reminder. The missed-workout rule breaks the relevant streak. 

### **21. Dashboard** 

- Personal greeting. 

- Today's workout and start CTA. 

- Today's meals and completion states. 

- Fruit task. 

- Hydration progress. 

- Current streak. 

- Points. 

- Upcoming tasks. 

- Progress snapshot. 

- Contextual motivational message. 

Example: 'Good morning! Let's make today count.' The dashboard should clearly distinguish completed, pending and missed tasks. 

### **22. Progress** 

- Monthly check-in. 

- Record weight and height. 

- Automatically calculate BMI. 

- Store history. 

- Show baseline, current and target BMI. 

- Progress bar and percentage. 

- BMI-over-time chart. 

- Weight-over-time chart. 

- Workout, meal, hydration, fruit and consistency progress. 

- Motivational milestone messages. 

Progress percentage measures movement from baseline toward target and cannot exceed 100%. For maintenance users, emphasize stability and habit consistency rather than forcing weight change. 

FitPocket — PRD + AI Builder Master Prompt | Working document 

### **23. Gamification** 

- Points for workouts, meals, hydration, fruit and monthly check-ins. 

- Streaks for consistency. 

- Badges for milestones. 

- Leagues based on activity points. 

- Never rank users by BMI, weight, appearance or body measurements. 

- Shareable achievement cards should default to non-sensitive achievements. 

### **24. Motivation Engine** 

- Contextual dashboard messages. 

- Pre/post workout encouragement. 

- Meal encouragement. 

- Progress recognition. 

- Non-shaming missed-task messaging. 

- Streak celebrations. 

- Admin-editable message library and triggers. 

- Builder and admin can edit motivational content. 

### **25. Admin / Owner CMS** 

- Owner: full access. 

- Admin: configurable permissions. 

- CRUD for exercises, workouts, programs, goals, levels, environments and media. 

- CRUD for meal plans, meals, fruits, portions, nutrition estimates and approved alternatives. 

- Manage motivational messages, badges, points and leagues. 

- Manage users and account status. 

- Targeted announcements via in-app, push and email. 

- Analytics. 

- Content lifecycle: Draft → Review → Published → Archived. Only published content is eligible for assignment. 

### **26. Analytics & Success Metrics** 

- Total/new/active users. 

- Onboarding completion. 

- Plan activation. 

- Workout completion/missed rate. 

- Meal engagement. 

- Hydration adherence. 

- Fruit adherence. 

- Streaks/badges. 

- Monthly check-ins. 

- PWA installs. 

- Notification engagement. 

- Premium conversion once launched. 

North Star: Healthy Habit Days, meaning days in which the user completes the product's configured key activities. 

### **27. Premium Architecture** 

Meal plans are the initial premium feature. Payments are not required at launch. Build centralized feature entitlements so premium content can be activated later without scattering payment logic across the UI. 

### **28. PWA, Offline & Sync** 

- Installable PWA. 

- Responsive on phone, tablet and desktop. 

- Previously loaded workouts available offline. 

- Supported activity completion works offline. 

FitPocket — PRD + AI Builder Master Prompt | Working document 

- Queue offline mutations with unique operation IDs and timestamps. 

- Sync to Supabase when connectivity returns. 

- Prevent duplicate completion events. 

- Show offline, pending-sync and synced states. 

### **29. Design System** 

Use the supplied HealthRich Fitness reference as inspiration, not as a layout to copy. Starting palette: orange approximately #E37210, near-black #0A0705, white/off-white #E7E6E5, with dark brown/orange supporting tones. 

- Athletic, premium, energetic, modern and friendly. 

- Orange for primary CTAs, progress, active states and highlights. 

- Avoid generic AI gradients. 

- Strong typography and clear hierarchy. 

- Mobile-first, fully responsive. 

- System/device theme is default. 

- Manual System / Light / Dark override. 

- Use motion only when useful and respect reduced-motion preferences. 

### **30. Navigation** 

Mobile: Home, My Plan, Progress, Achievements, Profile. Desktop can expand the same information architecture. Notifications should be easily accessible. 

### **31. Data Model** 

- User: id, name, email, phone, age/date-of-birth, gender, created_at, status. 

- User Profile: height, current weight, goals, fitness level, workout environment, target weight, dietary preferences, allergies, postpartum fields. 

- BMI Record: user_id, height, weight, BMI, classification, recorded_at. 

- Goal. 

- Exercise: name, category, instructions, muscles, levels, environments, fitness types, goals, equipment, duration, sets/reps/rest, difficulty, safety notes, media, status. 

- Workout: name, description, fitness type, goal, level, environment, category, duration, exercise relations, equipment, program week/day, special conditions, media, status. 

- Meal Plan; Meal; Meal Alternative; Fruit. 

- User Daily Plan: user_id, date, assigned workout, meals, fruit, hydration target. 

- Habit Task: user_id, type, scheduled_at, status, completed_at, recurrence state. 

- Reminder: task_id, channel, next notification, recurrence, active. 

- Streak; Points Ledger; Badge; User Badge; League; League Membership; Notification. 

- Admin Role/Permission; Feature Entitlement. 

### **32. Security, Privacy & Accessibility** 

- Supabase Row Level Security. 

- Users can access only their own private records. 

- Role-controlled admin access. 

- Never expose service-role credentials. 

- Validate server-side inputs. 

- Protect admin routes and privileged operations. 

- Account deletion and data export. 

- Minimize unnecessary sensitive data. 

- Design around NDPR and GDPR principles where applicable. 

- Keyboard navigation, screen readers, accessible contrast, large touch targets, visible focus states, reduced motion and semantic HTML. 

### **33. Loading, Empty & Error States** 

- Skeleton loaders rather than blank screens. 

FitPocket — PRD + AI Builder Master Prompt | Working document 

- Human-readable errors. 

- Useful empty states that guide the next action. 

- Offline errors explain that supported actions can sync later. 

- No raw technical error codes shown to users. 

### **34. QA Acceptance Criteria** 

- Registration, login, OTP, reset and logout work. 

- Onboarding collects required information. 

- BMI boundaries calculate correctly. 

- Plan engine assigns appropriate owner-approved content. 

- Beginner is preselected and changeable. 

- Home/Gym changes workout selection. 

- Postpartum routing requires appropriate acknowledgement. 

- Meal plan respects approved allergies/preferences. 

- Daily tasks persist and completion stops recurrence. 

- Recurring reminders follow the 30-minute rule outside sleep hours. 

- Missed workout updates streak correctly. 

- Monthly BMI records update progress. 

- Points, streaks, badges and leagues work from auditable events. 

- Admin can CRUD and publish content. 

- Offline writes sync without duplication. 

- RLS prevents cross-user access. 

- Application is responsive. 

- PWA installation and push work where supported. 

### **35. Health & Safety Guardrails** 

- Display a clear fitness/wellness disclaimer. 

- BMI is not a diagnosis. 

- No adult BMI categories for minors. 

- No guaranteed weight-loss/body-composition outcomes. 

- No literal fat-to-muscle claim. 

- Postpartum content requires user confirmation of clearance. 

- Provide exercise safety notes and appropriate professional guidance prompts. 

- Avoid shame-based body messaging. 

### **36. Seed Content** 

Seed enough realistic content to demonstrate every pathway: Underweight, Normal Weight, Overweight, Postpartum; Beginner, Intermediate, Expert; Home and Gym; all listed home categories; the gym weekly program; several Nigerian/local meal plans; fruits; approved alternatives; motivational messages; badges and league tiers. Clearly mark seed content for later replacement. 

## **PART II — AI BUILDER MASTER PROMPT** 

### **37. Master Role** 

You are the complete product delivery team for FitPocket: Senior Product Manager, UX Researcher, UX/UI Designer, Design Systems Lead, Senior Next.js Engineer, Supabase Architect, PWA Engineer, Notification Systems Engineer, Security Engineer, QA Lead and Technical Writer. Build the production-quality application described in this document. Do not replace required functionality with static mockups. 

### **38. Skills-First Workflow** 

15. Locate the supplied skills directory. 

16. Read every file in every folder and subfolder of the skills directory before coding. 

FitPocket — PRD + AI Builder Master Prompt | Working document 

17. Start with the Product Manager skill and create an implementation plan from this PRD. 

18. Apply the Emil Kowalski design skill to interaction and visual decisions. 

19. Apply the Impeccable design skill to hierarchy, spacing, typography, accessibility and polish. 

20. Apply the Taste skill to make deliberate product-quality choices and avoid generic AI interfaces. 

21. Respect this PRD and safety/security/accessibility requirements when resolving conflicts. 

22. Create an internal implementation checklist. 

23. Do not ask for clarification on requirements already specified; make sensible reversible decisions for unspecified details. 

### **39. Engineering Rules** 

- Next.js application with maintainable architecture. 

- Supabase database/auth infrastructure. 

- Custom internal OTP experience. 

- Vercel deployment target. 

- Cloudinary media layer. 

- Installable PWA with service worker and offline queue. 

- Comprehensive RLS. 

- Server-side privileged operations. 

- Typed models and validation. 

- Reusable domain services for business rules. 

- Centralized plan engine. 

- Centralized premium entitlements. 

- No secrets in client code. 

- No hard-coded owner content. 

### **40. Build Order** 

24. Inspect project and read skills. 

25. Create architecture/schema. 

26. Authentication + internal OTP. 

27. Roles/permissions. 

28. Admin CMS foundation. 

29. Exercise/workout models + seed content. 

30. Meal/fruit models + seed content. 

31. Personal Fitness Plan Engine. 

32. Onboarding. 

33. Daily plan generation. 

34. Dashboard + My Plan. 

35. Workout player. 

36. Meal/fruit tracking. 

37. Hydration tracking. 

38. Reminder/notification engine. 

39. Progress. 

40. Gamification. 

41. Leagues/sharing. 

42. PWA/offline/sync. 

43. Responsive/accessibility/theme polish. 

44. Security review. 

45. Automated/manual QA. 

46. Production readiness. 

### **41. Plan Engine Implementation** 

Implement the Personal Fitness Plan Engine as a domain service. It receives age, gender, height, weight, BMI classification, goals, target weight, fitness level, workout environment, dietary preferences, allergies, postpartum state, schedule and current program context. Filter ineligible content first, then use the priority order in this PRD. Produce explainable assignments. Owner-created schedules take precedence over generic randomization. FitPocket — PRD + AI Builder Master Prompt | Working document 

### **42. CMS Implementation** 

Admin forms must support create, edit, preview, publish, archive, validation, search, filtering and pagination where appropriate. New owner content must not require code changes. Only published content enters the plan engine. 

### **43. Media Implementation** 

Where owner media is absent, use appropriately licensed stock or animated exercise media during development. Store media references, not large binaries in the database. Make owner replacement possible without code changes. Do not use misleading or unsafe demonstrations. 

### **44. Notification Implementation** 

Use durable server-side scheduling, not browser-only timers. Each task has completion state, schedule, recurrence and sleep-window policy. Completed tasks stop recurring. Sleep hours suppress notifications. Use idempotent jobs so retries cannot duplicate notifications. Log delivery attempts and completion events. 

### **45. Offline Implementation** 

Use appropriate client-side persistence. Give each offline mutation a unique operation ID and timestamp. Sync idempotently on reconnection. Resolve duplicates deterministically. Clearly show offline/pending/synced states. 

### **46. UX/UI Implementation** 

- Translate the supplied brand reference into a modern fitness product rather than copying the flyer. 

- Mobile-first and fully responsive. 

- Use strong hierarchy and varied, purposeful content patterns. 

- Make workout cards actionable. 

- Make progress motivating without body shaming. 

- Use orange strategically. 

- Avoid generic AI gradients and repetitive SaaS-card layouts. 

- Respect device theme by default and manual override. 

- Respect reduced-motion. 

### **47. Copy Rules** 

Use motivational, warm, concise and human language. The product should feel like a supportive coach/friend, never a drill sergeant. Avoid shame, fear and appearance-based judgment. Example copy: 'Let's make today count.' 'Another win in the books.' 'Yesterday didn't go as planned. Today is another chance.' 'Your consistency is building.' 

### **48. Security & Health Rules** 

- Use RLS and role checks everywhere required. 

- Protect admin/server operations. 

- Never expose service-role keys. 

- Validate all user input server-side. 

- Do not diagnose medical conditions. 

- Do not use adult BMI categories for minors. 

- Do not promise outcomes. 

- Use postpartum clearance acknowledgement. 

- Use safer pain guidance. 

- Maintain consent/audit records where relevant. 

### **49. Testing Strategy** 

Create unit, integration and end-to-end tests for BMI boundaries, plan filters, goal overrides, postpartum routing, dailyplan generation, reminders, sleep suppression, completion, streaks, progress, points, badges, leagues, RLS, authentication and offline sync. Test duplicate sync, expired OTP, notification permission denial, no matching content, changed height/weight and deleted accounts. Run lint, type checks, tests and production build. 

FitPocket — PRD + AI Builder Master Prompt | Working document 

### **50. Final QA Checklist** 

- No required feature is a static mockup. 

- No placeholder UI where real functionality is required. 

- No dead links/routes. 

- No fake analytics represented as real. 

- No hard-coded user data. 

- No exposed secrets. 

- No cross-user data leakage. 

- Admin routes protected. 

- No reminders during sleep hours. 

- Completed tasks stop notifying. 

- Offline operations do not duplicate. 

- No adult BMI classification for ineligible ages. 

- No unsafe/shame-based copy. 

- Owner content editable through CMS. 

- Loading, empty, error and success states exist. 

- Mobile/tablet/desktop work. 

- PWA manifest/service worker work. 

- Production build succeeds. 

### **51. Final Delivery** 

47. Build in coherent phases. 

48. Test and fix each phase before continuing. 

49. Keep a short implementation log. 

50. Walk through the product as a real user and as an admin. 

51. Verify every fitness type, level and workout environment. 

52. Verify reminders, progress, gamification and offline sync. 

53. Verify RLS/security/privacy. 

54. Provide setup, run and deployment documentation. 

## **APPENDIX — NON-NEGOTIABLE RULES** 

- Fitness types: Underweight, Normal Weight, Overweight, Postpartum. 

- Fitness levels: Beginner, Intermediate, Expert. 

- Workout types: Home and Gym. 

- Postpartum is a special plan pathway, not a BMI category. 

- Adult BMI uses height and weight; age and gender personalize the plan. 

- WHO adult BMI categories are used. 

- Target BMI comes from the healthy range and can be overridden where appropriate. 

- Users can override goal recommendations. 

- Meal plans use local/Nigerian foods and fruits. 

- Meal alternatives are owner-approved. 

- Recurring reminders repeat every 30 minutes until completion, except during sleep hours. 

- Missed workouts can end the relevant streak. 

- Progress includes body metrics plus habits and consistency. 

- Leagues use activity points, never body measurements. 

- System/device theme is default. 

- PWA supports offline use and synchronization. 

- Admin manages content without code. 

- Premium architecture exists even though payments are not required at launch. 

- Owner-approved content is the source of truth for live workouts and meals. 

FitPocket — PRD + AI Builder Master Prompt | Working document 

