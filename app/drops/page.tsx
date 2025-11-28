// app/drops/page.tsx
import Link from "next/link";
import { listActiveDrops, listPublicLiveDrops } from "@/lib/drops";

export const metadata = {
  title: "Drops – DRIPDROPS",
  description:
    "Se alle live og kommende DRIPDROPS-drops med kuraterede design-, møbel- og fashionfund.",
};

export default async function DropsPage() {
  // 🔒 Public-sikker data
  const [allDrops, liveDrops] = await Promise.all([
    listActiveDrops(),       // admin/intern view – bruges til at finde kommende
    listPublicLiveDrops(),   // kun live drops, public-safe
  ]);

  const live = liveDrops;

  const now = Date.now();
  const upcoming = allDrops.filter((d) => {
    if (d.isLive) return false;
    if (!d.starts_at) return false;
    return new Date(d.starts_at).getTime() > now;
  });

  const hasAny = live.length > 0 || upcoming.length > 0;

  return (
    <div className="mx-auto max-w-5xl px-4 pb-16 pt-6 space-y-8">
      {/* HEADER */}
      <header className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-700/70 bg-slate-950/80 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-slate-300">
          <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
          <span>Drops overview</span>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-slate-50">
            DRIPDROPS-drops
          </h1>
          <p className="text-sm text-slate-400">
            Kuraterede, tidsbegrænsede drops med design, møbler og fashion. Én
            session ad gangen – ingen uendelig scroll.
          </p>
        </div>

        {/* HOW IT WORKS CARD */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 text-xs text-slate-300 lg:text-[13px]">
          <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            Sådan fungerer et DRIPDROP
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-xl leading-relaxed">
              Når et drop er{" "}
              <span className="text-emerald-300">live</span>, kan du købe
              udvalgte pieces i en kort tidsperiode. Kommende drops kan
              forhåndsstudies, så du er klar, når timeren starter.
            </p>
            <div className="flex flex-wrap gap-2 text-[11px]">
              <span className="rounded-full bg-slate-900 px-3 py-1 text-slate-300">
                Kuraterede 1/1 pieces
              </span>
              <span className="rounded-full bg-slate-900 px-3 py-1 text-slate-300">
                Session-baseret checkout
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* LIVE DROPS */}
      {live.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-100">
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]" />
              Live lige nu
            </h2>
            <span className="text-xs text-emerald-300">
              {live.length} aktivt drop{live.length > 1 ? "s" : ""}
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {live.map((drop) => (
              <Link
                key={drop.id}
                href={`/drop/${drop.id}`}
                className="dd-gradient-border group relative flex flex-col gap-3 overflow-hidden rounded-2xl bg-slate-950/90 p-4 shadow-[0_18px_50px_rgba(15,23,42,0.9)] transition hover:-translate-y-0.5 hover:bg-slate-900/90"
              >
                {/* top row */}
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Live drop
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Drop #{drop.sequence}
                  </span>
                </div>

                {/* content */}
                <div className="space-y-1">
                  <div className="text-sm font-semibold text-slate-50">
                    {drop.title}
                  </div>
                  <p className="line-clamp-2 text-xs text-slate-400">
                    {drop.description ??
                      "Kurateret mix af designklassikere, møbler og archive fashion."}
                  </p>
                </div>

                {/* bottom row */}
                <div className="mt-1 flex items-center justify-between text-xs text-slate-400">
                  <span className="inline-flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-400/80" />
                    Live – begrænset tid
                  </span>
                  <span className="text-slate-300 group-hover:text-slate-100">
                    Åbn droppet →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* UPCOMING DROPS */}
      {upcoming.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-slate-100">
              Kommende drops
            </h2>
            <span className="text-xs text-slate-400">
              {upcoming.length} planlagt{upcoming.length > 1 ? "e" : ""}
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {upcoming.map((drop) => (
              <Link
                key={drop.id}
                href={`/drop/${drop.id}`}
                className="group flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-4 transition hover:-translate-y-0.5 hover:border-slate-500 hover:bg-slate-900/80"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-full bg-slate-900 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-300">
                    Kommer snart
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Drop #{drop.sequence}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="text-sm font-semibold text-slate-50">
                    {drop.title}
                  </div>
                  <p className="line-clamp-2 text-xs text-slate-400">
                    {drop.description ??
                      "Kurateret drop med udvalgte design-, møbel- og fashionfund."}
                  </p>
                </div>

                <div className="mt-1 flex items-center justify-between text-xs text-slate-400">
                  <span>
                    {drop.startsAtLabel
                      ? `Dropper ${drop.startsAtLabel}`
                      : "Dato annonceres"}
                  </span>
                  <span className="text-slate-300 group-hover:text-slate-100">
                    Se detaljer →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* EMPTY STATE */}
      {!hasAny && (
        <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6 text-sm text-slate-400">
          <p>
            Der er ingen aktive eller planlagte drops lige nu. Når de første er
            klar, lander de her – med kuraterede 1/1 pieces klar til et kort,
            intenst drop.
          </p>
        </div>
      )}
    </div>
  );
}
