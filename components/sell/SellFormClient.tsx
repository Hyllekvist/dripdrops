"use client";

import { useState } from "react";

export function SellFormClient() {
  const [title, setTitle] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState<number | "">("");

  return (
    <form className="space-y-4 rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
      <div className="text-xs uppercase tracking-[0.18em] text-slate-400">
        Basis info
      </div>
      <div className="space-y-3">
        <label className="block text-sm">
          Titel
          <input
            className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Fx The Spanish Chair"
          />
        </label>
        <label className="block text-sm">
          Brand / producent
          <input
            className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          />
        </label>
        <label className="block text-sm">
          Prisidé (DKK)
          <input
            type="number"
            className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
            value={price}
            onChange={(e) =>
              setPrice(e.target.value ? Number(e.target.value) : "")
            }
          />
        </label>
      </div>

      <button
        type="button"
        className="mt-2 w-full rounded-2xl bg-gradient-to-r from-[var(--dd-neon-pink)] via-[var(--dd-neon-orange)] to-[var(--dd-neon-cyan)] px-5 py-2.5 text-sm font-semibold text-slate-950 dd-glow-cta"
      >
        Kør AI-scan og prisestimat
      </button>
    </form>
  );
}
