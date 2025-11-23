// app/item/[id]/page.tsx
import { notFound } from "next/navigation";
import { getItemById } from "@/lib/items";
import { getDropById } from "@/lib/drops";
import { ItemAnalyticsShell } from "@/components/ItemAnalyticsShell";

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

  // Hent drop-info (til label + fremtidig logik)
  const drop = item.dropId ? await getDropById(item.dropId) : null;

  const priceLabel = `${item.price.toLocaleString("da-DK")} kr`;
  const marketLabel =
    item.marketMin && item.marketMax
      ? `${item.marketMin.toLocaleString(
          "da-DK",
        )}–${item.marketMax.toLocaleString("da-DK")} kr`
      : null;

  const isLive = !!drop?.isLive;
  const isUpcoming = !!drop && !drop.isLive;

  // Drop-status pill
  let dropStatusLabel: string | null = null;
  if (drop) {
    if (isLive) {
      dropStatusLabel = "Live i droppet";
    } else if (drop.startsAtLabel) {
      dropStatusLabel = `Starter ${drop.startsAtLabel}`;
    }
  }

  // Grov vurdering af pris i forhold til markedsrange
  let pricePositionLabel: string | null = null;
  if (item.marketMin && item.marketMax) {
    const mid = (item.marketMin + item.marketMax) / 2;
    if (item.price <= item.marketMin) {
      pricePositionLabel = "Under typisk markedspris";
    } else if (item.price <= item.marketMax) {
      pricePositionLabel = "Inden for normalt prisniveau";
    } else {
      pricePositionLabel = "Over typisk prisniveau";
    }
  }

  return (
    <>
      {/* Analytics-hook – ingen UI */}
      <ItemAnalyticsShell
        itemId={item.id}
        ai={item.aiAuthenticity}
        price={item.price}
      />

      <div className="mx-auto max-w-5xl px-4 pb-28 pt-6 lg:pb-12 lg:pt-10">
        {/* HERO-HEADER */}
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-fuchsia-500/60 bg-fuchsia-500/10 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-fuchsia-100">
                Design Drop
              </span>
              <span className="rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1 text-[11px] text-slate-200">
                1/1 piece
              </span>
              {dropStatusLabel && (
                <span
                  className={
                    isLive
                      ? "rounded-full bg-emerald-400/15 px-3 py-1 text-[11px] font-medium text-emerald-300"
                      : "rounded-full bg-amber-400/15 px-3 py-1 text-[11px] font-medium text-amber-300"
                  }
                >
                  {dropStatusLabel}
                </span>
              )}
            </div>

            <div>
              <h1 className="text-2xl font-semibold text-slate-50 lg:text-3xl">
                {item.title}
              </h1>
              <p className="mt-1 text-sm text-slate-400">
                {item.designer} · {item.brand}
              </p>
            </div>

            {/* Live / upcoming micro-stats */}
            <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
              {isLive ? (
                <>
                  <span className="inline-flex items-center gap-2 rounded-full bg-slate-900/90 px-3 py-1">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                    37 kigger nu
                  </span>
                  <span className="rounded-full bg-slate-900/70 px-3 py-1">
                    5 har gemt
                  </span>
                  <span className="rounded-full bg-slate-900/70 px-3 py-1">
                    1 tilbage
                  </span>
                </>
              ) : (
                <>
                  <span className="inline-flex items-center gap-2 rounded-full bg-slate-900/90 px-3 py-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
                    Dropper snart – early preview
                  </span>
                  <span className="rounded-full bg-slate-900/70 px-3 py-1">
                    Kun dette ene eksemplar
                  </span>
                  {marketLabel && (
                    <span className="rounded-full bg-slate-900/70 px-3 py-1">
                      Forventet markedsværdi: {marketLabel}
                    </span>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Desktop price-hero + CTA */}
          <div className="hidden min-w-[260px] flex-col items-end gap-2 text-right lg:flex">
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

            {isLive ? (
              <button className="dd-glow-cta mt-2 rounded-2xl bg-gradient-to-r from-[var(--dd-neon-pink)] via-[var(--dd-neon-orange)] to-[var(--dd-neon-cyan)] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-slate-950">
                Køb nu – reserver i 2:00 min
              </button>
            ) : (
              <div className="mt-2 flex flex-col items-end gap-2">
                <div className="rounded-2xl border border-slate-700/70 bg-slate-900/80 px-4 py-2 text-[11px] text-slate-300">
                  Denne vare låses op, når droppet går live. Brug previewet til
                  at beslutte dig i god tid.
                </div>
                <button className="rounded-2xl border border-slate-600 bg-slate-900/80 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-100">
                  Følg droppet – vær klar ved start
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-start">
          {/* GALLERY */}
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

              {/* Overlay badge for upcoming */}
              {isUpcoming && (
                <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-center pt-4">
                  <span className="rounded-full bg-slate-950/80 px-4 py-1 text-[11px] font-medium text-amber-200 backdrop-blur">
                    Preview-mode · Varen kan først købes når droppet går live
                  </span>
                </div>
              )}

              <div className="absolute left-4 bottom-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-slate-950/85 px-3 py-1 text-xs text-slate-100">
                  {item.title}
                </span>
                {drop && (
                  <span className="rounded-full bg-slate-950/85 px-3 py-1 text-xs text-slate-400">
                    {isLive ? "Live i" : "Kommer i"} {drop.title}
                  </span>
                )}
              </div>
            </div>
            <div className="hidden gap-3 text-xs text-slate-500 sm:flex">
              <span>Flere vinkler / detaljer kan komme her senere.</span>
            </div>
          </div>

          {/* INFO-SIDE */}
          <div className="space-y-6">
            {/* Mobil price card (uden CTA hvis ikke live) */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 shadow-[0_18px_40px_rgba(15,23,42,0.85)] lg:hidden">
              <div className="flex items-baseline justify-between gap-4">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                    Pris
                  </div>
                  <div className="text-2xl font-semibold text-slate-50">
                    {priceLabel}
                  </div>
                  {marketLabel && (
                    <div className="mt-1 text-xs text-emerald-300">
                      Markedsværdi: {marketLabel}
                    </div>
                  )}
                </div>
                {isUpcoming && drop?.startsAtLabel && (
                  <div className="rounded-full bg-amber-400/15 px-3 py-1 text-[11px] font-medium text-amber-200">
                    Starter {drop.startsAtLabel}
                  </div>
                )}
              </div>
            </div>

            {/* DRIP AI™ AUTHENTICITY */}
            <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                    DRIP AI™ AUTHENTICITY SCAN
                  </div>
                  <p className="mt-1 text-xs text-slate-400">
                    {item.aiAuthenticity}% sandsynlig original baseret på
                    billeder, pris og historik.
                  </p>
                </div>
                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
                  {item.aiAuthenticity}% match
                </span>
              </div>
              <div className="mt-2 h-1.5 w-full rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-emerald-300 to-amber-300"
                  style={{ width: `${item.aiAuthenticity}%` }}
                />
              </div>

              {pricePositionLabel && (
                <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-slate-300">
                  <span className="rounded-full bg-slate-900/80 px-3 py-1">
                    {pricePositionLabel}
                  </span>
                  <span className="rounded-full bg-slate-900/80 px-3 py-1">
                    Model-match: høj
                  </span>
                  <span className="rounded-full bg-slate-900/80 px-3 py-1">
                    Slitage: inden for normalt niveau
                  </span>
                </div>
              )}
            </div>

            {/* BESKRIVELSE */}
            <div className="space-y-2 rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Beskrivelse
              </div>
              <p className="whitespace-pre-line text-sm leading-relaxed text-slate-200">
                {item.description}
              </p>
              <p className="pt-1 text-[11px] text-slate-500">
                Når droppet er slut, er denne væk. Der er kun dette ene eksemplar
                i droppet.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky CTA – kun når droppet er live */}
      {isLive && (
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
      )}
    </>
  );
}
