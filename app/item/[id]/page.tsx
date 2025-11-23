import { notFound } from "next/navigation";
import { getItemById } from "@/lib/items";
import { DropCountdown } from "@/components/DropCountdown";

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

<ItemAnalyticsShell
  itemId={item.id}
  ai={item.aiAuthenticity}
  price={item.price}
/>

  const priceLabel = `${item.price.toLocaleString("da-DK")} kr`;

  const marketLabel =
    item.marketMin && item.marketMax
      ? `${item.marketMin.toLocaleString("da-DK")}–${item.marketMax.toLocaleString(
          "da-DK",
        )} kr`
      : null;

  return (
    <>
      <div className="mx-auto max-w-5xl px-4 pb-32 pt-6 lg:pb-16 lg:pt-12">
        {/* Header block */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-fuchsia-500/60 bg-fuchsia-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-fuchsia-100">
                Design Drop
              </span>
              <span className="rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1 text-[11px] text-slate-200">
                1/1 piece
              </span>
{item.drop?.ends_at && (
    <DropCountdown endsAt={item.drop.ends_at} />
  )}


              {/* Countdown placeholder */}
              <span className="rounded-full bg-slate-900/70 px-3 py-1 text-[11px] text-amber-300">
                Slutter om 02:13
              </span>
            </div>

            <h1 className="text-3xl font-semibold text-slate-50">
              {item.title}
            </h1>

            <p className="text-sm text-slate-400">
              {item.designer} · {item.brand}
            </p>
          </div>

          {/* Desktop CTA */}
          <div className="hidden flex-col items-end lg:flex">
            <span className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
              Pris
            </span>

            <div className="text-2xl font-semibold text-slate-50">
              {priceLabel}
            </div>

            {marketLabel && (
              <div className="text-xs text-emerald-300">
                Markedsværdi: {marketLabel}
              </div>
            )}

            <button
              className="dd-glow-cta mt-3 rounded-2xl bg-gradient-to-r
              from-[var(--dd-neon-pink)] via-[var(--dd-neon-orange)]
              to-[var(--dd-neon-cyan)] px-6 py-3 text-xs font-semibold uppercase
              tracking-[0.16em] text-slate-950"
            >
              Køb nu – reserver i 2:00 min
            </button>

            <p className="mt-1 text-[10px] text-slate-500">
              Vi reserverer varen mens du betaler.
            </p>
          </div>
        </div>

        {/* Layout grid */}
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-start">
          {/* Image */}
          <div className="space-y-4">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-slate-800 bg-slate-900">
              <div
                className="h-full w-full"
                style={{
                  background:
                    "radial-gradient(circle at center, #eab30833, #020617 75%)",
                }}
              />
              <div className="pointer-events-none absolute inset-0 rounded-3xl border border-white/5" />

              <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-slate-950/85 px-3 py-1 text-xs text-slate-100">
                  {item.title}
                </span>
                <span className="rounded-full bg-slate-950/85 px-3 py-1 text-xs text-slate-400">
                  Live i Design Classics
                </span>
              </div>
            </div>

            <p className="hidden text-xs text-slate-500 sm:block">
              Flere billeder kommer i kommende version.
            </p>
          </div>

          {/* Right panel */}
          <div className="space-y-6">
            {/* AI section */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                    AI authenticity check
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    {item.aiAuthenticity}% sandsynlig original baseret på pris &
                    billeder.
                  </p>
                </div>

                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
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

            {/* Market value block */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Pris & værdi
              </p>

              <p className="mt-2 text-xl font-semibold text-slate-50">
                {priceLabel}
              </p>

              {marketLabel && (
                <p className="text-xs text-emerald-300">
                  Markedsværdi: {marketLabel}
                </p>
              )}

              <p className="mt-2 text-[11px] text-slate-500">
                Reservation gælder i 2 minutter efter tryk på køb.
              </p>
            </div>

            {/* Description */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Beskrivelse
              </p>

              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-200">
                {item.description}
              </p>
            </div>

            {/* Trust block */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Tryg handel
              </p>

              <ul className="mt-2 space-y-1 text-sm text-slate-300">
                <li>✓ Sikker reservation</li>
                <li>✓ Ingen bud — fast pris</li>
                <li>✓ 1/1 varer — ingen duplicates</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky CTA mobile */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-800/70 bg-slate-950/95 px-4 py-3 shadow-[0_-18px_40px_rgba(15,23,42,0.88)] lg:hidden">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
              Pris
            </p>
            <p className="text-lg font-semibold text-slate-50">{priceLabel}</p>
            {marketLabel && (
              <p className="text-[11px] text-emerald-300">
                Markedsværdi: {marketLabel}
              </p>
            )}
          </div>

          <button
            className="dd-glow-cta flex-1 rounded-2xl bg-gradient-to-r
            from-[var(--dd-neon-pink)] via-[var(--dd-neon-orange)]
            to-[var(--dd-neon-cyan)] px-4 py-3 text-xs font-semibold uppercase
            tracking-[0.16em] text-slate-950"
          >
            Køb nu – reserver i 2:00
          </button>
        </div>
      </div>
    </>
  );
}