/**
 * Timezone & Calendar Day Utilities
 * Uses pure calendar-day arithmetic to avoid DST and timezone shift anomalies.
 */

export const DEFAULT_TIMEZONE = "Asia/Jakarta";

/**
 * Validates if a string is a valid ISO calendar date format YYYY-MM-DD
 */
export function isValidDateString(dateStr: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;
  const [year, month, day] = dateStr.split("-").map(Number);
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;
  const d = new Date(Date.UTC(year, month - 1, day));
  return (
    d.getUTCFullYear() === year &&
    d.getUTCMonth() === month - 1 &&
    d.getUTCDate() === day
  );
}

/**
 * Derives the calendar date (YYYY-MM-DD) from any Date, ISO string, or timestamp in a specific IANA timezone.
 */
export function getCalendarDateInTimezone(
  dateInput: Date | string | number = new Date(),
  timezone: string = DEFAULT_TIMEZONE
): string {
  const date = typeof dateInput === "string" || typeof dateInput === "number" ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date input: ${String(dateInput)}`);
  }

  try {
    // en-CA produces standard ISO format "YYYY-MM-DD"
    const formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    return formatter.format(date);
  } catch {
    // Fallback if timezone string is unrecognized
    const fallbackFormatter = new Intl.DateTimeFormat("en-CA", {
      timeZone: "UTC",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    return fallbackFormatter.format(date);
  }
}

/**
 * Returns today's calendar date string (YYYY-MM-DD) in the given timezone.
 */
export function getTodayCalendarDate(timezone: string = DEFAULT_TIMEZONE): string {
  return getCalendarDateInTimezone(new Date(), timezone);
}

/**
 * Returns the immediate previous calendar day (YYYY-MM-DD).
 * Guaranteed to respect leap years and month boundaries without DST issues.
 */
export function getPreviousCalendarDay(dateStr: string): string {
  if (!isValidDateString(dateStr)) {
    throw new Error(`Invalid date string: ${dateStr}`);
  }
  const [year, month, day] = dateStr.split("-").map(Number);
  const d = new Date(Date.UTC(year, month - 1, day));
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}

/**
 * Returns the immediate next calendar day (YYYY-MM-DD).
 */
export function getNextCalendarDay(dateStr: string): string {
  if (!isValidDateString(dateStr)) {
    throw new Error(`Invalid date string: ${dateStr}`);
  }
  const [year, month, day] = dateStr.split("-").map(Number);
  const d = new Date(Date.UTC(year, month - 1, day));
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
}

/**
 * Computes calendar day difference (dateStr2 - dateStr1) in full days.
 */
export function getDaysDifference(dateStr1: string, dateStr2: string): number {
  if (!isValidDateString(dateStr1) || !isValidDateString(dateStr2)) {
    throw new Error(`Invalid date strings: ${dateStr1}, ${dateStr2}`);
  }
  const [y1, m1, d1] = dateStr1.split("-").map(Number);
  const [y2, m2, d2] = dateStr2.split("-").map(Number);
  const utc1 = Date.UTC(y1, m1 - 1, d1);
  const utc2 = Date.UTC(y2, m2 - 1, d2);
  return Math.round((utc2 - utc1) / (1000 * 60 * 60 * 24));
}

/**
 * Formats a YYYY-MM-DD string into a human-readable display date.
 */
export function formatDisplayDate(dateStr: string, options?: Intl.DateTimeFormatOptions): string {
  if (!isValidDateString(dateStr)) return dateStr;
  const [year, month, day] = dateStr.split("-").map(Number);
  const d = new Date(Date.UTC(year, month - 1, day));
  const defaultOptions: Intl.DateTimeFormatOptions = {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
    ...options,
  };
  return d.toLocaleDateString("en-US", defaultOptions);
}
