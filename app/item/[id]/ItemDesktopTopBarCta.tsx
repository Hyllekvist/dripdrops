"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DropHeaderCountdown } from "@/components/DropHeaderCountdown";
import { ItemCtaTracker } from "./ItemCtaTracker";

type DropMode = "live" | "upcoming" | "expired";

type Props = {
  anchorId: string;
  mode: DropMode;
  priceTitle: string;
  priceLabel: string;
  marketLabel: string | null;
  primaryCtaLabel: string;
  itemId: string;
  dropId: string | null;
  startsAt: string | null;
};

export function ItemDesktopTopBarCta({
  anchorId,
  mode,
  priceTitle,
  priceLabel,
  marketLabel,
  primaryCtaLabel,
  itemId,
  dropId,
  startsAt,
}: Props) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const anchor = document.getElementById(anchorId);
    if (!anchor) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Vis topbar når command center IKKE længere er synligt
        setShow(!entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(anchor);
    return () => observer.disconnect();
  }, [anchorId]);

  if (!show) return null;

  const scrollToAnchor = () => {
    const el = document.getElementById(anchorId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="fixed inset-x-0 top-16 z-40 hidden lg:block">
      <div className="mx-auto max-w-5xl px-4">
        <div className="flex items-center justify-between gap-4 rounded-full border border-slate-800/80 bg-slate-950/95 px-4 py-2 shadow-[0_12px_40px_rgba(15,23,42,0.7)] backdrop-blur-md">
          <div className="flex min-w-0 items-center gap-3">
            <div className="hidden text-xs text-slate-300 md:block">
              <div className="text-[10px] uppercase tracking-[0.16em] text-slate-500">
                {priceTitle}
              </div>
              <div className="text-sm font-semibold text-slate-50">
                {priceLabel}
              </div>
              {marketLabel && (
                <div className="text-[11px] text-emerald-400">
                  Markedsværdi: {marketLabel}
                </div>
              )}
            </div>

            <div className="text-[11px] text-slate-300">
              <DropHeaderCountdown mode={mode} startsAt={startsAt} />
            </div>
          </div>

          <div className="flex items-center gap-2">
            {mode === "live" && (
              <ItemCtaTracker
                eventName="dd_item_cta_click"
                label="topbar_buy_now_desktop"
                itemId={itemId}
                dropId={dropId}
                mode={mode}
              >
                <button className="rounded-full bg-gradient-to-r from-[var(--dd-neon-pink)] via-[var(--dd-neon-orange)] to-[var(--dd-neon-cyan)] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-950">
                  {primaryCtaLabel}
                </button>
              </ItemCtaTracker>
            )}

            {mode === "upcoming" && (
              <ItemCtaTracker
                eventName="dd_item_cta_click"
                label="topbar_scroll_to_reminder_desktop"
                itemId={itemId}
                dropId={dropId}
                mode={mode}
              >
                <button
                  onClick={scrollToAnchor}
                  className="rounded-full border border-slate-600 bg-slate-900 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-100"
                >
                  Sæt reminder
                </button>
              </ItemCtaTracker>
            )}

            {mode === "expired" && (
              <ItemCtaTracker
                eventName="dd_item_cta_click"
                label="topbar_see_upcoming_drops_desktop"
                itemId={itemId}
                dropId={dropId}
                mode={mode}
              >
                <Link
                  href="/drops"
                  className="rounded-full border border-slate-600 bg-slate-900 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-100"
                >
                  Se kommende drops
                </Link>
              </ItemCtaTracker>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
