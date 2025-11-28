// app/checkout/[id]/CheckoutTimer.tsx
"use client";

import { useEffect, useState } from "react";

type Props = {
  expires: string | null; // ISO-string fra reserved_until, eller null
};

function getRemainingSeconds(expires: string | null): number {
  if (!expires) return 120; // fallback: 2 min
  const end = new Date(expires).getTime();
  const now = Date.now();
  const diff = end - now;
  return diff > 0 ? Math.floor(diff / 1000) : 0;
}

export function CheckoutTimer({ expires }: Props) {
  const [secondsLeft, setSecondsLeft] = useState(() =>
    getRemainingSeconds(expires)
  );

  useEffect(() => {
    // reset når expires ændrer sig
    setSecondsLeft(getRemainingSeconds(expires));

    if (!expires) return;

    const id = setInterval(() => {
      setSecondsLeft(getRemainingSeconds(expires));
    }, 1000);

    return () => clearInterval(id);
  }, [expires]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  const label = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;

  return (
    <span className="rounded-full bg-black/60 px-3 py-1 font-mono text-emerald-300">
      {label}
    </span>
  );
}