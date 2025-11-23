"use client";

import { useEffect, useState } from "react";

export function DropCountdown({ endsAt }: { endsAt: string }) {
  const [remaining, setRemaining] = useState<number>(() => {
    return new Date(endsAt).getTime() - Date.now();
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(new Date(endsAt).getTime() - Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, [endsAt]);

  if (remaining <= 0) {
    return (
      <span className="rounded-full bg-red-500/20 px-3 py-1 text-xs text-red-300">
        Drop slut
      </span>
    );
  }

  const minutes = Math.floor(remaining / 1000 / 60);
  const seconds = Math.floor((remaining / 1000) % 60);

  return (
    <span className="rounded-full bg-yellow-500/20 px-3 py-1 text-xs text-yellow-300">
      Slutter om {minutes}:{seconds.toString().padStart(2, "0")}
    </span>
  );
}