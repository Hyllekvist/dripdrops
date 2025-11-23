import { notFound } from "next/navigation";
import { getItemById } from "@/lib/items";

type Props = { params: { id: string } };

export async function generateMetadata({ params }: Props) {
  const item = await getItemById(params.id);
  if (!item) return {};

  return {
    title: `${item.title} – DRIPDROPS`,
    description: `${item.designer ?? ""} ${item.brand ?? ""}`.trim(),
  };
}

export default async function ItemPage({ params }: Props) {
  const item = await getItemById(params.id);
  if (!item) notFound();

  const priceLabel = `${item.price.toLocaleString("da-DK")} kr`;
  const marketLabel =
    item.marketMin && item.marketMax
      ? `${item.marketMin.toLocaleString("da-DK")}–${item.marketMax.toLocaleString(
          "da-DK",
        )} kr`
      : null;

  return (
    <>
      <div className="mx-auto max-w-5xl px-4 pb-28 pt-6 lg:pb-12 lg:pt-10">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-fuchsia-500/60 bg-fuchsia-500/10 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-fuchsia-100">
                Design Drop
              </span>
              <span className="rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1 text-[11px] text-slate-200">
                1/1 piece
              </span>
            </div>

            <div>
              <h1 className="text-2xl font-semibold text-slate-50 lg:text-3xl">
                {item.title}
              </h1>
              <p className="mt-1 text-sm text-slate-400">
                {item.designer} · {item.brand}
              </p>
            </div>
          </div>

          {/* Desktop CTA */}
          <div className="hidden flex-col items-end gap-2 text-right lg:flex">
            <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
              Pris
            </div>
            <div className="text-2xl font-semibold text-slate-50">
              {priceLabel}
            </div>
            {marketLabel && (
              <div className="text-xs text-emerald-300">
                Markedsværdi: {marketLabel}
              </div>
            )}
            <button className="dd-glow-cta mt-2 rounded-2xl bg-gradient-to-r from-[var(--dd-neon-pink)] via-[var(--dd-neon-orange)] to-[var(--dd-neon-cyan)] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-slate-950">
              Køb nu – reserver i 2:00 min
            </button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-start">
          {/* Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-slate-800 bg-slate-900">
              <div
                className="h-full w-full"
                style={{
                  background:
                    "radial-gradient(circle at center, #eab30833, #020617 70%)",
                }}
              />
              <div className="pointer-events-none absolute inset-0 rounded-3xl border border-white/5" />
              <div className="absolute left-4 bottom-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-slate-950/85 px-3 py-1 text-xs text-slate-100">
                  {item.title}
                </span>
                <span className="rounded-full bg-slate-950/85 px-3 py-1 text-xs text-slate-400">
                  Live i Design Classics
                </span>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="space-y-6">
            {/* AI authenticity */}
            <div className="space-y-2 rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                    AI authenticity check
                  </div>
                  <p className="mt-1 text-xs text-slate-400">
                    {item.aiAuthenticity}% sandsynlig original baseret på
                    billeder og pris.
                  </p>
                </div>
                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
                  {item.aiAuthenticity}% match
                </span>
              </div>
              <div className="mt-3 h-1.5 w-full rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-emerald-300 to-amber-300"
                  style={{ width: `${item.aiAuthenticity}%` }}
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2 rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Beskrivelse
              </div>
              <p className="whitespace-pre-line text-sm leading-relaxed text-slate-200">
                {item.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky CTA – mobile */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-800/80 bg-slate-950/95 px-4 py-3 shadow-[0_-18px_40px_rgba(15,23,42,0.95)] lg:hidden">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
          <div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
              Pris
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
          <button className="dd-glow-cta flex-1 rounded-2xl bg-gradient-to-r from-[var(--dd-neon-pink)] via-[var(--dd-neon-orange)] to-[var(--dd-neon-cyan)] px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-slate-950">
            Køb nu – reserver i 2:00
          </button>
        </div>
      </div>
    </>
  );
}