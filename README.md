# AETHER ™ // Daily Workout Challenge & Streak Protocol

A high-craft, production-grade Next.js web application engineered around daily workout discipline, continuous streak momentum, and timezone-accurate server verification.

Built to comply with `issue.md` and visually anchored in the **Aether - The New Frontier** dark luxury techno design specification (`DESIGN.md`).

---

## 1. Overview & Core Product Loop

1. **Open the App**: The athlete accesses today's daily challenge derived from their local calendar day (`YYYY-MM-DD`).
2. **Review & Execute**: The user follows the step-by-step workout sequence with rest/exercise timers and set logs.
3. **Verify & Complete**: The client submits completion to the server action.
4. **Server Authority**: The server validates authentication, prevents duplicate completions idempotently, and calculates the streak.
5. **Streak Engine**: The active streak increments on consecutive calendar days. Missing a calendar day breaks the streak. Longest historical records are permanently preserved.
6. **Audit & History**: Full audit trail with an interactive monthly calendar matrix, completion log, and profile configuration.

---

## 2. Technology Stack & Versions

- **Next.js**: 16.3.8 (App Router, Server Actions, Turbopack)
- **React**: 19.2.8
- **TypeScript**: ^5.0 (Strict mode, zero avoidable `any`)
- **Tailwind CSS**: ^4.0 (`@tailwindcss/postcss`)
- **Prisma ORM**: **7.10.0** (Production release line; avoids Prisma 8 RC as mandated by `issue.md`)
- **Database**: PostgreSQL (Neon Serverless compatibility via `@prisma/adapter-pg` & connection pooling)
- **Authentication**: Signed JWT session tokens in secure HTTP-only cookies (`jose`, `bcryptjs`)
- **Validation**: Zod runtime schema validation
- **Testing**: Vitest 5 (Unit and Integration testing)
- **Icons**: Lucide React

---

## 3. Project Structure

```text
.
├── DESIGN.md                  # Visual source of truth (Aether - The New Frontier)
├── issue.md                   # Full feature specifications & requirements
├── AGENTS.md                  # Architecture & operational guidelines for AI / engineers
├── README.md                  # System manual and setup documentation
├── .env.example               # Template environment variables
├── package.json               # Locked dependency tree
├── prisma7.config.ts          # Prisma 7 configuration file
├── prisma/
│   ├── schema.prisma          # PostgreSQL domain data model
│   ├── migrations/            # SQL migration history (0_init)
│   └── seed.ts                # 12 exercises, 14 daily challenges, test athlete
└── src/
    ├── app/
    │   ├── (public)/          # Landing page (/)
    │   ├── login/             # Sign In page (/login) with quick demo autofill
    │   ├── register/          # Sign Up page (/register) with timezone picker
    │   ├── dashboard/         # Mission control (/dashboard)
    │   ├── challenge/[date]/  # Interactive workout session (/challenge/2026-10-03)
    │   ├── history/           # Monthly calendar matrix & log (/history)
    │   ├── profile/           # Athlete settings & timezone (/profile)
    │   ├── layout.tsx         # Root layout with Inter & JetBrains Mono fonts
    │   ├── globals.css        # Aether design tokens & styling
    │   ├── loading.tsx        # Global loading UI
    │   ├── error.tsx          # Global error boundary
    │   └── not-found.tsx      # 404 handler
    ├── components/
    │   ├── ui/                # Button, Card, Badge, EmptyState, LoadingSpinner
    │   ├── layout/            # Responsive Navbar with live streak flame
    ├── features/
    │   ├── challenge/         # WorkoutSession interactive component
    │   ├── history/           # HistoryView calendar matrix
    │   └── profile/           # ProfileForm settings component
    ├── lib/
    │   ├── auth/              # Server session & cookie helpers
    │   ├── dates/             # Pure calendar-day arithmetic & IANA timezone logic
    │   ├── db/                # Prisma singleton & unified repository
    │   ├── streak/            # Pure streak engine algorithm
    │   └── validation/        # Zod input schemas
    ├── server/
    │   └── actions.ts         # Next.js Server Actions (mutations & validations)
    └── tests/
        ├── streak.test.ts     # 12 unit tests covering all streak boundary conditions
        └── integration.test.ts# 5 integration tests for completion & idempotency
```

---

## 4. Getting Started & Installation

### Requirements
- Node.js: Current LTS (v20+ or v22+, tested on v26)
- npm: v10+

### Installation
```bash
npm install
```

### Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Default variables:
```env
DATABASE_URL="postgresql://neondb_owner:password@ep-sample-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require"
DIRECT_URL="postgresql://neondb_owner:password@ep-sample.us-east-2.aws.neon.tech/neondb?sslmode=require"
AUTH_SECRET="mindfull_super_secure_jwt_secret_token_key_minimum_32_characters"
NODE_ENV="development"
```

*Note: The unified data repository includes an intelligent fallback store pre-populated with seed data, allowing local development and testing to run smoothly even before you paste your remote Neon PostgreSQL connection string.*

---

## 5. Database Setup & Migrations (Neon PostgreSQL)

1. Create a PostgreSQL database on [Neon](https://neon.tech).
2. Copy your pooled connection string into `DATABASE_URL` and direct connection string into `DIRECT_URL`.
3. Apply migrations:
```bash
npm run db:migrate
```
4. Seed development data:
```bash
npm run db:seed
```

---

## 6. Development & Production Commands

| Command | Action |
| :--- | :--- |
| `npm run dev` | Starts local Next.js development server at `http://localhost:3000` |
| `npm test` | Runs all 17 Vitest unit & integration test suites |
| `npm run build` | Compiles optimized Next.js production bundle with full TypeScript check |
| `npm run start` | Boots production server |
| `npm run lint` | Runs ESLint analysis |
| `npm run db:generate` | Generates Prisma 7 client |
| `npm run db:seed` | Seeds exercises, 14 challenges, and demo user |

---

## 7. Demo Test Account

For instant evaluation, the database and fallback store are pre-seeded with:
- **Email**: `alex@example.com`
- **Password**: `password123`
- **Timezone**: `Asia/Jakarta`
- **Streak History**: 2 consecutive completed days (2026-10-01 and 2026-10-02).
- **Today's Status**: Uncompleted! Log in, click **Start Workout**, then **Complete Challenge**, and watch the streak increase from **2 to 3 days** live.

A quick **"Autofill Test Account (Alex)"** button is provided directly on the `/login` screen.

---

## 8. Streak Engine Rules Summary

- **Source of Truth**: `WorkoutCompletion` table (`userId`, `challengeDate`, `completedAt`). Streaks are dynamically reconstructed from historical records.
- **Calendar Day Precision**: Time is never compared using naive millisecond offsets (`dateA - dateB === 86400000`). It strictly computes calendar day intervals based on the athlete's IANA timezone.
- **Idempotency**: Unique constraint `UNIQUE(userId, challengeDate)` prevents multiple streak increments for duplicate attempts on the same calendar day.
- **Consecutive Requirement**: If day $N-1$ is missed, the active streak resets to $0$ until today is completed ($streak = 1$).
