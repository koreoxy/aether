import React from "react";
import { Loader2 } from "lucide-react";

export function LoadingSpinner({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
      <span className="font-mono-tag text-zinc-500 text-[11px]">{text}</span>
    </div>
  );
}
