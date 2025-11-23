import Link from "next/link";
import styles from "./HomePage.module.css";
import { listActiveDrops } from "@/lib/drops";

export default async function HomePage() {
  const drops = await listActiveDrops();
  const nextDrop = drops[0];

  return (
    <div className={styles.wrapper}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.dropPill}>
            <span>DROP #{nextDrop?.sequence ?? 27}</span>
            <span className={styles.liveDot} />
            <span>
              {nextDrop?.isLive
                ? "Live nu"
                : nextDrop?.startsAtLabel
                ? `Starter kl. ${nextDrop.startsAtLabel}`
                : "Næste drop klar"}
            </span>
          </div>

          <h1 className={styles.title}>
            Buy secondhand{" "}
            <span className={styles.titleHighlight}>in seconds.</span>
          </h1>

          <p className={styles.sub}>
            DRIPDROPS kuraterer de bedste design- og fashionfund i
            high-energy drops. Begrænset tid, verificeret af AI, ingen
            endeløs scroll.
          </p>

          <div className={styles.heroActions}>
            <Link href="/drops" className={styles.primaryCta}>
              Browse drops
            </Link>
            <Link href="/sell" className={styles.secondaryCta}>
              Sælg din næste favorit
            </Link>
          </div>

          <div className={styles.featureGrid}>
            <div className="dd-gradient-border rounded-2xl bg-slate-950/80 p-4">
              <p className={styles.featureLabel}>Authenticated by AI</p>
              <p className={styles.featureText}>
                Hver vare får et AI-estimat på ægthed, pris og efterspørgsel.
              </p>
            </div>
            <div className="dd-gradient-border rounded-2xl bg-slate-950/80 p-4">
              <p className={styles.featureLabel}>Limited-time drops</p>
              <p className={styles.featureText}>
                Drops varer 15 minutter. Høj energi, nul støj, maks fokus.
              </p>
            </div>
            <div className="dd-gradient-border rounded-2xl bg-slate-950/80 p-4">
              <p className={styles.featureLabel}>Design & curated fashion</p>
              <p className={styles.featureText}>
                Fra Spanske Stole til archive streetwear – vi sorterer
                skraldet fra.
              </p>
            </div>
          </div>
        </div>

        <div className={styles.heroVisual}>
          <div className={styles.mockCard}>
            <div className={styles.mockHeader}>
              <span className={styles.mockDropBadge}>Design Drop · Live</span>
              <span className={styles.mockTimer}>08:14</span>
            </div>
            <div className={styles.mockBody}>
              <div className={styles.mockImage} />
              <div className={styles.mockMeta}>
                <div className={styles.mockTitle}>The Spanish Chair</div>
                <div className={styles.mockPriceRow}>
                  <span className={styles.mockPrice}>9.500 kr</span>
                  <span className={styles.mockViews}>221 kigger nu</span>
                </div>
                <button className={styles.mockCta}>Køb nu – 1 tilbage</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
