// components/ItemMobileStickyCsta.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { UpcomingReminder } from "@/components/UpcomingReminder";

type DropMode = "live" | "upcoming" | "expired";

type Props = {
  mode: DropMode;
  priceTitle: string;
  priceLabel: string;
  marketLabel: string | null;
  primaryCtaLabel: string;
  itemId: string;
  dropStartsAt: string | null; // ISO-timestamp for drop start
};

export function ItemMobileStickyCta({
  mode,
  priceTitle,
  priceLabel,
  marketLabel,
  primaryCtaLabel,
  itemId,
  dropStartsAt,
}: Props) {
  const [remainingMs, setRemainingMs] = useState<number | null>(null);

  // Countdown kun for upcoming
  useEffect(() => {
    if (mode !== "upcoming" || !dropStartsAt) return;

    const target = new Date(dropStartsAt).getTime();
    if (Number.isNaN(target)) return;

    const tick = () => {
      setRemainingMs(target - Date.now());
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [mode, dropStartsAt]);

  let countdownLabel: string | null = null;
  let isNowLiveFromCountdown = false;

  if (mode === "upcoming" && remainingMs !== null) {
    if (remainingMs <= 0) {
      isNowLiveFromCountdown = true;
      countdownLabel = "Drop er live";
    } else {
      const totalSeconds = Math.floor(remainingMs / 1000);
      const minutes = Math.floor(totalSeconds / 60)
        .toString()
        .padStart(2, "0");
      const seconds = (totalSeconds % 60).toString().padStart(2, "0");
      countdownLabel = `Dropper om ${minutes}:${seconds}`;
    }
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-800/80 bg-slate-950/95 px-4 py-3 shadow-[0_-18px_40px_rgba(15,23,42,0.95)] lg:hidden">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
        {/* Prisblok til venstre */}
        <div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
            {priceTitle}
          </div>
          <div className="text-lg font-semibold text-slate-50">
            {priceLabel}
          </div>
          {marketLabel && (
            <div className="text-[11px] text-emerald-300">
              Markedsværdi: {marketLabel}
            </div>
          )}
        </div>

        {/* Højre side: CTA afhænger af mode */}
        {mode === "live" && (
          <button className="dd-glow-cta flex-1 rounded-2xl bg-gradient-to-r from-[var(--dd-neon-pink)] via-[var(--dd-neon-orange)] to-[var(--dd-neon-cyan)] px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-slate-950">
            {primaryCtaLabel}
          </button>
        )}

        {mode === "upcoming" && (
          <div className="flex flex-1 flex-col items-end gap-1">
            {countdownLabel && (
              <div
                className={
                  isNowLiveFromCountdown
                    ? "inline-flex items-center rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1"
                    : "inline-flex items-center rounded-full border border-slate-700 bg-slate-900/90 px-3 py-1"
                }
              >
                <span
                  className={
                    isNowLiveFromCountdown
                      ? "text-[11px] font-semibold text-emerald-300"
                      : "text-[11px] font-medium text-amber-300"
                  }
                >
                  {countdownLabel}
                </span>
              </div>
            )}

            <div className="w-full">
              <UpcomingReminder itemId={itemId} />
            </div>
          </div>
        )}

        {mode === "expired" && (
          <Link
            href="/drops"
            className="flex-1 rounded-2xl border border-slate-600 bg-slate-900/90 px-4 py-2.5 text-center text-xs font-semibold uppercase tracking-[0.16em] text-slate-100"
          >
            {primaryCtaLabel}
          </Link>
        )}
      </div>
    </div>
  );
}
