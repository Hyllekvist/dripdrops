// app/sell/thanks/SellThanksClient.tsx
"use client";

import { useEffect, useState } from "react";

type LastSell = {
  title: string;
  brand?: string | null;
  price?: number | null;
  condition?: string | null;
};

export function SellThanksClient() {
  const [item, setItem] = useState<LastSell | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("dd_last_sell_submission");
      if (!raw) return;
      const parsed = JSON.parse(raw) as LastSell;
      setItem(parsed);
    } catch {
      // ignorer bare
    }
  }, []);

  // Hvis man går direkte ind på /sell/thanks eller refresher, er der ingen data
  if (!item) return null;

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-4 shadow-[0_18px_55px_rgba(15,23,42,0.95)] space-y-3">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/15 border border-emerald-400/60">
          <span className="text-sm">✓</span>
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-emerald-300">
            Dit item er i køen
          </div>
          <p className="text-xs text-slate-400">
            Her er et preview af det, du lige har sendt ind.
          </p>
        </div>
      </div>

      <div className="mt-2 rounded-2xl border border-slate-800 bg-slate-950 p-3 text-sm">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
              Item
            </div>
            <div className="text-sm font-semibold text-slate-50 line-clamp-2">
              {item.title}
            </div>
            {item.brand && (
              <div className="text-xs text-slate-400">{item.brand}</div>
            )}
            {item.condition && (
              <div className="text-[11px] text-slate-500">
                Stand: {item.condition}
              </div>
            )}
          </div>
          <div className="text-right text-xs">
            <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
              Prisidé
            </div>
            <div className="text-sm text-slate-100">
              {item.price
                ? `${item.price.toLocaleString("da-DK")} kr`
                : "Ikke angivet"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
