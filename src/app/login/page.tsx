"use client";

import React, { useActionState, useState } from "react";
import Link from "next/link";
import { loginAction } from "@/server/actions";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Lock, Mail, ArrowRight, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleFillDemo = () => {
    setEmail("alex@example.com");
    setPassword("password123");
  };

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
          <div className="font-mono-tag text-zinc-500">AUTHENTICATION GATEWAY</div>
          <h2 className="text-xl font-medium tracking-tight text-white mt-2">
            Sign In to Your Protocol
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Access your daily challenges and continue your streak.
          </p>
        </div>

        {/* Login Card */}
        <Card className="p-6 sm:p-8 border-[#27272A] bg-[#0D0D0E]">
          {state?.error && (
            <div className="mb-6 p-3 rounded-[6px] bg-red-950/40 border border-red-800/50 text-red-300 text-xs">
              {state.error}
            </div>
          )}

          <form action={formAction} className="space-y-4">
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@example.com"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-[#141417] border border-[#27272A] rounded-[8px] text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-white focus:border-white transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-xs font-medium text-zinc-300 font-mono"
                >
                  PASSWORD
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-[#141417] border border-[#27272A] rounded-[8px] text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-white focus:border-white transition-colors"
                />
              </div>
            </div>

            <div className="pt-2">
              <Button type="submit" variant="primary" size="md" className="w-full" isLoading={isPending}>
                Sign In <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </form>

          {/* Quick Demo Credentials Autofill */}
          <div className="mt-6 pt-5 border-t border-[#27272A]/80 text-center">
            <button
              type="button"
              onClick={handleFillDemo}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] bg-[#141417] hover:bg-[#1C1C20] border border-[#27272A] text-xs font-mono text-zinc-300 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Autofill Test Account (Alex)
            </button>
            <p className="text-[11px] text-zinc-500 mt-2 font-mono">
              alex@example.com &bull; password123
            </p>
          </div>
        </Card>

        {/* Footer switch to register */}
        <div className="text-center mt-6 text-xs text-zinc-400">
          Do not have an account?{" "}
          <Link href="/register" className="text-white hover:underline font-medium">
            Register now
          </Link>
        </div>
      </div>
    </div>
  );
}
