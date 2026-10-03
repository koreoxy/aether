# Feature Issue: Daily Workout Challenge & Streak

## 1. Overview

Build a responsive web application where users complete a daily workout challenge to maintain a continuous streak.

The core product loop is:

1. User opens the app.
2. The app shows today's workout challenge.
3. User completes the required workout.
4. User marks the challenge as completed.
5. The system records the completion for the user's local calendar day.
6. The user's streak increases when the required daily challenge is completed on consecutive days.
7. Missing a required day breaks the active streak.
8. The user can view current streak, longest streak, completion history, and progress.

The implementation must be understandable and maintainable by both:
- experienced/senior developers;
- junior developers;
- lower-cost AI coding agents.

Avoid unnecessary architectural complexity. Prefer clear, conventional Next.js patterns and strongly typed TypeScript.

---

## 2. Primary Goals

- Daily workout challenge system.
- Reliable streak calculation.
- User accounts and persistent progress.
- Workout challenge history.
- Responsive UI for desktop, tablet, and mobile.
- UI must follow `DESIGN.md` as the design source of truth.
- Modern, production-oriented Next.js architecture.
- Type-safe database access.
- Good accessibility and loading/error/empty states.
- Clear separation between UI, business rules, and database operations.
- Easy for another developer or AI agent to continue the project.

## 3. Non-Goals for MVP

Do NOT implement these unless explicitly requested later:

- Social feed.
- Following/followers.
- Chat or messaging.
- Complex workout-plan marketplace.
- AI-generated workout plans.
- Wearable/device integrations.
- Payment/subscriptions.
- Nutrition/calorie tracking.
- Real-time multiplayer challenges.
- Native mobile apps.

These can be future issues.

---

# 4. Technology Stack

Use the latest stable production versions available when implementation begins.

### Required

- Next.js — current stable release.
- React — version compatible with the selected Next.js release.
- TypeScript — latest stable version compatible with the stack.
- Tailwind CSS — current stable release.
- Prisma ORM — current stable production release.
- Neon PostgreSQL — hosted PostgreSQL database.
- Node.js — current LTS version compatible with the selected stack.

### Important Prisma version note

At the time this issue was written, Prisma 8 was the current release candidate while Prisma 7 remained the supported production line. Do not blindly install a release candidate for production.

Before implementation:

1. Check the current Prisma release status.
2. Prefer the latest stable Prisma release.
3. Only use Prisma 8 if it has reached stable release by implementation time.
4. Lock the selected major/minor versions in `package.json`.

### Suggested supporting tools

These are allowed but should only be added when they solve a real problem:

- ESLint
- Prettier
- Vitest or Jest for unit tests
- Playwright for end-to-end tests
- Zod for runtime validation
- Lucide React for icons
- shadcn/ui only if compatible with and useful for the visual system in `DESIGN.md`

Do not add libraries merely because they are popular.

---

# 5. Design Requirements

## 5.1 Source of truth

`DESIGN.md` is the authoritative design specification.

The implementer MUST read `DESIGN.md` before creating the UI.

Do not replace the design with a generic dashboard template.

Extract and follow from `DESIGN.md`:

- color palette;
- typography;
- font sizes;
- font weights;
- spacing;
- border radius;
- shadows;
- borders;
- cards;
- buttons;
- navigation;
- icon style;
- illustrations/images;
- page composition;
- interaction patterns;
- desktop layout;
- mobile layout;
- visual hierarchy;
- animations/transitions.

If a component is not explicitly described, create the smallest component consistent with the design system.

### Important

If `DESIGN.md` is missing from the repository, stop the visual implementation phase and ask for the file rather than inventing a completely different visual style.

---

# 6. Responsive Requirements

The application must be fully responsive.

Required targets:

- Mobile: approximately 320px–767px.
- Tablet: approximately 768px–1023px.
- Desktop: 1024px and above.

At minimum test:

- 320px width.
- 375px width.
- 390px width.
- 768px width.
- 1024px width.
- 1280px width.
- 1440px width.

Mobile must not simply be a squeezed desktop layout.

The implementation should define intentional mobile behavior for:

- navigation;
- streak display;
- workout cards;
- exercise lists;
- completion controls;
- history/calendar;
- modals/dialogs;
- forms.

Avoid horizontal scrolling unless explicitly required by the design.

---

# 7. Core Product Requirements

## 7.1 Authentication

Users need an account so their streak belongs to them.

Authentication implementation may use a separate auth provider/library, but it must integrate cleanly with Next.js and Prisma.

Required concepts:

- User identity.
- User profile.
- Authenticated sessions.
- Protected application routes.
- Sign in.
- Sign out.
- Optional sign up depending on chosen auth solution.

Do not implement custom password hashing/session handling from scratch unless there is a strong reason.

---

# 8. Daily Challenge

Each calendar day has a workout challenge.

A challenge should contain enough information to render and complete it.

Suggested fields:

- title;
- description;
- difficulty;
- estimated duration;
- exercises;
- exercise order;
- target sets/repetitions/duration;
- rest duration if applicable;
- active date;
- optional image/media;
- completion requirements.

Example:

```text
Daily Challenge
---------------
Title: Full Body Starter

Duration: 20 minutes

Exercises:
1. Push Up       3 x 10
2. Bodyweight Squat 3 x 15
3. Plank         3 x 30 sec
4. Mountain Climber 3 x 20
```

The workout content should be data-driven rather than hardcoded directly into page components.

---

# 9. Challenge Completion

A user must be able to complete today's challenge.

Recommended flow:

1. Open today's challenge.
2. Review workout.
3. Start workout.
4. Complete exercises.
5. Confirm completion.
6. Server validates that the user can complete the challenge.
7. Completion record is saved.
8. Streak is recalculated/updated.
9. UI displays success state.
10. Dashboard reflects the new streak immediately.

Important:

The client must NOT be the authority for streak calculation.

The server/database must determine whether the challenge is completed and what the resulting streak is.

---

# 10. Streak Rules

Define the rules explicitly before implementation.

### Base rule

A user maintains an active streak by completing the required daily challenge on consecutive calendar days.

Example:

```text
Monday    completed -> streak 1
Tuesday   completed -> streak 2
Wednesday completed -> streak 3
Thursday  completed -> streak 4
```

If Thursday is missed:

```text
Monday    completed
Tuesday   completed
Wednesday completed
Thursday  missed
Friday    completed -> new streak 1
```

### Same-day duplicate completion

A user must not be able to increase their streak multiple times by completing the same daily challenge repeatedly.

Completion for the same user and challenge date must be idempotent.

### Time zone

Do not calculate a user's day purely from the server's UTC date.

The application must define a timezone strategy.

Recommended MVP:

- store the user's IANA timezone, e.g. `Asia/Jakarta`;
- calculate the user's current challenge date using that timezone;
- store timestamps in UTC;
- derive the user's calendar day using their timezone.

The timezone must be handled consistently on:

- today's challenge;
- completion;
- streak calculation;
- history;
- statistics.

---

# 11. Streak Data Model

Prefer storing completion history as the source of truth.

Do not rely only on a mutable `currentStreak` field.

The system should be able to reconstruct a user's streak from historical completion records.

Optional cached fields such as `currentStreak` and `longestStreak` may be used for performance, but they must never become the only source of truth.

---

# 12. Suggested Database Model

The exact Prisma schema can be refined during implementation, but the domain should approximately contain:

## User

```text
User
- id
- email
- name
- image
- timezone
- createdAt
- updatedAt
```

## DailyChallenge

```text
DailyChallenge
- id
- date
- title
- description
- difficulty
- estimatedDuration
- createdAt
- updatedAt
```

Constraint:

```text
UNIQUE(date)
```

if the MVP has exactly one global challenge per day.

## Exercise

```text
Exercise
- id
- name
- description
- instructions
- mediaUrl
- createdAt
- updatedAt
```

## ChallengeExercise

```text
ChallengeExercise
- id
- challengeId
- exerciseId
- order
- sets
- repetitions
- durationSeconds
- restSeconds
```

This keeps the challenge content flexible.

## WorkoutCompletion

```text
WorkoutCompletion
- id
- userId
- challengeId
- challengeDate
- completedAt
```

Recommended constraint:

```text
UNIQUE(userId, challengeId)
```

or another constraint that guarantees one completion per user per daily challenge.

## Optional UserStats

```text
UserStats
- userId
- currentStreak
- longestStreak
- totalCompletedDays
- updatedAt
```

This is optional and should be treated as a cached projection of completion history.

---

# 13. Database Indexing

Add indexes based on actual query patterns.

At minimum consider:

```text
WorkoutCompletion(userId, challengeDate)
WorkoutCompletion(userId, completedAt)
DailyChallenge(date)
ChallengeExercise(challengeId, order)
```

Do not create excessive indexes without a query-driven reason.

---

# 14. Application Pages

The exact routes may be adjusted by the implementer, but the MVP should contain approximately:

## Public

### `/`

Landing page.

Purpose:

- explain the challenge concept;
- show the streak concept;
- CTA to start;
- follow `DESIGN.md`.

### `/login`

Authentication page.

### `/register`

Registration page if required by the selected auth solution.

---

## Authenticated

### `/dashboard`

Main user dashboard.

Show:

- today's challenge;
- current streak;
- longest streak;
- today's completion state;
- progress/history preview;
- CTA to start today's workout.

### `/challenge/[date]`

Daily challenge detail page.

Show:

- challenge title;
- duration;
- difficulty;
- exercise list;
- sets/reps/time;
- start/complete interaction;
- completion state.

### `/history`

Show:

- calendar/history;
- completed days;
- missed days;
- current streak;
- longest streak;
- total completed challenges.

### `/profile`

Show:

- name;
- email;
- timezone;
- preferences;
- account actions.

---

# 15. Dashboard UX

The dashboard should immediately answer:

1. What is today's workout?
2. Have I completed it?
3. What is my current streak?
4. What do I need to do next?

Avoid making the user navigate through multiple pages just to start today's challenge.

---

# 16. Workout Completion UX

The completion interaction should be obvious.

States:

### Not started

```text
Today's Challenge
[Start Workout]
```

### In progress

```text
Workout in progress
Exercise 2 of 5
[Next]
```

### Ready to complete

```text
Workout finished
[Complete Challenge]
```

### Completed

```text
Challenge Complete ✓
Streak: 12 days
```

The final completion request should be sent to the server.

---

# 17. API / Server Architecture

Use server-side business logic.

Prefer:

- Server Components for data-heavy read-only pages.
- Server Actions or route handlers for mutations, according to current Next.js best practices.
- Prisma only in server-side code.
- Shared domain/service functions for streak calculations.
- Strong TypeScript types.

Do not expose database credentials to the client.

Do not instantiate Prisma repeatedly in a way that creates unnecessary database connections during development.

Create a centralized server-side database client.

---

# 18. Business Logic Separation

Streak calculation must be isolated from UI components.

Suggested structure:

```text
src/
  app/
  components/
  features/
    challenge/
    streak/
    history/
    profile/
  lib/
    auth/
    db/
    validation/
    dates/
  server/
    challenge/
    completion/
    streak/
```

Exact structure can be changed if the chosen Next.js architecture benefits from another organization.

The important rule is:

> UI components should not contain the core streak algorithm.

---

# 19. Streak Algorithm Requirements

Create a pure, testable function.

Example conceptual input:

```ts
calculateStreak({
  completionDates,
  today,
  timezone,
})
```

Expected responsibilities:

- normalize dates to calendar days;
- remove duplicates;
- sort dates;
- identify today's completion;
- count consecutive completed days;
- determine longest historical streak;
- handle missing days;
- handle the first-ever completion;
- handle future-dated records safely.

The algorithm must be timezone-aware.

Do not use simple millisecond differences such as:

```ts
dateA - dateB === 86400000
```

as the only date comparison strategy because daylight-saving/timezone boundaries can invalidate assumptions.

Use calendar-day logic.

---

# 20. Idempotency & Race Conditions

The completion endpoint must be safe when the user clicks multiple times or when duplicate requests arrive.

Required:

- unique database constraint for one completion per user/day/challenge;
- server-side validation;
- transaction where appropriate;
- graceful handling of duplicate completion attempts;
- no double increment of streak.

The UI may disable the completion button while submitting, but that is not sufficient protection by itself.

---

# 21. Validation

Validate all user-controlled input on the server.

Use a schema validation library such as Zod if helpful.

Examples:

- challenge ID;
- date;
- profile name;
- timezone;
- exercise completion payload.

Never trust hidden form fields or client-calculated streak values.

---

# 22. Error Handling

Implement predictable error states.

Required:

- database failure;
- authentication failure;
- unauthorized access;
- challenge not found;
- invalid challenge date;
- already completed;
- network/request failure;
- generic unexpected error.

User-facing errors should be understandable and not expose stack traces or sensitive database details.

---

# 23. Loading States

Every important async UI should have a loading state.

Examples:

- dashboard loading;
- challenge loading;
- history loading;
- completion submitting;
- profile saving.

Use current Next.js loading patterns where appropriate.

Avoid layout shifts when loading.

---

# 24. Empty States

Implement useful empty states.

Examples:

### No workout history

```text
No completed challenges yet.
Complete today's challenge to start your streak.
```

### No current challenge

This should ideally never happen in production, but the UI must still handle it gracefully.

---

# 25. Accessibility

Required:

- semantic HTML;
- keyboard navigation;
- visible focus states;
- accessible button labels;
- sufficient color contrast;
- form labels;
- accessible dialogs;
- reduced-motion consideration;
- screen-reader-friendly status messages.

Do not use color alone to communicate completion/missed states.

---

# 26. Performance

Use current Next.js performance patterns.

Requirements:

- minimize unnecessary client components;
- fetch server-side when interactivity is not required;
- avoid large client-side bundles;
- optimize images;
- lazy-load non-critical media;
- avoid unnecessary database queries;
- avoid N+1 query patterns;
- use indexes for common queries;
- use caching/revalidation only where correctness allows it.

Streak/completion data must never be stale in a way that causes incorrect user state.

---

# 27. Security

Minimum requirements:

- authentication on protected routes;
- authorization checks on every mutation;
- server-side validation;
- environment variables for secrets;
- no database credentials in client bundles;
- no trusting client-provided user IDs;
- user can only read/write their own private progress;
- protection against duplicate completion requests;
- safe error messages.

The authenticated user identity must come from the server-side session/auth layer, not from a client-provided `userId`.

---

# 28. Testing Strategy

## Unit tests

Prioritize pure business logic.

At minimum test:

- first completion;
- consecutive completions;
- one missed day;
- multiple missed days;
- duplicate completion;
- historical longest streak;
- current streak;
- no completion today;
- future completion records;
- timezone boundary cases.

## Integration tests

Test:

- create challenge;
- fetch today's challenge;
- complete challenge;
- duplicate completion;
- retrieve history;
- authorization.

## End-to-end tests

Critical flow:

```text
Register/Login
    ↓
Open Dashboard
    ↓
Open Today's Challenge
    ↓
Complete Workout
    ↓
Confirm Completion
    ↓
Dashboard shows updated streak
```

Also test the same-day duplicate-completion scenario.

---

# 29. Seed Data

Create development seed data.

Include:

- several exercises;
- at least 7 daily challenges;
- realistic exercise sets/reps/durations;
- sample completion history for a test user if useful.

The seed should make it easy for developers and AI agents to test streak behavior.

Do not put production user credentials in seed files.

---

# 30. Environment Variables

Create a documented `.env.example`.

Expected categories:

```env
DATABASE_URL=
DIRECT_URL=
AUTH_SECRET=
AUTH_PROVIDER_CLIENT_ID=
AUTH_PROVIDER_CLIENT_SECRET=
```

Only include variables actually required by the selected auth solution and deployment architecture.

Never commit real secrets.

---

# 31. Neon PostgreSQL

Use Neon as the PostgreSQL provider.

Implementation should account for Neon/serverless connection behavior.

Use the current recommended Prisma + Neon integration documented by the relevant versions.

Database setup should be documented so a junior developer can reproduce it:

1. Create Neon project.
2. Create development database.
3. Configure connection strings.
4. Configure environment variables.
5. Run Prisma migrations.
6. Seed development data.
7. Verify connection.
8. Deploy migration changes safely.

Production and development databases must not be mixed.

---

# 32. Migration Strategy

Database schema changes must use migrations.

Rules:

- Never manually edit production database structure without a migration plan.
- Commit migration files.
- Review destructive migrations carefully.
- Avoid resetting production databases.
- Keep schema changes small and understandable.
- Document breaking migrations.

---

# 33. Project Structure

A reasonable starting structure:

```text
.
├── app/
│   ├── (public)/
│   ├── (auth)/
│   ├── (dashboard)/
│   ├── api/
│   └── ...
├── components/
│   ├── ui/
│   ├── layout/
│   └── workout/
├── features/
│   ├── challenge/
│   ├── streak/
│   ├── history/
│   └── profile/
├── lib/
│   ├── db/
│   ├── auth/
│   ├── dates/
│   └── validation/
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── public/
├── tests/
├── DESIGN.md
├── README.md
├── AGENTS.md
├── .env.example
└── package.json
```

Do not force this exact structure if the current Next.js conventions or selected libraries make a simpler structure more appropriate.

---

# 34. Documentation for AI / Junior Developers

The repository should contain:

## `README.md`

Explain:

- what the project does;
- requirements;
- installation;
- environment variables;
- database setup;
- migration commands;
- seed commands;
- development commands;
- testing;
- production build;
- deployment.

## `AGENTS.md`

Explain:

- architecture;
- important business rules;
- coding conventions;
- database rules;
- how streak calculation works;
- what files should not be modified casually;
- how to run tests;
- how to verify changes.

This file is especially important because the project is intended to be implementable and maintainable by lower-cost AI coding agents.

---

# 35. Implementation Phases

Implementation should be divided into small milestones.

## Phase 0 — Requirements & Design Audit

Tasks:

- [ ] Read `DESIGN.md`.
- [ ] Identify all pages/screens.
- [ ] Extract design tokens.
- [ ] Identify responsive behavior.
- [ ] Define MVP scope.
- [ ] Define streak rules.
- [ ] Define timezone behavior.
- [ ] Confirm authentication approach.
- [ ] Confirm current stable versions of all required technologies.

Deliverable:

A short technical/design specification before coding.

---

## Phase 1 — Project Bootstrap

Tasks:

- [ ] Create Next.js project.
- [ ] Configure TypeScript.
- [ ] Configure Tailwind CSS.
- [ ] Configure linting/formatting.
- [ ] Add Prisma.
- [ ] Configure Neon PostgreSQL.
- [ ] Configure environment variables.
- [ ] Create initial repository structure.
- [ ] Add README.
- [ ] Add AGENTS.md.
- [ ] Verify clean development build.

Acceptance:

```text
npm/pnpm/bun install
development server starts
production build succeeds
database connection succeeds
```

---

## Phase 2 — Database & Domain Model

Tasks:

- [ ] Design Prisma schema.
- [ ] Create User model.
- [ ] Create DailyChallenge model.
- [ ] Create Exercise model.
- [ ] Create ChallengeExercise relation.
- [ ] Create WorkoutCompletion model.
- [ ] Add indexes/constraints.
- [ ] Create initial migration.
- [ ] Create seed script.
- [ ] Test migration against Neon development database.

Acceptance:

- migrations run successfully;
- seed succeeds;
- duplicate completion is prevented at database level.

---

## Phase 3 — Authentication

Tasks:

- [ ] Select authentication solution.
- [ ] Configure provider.
- [ ] Implement login.
- [ ] Implement registration if required.
- [ ] Implement logout.
- [ ] Protect authenticated routes.
- [ ] Connect authenticated identity to Prisma User.
- [ ] Store timezone.

Acceptance:

- unauthenticated user cannot access private dashboard;
- authenticated user can access own data;
- users cannot access another user's completion history.

---

## Phase 4 — Challenge Domain

Tasks:

- [ ] Create challenge service.
- [ ] Fetch today's challenge.
- [ ] Fetch challenge by date.
- [ ] Fetch exercises.
- [ ] Create completion service.
- [ ] Validate completion.
- [ ] Make completion idempotent.
- [ ] Add server-side authorization.

Acceptance:

A user can reliably fetch and complete today's challenge.

---

## Phase 5 — Streak Engine

Tasks:

- [ ] Implement date normalization.
- [ ] Implement current streak calculation.
- [ ] Implement longest streak calculation.
- [ ] Implement missed-day behavior.
- [ ] Handle duplicate dates.
- [ ] Handle timezone.
- [ ] Add unit tests for edge cases.

Acceptance:

All streak unit tests pass.

This phase should be treated as a high-priority domain feature because an incorrect streak undermines the main purpose of the application.

---

## Phase 6 — UI Foundation

Tasks:

- [ ] Implement design tokens from `DESIGN.md`.
- [ ] Implement typography.
- [ ] Implement buttons.
- [ ] Implement cards.
- [ ] Implement badges.
- [ ] Implement navigation.
- [ ] Implement responsive layout primitives.
- [ ] Implement loading/error states.

Acceptance:

Reusable UI components visually match `DESIGN.md`.

---

## Phase 7 — Dashboard

Tasks:

- [ ] Today's challenge card.
- [ ] Current streak.
- [ ] Longest streak.
- [ ] Completion state.
- [ ] Start workout CTA.
- [ ] History preview.
- [ ] Mobile dashboard.
- [ ] Desktop dashboard.

Acceptance:

The user can understand today's status without unnecessary navigation.

---

## Phase 8 — Workout Experience

Tasks:

- [ ] Challenge detail page.
- [ ] Exercise list.
- [ ] Progress through exercises.
- [ ] Completion flow.
- [ ] Submission state.
- [ ] Success state.
- [ ] Error recovery.
- [ ] Mobile-first interaction.

Acceptance:

A user can complete a daily challenge comfortably on a phone.

---

## Phase 9 — History & Profile

Tasks:

- [ ] Completion calendar/history.
- [ ] Longest streak display.
- [ ] Total completed days.
- [ ] Profile settings.
- [ ] Timezone setting.
- [ ] Responsive layouts.

Acceptance:

Historical completion data matches the database.

---

## Phase 10 — Testing & Hardening

Tasks:

- [ ] Unit tests.
- [ ] Integration tests.
- [ ] E2E tests.
- [ ] Accessibility audit.
- [ ] Responsive testing.
- [ ] Authentication testing.
- [ ] Authorization testing.
- [ ] Duplicate-request testing.
- [ ] Error-state testing.
- [ ] Production build.
- [ ] Database migration verification.

---

## Phase 11 — Deployment

Tasks:

- [ ] Create production Neon database.
- [ ] Configure production environment variables.
- [ ] Configure deployment platform.
- [ ] Run production migrations.
- [ ] Seed only safe production data if necessary.
- [ ] Verify authentication.
- [ ] Verify challenge loading.
- [ ] Verify completion.
- [ ] Verify streak calculation.
- [ ] Verify mobile UI.
- [ ] Configure monitoring/logging.

---

# 36. Definition of Done

The issue is complete when:

### Product

- [ ] User can authenticate.
- [ ] User can see today's workout.
- [ ] User can complete today's workout.
- [ ] Completion is persisted.
- [ ] User cannot duplicate completion.
- [ ] Streak increases correctly.
- [ ] Missing a day correctly breaks the active streak.
- [ ] Longest streak is calculated correctly.
- [ ] History is available.
- [ ] User timezone is respected.

### UI

- [ ] UI follows `DESIGN.md`.
- [ ] Desktop responsive layout works.
- [ ] Mobile responsive layout works.
- [ ] Loading states exist.
- [ ] Error states exist.
- [ ] Empty states exist.
- [ ] Keyboard navigation works.
- [ ] Basic accessibility requirements are met.

### Engineering

- [ ] TypeScript has no avoidable `any`.
- [ ] Prisma queries are server-side.
- [ ] Authentication and authorization are enforced server-side.
- [ ] Secrets are not committed.
- [ ] Database constraints prevent duplicate completion.
- [ ] Streak logic is independently unit tested.
- [ ] Critical flows have integration/E2E coverage.
- [ ] Production build succeeds.
- [ ] README is complete.
- [ ] AGENTS.md is complete.

---

# 37. Recommended Task Breakdown for Junior Developer / AI Agent

Do not give the entire project to a junior developer or low-cost AI model in one prompt.

Break work into isolated tasks.

Recommended order:

```text
1. Bootstrap project
2. Configure Tailwind/design system
3. Configure Prisma + Neon
4. Implement database schema
5. Implement seed data
6. Implement authentication
7. Implement challenge queries
8. Implement completion mutation
9. Implement streak engine
10. Write streak tests
11. Build shared UI components
12. Build dashboard
13. Build challenge page
14. Build completion flow
15. Build history
16. Build profile
17. Responsive refinement
18. Accessibility
19. E2E tests
20. Production hardening
```

Each task should have:

- clear input;
- expected output;
- files allowed to change;
- acceptance criteria;
- tests to run.

This prevents an AI coding agent from changing unrelated parts of the project.

---

# 38. Recommended Senior Developer Responsibilities

A senior developer should own the decisions that are expensive to get wrong:

- architecture;
- authentication strategy;
- database schema;
- timezone model;
- streak algorithm;
- security;
- deployment;
- migration strategy;
- performance;
- final code review.

The senior developer should review AI/junior output especially around:

- auth;
- database mutations;
- authorization;
- date/time handling;
- streak calculations;
- migrations;
- client/server boundaries.

---

# 39. Recommended Junior / AI Responsibilities

A junior developer or lower-cost AI model can safely handle isolated implementation tasks such as:

- UI components;
- forms;
- page layouts;
- Tailwind styling;
- loading states;
- empty states;
- basic CRUD screens;
- seed data;
- unit tests from predefined cases;
- documentation;
- simple refactoring.

For domain-critical code, provide the algorithm/specification first and require tests before integration.

---

# 40. Git / PR Strategy

Use small, focused commits.

Example:

```text
feat: bootstrap next app
feat: add prisma schema
feat: add workout seed data
feat: add authentication
feat: add daily challenge service
feat: add completion flow
feat: add streak engine
test: add streak edge cases
feat: add dashboard
feat: add workout experience
feat: add history page
fix: handle timezone boundary
```

Avoid giant commits such as:

```text
feat: build entire application
```

Every PR should include:

- summary;
- screenshots for UI changes;
- tests run;
- database migration notes if applicable;
- known limitations.

---

# 41. Final Implementation Principle

The application should be simple enough that another developer can understand the core flow by reading a small number of files:

```text
Today's Challenge
      ↓
Completion
      ↓
Completion History
      ↓
Streak Engine
      ↓
Dashboard
```

The most important rule is:

> Completion history is the source of truth. The streak is derived from reliable completion records and calendar-day rules.

The second most important rule is:

> The server is authoritative for authentication, authorization, completion, dates, and streak calculations.

The third:

> `DESIGN.md` is the visual source of truth. Do not invent a replacement design system when implementing the UI.
