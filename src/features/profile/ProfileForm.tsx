"use client";

import React, { useActionState } from "react";
import { updateProfileAction, logoutAction } from "@/server/actions";
import { UserRecord } from "@/lib/db/repository";
import { StreakCalculationResult } from "@/lib/streak/engine";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { User, Globe, Mail, LogOut, CheckCircle2, Shield } from "lucide-react";

interface ProfileFormProps {
  user: UserRecord;
  stats: StreakCalculationResult;
}

const POPULAR_TIMEZONES = [
  { value: "Asia/Jakarta", label: "Asia/Jakarta (WIB, UTC+7)" },
  { value: "Asia/Makassar", label: "Asia/Makassar (WITA, UTC+8)" },
  { value: "Asia/Jayapura", label: "Asia/Jayapura (WIT, UTC+9)" },
  { value: "UTC", label: "UTC (Coordinated Universal Time)" },
  { value: "America/New_York", label: "America/New_York (Eastern, UTC-5/UTC-4)" },
  { value: "America/Chicago", label: "America/Chicago (Central, UTC-6/UTC-5)" },
  { value: "America/Denver", label: "America/Denver (Mountain, UTC-7/UTC-6)" },
  { value: "America/Los_Angeles", label: "America/Los_Angeles (Pacific, UTC-8/UTC-7)" },
  { value: "Europe/London", label: "Europe/London (GMT/BST)" },
  { value: "Europe/Berlin", label: "Europe/Berlin (CET/CEST)" },
  { value: "Asia/Tokyo", label: "Asia/Tokyo (JST, UTC+9)" },
  { value: "Australia/Sydney", label: "Australia/Sydney (AEST, UTC+10/11)" },
];

export function ProfileForm({ user, stats }: ProfileFormProps) {
  const [state, formAction, isPending] = useActionState(updateProfileAction, null);

  return (
    <div className="space-y-8">
      {/* Profile Form Card */}
      <Card className="p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#27272A]">
          <div>
            <span className="font-mono-tag text-zinc-400">PERSONAL PROTOCOL</span>
            <h2 className="text-xl font-medium text-white mt-1">Profile Configuration</h2>
          </div>
          <Badge variant="mono">AUTHENTICATED</Badge>
        </div>

        {state?.error && (
          <div className="mb-6 p-3 rounded-[6px] bg-red-950/40 border border-red-800/50 text-red-300 text-xs font-mono">
            {state.error}
          </div>
        )}

        {state?.success && (
          <div className="mb-6 p-3 rounded-[6px] bg-emerald-950/40 border border-emerald-800/50 text-emerald-300 text-xs font-mono flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> Profile updated successfully.
          </div>
        )}

        <form action={formAction} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="name"
                className="block text-xs font-medium text-zinc-300 mb-1.5 font-mono"
              >
                DISPLAY NAME
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  defaultValue={user.name}
                  required
                  className="w-full pl-9 pr-3 py-2 text-sm bg-[#141417] border border-[#27272A] rounded-[8px] text-white focus:outline-none focus:ring-1 focus:ring-white transition-colors"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-xs font-medium text-zinc-300 mb-1.5 font-mono"
              >
                EMAIL ADDRESS (READ-ONLY)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  disabled
                  value={user.email}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-[#0E0E10] border border-[#27272A] rounded-[8px] text-zinc-500 cursor-not-allowed font-mono text-xs"
                />
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="timezone"
              className="block text-xs font-medium text-zinc-300 mb-1.5 font-mono"
            >
              IANA CALENDAR TIMEZONE
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                <Globe className="w-4 h-4" />
              </div>
              <select
                id="timezone"
                name="timezone"
                defaultValue={user.timezone}
                className="w-full pl-9 pr-3 py-2 text-sm bg-[#141417] border border-[#27272A] rounded-[8px] text-white focus:outline-none focus:ring-1 focus:ring-white transition-colors"
              >
                {POPULAR_TIMEZONES.map((tz) => (
                  <option key={tz.value} value={tz.value} className="bg-[#141417] text-white">
                    {tz.label}
                  </option>
                ))}
              </select>
            </div>
            <p className="text-[11px] text-zinc-500 mt-1.5 font-mono">
              Crucial: The streak engine evaluates your consecutive calendar days against this timezone.
            </p>
          </div>

          <div className="pt-2 flex justify-end">
            <Button type="submit" variant="primary" size="md" isLoading={isPending}>
              Save Profile Changes
            </Button>
          </div>
        </form>
      </Card>

      {/* Account Performance & Metadata */}
      <Card className="p-6 sm:p-8">
        <div className="font-mono-tag text-zinc-400 mb-4">ACCOUNT INTEGRITY & STATS</div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-6 border-b border-[#27272A]">
          <div>
            <div className="text-[10px] font-mono text-zinc-500">CURRENT STREAK</div>
            <div className="text-xl font-bold font-mono text-white mt-1">
              {stats.currentStreak} Days
            </div>
          </div>
          <div>
            <div className="text-[10px] font-mono text-zinc-500">BEST STREAK</div>
            <div className="text-xl font-bold font-mono text-white mt-1">
              {stats.longestStreak} Days
            </div>
          </div>
          <div>
            <div className="text-[10px] font-mono text-zinc-500">COMPLETIONS</div>
            <div className="text-xl font-bold font-mono text-white mt-1">
              {stats.totalCompletedDays} Workouts
            </div>
          </div>
          <div>
            <div className="text-[10px] font-mono text-zinc-500">USER ID</div>
            <div className="text-xs font-mono text-zinc-400 mt-1 truncate" title={user.id}>
              {user.id}
            </div>
          </div>
        </div>

        {/* Account Actions / Logout */}
        <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Encrypted HTTP-Only Session</span>
          </div>

          <form action={logoutAction}>
            <Button variant="danger" size="sm" className="gap-2 font-mono text-xs">
              <LogOut className="w-4 h-4" /> Terminate Session (Sign Out)
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
