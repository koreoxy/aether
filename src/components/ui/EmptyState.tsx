import React from "react";
import { Dumbbell, CalendarX, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "./Button";

export interface EmptyStateProps {
  title: string;
  description: string;
  icon?: "dumbbell" | "calendar" | "alert";
  actionLabel?: string;
  actionHref?: string;
}

export function EmptyState({
  title,
  description,
  icon = "dumbbell",
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  const IconComponent =
    icon === "calendar" ? CalendarX : icon === "alert" ? AlertCircle : Dumbbell;

  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-[8px] border border-dashed border-[#27272A] bg-[#0A0A0C]">
      <div className="w-12 h-12 rounded-[8px] bg-[#141416] border border-[#27272A] flex items-center justify-center mb-4 text-zinc-400">
        <IconComponent className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-white tracking-tight mb-1">{title}</h3>
      <p className="text-xs text-[#A1A1AA] max-w-sm mb-6 leading-relaxed">{description}</p>
      {actionLabel && actionHref && (
        <Link href={actionHref}>
          <Button variant="primary" size="sm">
            {actionLabel}
          </Button>
        </Link>
      )}
    </div>
  );
}
