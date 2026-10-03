/**
 * Pure Streak Engine
 * Implements strict calendar-day rules, timezone awareness, idempotency,
 * and handles edge cases (missed days, first-ever completion, duplicates, future dates).
 */

import {
  DEFAULT_TIMEZONE,
  getCalendarDateInTimezone,
  getNextCalendarDay,
  getPreviousCalendarDay,
  getTodayCalendarDate,
  isValidDateString,
} from "../dates/timezone";

export interface StreakCalculationInput {
  completionDates: (string | Date)[];
  today?: string; // Optional reference date (YYYY-MM-DD)
  timezone?: string; // IANA timezone string
}

export interface StreakCalculationResult {
  currentStreak: number;
  longestStreak: number;
  totalCompletedDays: number;
  isCompletedToday: boolean;
  lastCompletedDate: string | null;
  activeTodayDate: string;
}

/**
 * Calculates current streak, longest streak, completion status, and total completed days.
 * Pure function with no side effects or database dependencies.
 */
export function calculateStreak({
  completionDates,
  today,
  timezone = DEFAULT_TIMEZONE,
}: StreakCalculationInput): StreakCalculationResult {
  const effectiveToday = today && isValidDateString(today) ? today : getTodayCalendarDate(timezone);

  // 1. Normalize dates to YYYY-MM-DD strings
  const normalizedDates: string[] = [];
  for (const item of completionDates) {
    if (!item) continue;
    if (typeof item === "string") {
      if (isValidDateString(item)) {
        normalizedDates.push(item);
      } else {
        // Try parsing ISO timestamp or string
        try {
          const parsed = getCalendarDateInTimezone(item, timezone);
          if (isValidDateString(parsed)) {
            normalizedDates.push(parsed);
          }
        } catch {
          // Ignore invalid date strings
        }
      }
    } else if (item instanceof Date && !isNaN(item.getTime())) {
      normalizedDates.push(getCalendarDateInTimezone(item, timezone));
    }
  }

  // 2. Remove duplicates
  const uniqueDateSet = new Set<string>(normalizedDates);
  const allUniqueDates = Array.from(uniqueDateSet).sort();

  // 3. For current streak, only consider dates <= effectiveToday (ignore future anomalies)
  const validDatesUpToToday = allUniqueDates.filter((d) => d <= effectiveToday);
  const validDateSet = new Set<string>(validDatesUpToToday);

  const isCompletedToday = validDateSet.has(effectiveToday);
  const lastCompletedDate =
    validDatesUpToToday.length > 0 ? validDatesUpToToday[validDatesUpToToday.length - 1] : null;

  // 4. Calculate current streak by walking backward
  let currentStreak = 0;
  if (isCompletedToday) {
    currentStreak = 1;
    let checkDate = getPreviousCalendarDay(effectiveToday);
    while (validDateSet.has(checkDate)) {
      currentStreak += 1;
      checkDate = getPreviousCalendarDay(checkDate);
    }
  } else {
    // If not completed today, check if yesterday was completed (streak is still intact until today ends)
    const yesterday = getPreviousCalendarDay(effectiveToday);
    if (validDateSet.has(yesterday)) {
      currentStreak = 1;
      let checkDate = getPreviousCalendarDay(yesterday);
      while (validDateSet.has(checkDate)) {
        currentStreak += 1;
        checkDate = getPreviousCalendarDay(checkDate);
      }
    } else {
      // Missed yesterday, streak is broken
      currentStreak = 0;
    }
  }

  // 5. Calculate longest historical streak across all valid records
  let longestStreak = 0;
  let currentRun = 0;
  let prevDate: string | null = null;

  for (const dateStr of validDatesUpToToday) {
    if (prevDate === null) {
      currentRun = 1;
    } else {
      const expectedNext = getNextCalendarDay(prevDate);
      if (dateStr === expectedNext) {
        currentRun += 1;
      } else {
        currentRun = 1;
      }
    }
    if (currentRun > longestStreak) {
      longestStreak = currentRun;
    }
    prevDate = dateStr;
  }

  return {
    currentStreak,
    longestStreak,
    totalCompletedDays: validDatesUpToToday.length,
    isCompletedToday,
    lastCompletedDate,
    activeTodayDate: effectiveToday,
  };
}
