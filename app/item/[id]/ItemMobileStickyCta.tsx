"use client";

import { useRouter } from "next/navigation";
import { useItemLiveStatus } from "./useItemLiveStatus";

type Mode = "live" | "upcoming" | "expired";

type Props = {
  mode: Mode;
  priceTitle: string;
  priceLabel: string;
  marketLabel: string | null;
  primaryCtaLabel: string;
  itemId: string;
};

export function ItemMobileStickyCta({
  mode,
  priceTitle,
  priceLabel,
  marketLabel,
  primaryCtaLabel,
  itemId,
}: Props) {
  const router = useRouter();
  const { status } = useItemLiveStatus(itemId);

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
      // scroll brugeren tilbage til command center/reminder
      const el = document.getElementById("item-command-center");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else if (mode === "expired") {
      router.push("/drops");
    }
  };

  // Kun mobil
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-800/80 bg-slate-950/95 px-4 py-3 backdrop-blur md:hidden">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
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

        <button
          type="button"
          onClick={handleClick}
          disabled={isDisabled}
          className={`shrink-0 rounded-full px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] transition
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
  );
}