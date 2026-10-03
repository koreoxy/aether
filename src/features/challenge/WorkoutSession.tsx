"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { completeChallengeAction } from "@/server/actions";
import { ChallengeWithExercises } from "@/lib/db/repository";
import { Button } from "@/components/ui/Button";
import { Badge, DifficultyBadge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import {
  CheckCircle2,
  Clock,
  Dumbbell,
  Play,
  Pause,
  RotateCcw,
  ArrowRight,
  Flame,
  Check,
  ChevronRight,
  ChevronLeft,
  Trophy,
} from "lucide-react";

interface WorkoutSessionProps {
  challenge: ChallengeWithExercises;
  isAlreadyCompleted: boolean;
  userTimezone: string;
}

export function WorkoutSession({
  challenge,
  isAlreadyCompleted: initialCompleted,
}: WorkoutSessionProps) {
  const [isCompleted, setIsCompleted] = useState(initialCompleted);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [newStreakData, setNewStreakData] = useState<{
    currentStreak: number;
    longestStreak: number;
  } | null>(null);

  // Guided Workout Flow States
  const [hasStarted, setHasStarted] = useState(false);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [completedSets, setCompletedSets] = useState<Record<string, number>>({});

  // Built-in Exercise / Rest Stopwatch & Timer
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning]);

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const currentExercise = challenge.exercises[currentExerciseIndex];
  const totalExercises = challenge.exercises.length;

  const handleStartWorkout = () => {
    setHasStarted(true);
    setIsTimerRunning(true);
  };

  const handleCompleteSet = (exerciseId: string, totalSets: number) => {
    setCompletedSets((prev) => {
      const current = prev[exerciseId] || 0;
      return {
        ...prev,
        [exerciseId]: Math.min(totalSets, current + 1),
      };
    });
  };

  const handleNextExercise = () => {
    if (currentExerciseIndex < totalExercises - 1) {
      setCurrentExerciseIndex((prev) => prev + 1);
    }
  };

  const handlePrevExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex((prev) => prev - 1);
    }
  };

  const handleCompleteChallenge = async () => {
    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      const res = await completeChallengeAction({
        challengeId: challenge.id,
        challengeDate: challenge.date,
      });

      if (!res.success) {
        setSubmissionError(res.error || "Failed to submit challenge completion");
        setIsSubmitting(false);
        return;
      }

      setIsCompleted(true);
      setIsTimerRunning(false);
      if (res.data?.stats) {
        setNewStreakData({
          currentStreak: res.data.stats.currentStreak,
          longestStreak: res.data.stats.longestStreak,
        });
      }
    } catch {
      setSubmissionError("Network error while recording challenge completion");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ----------------- COMPLETED STATE VIEW -----------------
  if (isCompleted) {
    return (
      <div className="space-y-6">
        <div className="rounded-[8px] border border-emerald-800/40 bg-gradient-to-b from-[#0D1812] to-[#0A0E0C] p-6 sm:p-10 text-center relative overflow-hidden">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="font-mono-tag text-emerald-400 mb-2">VERIFIED PROTOCOL COMPLETION</div>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white mb-2">
            Challenge Complete!
          </h2>
          <p className="text-xs sm:text-sm text-zinc-300 max-w-md mx-auto leading-relaxed mb-8">
            Your workout has been permanently recorded for calendar day{" "}
            <span className="font-mono text-white font-semibold">{challenge.date}</span>.
          </p>

          {/* New Streak Display */}
          {newStreakData && (
            <div className="inline-flex items-center gap-6 px-6 py-4 rounded-[8px] bg-[#0E1511] border border-emerald-700/30 mb-8">
              <div className="flex items-center gap-2">
                <Flame className="w-6 h-6 text-amber-400 fill-amber-400 animate-pulse" />
                <div className="text-left">
                  <div className="text-[10px] font-mono text-zinc-400">ACTIVE STREAK</div>
                  <div className="text-2xl font-bold font-mono text-white">
                    {newStreakData.currentStreak} DAYS
                  </div>
                </div>
              </div>

              <div className="h-8 w-px bg-[#27272A]" />

              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-zinc-300" />
                <div className="text-left">
                  <div className="text-[10px] font-mono text-zinc-400">BEST RECORD</div>
                  <div className="text-xl font-bold font-mono text-white">
                    {newStreakData.longestStreak} DAYS
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard">
              <Button variant="primary" size="md" className="gap-2">
                Return to Dashboard <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/history">
              <Button variant="outline" size="md">
                View Completion Calendar
              </Button>
            </Link>
          </div>
        </div>

        {/* Exercises Summary List */}
        <Card className="p-6">
          <div className="font-mono-tag text-zinc-400 mb-4">COMPLETED EXERCISES</div>
          <div className="space-y-3">
            {challenge.exercises.map((item, idx) => (
              <div
                key={item.id}
                className="p-3 rounded-[6px] bg-[#141416] border border-[#27272A] flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-mono">
                    ✓
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">{item.exercise.name}</div>
                    <div className="text-xs text-zinc-500">
                      {item.sets} sets &bull; {item.repetitions ? `${item.repetitions} reps` : `${item.durationSeconds}s duration`}
                    </div>
                  </div>
                </div>
                <Badge variant="outline">DONE</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  // ----------------- ACTIVE WORKOUT & NOT STARTED STATES -----------------
  return (
    <div className="space-y-6">
      {submissionError && (
        <div className="p-4 rounded-[6px] bg-red-950/40 border border-red-800/50 text-red-300 text-xs font-mono">
          {submissionError}
        </div>
      )}

      {/* Overview & Workout Controller Card */}
      <div className="rounded-[8px] border border-[#27272A] bg-[#0D0D0E] p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="mono">TARGET DATE: {challenge.date}</Badge>
              <DifficultyBadge difficulty={challenge.difficulty} />
              <span className="text-xs font-mono text-zinc-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {challenge.estimatedDuration} MIN
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-white">
              {challenge.title}
            </h1>
            <p className="text-sm text-[#A1A1AA] max-w-2xl mt-1 leading-relaxed">
              {challenge.description}
            </p>
          </div>

          {/* Session Timer & Controller */}
          <div className="flex items-center gap-3 bg-[#141417] border border-[#27272A] p-2.5 rounded-[8px]">
            <div className="font-mono text-lg font-bold text-white px-2">
              {formatTimer(timerSeconds)}
            </div>
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="p-1.5 rounded-[4px] bg-[#1E1E22] hover:bg-[#27272A] text-zinc-300"
              title={isTimerRunning ? "Pause Timer" : "Start Timer"}
            >
              {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button
              onClick={() => {
                setIsTimerRunning(false);
                setTimerSeconds(0);
              }}
              className="p-1.5 rounded-[4px] bg-[#1E1E22] hover:bg-[#27272A] text-zinc-400"
              title="Reset Timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Guided Stepper Mode when Started */}
        {hasStarted && currentExercise ? (
          <div className="border-t border-[#27272A] pt-6 space-y-6">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
              <span>
                STEP {currentExerciseIndex + 1} OF {totalExercises}
              </span>
              <span>{Math.round(((currentExerciseIndex + 1) / totalExercises) * 100)}% COMPLETE</span>
            </div>

            {/* Stepper Progress Bar */}
            <div className="w-full bg-[#18181B] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-white h-full transition-all duration-300"
                style={{ width: `${((currentExerciseIndex + 1) / totalExercises) * 100}%` }}
              />
            </div>

            {/* Current Exercise Detail Panel */}
            <div className="p-6 rounded-[8px] bg-[#121215] border border-[#27272A] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="text-[10px] font-mono text-zinc-500 uppercase">
                    Current Movement
                  </div>
                  <h3 className="text-xl font-semibold text-white tracking-tight">
                    {currentExercise.exercise.name}
                  </h3>
                </div>
                <div className="flex items-center gap-2 font-mono text-xs text-zinc-300">
                  <span className="px-2.5 py-1 rounded-[4px] bg-[#1A1A1E] border border-[#27272A]">
                    {currentExercise.sets} Sets
                  </span>
                  <span className="px-2.5 py-1 rounded-[4px] bg-[#1A1A1E] border border-[#27272A]">
                    {currentExercise.repetitions
                      ? `${currentExercise.repetitions} Reps`
                      : `${currentExercise.durationSeconds}s Hold`}
                  </span>
                </div>
              </div>

              <p className="text-xs text-zinc-300 leading-relaxed">
                {currentExercise.exercise.instructions}
              </p>

              {/* Set Tracker Checkers */}
              <div className="pt-2">
                <div className="text-[11px] font-mono text-zinc-400 mb-2">SETS LOG:</div>
                <div className="flex flex-wrap gap-2">
                  {[...Array(currentExercise.sets)].map((_, sIdx) => {
                    const isDone = (completedSets[currentExercise.id] || 0) > sIdx;
                    return (
                      <button
                        key={sIdx}
                        onClick={() =>
                          handleCompleteSet(currentExercise.id, currentExercise.sets)
                        }
                        className={`px-3 py-1.5 rounded-[4px] text-xs font-mono font-medium flex items-center gap-1.5 transition-colors ${
                          isDone
                            ? "bg-white text-black font-semibold"
                            : "bg-[#18181B] text-zinc-400 border border-[#27272A] hover:bg-[#202024]"
                        }`}
                      >
                        {isDone ? <Check className="w-3.5 h-3.5" /> : null}
                        SET {sIdx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Navigation buttons between exercises */}
            <div className="flex items-center justify-between pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevExercise}
                disabled={currentExerciseIndex === 0}
                className="gap-1 font-mono text-xs"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </Button>

              {currentExerciseIndex < totalExercises - 1 ? (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleNextExercise}
                  className="gap-1 font-mono text-xs"
                >
                  Next Movement <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleCompleteChallenge}
                  isLoading={isSubmitting}
                  className="gap-2 font-mono text-xs font-bold bg-white text-black hover:bg-neutral-200"
                >
                  <CheckCircle2 className="w-4 h-4" /> Complete Challenge
                </Button>
              )}
            </div>
          </div>
        ) : (
          /* Not Started State */
          <div className="border-t border-[#27272A] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-zinc-400">
              Ready to begin? Click Start Workout to activate the guided sequence and session timer.
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Button
                variant="primary"
                size="md"
                onClick={handleStartWorkout}
                className="w-full sm:w-auto gap-2 font-mono text-xs"
              >
                <Play className="w-4 h-4 fill-black" /> Start Workout
              </Button>

              <Button
                variant="secondary"
                size="md"
                onClick={handleCompleteChallenge}
                isLoading={isSubmitting}
                className="w-full sm:w-auto font-mono text-xs whitespace-nowrap"
              >
                Mark As Finished
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Complete Workout Exercise List */}
      <Card className="p-6 sm:p-8">
        <div className="font-mono-tag text-zinc-400 mb-4">
          FULL EXERCISE SPECIFICATION // {totalExercises} MOVEMENTS
        </div>

        <div className="space-y-4">
          {challenge.exercises.map((item, idx) => (
            <div
              key={item.id}
              className={`p-4 rounded-[6px] border transition-colors ${
                hasStarted && currentExerciseIndex === idx
                  ? "border-white/60 bg-[#16161A]"
                  : "border-[#27272A] bg-[#121214]"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-start gap-3">
                  <span className="font-mono text-xs text-zinc-500 mt-0.5">0{idx + 1}</span>
                  <div>
                    <h4 className="text-sm font-semibold text-white tracking-tight">
                      {item.exercise.name}
                    </h4>
                    <p className="text-xs text-zinc-400 mt-1 max-w-xl">
                      {item.exercise.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 font-mono text-xs text-zinc-300 self-start sm:self-center shrink-0">
                  <span className="px-2 py-0.5 rounded bg-[#18181B] border border-[#27272A]">
                    {item.sets} Sets
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#18181B] border border-[#27272A]">
                    {item.repetitions ? `${item.repetitions} Reps` : `${item.durationSeconds}s Duration`}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Direct Complete Bar */}
        <div className="mt-8 pt-6 border-t border-[#27272A] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-zinc-400">
            Finished your workout? Send verification to update your streak.
          </div>
          <Button
            variant="primary"
            size="md"
            onClick={handleCompleteChallenge}
            isLoading={isSubmitting}
            className="w-full sm:w-auto gap-2 font-mono text-xs font-semibold"
          >
            <CheckCircle2 className="w-4 h-4" /> Complete Challenge
          </Button>
        </div>
      </Card>
    </div>
  );
}
