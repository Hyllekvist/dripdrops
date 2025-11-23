"use client";

import { useCountdown } from "@/app/hooks/useCountdown";
import { UpcomingReminder } from "@/components/UpcomingReminder";

type DropMode = "live" | "upcoming" | "expired";

type Props = {
  mode: DropMode;
  startsAt: string | null; // ISO timestamp
  itemId: string;
};

export function DropHeaderCountdown({ mode, startsAt, itemId }: Props) {
  // Kun upcoming bruger countdown
  if (mode !== "upcoming" || !startsAt) return null;

  const timeLeft = useCountdown(startsAt); // returnerer "MM:SS" eller "00:00"

  // Hvis hook returnerer null → endnu ikke loadet første tick
  if (timeLeft === null) return null;

  // Når tiden rammer, viser vi 'Drop er live'
  if (timeLeft === "00:00") {
    return (
      <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1">
        <span className="text-[11px] font-semibold text-emerald-300">
          Drop er live
        </span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/90 px-3 py-1">
      <span className="text-[11px] font-medium text-amber-300">
        Dropper om {timeLeft}
      </span>

      <span className="h-4 w-px bg-slate-700" />

      {/* Reminder CTA */}
      <UpcomingReminder itemId={itemId} />
    </div>
  );
}
