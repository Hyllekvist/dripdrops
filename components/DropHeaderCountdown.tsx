// components/DropHeaderCountdown.tsx
"use client";

import { useCountdown } from "@/hooks/useCountdown";
import { UpcomingReminder } from "@/components/UpcomingReminder";

type Props = {
  mode: "live" | "upcoming" | "expired";
  startsAt: string | null;
  itemId: string;
};

export function DropHeaderCountdown({ mode, startsAt, itemId }: Props) {
  const remaining = useCountdown(startsAt);

  if (mode !== "upcoming" || !startsAt) return null;

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/90 px-3 py-1">
      <span className="text-[11px] font-medium text-amber-300">
        Dropper om {remaining ?? "--:--"}
      </span>
      <span className="h-4 w-px bg-slate-700" />
      <div className="flex items-center gap-1">
        <UpcomingReminder itemId={itemId} />
      </div>
    </div>
  );
}
