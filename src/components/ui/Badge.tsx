import React from "react";

export interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "outline" | "success" | "warning" | "danger" | "mono";
  className?: string;
}

export function Badge({ children, variant = "default", className = "" }: BadgeProps) {
  const base =
    "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[4px] font-mono-tag font-semibold text-[10px] tracking-wider transition-colors";

  const variants = {
    default: "bg-[#18181B] text-zinc-300 border border-[#27272A]",
    outline: "border border-[#27272A] text-zinc-400 bg-transparent",
    success: "bg-emerald-950/40 text-emerald-400 border border-emerald-800/40",
    warning: "bg-amber-950/40 text-amber-400 border border-amber-800/40",
    danger: "bg-rose-950/40 text-rose-400 border border-rose-800/40",
    mono: "bg-white/10 text-white border border-white/20",
  };

  return <span className={`${base} ${variants[variant]} ${className}`}>{children}</span>;
}

export function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const norm = difficulty.toLowerCase();
  if (norm.includes("adv")) {
    return <Badge variant="danger">ADVANCED</Badge>;
  }
  if (norm.includes("beg")) {
    return <Badge variant="success">BEGINNER</Badge>;
  }
  return <Badge variant="warning">INTERMEDIATE</Badge>;
}
