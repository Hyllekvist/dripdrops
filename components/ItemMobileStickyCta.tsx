// components/ItemMobileStickyCta.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

type DropMode = "live" | "upcoming" | "expired";

type Props = {
  mode: DropMode;
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
  const [loading, setLoading] = useState(false);

  async function handleReserveClick() {
    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.ok) {
        const msg =
          data?.error === "already_reserved_or_sold"
            ? "Varen er allerede reserveret eller solgt."
            : "Kunne ikke reservere varen lige nu. Prøv igen om lidt.";
        alert(msg);
        return;
      }

      // success → videre til checkout
      router.push(`/checkout/${itemId}`);
    } catch (err) {
      console.error("ItemMobileStickyCta reserve error:", err);
      alert("Teknisk fejl – prøv igen om lidt.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-800/80 bg-slate-950/95 px-4 py-3 shadow-[0_-18px_40px_rgba(15,23,42,0.95)] lg:hidden">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
        {/* Prisblok */}
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

        {/* LIVE → reserver + checkout */}
        {mode === "live" && (
          <button
            type="button"
            onClick={handleReserveClick}
            disabled={loading}
            className="dd-glow-cta flex-1 rounded-2xl bg-gradient-to-r from-[var(--dd-neon-pink)] via-[var(--dd-neon-orange)] to-[var(--dd-neon-cyan)] px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-slate-950 disabled:opacity-70"
          >
            {loading ? "Reserverer…" : primaryCtaLabel}
          </button>
        )}

        {/* UPCOMING → scroll til reminder */}
        {mode === "upcoming" && (
          <a
            href="#reminder"
            className="flex-1 rounded-2xl border border-slate-600 bg-slate-900/90 px-4 py-2.5 text-center text-xs font-semibold uppercase tracking-[0.16em] text-slate-100"
          >
            Få reminder
          </a>
        )}

        {/* EXPIRED */}
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