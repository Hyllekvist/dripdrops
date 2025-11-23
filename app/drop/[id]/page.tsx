import { notFound } from "next/navigation";
import { cache } from "react";
import { getItemById } from "@/lib/items";

// ---- Cachedf data fetch (undgår dobbelt Supabase-call) ----
const getItemByIdCached = cache(getItemById);

type Props = { params: { id: string } };

// ---- JSON-LD til SEO (Product + Offer) ----
function ItemJsonLd({ item }: { item: any }) {
  const price = item.price ?? 0;
  const currency = "DKK";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: item.title,
    brand: item.brand || undefined,
    description: item.description || undefined,
    offers: {
      "@type": "Offer",
      price: price,
      priceCurrency: currency,
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/UsedCondition",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export async function generateMetadata({ params }: Props) {
  const item = await getItemByIdCached(params.id);
  if (!item) return {};

  const title = `${item.title} – DRIPDROPS`;
  const descBase = item.description || `${item.designer} · ${item.brand}`;
  const description = descBase.slice(0, 155); // safe meta length

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "product",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function ItemPage({ params }: Props) {
  const item = await getItemByIdCached(params.id);
  if (!item) notFound();

  const priceLabel = `${item.price.toLocaleString("da-DK")} kr`;
  const marketMin = item.marketMin ?? item.price;
  const marketMax = item.marketMax ?? item.price;
  const marketLabel = `${marketMin.toLocaleString(
    "da-DK"
  )}–${marketMax.toLocaleString("da-DK")} kr`;

  return (
    <>
      {/* SEO schema */}
      <ItemJsonLd item={item} />

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
                {[item.designer, item.brand].filter(Boolean).join(" · ")}
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
            <div className="text-xs text-emerald-300">
              Markedsværdi: {marketLabel}
            </div>
            <ItemBuyCta
              variant="primary"
              label="Køb nu – reserver i 2:00 min"
              itemId={item.id}
            />
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-start">
          {/* Billede / gallery */}
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
                  Design Drop · 1/1 piece
                </span>
              </div>
            </div>

            <div className="hidden gap-3 text-xs text-slate-500 sm:flex">
              <span>Flere vinkler / detaljer kan komme her senere.</span>
            </div>
          </div>

          {/* Info / spec */}
          <div className="space-y-6">
            {/* Price blok (mobil) */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 shadow-[0_18px_40px_rgba(15,23,42,0.85)] lg:hidden">
              <div className="flex items-baseline justify-between gap-4">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                    Pris
                  </div>
                  <div className="text-2xl font-semibold text-slate-50">
                    {priceLabel}
                  </div>
                  <div className="mt-1 text-xs text-emerald-300">
                    Markedsværdi: {marketLabel}
                  </div>
                </div>
              </div>
            </div>

            {/* AI authenticity */}
            <div className="space-y-2 rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                    AI authenticity check
                  </div>
                  <p className="mt-1 text-xs text-slate-400">
                    {item.aiAuthenticity}% sandsynlig original baseret på
                    billeder, pris og beskrivelse.
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

            {/* Stand + meta */}
            <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Stand & detaljer
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="rounded-full bg-slate-900 px-3 py-1 text-slate-100">
                  {item.conditionLabel}
                </span>
                <span className="rounded-full bg-slate-900 px-3 py-1 text-slate-300">
                  Original produktion
                </span>
                <span className="rounded-full bg-slate-900 px-3 py-1 text-slate-300">
                  Klar til levering
                </span>
              </div>
            </div>

            {/* Beskrivelse */}
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

      {/* Sticky buy bar – mobil */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-800/80 bg-slate-950/95 px-4 py-3 shadow-[0_-18px_40px_rgba(15,23,42,0.95)] lg:hidden">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
          <div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
              Pris
            </div>
            <div className="text-lg font-semibold text-slate-50">
              {priceLabel}
            </div>
            <div className="text-[11px] text-emerald-300">
              Markedsværdi: {marketLabel}
            </div>
          </div>
          <ItemBuyCta
            variant="primary"
            label="Køb nu – reserver i 2:00"
            itemId={item.id}
            fullWidth
          />
        </div>
      </div>
    </>
  );
}

// ---- Client CTA-komponent (inline import – se nedenfor fil) ----
import ItemBuyCta from "@/components/ItemBuyCta";