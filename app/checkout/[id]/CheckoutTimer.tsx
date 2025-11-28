// app/checkout/[id]/CheckoutTimer.tsx
"use client";

import { useEffect, useState } from "react";

export function CheckoutTimer({ expires }: { expires: string | null }) {
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);

  useEffect(() => {
    let initial = 120;

    if (expires) {
      const diff = Math.floor(
        (new Date(expires).getTime() - Date.now()) / 1000
      );
      initial = diff > 0 ? diff : 0;
    }

    setSecondsLeft(initial);

    const id = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev === null) return prev;
        if (prev <= 1) {
          clearInterval(id);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [expires]);

  const s = secondsLeft ?? 0;
  const mm = String(Math.floor(s / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");

  const expired = s <= 0;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/90 p-3">
      <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_0%_0%,rgba(255,92,222,0.22),transparent_55%),radial-gradient(circle_at_100%_100%,rgba(0,240,255,0.22),transparent_55%)]" />
      <div className="relative z-10 flex items-center justify-between gap-3 text-xs text-slate-100">
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex h-2 w-2 rounded-full ${
              expired ? "bg-rose-400" : "bg-emerald-400 animate-pulse"
            }`}
          />
          <span>
            {expired ? "Din reservation er udløbet" : "Din session er aktiv"}
          </span>
        </div>
        <div className="flex items-center gap-2 text-[11px]">
          <span className="text-slate-300">
            {expired ? "Tid tilbage:" : "Tid tilbage:"}
          </span>
          <span className="rounded-full bg-black/60 px-3 py-1 font-mono text-emerald-300">
            {mm}:{ss}
          </span>
        </div>
      </div>
    </div>
  );
}