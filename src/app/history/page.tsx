import React from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import {
  getAllChallenges,
  getUserCompletions,
  getUserStreakStats,
} from "@/lib/db/repository";
import { getTodayCalendarDate } from "@/lib/dates/timezone";
import { Navbar } from "@/components/layout/Navbar";
import { HistoryView } from "@/features/history/HistoryView";

export default async function HistoryPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const timezone = user.timezone || "Asia/Jakarta";
  const todayDate = getTodayCalendarDate(timezone);

  const stats = await getUserStreakStats(user.id, timezone);
  const completions = await getUserCompletions(user.id);
  const challenges = await getAllChallenges();

  return (
    <div className="min-h-screen flex flex-col bg-[#050505] text-white">
      <Navbar
        user={{ name: user.name, email: user.email }}
        currentStreak={stats.currentStreak}
        todayDate={todayDate}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6">
        <div className="pb-6 border-b border-[#27272A]">
          <div className="font-mono-tag text-zinc-400 mb-1">03-C. AUDIT TRAIL // STREAK ARCHIVE</div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
            Workout History & Calendar
          </h1>
          <p className="text-xs sm:text-sm text-[#A1A1AA] mt-1">
            Complete historical audit of your daily challenges, streaks, and calendar completions.
          </p>
        </div>

        <HistoryView
          stats={stats}
          completions={completions}
          challenges={challenges}
          todayDate={todayDate}
          userTimezone={timezone}
        />
      </main>
    </div>
  );
}
