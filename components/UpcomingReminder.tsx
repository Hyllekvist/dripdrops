"use client";

import { useState } from "react";

export function UpcomingReminder({ itemId }: { itemId: string }) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (!email) return;
    setLoading(true);

    const res = await fetch("/api/waitlist", {
      method: "POST",
      body: JSON.stringify({ itemId, email }),
      headers: { "Content-Type": "application/json" },
    });

    setLoading(false);

    if (res.ok) {
      setDone(true);
      if (window.gtag) {
        window.gtag("event", "waitlist_join", {
          event_category: "conversion",
          item_id: itemId,
        });
      }
    }
  }

  if (done) {
    return (
      <div className="rounded-xl bg-emerald-500/15 border border-emerald-500/40 px-4 py-3 text-emerald-300 text-sm">
        ✔ Du er på reminder-listen!  
        Vi sender besked, når droppet åbner.
      </div>
    );
  }

  return (
    <div className="space-y-3 rounded-xl border border-slate-700 bg-slate-900/70 p-4">
      <p className="text-sm text-slate-300">
        Dropper snart. Skriv din mail – så får du reminder, når det åbner.
      </p>

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="din@email.dk"
        className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-slate-100"
      />

      <button
        onClick={submit}
        disabled={loading}
        className="w-full rounded-xl bg-gradient-to-r from-[var(--dd-neon-pink)] via-[var(--dd-neon-orange)] to-[var(--dd-neon-cyan)] px-4 py-2.5 text-sm font-semibold text-slate-950 tracking-[0.15em] uppercase disabled:opacity-50"
      >
        {loading ? "Sender..." : "Få reminder"}
      </button>
    </div>
  );
}
