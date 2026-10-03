"use client";

import React, { useActionState } from "react";
import Link from "next/link";
import { registerAction } from "@/server/actions";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Lock, Mail, User, Globe, ArrowRight } from "lucide-react";

const COMMON_TIMEZONES = [
  { value: "Asia/Jakarta", label: "Asia/Jakarta (WIB, UTC+7)" },
  { value: "Asia/Makassar", label: "Asia/Makassar (WITA, UTC+8)" },
  { value: "Asia/Jayapura", label: "Asia/Jayapura (WIT, UTC+9)" },
  { value: "UTC", label: "UTC (Coordinated Universal Time)" },
  { value: "America/New_York", label: "America/New_York (Eastern, UTC-5/UTC-4)" },
  { value: "America/Los_Angeles", label: "America/Los_Angeles (Pacific, UTC-8/UTC-7)" },
  { value: "Europe/London", label: "Europe/London (GMT/BST)" },
  { value: "Europe/Berlin", label: "Europe/Berlin (CET/CEST)" },
  { value: "Asia/Tokyo", label: "Asia/Tokyo (JST, UTC+9)" },
  { value: "Australia/Sydney", label: "Australia/Sydney (AEST, UTC+10/11)" },
];

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(registerAction, null);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-[#050505] text-white">
      <div className="w-full max-w-md">
        {/* Brand header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block group mb-3">
            <span className="text-2xl font-bold tracking-tight text-white group-hover:text-zinc-300">
              AETHER <span className="text-xs font-mono text-zinc-500 font-normal">™</span>
            </span>
          </Link>
          <div className="font-mono-tag text-zinc-500">NEW RECRUIT REGISTRATION</div>
          <h2 className="text-xl font-medium tracking-tight text-white mt-2">
            Create Your Athlete Profile
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Establish your identity and lock in your local timezone.
          </p>
        </div>

        {/* Register Card */}
        <Card className="p-6 sm:p-8 border-[#27272A] bg-[#0D0D0E]">
          {state?.error && (
            <div className="mb-6 p-3 rounded-[6px] bg-red-950/40 border border-red-800/50 text-red-300 text-xs">
              {state.error}
            </div>
          )}

          <form action={formAction} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-xs font-medium text-zinc-300 mb-1.5 font-mono"
              >
                FULL NAME
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="e.g. Jordan Hayes"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-[#141417] border border-[#27272A] rounded-[8px] text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-white focus:border-white transition-colors"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-xs font-medium text-zinc-300 mb-1.5 font-mono"
              >
                EMAIL ADDRESS
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="jordan@example.com"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-[#141417] border border-[#27272A] rounded-[8px] text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-white focus:border-white transition-colors"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-medium text-zinc-300 mb-1.5 font-mono"
              >
                PASSWORD
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={6}
                  placeholder="Minimum 6 characters"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-[#141417] border border-[#27272A] rounded-[8px] text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-white focus:border-white transition-colors"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="timezone"
                className="block text-xs font-medium text-zinc-300 mb-1.5 font-mono"
              >
                CALENDAR TIMEZONE
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                  <Globe className="w-4 h-4" />
                </div>
                <select
                  id="timezone"
                  name="timezone"
                  defaultValue="Asia/Jakarta"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-[#141417] border border-[#27272A] rounded-[8px] text-white focus:outline-none focus:ring-1 focus:ring-white focus:border-white transition-colors"
                >
                  {COMMON_TIMEZONES.map((tz) => (
                    <option key={tz.value} value={tz.value} className="bg-[#141417] text-white">
                      {tz.label}
                    </option>
                  ))}
                </select>
              </div>
              <p className="text-[10px] text-zinc-500 mt-1 font-mono">
                Streak cutoffs and challenge active dates follow this local timezone.
              </p>
            </div>

            <div className="pt-2">
              <Button type="submit" variant="primary" size="md" className="w-full" isLoading={isPending}>
                Create Account <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </form>
        </Card>

        {/* Footer switch to login */}
        <div className="text-center mt-6 text-xs text-zinc-400">
          Already registered?{" "}
          <Link href="/login" className="text-white hover:underline font-medium">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
