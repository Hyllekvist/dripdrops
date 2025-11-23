import { listActiveDrops } from "@/lib/drops";

export const metadata = {
  title: "Aktive drops",
  description: "Se alle aktive og kommende DRIPDROPS-drops.",
};

export default async function DropsPage() {
  const drops = await listActiveDrops();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 space-y-6">
      <h1 className="text-2xl font-semibold">Aktive drops</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        {drops.map((drop) => (
          <a
            key={drop.id}
            href={`/drop/${drop.id}`}
            className="dd-gradient-border rounded-2xl bg-slate-950/80 p-4"
          >
            <div className="text-xs uppercase tracking-[0.18em] text-slate-400">
              Drop #{drop.sequence}
            </div>
            <div className="mt-1 text-lg font-semibold">{drop.title}</div>
            <div className="mt-2 text-sm text-slate-400">
              {drop.isLive ? "Live nu" : `Starter ${drop.startsAtLabel}`}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
