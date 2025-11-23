"use client";

import { useEffect, useState } from "react";

type Props = {
  /** ISO-tidspunkt for hvornår droppet slutter */
  endsAt: string | null;
};

export function DropCountdown({ endsAt }: Props) {
  if (!endsAt) return null;

  const endMs = new Date(endsAt).getTime();
  const [remaining, setRemaining] = useState(endMs - Date.now());

  useEffect(() => {
    if (Number.isNaN(endMs)) return;

    const update = () => {
      setRemaining(endMs - Date.now());
    };

    update(); // initial tick
    const id = setInterval(update, 1000);

    return () => clearInterval(id);
  }, [endMs]);

  if (Number.isNaN(endMs)) return null;

  // Deadline er passeret
  if (remaining <= 0) {
    return (
      <span className="rounded-full bg-red-500/10 px-3 py-1 text-[11px] font-semibold text-red-300">
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
