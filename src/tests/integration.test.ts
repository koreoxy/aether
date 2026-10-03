import { describe, it, expect, beforeEach } from "vitest";
import {
  findUserByEmail,
  getDailyChallengeByDate,
  getUserCompletions,
  recordWorkoutCompletion,
  getUserStreakStats,
} from "../lib/db/repository";

describe("Domain & Repository Integration Tests", () => {
  const testUserId = "usr-alex-vance";

  it("fetches pre-seeded test user by email", async () => {
    const user = await findUserByEmail("alex@example.com");
    expect(user).not.toBeNull();
    expect(user?.email).toBe("alex@example.com");
    expect(user?.name).toBe("Alex Vance");
  });

  it("fetches today's daily challenge and its exercises", async () => {
    const challenge = await getDailyChallengeByDate("2026-10-03");
    expect(challenge).not.toBeNull();
    expect(challenge?.title).toContain("Full Body");
    expect(challenge?.exercises.length).toBeGreaterThan(0);
    expect(challenge?.exercises[0].exercise.name).toBeDefined();
  });

  it("verifies sample completion history and calculates current streak correctly", async () => {
    const completions = await getUserCompletions(testUserId);
    expect(completions.length).toBeGreaterThanOrEqual(2);

    const stats = await getUserStreakStats(testUserId, "Asia/Jakarta");
    // Pre-seeded completions on 2026-10-01 and 2026-10-02
    expect(stats.currentStreak).toBe(2);
    expect(stats.isCompletedToday).toBe(false);
  });

  it("records today's workout completion and increases streak to 3", async () => {
    const challenge = await getDailyChallengeByDate("2026-10-03");
    expect(challenge).not.toBeNull();

    const result = await recordWorkoutCompletion({
      userId: testUserId,
      challengeId: challenge!.id,
      challengeDate: "2026-10-03",
    });

    expect(result.success).toBe(true);
    expect(result.alreadyCompleted).toBe(false);
    expect(result.stats.currentStreak).toBe(3);
    expect(result.stats.isCompletedToday).toBe(true);
  });

  it("prevents duplicate completions on the same day idempotently", async () => {
    const challenge = await getDailyChallengeByDate("2026-10-03");

    // Second completion attempt
    const secondResult = await recordWorkoutCompletion({
      userId: testUserId,
      challengeId: challenge!.id,
      challengeDate: "2026-10-03",
    });

    expect(secondResult.success).toBe(true);
    expect(secondResult.alreadyCompleted).toBe(true);
    // Streak must NOT double-increment! It stays 3
    expect(secondResult.stats.currentStreak).toBe(3);
  });
});
