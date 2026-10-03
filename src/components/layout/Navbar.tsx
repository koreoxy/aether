"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Flame, Menu, X, User, Calendar, Dumbbell, LayoutDashboard, LogOut } from "lucide-react";
import { logoutAction } from "@/server/actions";

interface NavbarProps {
  user?: {
    name: string;
    email: string;
  } | null;
  currentStreak?: number;
  todayDate?: string;
}

export function Navbar({ user, currentStreak = 0, todayDate = "" }: NavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const todayUrl = todayDate ? `/challenge/${todayDate}` : "/dashboard";

  interface NavLinkItem {
    href: string;
    label: string;
    icon?: React.ComponentType<{ className?: string }>;
  }

  const navLinks: NavLinkItem[] = user
    ? [
        { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: todayUrl, label: "Challenge", icon: Dumbbell },
        { href: "/history", label: "History", icon: Calendar },
        { href: "/profile", label: "Profile", icon: User },
      ]
    : [
        { href: "/login", label: "Sign In" },
        { href: "/register", label: "Register" },
      ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#27272A] bg-[#050505]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-2 group">
              <span className="text-xl font-bold tracking-tight text-white group-hover:text-zinc-300 transition-colors">
                AETHER <span className="text-xs font-mono text-zinc-500 font-normal">™</span>
              </span>
              <span className="hidden sm:inline-block font-mono-tag text-[10px] text-zinc-400 border border-[#27272A] px-2 py-0.5 rounded-[4px] bg-[#101012]">
                EST. 2025 // STREAK
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          {user && (
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive =
                  pathname === link.href || (link.label === "Challenge" && pathname.startsWith("/challenge"));
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-[6px] text-xs font-medium tracking-wide transition-all ${
                      isActive
                        ? "bg-white text-black font-semibold shadow-sm"
                        : "text-zinc-400 hover:text-white hover:bg-[#141416]"
                    }`}
                  >
                    {Icon && <Icon className="w-3.5 h-3.5" />}
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          )}

          {/* Right Header Section: Streak Badge & User Controls */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                {/* Active Streak Counter Badge */}
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-[6px] bg-[#0F0F12] border border-[#27272A] text-zinc-200">
                  <Flame
                    className={`w-4 h-4 ${
                      currentStreak > 0 ? "text-amber-400 fill-amber-400 animate-pulse" : "text-zinc-500"
                    }`}
                  />
                  <span className="font-mono text-xs font-bold tracking-tight">
                    {currentStreak} <span className="text-[10px] text-zinc-400 font-normal">DAY{currentStreak === 1 ? "" : "S"}</span>
                  </span>
                </div>

                {/* User quick name & Logout */}
                <form action={logoutAction} className="hidden sm:flex items-center">
                  <button
                    type="submit"
                    title="Sign Out"
                    className="p-1.5 rounded-[6px] text-zinc-400 hover:text-white hover:bg-[#18181B] transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </form>
              </>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3.5 py-1.5 text-xs text-zinc-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-1.5 text-xs font-medium bg-white text-black hover:bg-neutral-200 rounded-[6px] transition-colors"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-[6px] text-zinc-400 hover:text-white hover:bg-[#141416]"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#27272A] bg-[#0A0A0C] px-4 pt-3 pb-5 space-y-2">
          {user ? (
            <>
              <div className="px-2 py-1.5 mb-2 border-b border-[#27272A]/60 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-white">{user.name}</div>
                  <div className="text-[10px] font-mono text-zinc-400">{user.email}</div>
                </div>
                <div className="flex items-center gap-1 text-xs font-mono text-amber-400">
                  <Flame className="w-3.5 h-3.5 fill-amber-400" /> {currentStreak} Days
                </div>
              </div>

              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-[6px] text-xs font-medium ${
                      isActive ? "bg-white text-black font-semibold" : "text-zinc-300 hover:bg-[#141416]"
                    }`}
                  >
                    {Icon && <Icon className="w-4 h-4" />}
                    {link.label}
                  </Link>
                );
              })}

              <div className="pt-2 border-t border-[#27272A]/60">
                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-red-950/20 rounded-[6px]"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="space-y-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center py-2 text-sm text-zinc-300 hover:text-white"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center py-2 text-sm font-semibold bg-white text-black rounded-[6px]"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
