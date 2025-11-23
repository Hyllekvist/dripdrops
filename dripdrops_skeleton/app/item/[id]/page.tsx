import { notFound } from "next/navigation";
import { getItemById } from "@/lib/items";

type Props = { params: { id: string } };

export async function generateMetadata({ params }: Props) {
  const item = await getItemById(params.id);
  if (!item) return {};
  return {
    title: `${item.title} – DRIPDROPS`,
    description: `${item.designer} ${item.brand} · stand: ${item.conditionLabel}.`,
  };
}

export default async function ItemPage({ params }: Props) {
  const item = await getItemById(params.id);
  if (!item) notFound();

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-8 lg:flex-row">
      <div className="flex-1 space-y-4">
        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-slate-900 border border-slate-800">
          <div
            className="h-full w-full"
            style={{
              background:
                "radial-gradient(circle at center, #eab30833, #020617 70%)",
            }}
          />
          <div className="absolute left-4 bottom-4 flex gap-2">
            <span className="rounded-full bg-slate-950/80 px-3 py-1 text-xs">
              {item.title}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-5">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-fuchsia-500/40 bg-fuchsia-500/10 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-fuchsia-100">
            Design Drop
          </div>
          <h1 className="mt-2 text-2xl font-semibold">{item.title}</h1>
          <p className="text-sm text-slate-400">
            {item.designer} · {item.brand}
          </p>
        </div>

        <div className="flex items-baseline justify-between gap-4">
          <div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
              Pris
            </div>
            <div className="text-2xl font-semibold">
              {item.price.toLocaleString("da-DK")} kr
            </div>
            <div className="mt-1 text-xs text-emerald-300">
              Markedsværdi: {item.marketMin}–{item.marketMax} kr
            </div>
          </div>
          <button className="dd-glow-cta rounded-2xl bg-gradient-to-r from-[var(--dd-neon-pink)] via-[var(--dd-neon-orange)] to-[var(--dd-neon-cyan)] px-5 py-2.5 text-sm font-semibold text-slate-950">
            Køb nu – reserver i 2:00 min
          </button>
        </div>

        <div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
            AI authenticity check
          </div>
          <div className="mt-1 flex items-center justify-between text-xs">
            <span className="text-emerald-300">
              {item.aiAuthenticity}% sandsynlig original
            </span>
          </div>
          <div className="mt-1 h-1.5 w-full rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-emerald-300 to-amber-300"
              style={{ width: `${item.aiAuthenticity}%` }}
            />
          </div>
        </div>

        <div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
            Beskrivelse
          </div>
          <p className="mt-1 text-sm text-slate-200 whitespace-pre-line">
            {item.description}
          </p>
        </div>
      </div>
    </div>
  );
}
