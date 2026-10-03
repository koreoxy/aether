import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505]">
      <LoadingSpinner text="SYNCHRONIZING WITH AETHER PROTOCOL..." />
    </div>
  );
}
