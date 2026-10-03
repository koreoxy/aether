import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/session";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Flame, Dumbbell, ShieldCheck, ArrowRight, Zap, Trophy, Timer } from "lucide-react";
import { getTodayCalendarDate } from "@/lib/dates/timezone";

export default async function LandingPage() {
  const user = await getCurrentUser();
  const today = getTodayCalendarDate(user?.timezone || "Asia/Jakarta");

  return (
    <div className="min-h-screen flex flex-col bg-[#050505] text-white">
      <Navbar user={user ? { name: user.name, email: user.email } : null} todayDate={today} />

      <main className="flex-1 flex flex-col items-center">
        {/* Hero Section */}
        <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-16 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#27272A] bg-[#0E0E10] text-zinc-300 mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-mono-tag text-[10px] text-zinc-300">01-A. EST. 2025 // AETHER PROTOCOL</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-white max-w-4xl leading-[1.08] mb-6">
            Daily Workout Discipline. <br />
            <span className="text-zinc-500">Unbroken Momentum.</span>
          </h1>

          <p className="text-base sm:text-lg text-[#A1A1AA] max-w-2xl font-normal leading-relaxed mb-10">
            A single, curated daily challenge every calendar day. Complete your routine, secure your proof, and elevate your streak without exceptions.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            {user ? (
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto gap-2">
                  Open Dashboard <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/register" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto gap-2">
                    Claim Today&apos;s Challenge <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/login" className="w-full sm:w-auto">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>

          <div className="mt-12 flex items-center gap-6 text-xs text-zinc-500 font-mono">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" /> SERVER-VERIFIED STREAKS
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Timer className="w-4 h-4 text-amber-500" /> TIMEZONE AWARE
            </span>
          </div>
        </section>

        {/* Bento Grid Showcase - Following DESIGN.md */}
        <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 pb-24">
          <div className="flex items-center justify-between mb-8 border-b border-[#27272A] pb-4">
            <div className="font-mono-tag text-zinc-400">02-B. ARCHITECTURE // FEATURE GRID</div>
            <div className="font-mono-tag text-zinc-500">SPEC: NEUFORM V1</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Bento Card 1: Today's Challenge (2 Columns wide) */}
            <div className="md:col-span-2 rounded-[8px] border border-[#27272A] bg-[#0D0D0E] p-6 sm:p-8 flex flex-col justify-between hover:border-[#3F3F46] transition-all">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="mono">DAILY ENGINE</Badge>
                  <span className="font-mono text-xs text-zinc-400">TODAY &bull; 25 MIN</span>
                </div>
                <h3 className="text-2xl font-medium text-white mb-2 tracking-tight">
                  AETHER ™ Full Body Frontier
                </h3>
                <p className="text-sm text-zinc-400 max-w-xl mb-6 leading-relaxed">
                  Compound push mechanics, bodyweight squat volume, and core endurance intervals. Crafted for maximum functional hypertrophy with zero equipment required.
                </p>

                {/* Workout Preview Checklist */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-[6px] bg-[#141417] border border-[#27272A]/70">
                    <div className="text-[11px] font-mono text-zinc-400">EXERCISE 01</div>
                    <div className="text-sm font-semibold text-white mt-0.5">Push-Ups</div>
                    <div className="text-xs text-zinc-500 mt-1">4 sets &times; 15 reps</div>
                  </div>
                  <div className="p-3 rounded-[6px] bg-[#141417] border border-[#27272A]/70">
                    <div className="text-[11px] font-mono text-zinc-400">EXERCISE 02</div>
                    <div className="text-sm font-semibold text-white mt-0.5">Body Squats</div>
                    <div className="text-xs text-zinc-500 mt-1">4 sets &times; 20 reps</div>
                  </div>
                  <div className="p-3 rounded-[6px] bg-[#141417] border border-[#27272A]/70">
                    <div className="text-[11px] font-mono text-zinc-400">EXERCISE 03</div>
                    <div className="text-sm font-semibold text-white mt-0.5">Forearm Plank</div>
                    <div className="text-xs text-zinc-500 mt-1">3 sets &times; 60s hold</div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-[#27272A] flex items-center justify-between text-xs text-zinc-400">
                <span className="flex items-center gap-2">
                  <Dumbbell className="w-4 h-4 text-white" /> 6 Target Exercises
                </span>
                <span className="font-mono text-zinc-300">EST. DIFFICULTY: ADVANCED</span>
              </div>
            </div>

            {/* Bento Card 2: Streak Fuel */}
            <div className="rounded-[8px] border border-[#27272A] bg-[#0D0D0E] p-6 sm:p-8 flex flex-col justify-between hover:border-[#3F3F46] transition-all relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="warning">STREAK SYSTEM</Badge>
                  <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
                </div>
                <div className="mt-2 mb-1 text-5xl font-mono font-bold tracking-tight text-white flex items-baseline gap-2">
                  14 <span className="text-sm font-normal text-zinc-500">DAYS</span>
                </div>
                <div className="text-xs font-mono text-amber-400/90 mb-4">CONSECUTIVE RECORD</div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Strict calendar-day validation. Missing a single calendar day resets active streak to zero. Idempotent server validation guarantees authentic records.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#27272A]">
                <div className="text-[11px] font-mono text-zinc-500 mb-2">CALENDAR TRAJECTORY</div>
                <div className="flex items-center gap-1.5">
                  {[...Array(7)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-5 flex-1 rounded-[3px] ${
                        i < 6 ? "bg-white text-black" : "bg-[#27272A]"
                      }`}
                      title={i < 6 ? "Completed" : "Today"}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Bento Card 3: Timezone Strategy */}
            <div className="rounded-[8px] border border-[#27272A] bg-[#0D0D0E] p-6 sm:p-8 flex flex-col justify-between hover:border-[#3F3F46] transition-all">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="outline">TIMEZONE INTEGRITY</Badge>
                  <Zap className="w-4 h-4 text-zinc-400" />
                </div>
                <h4 className="text-lg font-medium text-white mb-2">Zero Drift Logic</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  No raw 86,400,000 millisecond comparisons. Built on strict IANA timezone calendar days (`Asia/Jakarta`, `UTC`, `America/New_York`) to withstand DST shifts and international flight travel.
                </p>
              </div>
              <div className="mt-6 font-mono text-[11px] text-zinc-500 border border-[#27272A] p-2.5 rounded-[6px] bg-[#080809]">
                USER_TZ: ASIA/JAKARTA [UTC+7]
              </div>
            </div>

            {/* Bento Card 4: Historical Analytics */}
            <div className="md:col-span-2 rounded-[8px] border border-[#27272A] bg-[#0D0D0E] p-6 sm:p-8 flex flex-col justify-between hover:border-[#3F3F46] transition-all">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="outline">AUDITABLE HISTORY</Badge>
                  <Trophy className="w-4 h-4 text-zinc-400" />
                </div>
                <h4 className="text-xl font-medium text-white mb-2">Completion History Is The Source Of Truth</h4>
                <p className="text-xs text-zinc-400 leading-relaxed max-w-xl">
                  Streaks are never stored as brittle standalone counters. The engine reconstructs active and historical longest streaks dynamically from verified completion records.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-[#27272A]">
                <div>
                  <div className="text-[10px] font-mono text-zinc-500 uppercase">Current Streak</div>
                  <div className="text-xl font-bold font-mono text-white mt-1">2 Days</div>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-zinc-500 uppercase">Longest Streak</div>
                  <div className="text-xl font-bold font-mono text-white mt-1">14 Days</div>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-zinc-500 uppercase">Total Logged</div>
                  <div className="text-xl font-bold font-mono text-white mt-1">38 Days</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Demo Credentials Callout */}
          <div className="mt-8 p-4 sm:p-6 rounded-[8px] border border-[#27272A] bg-[#0A0A0C] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-left">
              <span className="font-mono-tag text-zinc-400">DEMO TEST ACCOUNT READY</span>
              <p className="text-xs text-zinc-400 mt-1">
                Evaluation account pre-configured with 2-day historical streak: <br />
                <span className="text-white font-mono">alex@example.com</span> &bull; Password: <span className="text-white font-mono">password123</span>
              </p>
            </div>
            <Link href="/login">
              <Button size="sm" variant="secondary" className="whitespace-nowrap font-mono text-xs">
                Log In As Alex &rarr;
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-[#27272A] bg-[#050505] py-8 text-center text-xs text-zinc-500 font-mono">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>AETHER ™ // DAILY WORKOUT CHALLENGE & STREAK PROTOCOL</div>
          <div>POWERED BY NEXT.JS &bull; PRISMA 7 &bull; NEON POSTGRESQL</div>
        </div>
      </footer>
    </div>
  );
}
