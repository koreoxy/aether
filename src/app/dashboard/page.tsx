import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import {
  getDailyChallengeByDate,
  getUserCompletions,
  getUserStreakStats,
} from "@/lib/db/repository";
import {
  formatDisplayDate,
  getPreviousCalendarDay,
  getTodayCalendarDate,
} from "@/lib/dates/timezone";
import { Navbar } from "@/components/layout/Navbar";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge, DifficultyBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Flame,
  Trophy,
  Dumbbell,
  CheckCircle2,
  Clock,
  ArrowRight,
  Calendar,
  Sparkles,
  Zap,
} from "lucide-react";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const timezone = user.timezone || "Asia/Jakarta";
  const todayDate = getTodayCalendarDate(timezone);
  const todayDisplay = formatDisplayDate(todayDate);

  // Fetch streak statistics and today's challenge
  const stats = await getUserStreakStats(user.id, timezone);
  const todayChallenge = await getDailyChallengeByDate(todayDate);
  const completions = await getUserCompletions(user.id);

  // Check if today's challenge is completed
  const isCompletedToday = stats.isCompletedToday;

  // Prepare 7-day progress trail (from 6 days ago up to today)
  const past7Days: { date: string; isCompleted: boolean; isToday: boolean; label: string }[] = [];
  let curr = todayDate;
  const daysList = [curr];
  for (let i = 0; i < 6; i++) {
    curr = getPreviousCalendarDay(curr);
    daysList.unshift(curr);
  }

  const completionDateSet = new Set(completions.map((c) => c.challengeDate));
  for (const d of daysList) {
    past7Days.push({
      date: d,
      isCompleted: completionDateSet.has(d),
      isToday: d === todayDate,
      label: formatDisplayDate(d, { weekday: "narrow" }),
    });
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#050505] text-white">
      <Navbar
        user={{ name: user.name, email: user.email }}
        currentStreak={stats.currentStreak}
        todayDate={todayDate}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        {/* Welcome & Status Ribbon */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#27272A]">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="font-mono-tag text-zinc-400">ATHLETE // {user.name}</span>
              <span className="text-zinc-600">&bull;</span>
              <span className="font-mono text-xs text-zinc-500">{timezone}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
              Daily Mission Control
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3.5 py-1.5 rounded-[6px] bg-[#0E0E10] border border-[#27272A] flex items-center gap-2 text-xs font-mono text-zinc-300">
              <Calendar className="w-3.5 h-3.5 text-zinc-400" />
              <span>{todayDisplay}</span>
            </div>
          </div>
        </div>

        {/* Streak Metrics Bento Strip (3 Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Card 1: Current Streak */}
          <Card className="relative overflow-hidden group">
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono-tag text-zinc-400">CURRENT STREAK</span>
              <div className="p-1.5 rounded-[4px] bg-[#141416] border border-[#27272A]">
                <Flame
                  className={`w-4 h-4 ${
                    stats.currentStreak > 0
                      ? "text-amber-400 fill-amber-400 animate-pulse"
                      : "text-zinc-500"
                  }`}
                />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-bold font-mono tracking-tight text-white">
                {stats.currentStreak}
              </span>
              <span className="text-xs font-mono text-zinc-500">
                DAY{stats.currentStreak === 1 ? "" : "S"}
              </span>
            </div>
            <div className="mt-3 text-xs text-zinc-400">
              {isCompletedToday ? (
                <span className="text-emerald-400 flex items-center gap-1 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Completed today. Streak protected!
                </span>
              ) : stats.currentStreak > 0 ? (
                <span className="text-amber-400/90 font-medium">
                  Active streak. Finish today to push to {stats.currentStreak + 1}!
                </span>
              ) : (
                <span className="text-zinc-500">Start your streak today.</span>
              )}
            </div>
          </Card>

          {/* Card 2: Longest Streak */}
          <Card>
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono-tag text-zinc-400">LONGEST RECORD</span>
              <div className="p-1.5 rounded-[4px] bg-[#141416] border border-[#27272A]">
                <Trophy className="w-4 h-4 text-zinc-300" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-bold font-mono tracking-tight text-white">
                {stats.longestStreak}
              </span>
              <span className="text-xs font-mono text-zinc-500">
                DAY{stats.longestStreak === 1 ? "" : "S"}
              </span>
            </div>
            <div className="mt-3 text-xs text-zinc-500">
              Personal all-time continuous record
            </div>
          </Card>

          {/* Card 3: Total Completed */}
          <Card>
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono-tag text-zinc-400">TOTAL SESSIONS</span>
              <div className="p-1.5 rounded-[4px] bg-[#141416] border border-[#27272A]">
                <Dumbbell className="w-4 h-4 text-zinc-300" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-bold font-mono tracking-tight text-white">
                {stats.totalCompletedDays}
              </span>
              <span className="text-xs font-mono text-zinc-500">WORKOUTS</span>
            </div>
            <div className="mt-3 text-xs text-zinc-500">Verified server completions</div>
          </Card>
        </div>

        {/* Primary Feature: Today's Workout Challenge */}
        {todayChallenge ? (
          <div className="rounded-[8px] border border-[#27272A] bg-[#0D0D0E] p-6 sm:p-8 relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="mono">01-A. TODAY&apos;S CHALLENGE</Badge>
                  <DifficultyBadge difficulty={todayChallenge.difficulty} />
                  <span className="text-xs font-mono text-zinc-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {todayChallenge.estimatedDuration} MIN
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-white">
                  {todayChallenge.title}
                </h2>
                <p className="text-sm text-[#A1A1AA] max-w-2xl mt-1.5 leading-relaxed">
                  {todayChallenge.description}
                </p>
              </div>

              {/* Status & CTA Badge */}
              <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-3 shrink-0">
                {isCompletedToday ? (
                  <div className="px-3.5 py-1.5 rounded-[6px] bg-emerald-950/40 border border-emerald-800/40 text-emerald-400 text-xs font-mono font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> COMPLETED TODAY ✓
                  </div>
                ) : (
                  <div className="px-3.5 py-1.5 rounded-[6px] bg-amber-950/30 border border-amber-800/40 text-amber-300 text-xs font-mono font-semibold flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-400 animate-bounce" /> READY TO PERFORM
                  </div>
                )}

                <Link href={`/challenge/${todayDate}`}>
                  <Button
                    size="md"
                    variant={isCompletedToday ? "secondary" : "primary"}
                    className="gap-2 font-mono text-xs font-semibold"
                  >
                    {isCompletedToday ? "Review Workout" : "Start Workout"}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Exercises Grid Preview */}
            <div className="border-t border-[#27272A] pt-6">
              <div className="font-mono-tag text-zinc-400 mb-4">
                WORKOUT EXERCISES // {todayChallenge.exercises.length} MOVEMENTS
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {todayChallenge.exercises.map((item, idx) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-[6px] bg-[#141417] border border-[#27272A]/70 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 mb-1">
                        <span>EXERCISE 0{idx + 1}</span>
                        <span>{item.exercise.category || "Full Body"}</span>
                      </div>
                      <div className="text-sm font-semibold text-white tracking-tight">
                        {item.exercise.name}
                      </div>
                    </div>
                    <div className="mt-2 text-xs font-mono text-zinc-400 flex items-center justify-between pt-2 border-t border-[#27272A]/40">
                      <span>{item.sets} Sets</span>
                      <span>
                        {item.repetitions
                          ? `${item.repetitions} Reps`
                          : `${item.durationSeconds}s Duration`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <Card className="p-8 text-center text-zinc-400">
            <p>No workout challenge scheduled for today ({todayDate}).</p>
          </Card>
        )}

        {/* 7-Day Trajectory Strip */}
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <span className="font-mono-tag text-zinc-400">TRAJECTORY MATRIX</span>
              <h3 className="text-base font-medium text-white mt-1">7-Day Momentum Window</h3>
            </div>
            <Link
              href="/history"
              className="text-xs font-mono text-zinc-400 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              View Full History <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-7 gap-2 sm:gap-3 pt-2">
            {past7Days.map((day) => (
              <div
                key={day.date}
                className={`p-3 rounded-[6px] border text-center flex flex-col items-center justify-between gap-2 ${
                  day.isToday
                    ? "border-white/50 bg-[#16161A]"
                    : "border-[#27272A] bg-[#0E0E10]"
                }`}
              >
                <div className="text-[11px] font-mono text-zinc-400">{day.label}</div>
                <div>
                  {day.isCompleted ? (
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  ) : day.isToday ? (
                    <div className="w-6 h-6 rounded-full border border-dashed border-amber-400/60 flex items-center justify-center text-amber-400 text-xs font-mono">
                      &bull;
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full border border-[#27272A] flex items-center justify-center text-zinc-600 text-[10px] font-mono">
                      -
                    </div>
                  )}
                </div>
                <div className="text-[10px] font-mono text-zinc-500">
                  {day.date.slice(8)}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </main>
    </div>
  );
}
