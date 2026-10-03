import React from "react";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import {
  getDailyChallengeByDate,
  getUserCompletions,
  getUserStreakStats,
} from "@/lib/db/repository";
import { getTodayCalendarDate, isValidDateString } from "@/lib/dates/timezone";
import { Navbar } from "@/components/layout/Navbar";
import { WorkoutSession } from "@/features/challenge/WorkoutSession";
import { EmptyState } from "@/components/ui/EmptyState";

interface PageProps {
  params: Promise<{
    date: string;
  }>;
}

export default async function ChallengeDetailPage({ params }: PageProps) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const { date } = await params;
  if (!isValidDateString(date)) {
    notFound();
  }

  const timezone = user.timezone || "Asia/Jakarta";
  const todayDate = getTodayCalendarDate(timezone);
  const stats = await getUserStreakStats(user.id, timezone);

  const challenge = await getDailyChallengeByDate(date);
  const completions = await getUserCompletions(user.id);
  const isAlreadyCompleted = completions.some(
    (c) => c.challengeDate === date || (challenge && c.challengeId === challenge.id)
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#050505] text-white">
      <Navbar
        user={{ name: user.name, email: user.email }}
        currentStreak={stats.currentStreak}
        todayDate={todayDate}
      />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {challenge ? (
          <WorkoutSession
            challenge={challenge}
            isAlreadyCompleted={isAlreadyCompleted}
            userTimezone={timezone}
          />
        ) : (
          <EmptyState
            title="No Challenge Found"
            description={`There is no daily workout challenge scheduled for ${date}.`}
            icon="dumbbell"
            actionLabel="Back to Dashboard"
            actionHref="/dashboard"
          />
        )}
      </main>
    </div>
  );
}
