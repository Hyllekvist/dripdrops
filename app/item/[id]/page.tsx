// app/item/[id]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { getItemById } from "@/lib/items";
import { getDropById } from "@/lib/drops";
import { ItemAnalyticsShell } from "@/components/ItemAnalyticsShell";
import { UpcomingReminder } from "@/components/UpcomingReminder";
import { DropHeaderCountdown } from "@/components/DropHeaderCountdown";
import { ItemMobileStickyCta } from "@/components/ItemMobileStickyCta";
import { ItemTrackingClient } from "./ItemTrackingClient";
import { ItemCtaTracker } from "./ItemCtaTracker";

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
      "Tryk “Køb nu” for at reservere varen i 2 minutter. Hvis du ikke betaler i tide, går den videre til næste køber.";
    priceTitle = "Pris";
  } else if (mode === "upcoming") {
    primaryCtaLabel = "Få reminder når droppet åbner";
    primaryCtaSub = drop?.startsAtLabel
      ? `Vi sender kun en mail, når droppet åbner – ingen spam. Dropper ${drop.startsAtLabel}.`
      : "Vi sender kun en mail, når droppet åbner – ingen spam.";
    priceTitle = "Forventet pris i droppet";
  } else {
    primaryCtaLabel = "Se kommende drops";
    primaryCtaSub =
      "Denne vare er allerede røget. Følg kommende drops for lignende pieces.";
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

  // ---- FOMO / SOCIAL PROOF (dummy-værdier indtil I har rigtige tal) ----
  const reminderCount = 37;
  const viewerCount = mode === "live" ? 12 : 0;
  const lastSimilarDropSeconds = 18;

  return (
    <>
      {/* Tracking – ingen UI */}
      <ItemTrackingClient
        itemId={item.id}
        dropId={drop?.id ?? null}
        mode={mode}
      />

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
            <span className="rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1 text-[11px] text-slate-100">
              1/1 piece
            </span>
            {dropStatusLabel && (
              <span
                className={
                  mode === "expired"
                    ? "rounded-full bg-slate-800/80 px-3 py-1 text-[11px] font-medium text-slate-100"
                    : "rounded-full bg-amber-400/15 px-3 py-1 text-[11px] font-medium text-amber-200"
                }
              >
                {dropStatusLabel}
              </span>
            )}
          </div>

          {drop && (
            <div className="hidden text-right text-[11px] text-slate-400 lg:block">
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
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-start">
          {/* HERO / VISUAL */}
          <section className="space-y-4">
            <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 text-slate-50 shadow-[0_20px_60px_rgba(15,23,42,0.55)]">
              {/* Billede */}
              <div className="relative aspect-[4/3] sm:aspect-[4/3]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#020617,#000000_70%)]" />
                <div className="relative z-10 flex h-full w-full items-center justify-center">
                  <span className="rounded-full bg-black/70 px-3 py-1 text-[11px] text-slate-100 backdrop-blur-sm">
                    Produktbillede kommer her
                  </span>
                </div>
              </div>

              {/* Basic info + mobil-countdown */}
              <div className="border-t border-slate-900 px-4 py-4 text-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    {item.designer && (
                      <div className="text-xs font-medium text-slate-300">
                        {item.designer}
                      </div>
                    )}
                    <h1 className="mt-1 text-lg font-semibold leading-tight text-slate-50">
                      {item.title}
                    </h1>
                    {item.brand && (
                      <p className="mt-1 text-[13px] text-slate-400">
                        {item.brand}
                      </p>
                    )}
                    <p className="mt-1 text-[11px] text-slate-400">
                      1/1 – ingen restock
                    </p>

                    {mode === "live" && (
                      <p className="mt-2 flex items-center gap-2 text-[11px] text-emerald-400">
                        <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                        Flere kigger på varen nu
                      </p>
                    )}
                  </div>

                  {/* MOBIL: countdown tæt på produktet */}
                  <div className="text-right text-[11px] text-slate-300 lg:hidden">
                    <DropHeaderCountdown
                      mode={mode}
                      startsAt={drop?.starts_at ?? null}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* RIGHT COLUMN: COMMAND CENTER + DATA + TRUST + DESCRIPTION */}
          <section className="space-y-4 lg:space-y-5 lg:sticky lg:top-24">
            {/* COMMAND CENTER */}
            <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/90 p-4 lg:p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-50">
                    Drop overview
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Pris, timing og markedsdata for dette drop.
                  </p>
                </div>
                {dropStatusLabel && (
                  <span
                    className={
                      mode === "expired"
                        ? "rounded-full bg-slate-800 px-3 py-1 text-[11px] text-slate-200"
                        : "rounded-full bg-amber-400/15 px-3 py-1 text-[11px] text-amber-200"
                    }
                  >
                    {dropStatusLabel}
                  </span>
                )}
              </div>

              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">
                    {priceTitle}
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-slate-50">
                    {priceLabel}
                  </p>

                  {marketLabel && (
                    <p className="mt-1 text-[13px] text-emerald-400">
                      Markedsværdi: {marketLabel}
                    </p>
                  )}
                  {pricePositionLabel && (
                    <p className="mt-1 text-[11px] text-slate-300">
                      {pricePositionLabel}
                    </p>
                  )}
                </div>

                {/* Desktop: countdown koblet direkte til pris */}
                <div className="hidden text-right text-xs text-slate-300 lg:block">
                  <DropHeaderCountdown
                    mode={mode}
                    startsAt={drop?.starts_at ?? null}
                  />
                </div>
              </div>

              {/* DESKTOP: primær CTA – mobil styres af sticky bar */}
              <div className="mt-3 hidden lg:block">
                {mode === "live" && (
                  <ItemCtaTracker
                    eventName="dd_item_cta_click"
                    label="buy_now_desktop"
                    itemId={item.id}
                    dropId={drop?.id ?? null}
                    mode={mode}
                  >
                    <button className="w-full rounded-full bg-gradient-to-r from-[var(--dd-neon-pink)] via-[var(--dd-neon-orange)] to-[var(--dd-neon-cyan)] px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-950">
                      {primaryCtaLabel}
                    </button>
                  </ItemCtaTracker>
                )}

                {mode === "upcoming" && (
                  <ItemCtaTracker
                    eventName="dd_item_cta_click"
                    label="reminder_desktop"
                    itemId={item.id}
                    dropId={drop?.id ?? null}
                    mode={mode}
                  >
                    <div className="w-full">
                      <UpcomingReminder itemId={item.id} />
                    </div>
                  </ItemCtaTracker>
                )}

                {mode === "expired" && (
                  <ItemCtaTracker
                    eventName="dd_item_cta_click"
                    label="see_upcoming_drops_desktop"
                    itemId={item.id}
                    dropId={drop?.id ?? null}
                    mode={mode}
                  >
                    <Link
                      href="/drops"
                      className="block w-full rounded-full border border-slate-600 bg-slate-900/90 px-4 py-2.5 text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-100"
                    >
                      {primaryCtaLabel}
                    </Link>
                  </ItemCtaTracker>
                )}

                {/* FOMO-lag lige under CTA */}
                <div className="mt-3 space-y-1 text-[11px] text-slate-300">
                  {mode === "upcoming" && (
                    <>
                      <p>
                        🔥 {reminderCount}+ har allerede sat reminder på dette
                        drop.
                      </p>
                      <p>
                        ⚡ Sidst et lignende piece droppede, røg det på{" "}
                        {lastSimilarDropSeconds} sekunder.
                      </p>
                    </>
                  )}
                  {mode === "live" && (
                    <>
                      {viewerCount > 0 && (
                        <p>👀 {viewerCount} kigger på varen lige nu.</p>
                      )}
                      <p>
                        ⚡ Én session ad gangen. Når du trykker “Køb nu”, lukker
                        vi for alle andre.
                      </p>
                    </>
                  )}
                </div>

                {/* Forklaring + trust */}
                <p className="mt-2 text-[10px] text-slate-400">
                  {primaryCtaSub}
                </p>
                <p className="mt-1 text-[10px] text-slate-500">
                  Sikker handel via DRIPDROPS: Betaling via sikre udbydere,
                  pengene frigives først, når varen er på vej, og alle sælgere
                  ID-verificeres.
                </p>
              </div>
            </div>

            {/* DRIP DATA – enkel markedsviden */}
            <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/90 p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-slate-50">Drip Data</p>
                <span className="rounded-full bg-slate-950 px-2.5 py-1 text-[11px] text-slate-300">
                  Markedsindsigt
                </span>
              </div>

              <div className="mt-2 grid grid-cols-2 gap-4 text-sm text-slate-100">
                <div>
                  <p className="text-[11px] text-slate-400">Markedsværdi</p>
                  <p className="mt-1 text-sm font-medium">
                    {marketLabel ?? "Kommer snart"}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-400">Prisposition</p>
                  <p className="mt-1 text-sm font-medium">
                    {pricePositionLabel ?? "Analyseres"}
                  </p>
                </div>
              </div>

              <p className="text-[11px] text-slate-500">
                Kilde: Offentlige salgsdata (StockX, GOAT m.fl.) kombineret med
                Drip AI™ vurdering.
              </p>
            </div>

            {/* DRIP AI™ AUTHENTICITY */}
            <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/90 p-4">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-slate-50">
                    DRIP AI™ authenticity
                  </p>
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
                <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-slate-100">
                  <span className="rounded-full bg-slate-950 px-3 py-1">
                    {pricePositionLabel}
                  </span>
                  <span className="rounded-full bg-slate-950 px-3 py-1">
                    Model-match: høj
                  </span>
                  <span className="rounded-full bg-slate-950 px-3 py-1">
                    Slitage: inden for normalt niveau
                  </span>
                </div>
              )}
            </div>

            {/* HOW IT WORKS */}
            <div className="space-y-2 rounded-2xl border border-slate-800 bg-slate-900/90 p-4">
              <p className="text-sm font-semibold text-slate-50">
                Sådan fungerer et DripDrop
              </p>
              {mode === "live" && (
                <p className="text-[13px] leading-relaxed text-slate-200">
                  1) Tryk “Køb nu” → 2) Varen reserveres i 2 minutter → 3) Du
                  gennemfører betaling → 4) Sælger sender varen. Ét køb ad
                  gangen – ingen uendelig kamp om knappen.
                </p>
              )}
              {mode === "upcoming" && (
                <p className="text-[13px] leading-relaxed text-slate-200">
                  Når droppet går live, kan du købe med ét tap. Indtil da kan du
                  sætte reminder og gemme varen, så du er klar, når timeren
                  starter.
                </p>
              )}
              {mode === "expired" && (
                <p className="text-[13px] leading-relaxed text-slate-200">
                  Drops er korte og vilde. Denne vare røg i et tidligere drop.
                  Følg kommende drops, hvis du vil fange lignende pieces, før de
                  forsvinder igen.
                </p>
              )}
            </div>

            {/* DESCRIPTION */}
            <div className="space-y-2 rounded-2xl border border-slate-800 bg-slate-900/90 p-4">
              <p className="text-sm font-semibold text-slate-50">Beskrivelse</p>
              <p className="whitespace-pre-line text-[13px] leading-relaxed text-slate-200">
                {item.description}
              </p>
              <p className="pt-1 text-[11px] text-slate-500">{scarcityFooter}</p>
            </div>
          </section>
        </div>
      </div>

      {/* Sticky CTA – mobil */}
      <ItemCtaTracker
        eventName="dd_item_cta_click"
        label="sticky_cta_mobile"
        itemId={item.id}
        dropId={drop?.id ?? null}
        mode={mode}
      >
        <ItemMobileStickyCta
          mode={mode}
          priceTitle={priceTitle}
          priceLabel={priceLabel}
          marketLabel={marketLabel}
          primaryCtaLabel={primaryCtaLabel}
          itemId={item.id}
        />
      </ItemCtaTracker>
    </>
  );
}
