"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { AlertTriangle, RotateCcw } from "lucide-react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to monitoring if configured
    console.error("Application error boundary caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505] text-white px-4 text-center">
      <div className="w-12 h-12 rounded-[8px] bg-red-950/30 border border-red-800/40 flex items-center justify-center mb-4 text-red-400">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <div className="font-mono-tag text-red-400 mb-2">SYSTEM EXCEPTION ENCOUNTERED</div>
      <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white mb-2">
        Something Went Wrong
      </h1>
      <p className="text-xs sm:text-sm text-zinc-400 max-w-sm mb-6 leading-relaxed">
        An unexpected error occurred during request execution. Your streak data remains securely stored.
      </p>
      <div className="flex items-center gap-3">
        <Button variant="primary" size="md" onClick={() => reset()} className="gap-2 font-mono text-xs">
          <RotateCcw className="w-4 h-4" /> Try Again
        </Button>
        <Link href="/dashboard">
          <Button variant="outline" size="md" className="font-mono text-xs">
            Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
