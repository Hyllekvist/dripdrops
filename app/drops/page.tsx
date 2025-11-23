import Link from "next/link";
import { listActiveDrops } from "@/lib/drops";

export const metadata = {
  title: "Aktive drops",
  description: "Se alle aktive og kommende DRIPDROPS-drops.",
};

export default async function DropsPage() {
  const drops = await listActiveDrops();

  const live = drops.filter((d) => d.isLive);
  const upcoming = drops.filter((d) => !d.isLive);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-slate-50">Drops</h1>
        <p className="text-sm text-slate-400">
          Kuraterede, tidsbegrænsede drops med design, møbler og fashion. Én
          session ad gangen – ingen uendelig scroll.
        </p>
      </header>

      {live.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-slate-100">
              Live lige nu
            </h2>
            <span className="text-xs text-emerald-300">
              {live.length} aktive drop{live.length > 1 ? "s" : ""}
            </span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {live.map((drop) => (
              <Link
                key={drop.id}
                href={`/drop/${drop.id}`}
                className="dd-gradient-border group relative flex flex-col gap-3 rounded-2xl bg-slate-950/90 p-4 transition hover:-translate-y-0.5 hover:bg-slate-900/90"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                    Live drop
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Drop #{drop.sequence}
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-semibold text-slate-50">
                    {drop.title}
                  </div>
                  <p className="line-clamp-2 text-xs text-slate-400">
                    {drop.description ??
                      "Kurateret mix af designklassikere og udvalgt archive."}
                  </p>
                </div>
                <div className="mt-1 flex items-center justify-between text-xs text-slate-400">
                  <span>{drop.startsAtLabel || "Live nu"}</span>
                  <span className="text-slate-300 group-hover:text-slate-100">
                    Se droppet →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {upcoming.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-slate-100">
              Kommende drops
            </h2>
            <span className="text-xs text-slate-400">
              {upcoming.length} planlagte
            </span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {upcoming.map((drop) => (
              <Link
                key={drop.id}
                href={`/drop/${drop.id}`}
                className="group flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-4 transition hover:-translate-y-0.5 hover:border-slate-500"
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
                      "Kurateret drop med design, møbler og fashion."}
                  </p>
                </div>
                <div className="mt-1 flex items-center justify-between text-xs text-slate-400">
                  <span>{drop.startsAtLabel || "Dato annonceres"}</span>
                  <span className="text-slate-300 group-hover:text-slate-100">
                    Se detaljer →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {drops.length === 0 && (
        <p className="text-sm text-slate-500">
          Der er ingen aktive drops endnu. Når de første er klar, lander de
          her.
        </p>
      )}
    </div>
  );
}
