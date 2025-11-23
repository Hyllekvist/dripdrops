// app/item/[id]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { getItemById } from "@/lib/items";
import { getDropById } from "@/lib/drops";
import { ItemAnalyticsShell } from "@/components/ItemAnalyticsShell";
import { UpcomingReminder } from "@/components/UpcomingReminder";
import { DropHeaderCountdown } from "@/components/DropHeaderCountdown";

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

  // Hent drop-info (til state + labels)
  const drop = item.dropId ? await getDropById(item.dropId) : null;

  // ---- STATE: live / upcoming / expired -----------------------------------
  type DropMode = "live" | "upcoming" | "expired";
  let mode: DropMode = "live";

  if (drop) {
    if (drop.isLive) {
      mode = "live";
    } else if (drop.starts_at) {
      const starts = new Date(drop.starts_at);
      const now = new Date();
      mode = starts.getTime() > now.getTime() ? "upcoming" : "expired";
    } else {
      mode = "expired";
    }
  }

  const priceLabel = `${item.price.toLocaleString("da-DK")} kr`;
  const marketLabel =
    item.marketMin && item.marketMax
      ? `${item.marketMin.toLocaleString(
          "da-DK",
        )}–${item.marketMax.toLocaleString("da-DK")} kr`
      : null;

  // Drop-status pill
  let dropStatusLabel: string | null = null;
  if (drop) {
    if (mode === "live") {
      dropStatusLabel = "Live drop";
    } else if (mode === "upcoming" && drop.startsAtLabel) {
      dropStatusLabel = `Starter ${drop.startsAtLabel}`;
    } else if (mode === "expired") {
      dropStatusLabel = `Drop #${drop.sequence} er slut`;
    }
  }

  // Pris-position ift. markedsrange
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

  // CTA-tekst afhængigt af state
  let primaryCtaLabel = "";
  let primaryCtaSub = "";
  let priceTitle = "Pris";

  if (mode === "live") {
    primaryCtaLabel = "Køb nu – reserver i 2:00";
    primaryCtaSub =
      "Du reserverer bare varen i 2 minutter. Betaling sker først i næste step.";
    priceTitle = "Pris";
  } else if (mode === "upcoming") {
    primaryCtaLabel = "Få reminder når droppet åbner";
    primaryCtaSub = drop?.startsAtLabel
      ? `Dropper ${drop.startsAtLabel}. Vi giver besked, når det går live.`
      : "Dropper snart – få besked, når det åbner.";
    priceTitle = "Forventet pris i droppet";
  } else {
    // expired
    primaryCtaLabel = "Se kommende drops";
    primaryCtaSub =
      "Denne vare blev solgt i et tidligere drop. Hold øje med lignende i kommende drops.";
    priceTitle = "Solgt for";
  }

  // Tekst efter beskrivelse afhængigt af state
  let scarcityFooter = "";
  if (mode === "live") {
    scarcityFooter =
      "Når tiden løber ud, er denne én væk. Der er kun dette ene eksemplar i droppet.";
  } else if (mode === "upcoming") {
    scarcityFooter =
      "Når droppet åbner, er der kun ét eksemplar. Sæt reminder nu, hvis du vil have første skud.";
  } else {
    scarcityFooter =
      "Denne vare er allerede røget. Brug kommende drops til at finde lignende pieces.";
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
                    mode === "expired"
                      ? "rounded-full bg-slate-800/80 px-3 py-1 text-[11px] font-medium text-slate-200"
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

            {/* “Live stats” – skifter let efter state */}
            <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
              {mode === "live" && (
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
              )}
              {mode === "upcoming" && (
                <>
                  <span className="rounded-full bg-slate-900/90 px-3 py-1">
                    Dropper snart – early access via konto
                  </span>
                  <span className="rounded-full bg-slate-900/70 px-3 py-1">
                    Gem varen for at få hurtig adgang
                  </span>
                </>
              )}
              {mode === "expired" && (
                <>
                  <span className="rounded-full bg-slate-900/90 px-3 py-1">
                    Solgt i tidligere drop
                  </span>
                  <span className="rounded-full bg-slate-900/70 px-3 py-1">
                    Se kommende drops for lignende pieces
                  </span>
                </>
              )}
            </div>

            {/* Countdown + reminder badge i headeren */}
           {/* Countdown i headeren */}
<div className="mt-2">
  <DropHeaderCountdown
    mode={mode}
    startsAt={drop?.starts_at ?? null}
  />
</div>

          </div>

          {/* Desktop price-hero + CTA */}
          <div className="hidden min-w-[260px] flex-col items-end gap-2 text-right lg:flex">
            <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
              {priceTitle}
            </div>
            <div className="text-2xl font-semibold text-slate-50">
              {priceLabel}
            </div>
            {marketLabel && (
              <div className="text-xs text-emerald-300">
                Markedsværdi: {marketLabel}
              </div>
            )}

            {mode === "live" && (
              <button className="dd-glow-cta mt-2 rounded-2xl bg-gradient-to-r from-[var(--dd-neon-pink)] via-[var(--dd-neon-orange)] to-[var(--dd-neon-cyan)] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-slate-950">
                {primaryCtaLabel}
              </button>
            )}

            {mode === "upcoming" && (
              <>
                {/* Reminder-CTA til upcoming drops (desktop) */}
                <div className="mt-2">
                  <UpcomingReminder itemId={item.id} />
                </div>
              </>
            )}

            {mode === "expired" && (
              <Link
                href="/drops"
                className="mt-2 rounded-2xl border border-slate-600 bg-slate-900/90 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-slate-100"
              >
                {primaryCtaLabel}
              </Link>
            )}

            <p className="mt-1 max-w-xs text-[11px] text-slate-500">
              {primaryCtaSub}
            </p>
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
              <div className="absolute left-4 bottom-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-slate-950/85 px-3 py-1 text-xs text-slate-100">
                  {item.title}
                </span>
                {drop && (
                  <span className="rounded-full bg-slate-950/85 px-3 py-1 text-xs text-slate-400">
                    {mode === "expired"
                      ? `Solgt i ${drop.title}`
                      : `Live i ${drop.title}`}
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
            {/* Mobil price card */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 shadow-[0_18px_40px_rgba(15,23,42,0.85)] lg:hidden">
              <div className="flex items-baseline justify-between gap-4">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                    {priceTitle}
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

            {/* “Sådan fungerer et drop”-forklaring */}
            <div className="space-y-2 rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Sådan fungerer et DRIPDROP
              </div>
              {mode === "live" && (
                <p className="text-xs leading-relaxed text-slate-300">
                  1) Tryk “Køb nu” → 2) Varen reserveres i 2 minutter → 3) Du
                  gennemfører betaling → 4) Sælger sender varen. Én session ad
                  gangen, ingen uendelig scroll.
                </p>
              )}
              {mode === "upcoming" && (
                <p className="text-xs leading-relaxed text-slate-300">
                  Når droppet går live, kan du købe med ét tap. Indtil da kan du
                  sætte reminder og gemme varen, så du er klar, når timeren
                  starter.
                </p>
              )}
              {mode === "expired" && (
                <p className="text-xs leading-relaxed text-slate-300">
                  Drops er korte og vilde. Denne vare røg i et tidligere drop.
                  Følg kommende drops, hvis du vil fange lignende pieces, før de
                  forsvinder igen.
                </p>
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
                {scarcityFooter}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky CTA – mobil */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-800/80 bg-slate-950/95 px-4 py-3 shadow-[0_-18px_40px_rgba(15,23,42,0.95)] lg:hidden">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
          <div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
              {priceTitle}
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

          {mode === "live" && (
            <button className="dd-glow-cta flex-1 rounded-2xl bg-gradient-to-r from-[var(--dd-neon-pink)] via-[var(--dd-neon-orange)] to-[var(--dd-neon-cyan)] px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-slate-950">
              {primaryCtaLabel}
            </button>
          )}

          {mode === "upcoming" && (
            <div className="flex-1">
              {/* Reminder-CTA til upcoming drops (mobil sticky) */}
              <UpcomingReminder itemId={item.id} />
            </div>
          )}

          {mode === "expired" && (
            <Link
              href="/drops"
              className="flex-1 rounded-2xl border border-slate-600 bg-slate-900/90 px-4 py-2.5 text-center text-xs font-semibold uppercase tracking-[0.16em] text-slate-100"
            >
              {primaryCtaLabel}
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
