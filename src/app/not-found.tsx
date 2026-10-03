import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505] text-white px-4 text-center">
      <div className="w-12 h-12 rounded-[8px] bg-[#141416] border border-[#27272A] flex items-center justify-center mb-4 text-zinc-400">
        <AlertCircle className="w-6 h-6" />
      </div>
      <div className="font-mono-tag text-zinc-500 mb-2">404 // NOT FOUND</div>
      <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white mb-2">
        Protocol Route Not Located
      </h1>
      <p className="text-xs sm:text-sm text-zinc-400 max-w-sm mb-6">
        The challenge or page you requested does not exist or has been shifted in the schedule.
      </p>
      <Link href="/dashboard">
        <Button variant="primary" size="md">
          Return to Dashboard
        </Button>
      </Link>
    </div>
  );
}
