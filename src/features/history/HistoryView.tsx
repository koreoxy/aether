"use client";

import React, { useState } from "react";
import Link from "next/link";
import { StreakCalculationResult } from "@/lib/streak/engine";
import { CompletionRecord, ChallengeWithExercises } from "@/lib/db/repository";
import { formatDisplayDate } from "@/lib/dates/timezone";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  Flame,
  Trophy,
  Dumbbell,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

interface HistoryViewProps {
  stats: StreakCalculationResult;
  completions: CompletionRecord[];
  challenges: ChallengeWithExercises[];
  todayDate: string;
  userTimezone: string;
}

export function HistoryView({
  stats,
  completions,
  challenges,
  todayDate,
}: HistoryViewProps) {
  // Calendar month state
  const [currentYearMonth, setCurrentYearMonth] = useState(() => {
    return {
      year: parseInt(todayDate.slice(0, 4), 10),
      month: parseInt(todayDate.slice(5, 7), 10) - 1, // 0-indexed
    };
  });

  const completionMap = new Map<string, CompletionRecord>();
  for (const c of completions) {
    completionMap.set(c.challengeDate, c);
  }

  const challengeMap = new Map<string, ChallengeWithExercises>();
  for (const ch of challenges) {
    challengeMap.set(ch.date, ch);
  }

  // Month navigation
  const handlePrevMonth = () => {
    setCurrentYearMonth((prev) => {
      if (prev.month === 0) return { year: prev.year - 1, month: 11 };
      return { year: prev.year, month: prev.month - 1 };
    });
  };

  const handleNextMonth = () => {
    setCurrentYearMonth((prev) => {
      if (prev.month === 11) return { year: prev.year + 1, month: 0 };
      return { year: prev.year, month: prev.month + 1 };
    });
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  const currentMonthTitle = `${monthNames[currentYearMonth.month]} ${currentYearMonth.year}`;

  // Build calendar matrix (Monday through Sunday)
  const firstDayOfMonth = new Date(Date.UTC(currentYearMonth.year, currentYearMonth.month, 1));
  const daysInMonth = new Date(Date.UTC(currentYearMonth.year, currentYearMonth.month + 1, 0)).getUTCDate();

  // JavaScript getUTCDay: 0 = Sun, 1 = Mon ... 6 = Sat
  // Convert so 0 = Monday, 6 = Sunday
  const startDayIndex = (firstDayOfMonth.getUTCDay() + 6) % 7;

  const calendarDays: Array<{
    dateStr: string;
    dayNum: number;
    isCurrentMonth: boolean;
    isCompleted: boolean;
    isToday: boolean;
    hasChallenge: boolean;
    challengeTitle?: string;
  }> = [];

  // Padding days before start of month
  const prevMonthTotalDays = new Date(Date.UTC(currentYearMonth.year, currentYearMonth.month, 0)).getUTCDate();
  for (let i = startDayIndex - 1; i >= 0; i--) {
    const dNum = prevMonthTotalDays - i;
    const m = currentYearMonth.month === 0 ? 12 : currentYearMonth.month;
    const y = currentYearMonth.month === 0 ? currentYearMonth.year - 1 : currentYearMonth.year;
    const dateStr = `${y}-${String(m).padStart(2, "0")}-${String(dNum).padStart(2, "0")}`;
    calendarDays.push({
      dateStr,
      dayNum: dNum,
      isCurrentMonth: false,
      isCompleted: completionMap.has(dateStr),
      isToday: dateStr === todayDate,
      hasChallenge: challengeMap.has(dateStr),
    });
  }

  // Days of current month
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${currentYearMonth.year}-${String(currentYearMonth.month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    calendarDays.push({
      dateStr,
      dayNum: d,
      isCurrentMonth: true,
      isCompleted: completionMap.has(dateStr),
      isToday: dateStr === todayDate,
      hasChallenge: challengeMap.has(dateStr),
      challengeTitle: challengeMap.get(dateStr)?.title,
    });
  }

  // Padding days to fill remaining week grid (up to multiple of 7)
  const remainingDays = 7 - (calendarDays.length % 7);
  if (remainingDays < 7) {
    for (let d = 1; d <= remainingDays; d++) {
      const m = currentYearMonth.month === 11 ? 1 : currentYearMonth.month + 2;
      const y = currentYearMonth.month === 11 ? currentYearMonth.year + 1 : currentYearMonth.year;
      const dateStr = `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      calendarDays.push({
        dateStr,
        dayNum: d,
        isCurrentMonth: false,
        isCompleted: completionMap.has(dateStr),
        isToday: dateStr === todayDate,
        hasChallenge: challengeMap.has(dateStr),
      });
    }
  }

  return (
    <div className="space-y-8">
      {/* Top Streak Stats Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono-tag text-zinc-400">ACTIVE STREAK</span>
            <Flame
              className={`w-4 h-4 ${
                stats.currentStreak > 0 ? "text-amber-400 fill-amber-400" : "text-zinc-600"
              }`}
            />
          </div>
          <div className="text-3xl font-bold font-mono text-white">
            {stats.currentStreak} <span className="text-xs font-normal text-zinc-500">DAYS</span>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono-tag text-zinc-400">LONGEST RECORD</span>
            <Trophy className="w-4 h-4 text-zinc-300" />
          </div>
          <div className="text-3xl font-bold font-mono text-white">
            {stats.longestStreak} <span className="text-xs font-normal text-zinc-500">DAYS</span>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono-tag text-zinc-400">TOTAL SESSIONS</span>
            <Dumbbell className="w-4 h-4 text-zinc-300" />
          </div>
          <div className="text-3xl font-bold font-mono text-white">
            {stats.totalCompletedDays} <span className="text-xs font-normal text-zinc-500">LOGGED</span>
          </div>
        </Card>
      </div>

      {/* Interactive Calendar Matrix */}
      <Card className="p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <CalendarIcon className="w-5 h-5 text-zinc-400" />
            <h2 className="text-xl font-medium tracking-tight text-white">{currentMonthTitle}</h2>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevMonth}
              className="p-2 h-8 w-8 text-zinc-300"
              aria-label="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentYearMonth({
                  year: parseInt(todayDate.slice(0, 4), 10),
                  month: parseInt(todayDate.slice(5, 7), 10) - 1,
                })
              }
              className="text-xs font-mono px-3 h-8"
            >
              Today
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextMonth}
              className="p-2 h-8 w-8 text-zinc-300"
              aria-label="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-1 text-center font-mono-tag text-zinc-500 text-[10px] mb-2">
          <div>MON</div>
          <div>TUE</div>
          <div>WED</div>
          <div>THU</div>
          <div>FRI</div>
          <div>SAT</div>
          <div>SUN</div>
        </div>

        {/* Calendar Grid Days */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {calendarDays.map((d, idx) => {
            const isPast = d.dateStr < todayDate;
            const isMissed = isPast && !d.isCompleted && d.isCurrentMonth;

            return (
              <Link
                key={idx}
                href={d.hasChallenge ? `/challenge/${d.dateStr}` : "#"}
                className={`min-h-[64px] sm:min-h-[80px] p-2 rounded-[6px] border flex flex-col justify-between transition-all ${
                  d.isCompleted
                    ? "bg-emerald-950/20 border-emerald-700/50 hover:border-emerald-500"
                    : d.isToday
                    ? "bg-[#18181C] border-white/60"
                    : d.isCurrentMonth
                    ? "bg-[#0E0E10] border-[#27272A] hover:border-[#3F3F46]"
                    : "bg-[#080809] border-[#1C1C1F] opacity-40"
                } ${!d.hasChallenge ? "cursor-default pointer-events-none" : "cursor-pointer"}`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`font-mono text-xs ${
                      d.isToday
                        ? "text-white font-bold"
                        : d.isCurrentMonth
                        ? "text-zinc-300"
                        : "text-zinc-600"
                    }`}
                  >
                    {d.dayNum}
                  </span>

                  {d.isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : d.isToday ? (
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  ) : isMissed ? (
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" title="Missed" />
                  ) : null}
                </div>

                <div className="mt-1">
                  {d.isCompleted ? (
                    <span className="text-[10px] font-mono text-emerald-400 font-semibold block truncate">
                      DONE ✓
                    </span>
                  ) : d.challengeTitle && d.isCurrentMonth ? (
                    <span className="text-[10px] text-zinc-500 block truncate" title={d.challengeTitle}>
                      {d.challengeTitle}
                    </span>
                  ) : null}
                </div>
              </Link>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 pt-4 border-t border-[#27272A] flex flex-wrap items-center gap-6 text-xs font-mono text-zinc-400">
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded-[3px] bg-emerald-950/40 border border-emerald-600/60" />
            <span>Completed Workout</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded-[3px] bg-[#18181C] border border-white/60" />
            <span>Today</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded-[3px] bg-[#0E0E10] border border-[#27272A]" />
            <span>Scheduled Challenge</span>
          </div>
        </div>
      </Card>

      {/* Completion Log List */}
      <Card className="p-6 sm:p-8">
        <div className="font-mono-tag text-zinc-400 mb-4">VERIFIED COMPLETION LOG</div>

        {completions.length > 0 ? (
          <div className="space-y-3">
            {[...completions].reverse().map((record) => {
              const ch = challengeMap.get(record.challengeDate);
              const formattedDate = formatDisplayDate(record.challengeDate);

              return (
                <div
                  key={record.id}
                  className="p-4 rounded-[6px] bg-[#141416] border border-[#27272A] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-[6px] bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-white">
                          {ch?.title || "Daily Challenge"}
                        </span>
                        <Badge variant="success">RECORDED</Badge>
                      </div>
                      <div className="text-xs text-zinc-400 mt-0.5">
                        Completed for calendar day: <span className="font-mono text-zinc-300">{formattedDate}</span>
                      </div>
                    </div>
                  </div>

                  <Link href={`/challenge/${record.challengeDate}`}>
                    <Button variant="ghost" size="sm" className="gap-1 font-mono text-xs">
                      View Challenge <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            title="No workout history"
            description="No completed challenges yet. Complete today's challenge to start your streak."
            icon="calendar"
            actionLabel="Start Today's Workout"
            actionHref={`/challenge/${todayDate}`}
          />
        )}
      </Card>
    </div>
  );
}
