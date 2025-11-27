"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Drop = {
  id: string;
  title: string;
  sequence: number | null;
  starts_at: string | null;
  ends_at: string | null;
  is_live: boolean | null;
};

type Props = {
  itemId: string;
  dropId: string | null;
  drops: Drop[];
};

export function AdminItemDetailActions({ itemId, dropId, drops }: Props) {
  const router = useRouter();
  const [selected, setSelected] = useState(dropId ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/items/assign-drop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemId,
          dropId: selected || null,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error || "Ukendt fejl");
      }

      router.refresh();
    } catch (err: any) {
      setError(err.message || "Fejl");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 space-y-4">
      <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
        Drop-tilknytning
      </div>

      <select
        className="w-full rounded-xl bg-slate-900 border border-slate-700 text-sm p-2 text-slate-100"
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
      >
        <option value="">— Uden drop —</option>

        {drops.map((d) => (
          <option key={d.id} value={d.id}>
            #{d.sequence} — {d.title}
          </option>
        ))}
      </select>

      <button
        type="button"
        onClick={save}
        disabled={loading}
        className="rounded-full bg-emerald-500 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-900 disabled:opacity-60"
      >
        {loading ? "Gemmer…" : "Gem drop-tilknytning"}
      </button>

      {error && (
        <p className="text-[11px] text-rose-400">Fejl: {error}</p>
      )}
    </section>
  );
}
