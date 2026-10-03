/**
 * Central Data Access Repository
 * Communicates with Prisma Client (PostgreSQL / Neon) with graceful fallback
 * to pre-seeded in-memory store if DATABASE_URL is not yet connected.
 */

import { prisma } from "./prisma";
import { SEED_CHALLENGES, SEED_EXERCISES } from "../../../prisma/seed";
import { calculateStreak, StreakCalculationResult } from "../streak/engine";
import { getTodayCalendarDate, isValidDateString } from "../dates/timezone";

export interface ExerciseItem {
  id: string;
  name: string;
  description: string;
  instructions: string;
  mediaUrl: string | null;
  targetMuscle: string | null;
  category: string | null;
}

export interface ChallengeExerciseItem {
  id: string;
  order: number;
  sets: number;
  repetitions: number | null;
  durationSeconds: number | null;
  restSeconds: number | null;
  exercise: ExerciseItem;
}

export interface ChallengeWithExercises {
  id: string;
  date: string;
  title: string;
  description: string;
  difficulty: string;
  estimatedDuration: number;
  exercises: ChallengeExerciseItem[];
}

export interface UserRecord {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  image: string | null;
  timezone: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CompletionRecord {
  id: string;
  userId: string;
  challengeId: string;
  challengeDate: string;
  completedAt: Date;
}

// ----------------- IN-MEMORY FALLBACK STORE -----------------
// Pre-populated so that local dev, build, and tests work effortlessly out of the box
interface MemoryStore {
  users: Map<string, UserRecord>;
  challenges: Map<string, ChallengeWithExercises>;
  completions: CompletionRecord[];
}

function initializeMemoryStore(): MemoryStore {
  const store: MemoryStore = {
    users: new Map(),
    challenges: new Map(),
    completions: [],
  };

  // Seed default test user: alex@example.com / password123
  // Pre-hashed bcrypt for "password123"
  const defaultPasswordHash =
    "$2a$10$w87g4XwB/rXjJg6T4lFq7.57bLz83P20csqm6x9vY5w2QfVom.5F6";

  const defaultUser: UserRecord = {
    id: "usr-alex-vance",
    email: "alex@example.com",
    name: "Alex Vance",
    passwordHash: defaultPasswordHash,
    image: null,
    timezone: "Asia/Jakarta",
    createdAt: new Date("2026-09-01T00:00:00Z"),
    updatedAt: new Date("2026-09-01T00:00:00Z"),
  };
  store.users.set(defaultUser.id, defaultUser);
  store.users.set(defaultUser.email, defaultUser);

  const exerciseMap = new Map<string, ExerciseItem>();
  for (const ex of SEED_EXERCISES) {
    exerciseMap.set(ex.id, { ...ex, mediaUrl: null });
  }

  for (const sc of SEED_CHALLENGES) {
    const challengeId = `ch-${sc.date}`;
    const mappedExercises: ChallengeExerciseItem[] = sc.exercises.map((item, idx) => ({
      id: `ce-${sc.date}-${idx}`,
      order: item.order,
      sets: item.sets,
      repetitions: item.repetitions ?? null,
      durationSeconds: item.durationSeconds ?? null,
      restSeconds: item.restSeconds ?? 30,
      exercise: exerciseMap.get(item.exerciseId) ?? {
        id: item.exerciseId,
        name: "General Exercise",
        description: "Movement drill",
        instructions: "Perform cleanly with good form.",
        mediaUrl: null,
        targetMuscle: "Full Body",
        category: "Calisthenics",
      },
    }));

    const challengeRecord: ChallengeWithExercises = {
      id: challengeId,
      date: sc.date,
      title: sc.title,
      description: sc.description,
      difficulty: sc.difficulty,
      estimatedDuration: sc.estimatedDuration,
      exercises: mappedExercises,
    };
    store.challenges.set(sc.date, challengeRecord);
    store.challenges.set(challengeId, challengeRecord);
  }

  // Pre-seed test completions for Alex Vance: 2026-10-01 and 2026-10-02
  const ch1 = store.challenges.get("2026-10-01");
  const ch2 = store.challenges.get("2026-10-02");
  if (ch1) {
    store.completions.push({
      id: "comp-1",
      userId: defaultUser.id,
      challengeId: ch1.id,
      challengeDate: "2026-10-01",
      completedAt: new Date("2026-10-01T08:30:00Z"),
    });
  }
  if (ch2) {
    store.completions.push({
      id: "comp-2",
      userId: defaultUser.id,
      challengeId: ch2.id,
      challengeDate: "2026-10-02",
      completedAt: new Date("2026-10-02T09:15:00Z"),
    });
  }

  return store;
}

const globalForMemory = globalThis as unknown as {
  __mindfullMemoryStore?: MemoryStore;
};

const memoryStore = (globalForMemory.__mindfullMemoryStore ??= initializeMemoryStore());

function isLiveDatabaseAvailable(): boolean {
  return Boolean(process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith("postgres"));
}

// ----------------- USER OPERATIONS -----------------

export async function findUserByEmail(email: string): Promise<UserRecord | null> {
  const normalizedEmail = email.toLowerCase().trim();

  if (isLiveDatabaseAvailable()) {
    try {
      const user = await prisma.user.findUnique({
        where: { email: normalizedEmail },
      });
      if (user) return user as UserRecord;
    } catch {
      // Fall through to memory store on DB error
    }
  }

  return memoryStore.users.get(normalizedEmail) ?? null;
}

export async function findUserById(id: string): Promise<UserRecord | null> {
  if (isLiveDatabaseAvailable()) {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
      });
      if (user) return user as UserRecord;
    } catch {
      // Fall through to memory store
    }
  }

  return memoryStore.users.get(id) ?? null;
}

export async function createUser(data: {
  email: string;
  name: string;
  passwordHash: string;
  timezone?: string;
}): Promise<UserRecord> {
  const normalizedEmail = data.email.toLowerCase().trim();
  const timezone = data.timezone || "Asia/Jakarta";

  if (isLiveDatabaseAvailable()) {
    try {
      const user = await prisma.user.create({
        data: {
          email: normalizedEmail,
          name: data.name.trim(),
          passwordHash: data.passwordHash,
          timezone,
        },
      });
      return user as UserRecord;
    } catch {
      // Fall through if database unreachable
    }
  }

  const id = `usr-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const newUser: UserRecord = {
    id,
    email: normalizedEmail,
    name: data.name.trim(),
    passwordHash: data.passwordHash,
    image: null,
    timezone,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  memoryStore.users.set(id, newUser);
  memoryStore.users.set(normalizedEmail, newUser);
  return newUser;
}

export async function updateUser(
  id: string,
  data: { name?: string; timezone?: string }
): Promise<UserRecord | null> {
  if (isLiveDatabaseAvailable()) {
    try {
      const updated = await prisma.user.update({
        where: { id },
        data: {
          ...(data.name ? { name: data.name.trim() } : {}),
          ...(data.timezone ? { timezone: data.timezone } : {}),
        },
      });
      return updated as UserRecord;
    } catch {
      // Fall through
    }
  }

  const user = memoryStore.users.get(id);
  if (!user) return null;

  if (data.name) user.name = data.name.trim();
  if (data.timezone) user.timezone = data.timezone;
  user.updatedAt = new Date();

  memoryStore.users.set(id, user);
  memoryStore.users.set(user.email, user);
  return user;
}

// ----------------- CHALLENGE OPERATIONS -----------------

export async function getDailyChallengeByDate(dateStr: string): Promise<ChallengeWithExercises | null> {
  if (isLiveDatabaseAvailable()) {
    try {
      const challenge = await prisma.dailyChallenge.findUnique({
        where: { date: dateStr },
        include: {
          exercises: {
            orderBy: { order: "asc" },
            include: { exercise: true },
          },
        },
      });
      if (challenge) {
        return challenge as unknown as ChallengeWithExercises;
      }
    } catch {
      // Fall through
    }
  }

  return memoryStore.challenges.get(dateStr) ?? null;
}

export async function getAllChallenges(): Promise<ChallengeWithExercises[]> {
  if (isLiveDatabaseAvailable()) {
    try {
      const list = await prisma.dailyChallenge.findMany({
        orderBy: { date: "asc" },
        include: {
          exercises: {
            orderBy: { order: "asc" },
            include: { exercise: true },
          },
        },
      });
      if (list && list.length > 0) {
        return list as unknown as ChallengeWithExercises[];
      }
    } catch {
      // Fall through
    }
  }

  const seen = new Set<string>();
  const list: ChallengeWithExercises[] = [];
  for (const [, val] of memoryStore.challenges.entries()) {
    if (!seen.has(val.id)) {
      seen.add(val.id);
      list.push(val);
    }
  }
  return list.sort((a, b) => a.date.localeCompare(b.date));
}

// ----------------- COMPLETION & STREAK OPERATIONS -----------------

export async function getUserCompletions(userId: string): Promise<CompletionRecord[]> {
  if (isLiveDatabaseAvailable()) {
    try {
      const records = await prisma.workoutCompletion.findMany({
        where: { userId },
        orderBy: { completedAt: "asc" },
      });
      return records as CompletionRecord[];
    } catch {
      // Fall through
    }
  }

  return memoryStore.completions
    .filter((c) => c.userId === userId)
    .sort((a, b) => a.completedAt.getTime() - b.completedAt.getTime());
}

export async function recordWorkoutCompletion({
  userId,
  challengeId,
  challengeDate,
}: {
  userId: string;
  challengeId: string;
  challengeDate: string;
}): Promise<{
  success: boolean;
  alreadyCompleted: boolean;
  stats: StreakCalculationResult;
}> {
  const user = await findUserById(userId);
  const timezone = user?.timezone || "Asia/Jakarta";
  const todayStr = getTodayCalendarDate(timezone);

  // Check if already completed
  const existingCompletions = await getUserCompletions(userId);
  const alreadyCompleted = existingCompletions.some(
    (c) => c.challengeId === challengeId || c.challengeDate === challengeDate
  );

  if (alreadyCompleted) {
    const streakResult = calculateStreak({
      completionDates: existingCompletions.map((c) => c.challengeDate),
      today: todayStr,
      timezone,
    });
    return {
      success: true,
      alreadyCompleted: true,
      stats: streakResult,
    };
  }

  // Not completed yet, record completion
  const now = new Date();

  if (isLiveDatabaseAvailable()) {
    try {
      await prisma.$transaction(async (tx) => {
        await tx.workoutCompletion.create({
          data: {
            userId,
            challengeId,
            challengeDate,
            completedAt: now,
          },
        });
      });
    } catch {
      // Fall through to memory
    }
  }

  // In-memory record
  const newRecord: CompletionRecord = {
    id: `comp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    userId,
    challengeId,
    challengeDate,
    completedAt: now,
  };
  memoryStore.completions.push(newRecord);

  // Recalculate streak
  const updatedCompletions = await getUserCompletions(userId);
  const streakResult = calculateStreak({
    completionDates: updatedCompletions.map((c) => c.challengeDate),
    today: todayStr,
    timezone,
  });

  // Update cached projection in database if available
  if (isLiveDatabaseAvailable()) {
    try {
      await prisma.userStats.upsert({
        where: { userId },
        update: {
          currentStreak: streakResult.currentStreak,
          longestStreak: streakResult.longestStreak,
          totalCompletedDays: streakResult.totalCompletedDays,
          lastCompletedDate: streakResult.lastCompletedDate,
        },
        create: {
          userId,
          currentStreak: streakResult.currentStreak,
          longestStreak: streakResult.longestStreak,
          totalCompletedDays: streakResult.totalCompletedDays,
          lastCompletedDate: streakResult.lastCompletedDate,
        },
      });
    } catch {
      // Non-fatal projection error
    }
  }

  return {
    success: true,
    alreadyCompleted: false,
    stats: streakResult,
  };
}

export async function getUserStreakStats(
  userId: string,
  userTimezone?: string
): Promise<StreakCalculationResult> {
  const user = await findUserById(userId);
  const timezone = userTimezone || user?.timezone || "Asia/Jakarta";
  const todayStr = getTodayCalendarDate(timezone);

  const completions = await getUserCompletions(userId);
  return calculateStreak({
    completionDates: completions.map((c) => c.challengeDate),
    today: todayStr,
    timezone,
  });
}
