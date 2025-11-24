// app/item/[id]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { getItemById } from "@/lib/items";
import { getDropById } from "@/lib/drops";
import { ItemAnalyticsShell } from "@/components/ItemAnalyticsShell";
import { UpcomingReminder } from "@/components/UpcomingReminder";
import { DropHeaderCountdown } from "@/components/DropHeaderCountdown";
import { ItemMobileStickyCta } from "@/components/ItemMobileStickyCta";

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

  let pricePositionLabel: string | null = null;
  if (item.marketMin && item.marketMax) {
    if (item.price <= item.marketMin) {
      pricePositionLabel = "Under typisk markedspris";
    } else if (item.price <= item.marketMax) {
      pricePositionLabel = "Inden for normalt prisniveau";
    } else {
      pricePositionLabel = "Over typisk prisniveau";
    }
  }

  let primaryCtaLabel = "";
  let primaryCtaSub = "";
  let priceTitle = "Pris";

  if (mode === "live") {
    primaryCtaLabel = "Køb nu – reserver i 2:00";
    primaryCtaSub =
      "Du reserverer varen i 2 minutter. Betaling sker først i næste step.";
    priceTitle = "Pris";
  } else if (mode === "upcoming") {
    primaryCtaLabel = "Få reminder når droppet åbner";
    primaryCtaSub = drop?.startsAtLabel
      ? `Dropper ${drop.startsAtLabel}. Vi giver besked, når det går live.`
      : "Dropper snart – få besked, når det åbner.";
    priceTitle = "Forventet pris i droppet";
  } else {
    primaryCtaLabel = "Se kommende drops";
    primaryCtaSub =
      "Denne vare blev solgt i et tidligere drop. Hold øje med lignende i kommende drops.";
    priceTitle = "Solgt for";
  }

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

      <div className="mx-auto max-w-5xl px-4 pb-28 pt-4 lg:pb-16 lg:pt-8">
        {/* TOP BADGES */}
        <div className="mb-4 flex items-center justify-between gap-3">
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

          {drop && (
            <div className="hidden text-right text-[11px] text-slate-500 lg:block">
              <div>Drop #{drop.sequence}</div>
              {mode === "live" && <div>Åben nu</div>}
              {mode === "upcoming" && drop.startsAtLabel && (
                <div>{drop.startsAtLabel}</div>
              )}
              {mode === "expired" && <div>Afsluttet</div>}
            </div>
          )}
        </div>

        {/* MAIN GRID */}
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start">
          {/* HERO / CARD */}
          <section className="space-y-4">
            <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-100 text-slate-900 shadow-[0_20px_60px_rgba(15,23,42,0.55)] dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50">
              {/* Billede */}
              <div className="relative aspect-[4/3] sm:aspect-[4/3]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#0f172a,#020617_65%)] dark:bg-[radial-gradient(circle_at_center,#020617,#000000_70%)]" />
                <div className="relative z-10 flex h-full w-full items-center justify-center">
                  <span className="rounded-full bg-black/60 px-3 py-1 text-[11px] text-slate-100 backdrop-blur-sm">
                    Produktbillede kommer her
                  </span>
                </div>
              </div>

              {/* Info + (desktop) pris + CTA */}
              <div className="border-t border-black/5 px-4 py-4 text-sm dark:border-slate-800">
                <div className="grid grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] items-start gap-4">
                  {/* Venstre: designer + title + brand + FOMO */}
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                      {item.designer}
                    </div>
                    <h1 className="mt-1 text-lg font-semibold leading-tight text-slate-900 dark:text-slate-50">
                      {item.title}
                    </h1>
                    {item.brand && (
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        {item.brand}
                      </p>
                    )}
                    <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                      1/1 – ingen restock
                    </p>

                    {/* FOMO VIEWER COUNT */}
                    {mode === "live" && (
                      <p className="mt-2 flex items-center gap-2 text-[11px] text-emerald-400">
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Flere kigger på varen nu
                      </p>
                    )}
                  </div>

                  {/* Højre: desktop price + CTA / mobil countdown */}
                  <div className="text-right text-xs">
                    {/* DESKTOP: pris + CTA */}
                    <div className="hidden lg:block">
                      <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                        {priceTitle}
                      </div>
                      <div className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-50">
                        {priceLabel}
                      </div>
                      {marketLabel && (
                        <div className="mt-1 text-[11px] text-emerald-500 dark:text-emerald-300">
                          Markedsværdi: {marketLabel}
                        </div>
                      )}
                      {pricePositionLabel && (
                        <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                          {pricePositionLabel}
                        </div>
                      )}

                      <div className="mt-3">
                        {mode === "live" && (
                          <button className="w-full rounded-full bg-gradient-to-r from-[var(--dd-neon-pink)] via-[var(--dd-neon-orange)] to-[var(--dd-neon-cyan)] px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-950">
                            {primaryCtaLabel}
                          </button>
                        )}

                        {mode === "upcoming" && (
                          <div className="w-full">
                            <UpcomingReminder itemId={item.id} />
                          </div>
                        )}

                        {mode === "expired" && (
                          <Link
                            href="/drops"
                            className="block w-full rounded-full border border-slate-600 bg-slate-900/90 px-4 py-2.5 text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-100"
                          >
                            {primaryCtaLabel}
                          </Link>
                        )}
                      </div>

                      <p className="mt-1 text-[10px] text-slate-500 dark:text-slate-500">
                        {primaryCtaSub}
                      </p>
                    </div>

                    {/* MOBIL: countdown – ingen pris her */}
                    <div className="block text-right text-[11px] text-slate-600 dark:text-slate-400 lg:hidden">
                      <DropHeaderCountdown
                        mode={mode}
                        startsAt={drop?.starts_at ?? null}
                      />
                    </div>
                  </div>
                </div>

                {/* Card-footer: drop-meta – uden pris */}
                <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-slate-600 dark:text-slate-400">
                  {mode === "live" && (
                    <>
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/80 px-3 py-1 text-slate-200">
                        Live nu – session-baseret checkout
                      </span>
                      <span className="rounded-full bg-slate-900/60 px-3 py-1 text-slate-300">
                        Sikker betaling via DRIPDROPS
                      </span>
                    </>
                  )}
                  {mode === "upcoming" && (
                    <>
                      <span className="rounded-full bg-slate-900/80 px-3 py-1 text-slate-200">
                        Dropper snart
                      </span>
                      <span className="rounded-full bg-slate-900/60 px-3 py-1 text-slate-300">
                        Sæt reminder for at være klar
                      </span>
                    </>
                  )}
                  {mode === "expired" && (
                    <>
                      <span className="rounded-full bg-slate-900/80 px-3 py-1 text-slate-200">
                        Solgt i tidligere drop
                      </span>
                      <span className="rounded-full bg-slate-900/60 px-3 py-1 text-slate-300">
                        Se kommende drops for lignende varer
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* INFO / TRUST / DESCRIPTION */}
          <section className="space-y-6">
            {/* DRIP AI™ AUTHENTICITY */}
            <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-950/90 p-4">
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

            {/* HOW IT WORKS */}
            <div className="space-y-2 rounded-2xl border border-slate-800 bg-slate-950/90 p-4">
              <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Sådan fungerer et DRIPDROP
              </div>
              {mode === "live" && (
                <p className="text-xs leading-relaxed text-slate-300">
                  1) Tryk “Køb nu” → 2) Varen reserveres i 2 minutter → 3) Du
                  gennemfører betaling → 4) Sælger sender varen. Én session ad
                  gangen – ingen uendelig scroll.
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

            {/* DESCRIPTION */}
            <div className="space-y-2 rounded-2xl border border-slate-800 bg-slate-950/90 p-4">
              <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Beskrivelse
              </div>
              <p className="whitespace-pre-line text-sm leading-relaxed text-slate-200">
                {item.description}
              </p>
              <p className="pt-1 text-[11px] text-slate-500">{scarcityFooter}</p>
            </div>
          </section>
        </div>
      </div>

      {/* Sticky CTA – mobil (ejer prisen på small screens) */}
      <ItemMobileStickyCta
        mode={mode}
        priceTitle={priceTitle}
        priceLabel={priceLabel}
        marketLabel={marketLabel}
        primaryCtaLabel={primaryCtaLabel}
        itemId={item.id}
      />
    </>
  );
}