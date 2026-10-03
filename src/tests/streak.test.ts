import { describe, it, expect } from "vitest";
import { calculateStreak } from "../lib/streak/engine";
import {
  getCalendarDateInTimezone,
  getNextCalendarDay,
  getPreviousCalendarDay,
} from "../lib/dates/timezone";

describe("Streak Engine - Core Rules", () => {
  it("handles empty completions", () => {
    const result = calculateStreak({
      completionDates: [],
      today: "2026-10-03",
    });

    expect(result.currentStreak).toBe(0);
    expect(result.longestStreak).toBe(0);
    expect(result.totalCompletedDays).toBe(0);
    expect(result.isCompletedToday).toBe(false);
    expect(result.lastCompletedDate).toBeNull();
  });

  it("handles first-ever completion on today", () => {
    const result = calculateStreak({
      completionDates: ["2026-10-03"],
      today: "2026-10-03",
    });

    expect(result.currentStreak).toBe(1);
    expect(result.longestStreak).toBe(1);
    expect(result.totalCompletedDays).toBe(1);
    expect(result.isCompletedToday).toBe(true);
    expect(result.lastCompletedDate).toBe("2026-10-03");
  });

  it("handles consecutive completions ending today", () => {
    const result = calculateStreak({
      completionDates: ["2026-10-01", "2026-10-02", "2026-10-03"],
      today: "2026-10-03",
    });

    expect(result.currentStreak).toBe(3);
    expect(result.longestStreak).toBe(3);
    expect(result.totalCompletedDays).toBe(3);
    expect(result.isCompletedToday).toBe(true);
  });

  it("maintains active streak when yesterday completed but today not yet completed", () => {
    const result = calculateStreak({
      completionDates: ["2026-10-01", "2026-10-02"],
      today: "2026-10-03",
    });

    expect(result.currentStreak).toBe(2);
    expect(result.longestStreak).toBe(2);
    expect(result.totalCompletedDays).toBe(2);
    expect(result.isCompletedToday).toBe(false);
    expect(result.lastCompletedDate).toBe("2026-10-02");
  });

  it("breaks streak when one day is missed (yesterday missed, last was 2 days ago)", () => {
    const result = calculateStreak({
      completionDates: ["2026-09-30", "2026-10-01"], // 2026-10-02 missed!
      today: "2026-10-03",
    });

    expect(result.currentStreak).toBe(0);
    expect(result.longestStreak).toBe(2);
    expect(result.isCompletedToday).toBe(false);
  });

  it("restarts streak at 1 after completing today following a missed day", () => {
    const result = calculateStreak({
      completionDates: ["2026-09-30", "2026-10-01", "2026-10-03"], // 2026-10-02 was missed
      today: "2026-10-03",
    });

    expect(result.currentStreak).toBe(1);
    expect(result.longestStreak).toBe(2); // previous streak was 2
    expect(result.isCompletedToday).toBe(true);
    expect(result.totalCompletedDays).toBe(3);
  });

  it("handles duplicate same-day completions idempotently", () => {
    const result = calculateStreak({
      completionDates: [
        "2026-10-01",
        "2026-10-02",
        "2026-10-02",
        "2026-10-03",
        "2026-10-03",
        "2026-10-03",
      ],
      today: "2026-10-03",
    });

    expect(result.currentStreak).toBe(3);
    expect(result.longestStreak).toBe(3);
    expect(result.totalCompletedDays).toBe(3);
    expect(result.isCompletedToday).toBe(true);
  });

  it("handles unsorted completion dates gracefully", () => {
    const result = calculateStreak({
      completionDates: ["2026-10-03", "2026-10-01", "2026-10-02"],
      today: "2026-10-03",
    });

    expect(result.currentStreak).toBe(3);
    expect(result.longestStreak).toBe(3);
  });

  it("preserves historical longest streak even after a long gap", () => {
    const result = calculateStreak({
      completionDates: [
        // 5 consecutive days in August
        "2026-08-01",
        "2026-08-02",
        "2026-08-03",
        "2026-08-04",
        "2026-08-05",
        // Long gap throughout September
        // 2 consecutive days now
        "2026-10-02",
        "2026-10-03",
      ],
      today: "2026-10-03",
    });

    expect(result.currentStreak).toBe(2);
    expect(result.longestStreak).toBe(5);
    expect(result.totalCompletedDays).toBe(7);
  });

  it("handles future-dated completion records safely without inflating current streak", () => {
    const result = calculateStreak({
      completionDates: ["2026-10-01", "2026-10-02", "2026-10-03", "2026-10-05"],
      today: "2026-10-03",
    });

    expect(result.currentStreak).toBe(3);
    expect(result.isCompletedToday).toBe(true);
    expect(result.totalCompletedDays).toBe(3);
  });

  it("handles month and leap year boundaries correctly", () => {
    // 2024 is a leap year (Feb has 29 days)
    expect(getNextCalendarDay("2024-02-28")).toBe("2024-02-29");
    expect(getNextCalendarDay("2024-02-29")).toBe("2024-03-01");
    expect(getPreviousCalendarDay("2024-03-01")).toBe("2024-02-29");

    const leapStreak = calculateStreak({
      completionDates: ["2024-02-28", "2024-02-29", "2024-03-01"],
      today: "2024-03-01",
    });
    expect(leapStreak.currentStreak).toBe(3);

    // 2025 is not a leap year (Feb has 28 days)
    expect(getNextCalendarDay("2025-02-28")).toBe("2025-03-01");
    expect(getPreviousCalendarDay("2025-03-01")).toBe("2025-02-28");
  });

  it("accurately handles timezone boundaries", () => {
    // 2026-10-02T23:30:00Z in UTC is 2026-10-03T06:30:00 in Asia/Jakarta (UTC+7)
    const utcDate = new Date("2026-10-02T23:30:00.000Z");

    const jakartaDay = getCalendarDateInTimezone(utcDate, "Asia/Jakarta");
    const utcDay = getCalendarDateInTimezone(utcDate, "UTC");
    const nyDay = getCalendarDateInTimezone(utcDate, "America/New_York");

    expect(jakartaDay).toBe("2026-10-03");
    expect(utcDay).toBe("2026-10-02");
    expect(nyDay).toBe("2026-10-02");
  });
});
