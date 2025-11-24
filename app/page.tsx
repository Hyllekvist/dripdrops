import Link from "next/link";
import styles from "./HomePage.module.css";
import { listActiveDrops } from "@/lib/drops";
import { listItemsForDrop } from "@/lib/items";

export default async function HomePage() {
  const drops = await listActiveDrops();
  const nextDrop = drops[0];

  let heroItem: any = null;

  if (nextDrop) {
    const items = await listItemsForDrop(nextDrop.id);
    heroItem = items[0] ?? null;
  }

  const dropLabel = nextDrop
    ? nextDrop.isLive
      ? "Live nu"
      : nextDrop.startsAtLabel
      ? `Starter ${nextDrop.startsAtLabel}`
      : "Næste drop klar"
    : "Næste drop klar";

  return (
    <div className={styles.wrapper}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          {/* MOBILE HERO PRODUCT – stage card over titel */}
          {heroItem && (
            <div className="mb-6 block rounded-3xl border border-slate-800 bg-slate-100/90 p-4 shadow-[0_18px_40px_rgba(15,23,42,0.65)] dark:bg-slate-900/90 lg:hidden">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-slate-800">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#0f172a,#020617_70%)] opacity-70 dark:bg-[radial-gradient(circle_at_center,#020617,#000000_75%)]" />
                <div className="relative z-10 flex h-full w-full items-center justify-center text-xs text-slate-200">
                  Produktbillede kommer her
                </div>
              </div>

              <div className="mt-4 flex items-start justify-between gap-3">
                <div>
                  {heroItem.designer && (
                    <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                      {heroItem.designer}
                    </p>
                  )}
                  <p className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                    {heroItem.title}
                  </p>
                  {heroItem.brand && (
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {heroItem.brand}
                    </p>
                  )}
                  <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                    1/1 – ingen restock
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                    Pris
                  </p>
                  <p className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                    {heroItem.price.toLocaleString("da-DK")} kr
                  </p>
                  <p className="mt-1 flex items-center justify-end gap-1 text-[11px] text-emerald-500">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {nextDrop?.isLive ? "Live drop" : "Udvalgt item"}
                  </p>
                </div>
              </div>

              <Link
                href={`/item/${heroItem.id}`}
                className="mt-4 block w-full rounded-full bg-gradient-to-r from-[var(--dd-neon-pink)] via-[var(--dd-neon-orange)] to-[var(--dd-neon-cyan)] px-4 py-3 text-center text-[12px] font-semibold uppercase tracking-[0.16em] text-slate-950"
              >
                Se varen
              </Link>
            </div>
          )}

          {/* DROP PILL */}
          <div className={styles.dropPill}>
            <span>DROP #{nextDrop?.sequence ?? 27}</span>
            <span className={styles.liveDot} />
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
            <Link href="/drops" className={styles.primaryCta}>
              Browse drops
            </Link>
            <Link href="/sell" className={styles.secondaryCta}>
              Sælg din næste favorit
            </Link>
          </div>

          {/* FEATURE GRID – tilpasset til dark/light via utility classes */}
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
                Fra Spanske Stole til archive streetwear – vi sorterer skraldet
                fra.
              </p>
            </div>
          </div>
        </div>

        {/* DESKTOP HERO VISUAL / MOCK CARD (beholder din gamle, kun desktop) */}
        <div className={styles.heroVisual}>
          <div className={styles.mockCard}>
            <div className={styles.mockHeader}>
              <span className={styles.mockDropBadge}>
                {nextDrop ? nextDrop.title : "Design Drop"}
              </span>
              <span className={styles.mockTimer}>
                {nextDrop?.isLive ? "Live" : "Snart"}
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
                    {heroItem
                      ? `${heroItem.price.toLocaleString("da-DK")} kr`
                      : "9.500 kr"}
                  </span>
                  <span className={styles.mockViews}>
                    {nextDrop?.isLive
                      ? "Live drop"
                      : heroItem
                      ? "Udvalgt item"
                      : "221 kigger nu"}
                  </span>
                </div>
                {heroItem ? (
                  <Link
                    href={`/item/${heroItem.id}`}
                    className={styles.mockCta}
                  >
                    Se varen
                  </Link>
                ) : (
                  <button className={styles.mockCta}>
                    Køb nu – 1 tilbage
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