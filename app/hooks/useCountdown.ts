// app/hooks/useCountdown.ts
"use client";

import { useEffect, useState } from "react";

export function useCountdown(targetIso: string | null) {
  const [remaining, setRemaining] = useState<string | null>(null);

  useEffect(() => {
    if (!targetIso) return;
    const target = new Date(targetIso).getTime();

    const tick = () => {
      const now = Date.now();
      const diff = target - now;
      if (diff <= 0) {
        setRemaining("00:00");
        return;
      }
      const m = Math.floor(diff / 1000 / 60);
      const s = Math.floor((diff / 1000) % 60);
      setRemaining(`${m.toString().padStart(2, "0")}:${s
        .toString()
        .padStart(2, "0")}`);
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetIso]);

  return remaining;
}
