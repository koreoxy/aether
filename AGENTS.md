# AGENTS.md // Architecture & Developer Guidance for AI & Junior Engineers

This guide outlines core system boundaries, domain invariants, and code conventions for **AETHER Workout & Streak**. Follow these rules whenever modifying or extending the project.

---

## 1. Golden Principles

1. **Completion History Is The Source of Truth**:
   - The user's active streak and historical records are always derived from `WorkoutCompletion` records (`userId`, `challengeDate`).
   - The `UserStats` table is merely a performance cache projection. Never treat mutable streak numbers as the single source of truth.

2. **The Server Is Authoritative**:
   - The client never dictates whether a challenge is completed or what the streak count should be.
   - User identity is always retrieved from server-side verified HTTP-only session cookies (`getCurrentUser()` / `requireAuthUser()`), never from client payloads or hidden form inputs.

3. **Design System Integrity (`DESIGN.md`)**:
   - Visual styling must follow `DESIGN.md` (Aether - The New Frontier).
   - Anchor palette: Background `#050505`, Surface `#0D0D0E`, Borders `#27272A`, Text `#FFFFFF`, Secondary Text `#A1A1AA`.
   - Typography: `Inter` for headings and body; `JetBrains Mono` for technical micro-labels and badges.
   - Radius: `8px` for cards and controls; `9999px` for pill badges.
   - Do not replace this techno-minimalist aesthetic with standard generic SaaS themes.

---

## 2. Directory Architecture

```text
src/
├── app/                  # Next.js App Router (Server Components & Pages)
│   ├── (public)          # Landing page (/)
│   ├── login/ & register/# Authentication routes
│   ├── dashboard/        # Mission Control dashboard
│   ├── challenge/[date]/ # Challenge detail & workout session
│   ├── history/          # Calendar matrix & completion log
│   └── profile/          # Athlete profile & timezone settings
├── components/           # Reusable UI primitives
│   ├── ui/               # Button, Card, Badge, EmptyState, LoadingSpinner
│   └── layout/           # Responsive Navbar with live streak counter
├── features/             # Domain UI feature components
│   ├── challenge/        # WorkoutSession.tsx (stepper, timers, completion trigger)
│   ├── history/          # HistoryView.tsx (monthly calendar matrix)
│   └── profile/          # ProfileForm.tsx
├── lib/
│   ├── auth/             # Session management & JWT cookie handling
│   ├── dates/            # Pure timezone & calendar day utilities
│   ├── db/               # Prisma singleton & unified repository
│   ├── streak/           # Pure streak calculation engine
│   └── validation/       # Zod schemas
├── server/
│   └── actions.ts        # Server Actions (form handling & DB mutations)
└── tests/
    ├── streak.test.ts    # Unit tests for pure streak engine
    └── integration.test.ts # Integration tests for DB repository & idempotency
```

---

## 3. Streak Calculation Engine Rules (`src/lib/streak/engine.ts`)

The streak function signature:
```ts
calculateStreak({
  completionDates: (string | Date)[],
  today?: string,
  timezone?: string
}): StreakCalculationResult
```

### Invariants:
1. **Calendar-Day Logic**:
   - Never use raw millisecond differences (`dateA - dateB === 86400000`). Daylight Saving Time (DST) or leap seconds break millisecond math.
   - Always compare discrete calendar days formatted as `YYYY-MM-DD` in the user's timezone.
2. **Consecutive Days**:
   - Streak increments only when consecutive calendar days are completed ($D$, $D-1$, $D-2$, ...).
   - If yesterday ($D-1$) is completed, but today ($D$) has not yet been completed, the streak remains intact (pending today's completion).
   - If yesterday was missed, the active streak resets to $0$ until today is completed ($streak = 1$).
3. **Idempotency**:
   - Completing the same challenge date multiple times in one day must NOT increment the streak more than once.
4. **Future-Date Protection**:
   - Dates beyond today's calendar date are excluded from the current active streak calculation.

---

## 4. Protected Files (Do Not Modify Casually)

| File | Rationale |
| :--- | :--- |
| `src/lib/streak/engine.ts` | Core mathematical algorithm. Any regression breaks streak reliability. Must pass all 12 tests. |
| `src/lib/dates/timezone.ts`| Date normalization & timezone boundaries. |
| `prisma/schema.prisma`     | Enforces `UNIQUE(userId, challengeDate)` and cascade relations. Changes require migration scripts. |
| `src/lib/auth/session.ts`  | Security perimeter. Handles encrypted HTTP-only session cookies. |

---

## 5. Verification & Testing

Always verify changes with the test suite and production build:

```bash
# 1. Run all unit and integration tests
npm test

# 2. Run full Next.js production build and type-checking
npm run build
```

Expected output:
- `17 passed (17)` in Vitest.
- `Compiled successfully` with `Finished TypeScript in ...` and `0 errors`.
