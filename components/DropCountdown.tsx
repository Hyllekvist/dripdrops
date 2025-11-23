// components/DropHeaderCountdown.tsx
"use client";

import { useEffect, useState } from "react";
import { UpcomingReminder } from "@/components/UpcomingReminder";

type DropMode = "live" | "upcoming" | "expired";

type Props = {
  mode: DropMode;
  startsAt: string | null; // ISO-timestamp
  itemId: string;
};

export function DropHeaderCountdown({ mode, startsAt, itemId }: Props) {
  const [remainingMs, setRemainingMs] = useState<number | null>(null);

  useEffect(() => {
    if (mode !== "upcoming" || !startsAt) return;

    const target = new Date(startsAt).getTime();
    if (Number.isNaN(target)) return;

    const tick = () => {
      setRemainingMs(target - Date.now());
    };

    tick(); // første opdatering
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [mode, startsAt]);

  // Kun relevant for upcoming
  if (mode !== "upcoming" || !startsAt || remainingMs === null) return null;

  // Hvis tiden er gået
  if (remainingMs <= 0) {
    return (
      <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1">
        <span className="text-[11px] font-semibold text-emerald-300">
          Drop er live
        </span>
      </div>
    );
  }

  const totalSeconds = Math.floor(remainingMs / 1000);
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/90 px-3 py-1">
      <span className="text-[11px] font-medium text-amber-300">
        Dropper om {minutes}:{seconds}
      </span>
      <span className="h-4 w-px bg-slate-700" />
      <UpcomingReminder itemId={itemId} />
    </div>
  );
}
