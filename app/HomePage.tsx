// app/HomePage.tsx
import Link from "next/link";
import styles from "./HomePage.module.css";
import { listPublicLiveDrops } from "@/lib/drops";
import { listItemsForDrop } from "@/lib/items";
import { HeroClickTracker } from "./HeroClickTracker";
import { HomeCtaTracker } from "./HomeCtaTracker";

type HeroItem = {
  id: string;
  title: string;
  price: number | null;
  brand?: string | null;
  designer?: string | null;
};

export default async function HomePage() {
  // 🔒 Kun LIVE drops til forsiden
  const drops = await listPublicLiveDrops();
  const activeDrop = drops[0] ?? null;

  let heroItem: HeroItem | null = null;

  if (activeDrop) {
    const items = await listItemsForDrop(activeDrop.id);
    const firstItem = items[0];

    if (firstItem) {
      heroItem = {
        id: firstItem.id,
        title: firstItem.title,
        price: firstItem.price ?? null,
        brand: firstItem.brand ?? null,
        designer: firstItem.designer ?? null,
      };
    }
  }

  const dropLabel = activeDrop ? "Live nu" : "Næste drop klar";

  return (
    <div className={styles.wrapper}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          {/* MOBILE HERO PRODUCT (stage item over titlen) – kun hvis der er et live drop */}
          {heroItem && activeDrop && (
            <HeroClickTracker itemId={heroItem.id}>
              <Link
                href={`/item/${heroItem.id}`}
                className="mb-8 block lg:hidden"
              >
                <article className="relative overflow-hidden rounded-3xl border border-slate-800/70 bg-slate-950 shadow-[0_22px_60px_rgba(0,0,0,0.75)] dark:border-slate-700 dark:bg-slate-950">
                  {/* subtle neon bg */}
                  <div className="pointer-events-none absolute inset-0 animate-pulse-slow bg-[radial-gradient(circle_at_20%_0%,rgba(255,92,222,0.18),transparent_60%),radial-gradient(circle_at_80%_100%,rgba(0,240,255,0.18),transparent_55%)]" />

                  <div className="relative z-10 px-5 py-5">
                    {/* top row */}
                    <div className="mb-4 flex items-center justify-between text-[11px] text-slate-200">
                      <div className="inline-flex items-center gap-2">
                        <span className="rounded-full bg-slate-950/90 px-3 py-1 uppercase tracking-[0.18em] text-slate-200">
                          Hero drop
                        </span>
                        <span className="inline-flex items-center gap-1 text-emerald-300">
                          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                          Live lige nu
                        </span>
                      </div>
                      <span className="text-xs text-slate-400">
                        DROP #{activeDrop.sequence}
                      </span>
                    </div>

                    {/* image placeholder – kan senere skiftes til rigtig billedkomponent */}
                    <div className="mb-5 overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_top,#1f2937,#020617_70%)]">
                      <div className="flex aspect-[4/3] items-center justify-center text-[11px] text-slate-300">
                        Produktbillede låst til dette drop
                      </div>
                    </div>

                    {/* meta + price */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        {heroItem.designer && (
                          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                            {heroItem.designer}
                          </p>
                        )}
                        <p className="mt-1 text-lg font-semibold text-slate-50">
                          {heroItem.title}
                        </p>
                        {heroItem.brand && (
                          <p className="text-sm text-slate-400">
                            {heroItem.brand}
                          </p>
                        )}
                        <p className="mt-1 text-[11px] text-slate-500">
                          1/1 – ingen restock
                        </p>
                        <p className="mt-2 text-[12px] font-medium text-emerald-300">
                          Live nu – begrænset tid
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                          Pris
                        </p>
                        <p className="mt-1 text-lg font-semibold text-slate-50">
                          {typeof heroItem.price === "number"
                            ? `${heroItem.price.toLocaleString("da-DK")} kr`
                            : "Se pris"}
                        </p>
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="mt-5 flex items-center justify-between gap-3">
                      <p className="text-[11px] text-slate-500">
                        Tap for at åbne droppet.
                      </p>
                      <div className="rounded-full bg-gradient-to-r from-[var(--dd-neon-pink)] via-[var(--dd-neon-orange)] to-[var(--dd-neon-cyan)] p-[1px]">
                        <div className="rounded-full bg-slate-950 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-50">
                          Se varen
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            </HeroClickTracker>
          )}

          {/* DROP PILL */}
          <div className={styles.dropPill}>
            <span>DROP #{activeDrop?.sequence ?? 27}</span>
            {activeDrop && <span className={styles.liveDot} />}
            <span>{dropLabel}</span>
          </div>

          {/* HERO COPY */}
          <h1 className={styles.title}>
            Buy secondhand{" "}
            <span className={styles.titleHighlight}>in seconds.</span>
          </h1>

          <p className={styles.sub}>
            DRIPDROPS kuraterer de bedste design- og fashionfund i high-energy
            drops. Begrænset tid, verificeret af AI, ingen endeløs scroll.
          </p>

          {/* HERO CTAs */}
          <div className={styles.heroActions}>
            <HomeCtaTracker
              eventName="dd_cta_click"
              payload={{ label: "browse_drops", position: "hero" }}
            >
              <Link href="/drops" className={styles.primaryCta}>
                Browse drops
              </Link>
            </HomeCtaTracker>

            <HomeCtaTracker
              eventName="dd_cta_click"
              payload={{ label: "sell_next_favorite", position: "hero" }}
            >
              <Link href="/sell" className={styles.secondaryCta}>
                Sælg din næste favorit
              </Link>
            </HomeCtaTracker>
          </div>

          {/* FEATURE GRID */}
          <div className={styles.featureGrid}>
            <div className="dd-gradient-border rounded-2xl bg-slate-100/90 p-4 dark:bg-slate-950/80">
              <p className={styles.featureLabel}>Authenticated by AI</p>
              <p className={styles.featureText}>
                Hver vare får et AI-estimat på ægthed, pris og efterspørgsel.
              </p>
            </div>
            <div className="dd-gradient-border rounded-2xl bg-slate-100/90 p-4 dark:bg-slate-950/80">
              <p className={styles.featureLabel}>Limited-time drops</p>
              <p className={styles.featureText}>
                Drops varer 15 minutter. Høj energi, nul støj, maks fokus.
              </p>
            </div>
            <div className="dd-gradient-border rounded-2xl bg-slate-100/90 p-4 dark:bg-slate-950/80">
              <p className={styles.featureLabel}>Design & curated fashion</p>
              <p className={styles.featureText}>
                Fra Spanske Stole til archive streetwear – vi sorterer
                skraldet fra.
              </p>
            </div>
          </div>
        </div>

        {/* DESKTOP HERO VISUAL */}
        <div className={styles.heroVisual}>
          <div className={styles.mockCard}>
            <div className={styles.mockHeader}>
              <span className={styles.mockDropBadge}>
                {activeDrop ? activeDrop.title : "Design Drop"}
              </span>
              <span className={styles.mockTimer}>
                {activeDrop ? "Live" : "Snart"}
              </span>
            </div>
            <div className={styles.mockBody}>
              <div className={styles.mockImage} />
              <div className={styles.mockMeta}>
                <div className={styles.mockTitle}>
                  {heroItem?.title ?? "The Spanish Chair"}
                </div>
                <div className={styles.mockPriceRow}>
                  <span className={styles.mockPrice}>
                    {heroItem && typeof heroItem.price === "number"
                      ? `${heroItem.price.toLocaleString("da-DK")} kr`
                      : "9.500 kr"}
                  </span>
                  <span className={styles.mockViews}>
                    {activeDrop
                      ? heroItem
                        ? "Live drop"
                        : "Drop åbent"
                      : "221 kigger nu"}
                  </span>
                </div>
                {heroItem && activeDrop ? (
                  <Link
                    href={`/item/${heroItem.id}`}
                    className={styles.mockCta}
                  >
                    Se varen
                  </Link>
                ) : (
                  <button className={styles.mockCta}>
                    Se kommende drops
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
