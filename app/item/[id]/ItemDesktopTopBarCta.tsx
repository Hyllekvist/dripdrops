"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useItemLiveStatus } from "./useItemLiveStatus";

type Mode = "live" | "upcoming" | "expired";

type Props = {
  anchorId: string;
  mode: Mode;
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
  startsAt,
}: Props) {
  const router = useRouter();
  const { status } = useItemLiveStatus(itemId);

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = document.getElementById(anchorId);
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        // Hvis command center IKKE er i view, viser vi topbaren
        setVisible(!entry.isIntersecting);
      },
      {
        root: null,
        threshold: 0,
        rootMargin: "0px 0px -70% 0px",
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [anchorId]);

  if (!visible) return null;

  const isLive = mode === "live";

  let isDisabled = false;
  let effectiveLabel = primaryCtaLabel;

  if (isLive) {
    if (status === "reserved") {
      effectiveLabel = "Reserveret i checkout";
      isDisabled = true;
    } else if (status === "sold") {
      effectiveLabel = "Solgt";
      isDisabled = true;
    }
  }

  const handleClick = () => {
    if (isDisabled) return;

    if (mode === "live") {
      router.push(`/checkout?itemId=${itemId}`);
    } else if (mode === "upcoming") {
      const el = document.getElementById(anchorId);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (mode === "expired") {
      router.push("/drops");
    }
  };

  const startsLabel =
    mode === "upcoming" && startsAt
      ? new Date(startsAt).toLocaleString("da-DK", {
          weekday: "short",
          hour: "2-digit",
          minute: "2-digit",
        })
      : null;

  return (
    <div className="fixed inset-x-0 top-0 z-40 hidden border-b border-slate-800/70 bg-slate-950/95 backdrop-blur lg:block">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-2.5">
        <div className="min-w-0">
          <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-slate-400">
            {priceTitle}
          </p>
          <p className="text-sm font-semibold text-slate-50">{priceLabel}</p>
          {marketLabel && (
            <p className="text-[11px] text-emerald-400">
              Markedsværdi: {marketLabel}
            </p>
          )}
        </div>

        <div className="flex items-center gap-4">
          {mode === "live" && (
            <div className="flex items-center gap-1 text-[11px] text-emerald-400">
              <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              <span>Drop er live</span>
            </div>
          )}

          {startsLabel && (
            <div className="text-right text-[11px] text-slate-300">
              Åbner: {startsLabel}
            </div>
          )}

          <button
            type="button"
            onClick={handleClick}
            disabled={isDisabled}
            className={`rounded-full px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] transition
              ${
                isDisabled
                  ? "cursor-not-allowed border border-slate-700 bg-slate-800 text-slate-400"
                  : "border border-fuchsia-400/70 bg-fuchsia-500 text-slate-950 hover:bg-fuchsia-400 hover:border-fuchsia-300"
              }`}
          >
            {effectiveLabel}
          </button>
        </div>
      </div>
    </div>
  );
}