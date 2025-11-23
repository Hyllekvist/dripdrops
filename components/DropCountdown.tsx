"use client";

import { useEffect, useState } from "react";

type Props = {
  /** ISO-tidspunkt for hvornår droppet starter */
  startsAt: string;
  /** længde på drop i minutter – default 15 */
  durationMinutes?: number;
};

export function DropCountdown({ startsAt, durationMinutes = 15 }: Props) {
  const startMs = new Date(startsAt).getTime();
  const endMs = startMs + durationMinutes * 60 * 1000;

  const [remaining, setRemaining] = useState(endMs - Date.now());

  useEffect(() => {
    if (Number.isNaN(startMs)) return;

    const id = setInterval(() => {
      setRemaining(endMs - Date.now());
    }, 1000);

    return () => clearInterval(id);
  }, [startMs, endMs]);

  if (Number.isNaN(startMs)) return null;

  if (remaining <= 0) {
    return (
      <span className="rounded-full bg-amber-500/10 px-3 py-1 text-[11px] font-semibold text-amber-300">
        Sluttet
      </span>
    );
  }

  const totalSeconds = Math.floor(remaining / 1000);
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");

  return (
    <span className="rounded-full bg-amber-500/10 px-3 py-1 text-[11px] font-semibold text-amber-300">
      Slutter om {minutes}:{seconds}
    </span>
  );
}
