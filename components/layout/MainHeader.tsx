"use client";

import Link from "next/link";
import styles from "./MainHeader.module.css";
import { ThemeToggle } from "@/components/ThemeToggle";

export function MainHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoMark}>DD</span>
          <span className={styles.logoText}>DRIPDROPS</span>
        </Link>

        <div className={styles.right}>
          {/* Nav-links – skjules på mobil via CSS */}
          <nav className={styles.nav}>
            <Link href="/drops" className={styles.navLink}>
              Drops
            </Link>
            <Link href="/sell" className={styles.navLink}>
              Sælg
            </Link>
            <Link href="/account" className={styles.navLinkMuted}>
              Konto
            </Link>
          </nav>

          {/* Neon theme toggle – altid synlig */}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
