"use client";

import Link from "next/link";
import styles from "./MainHeader.module.css";

export function MainHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoMark}>DD</span>
          <span className={styles.logoText}>DRIPDROPS</span>
        </Link>

        <div className={styles.right}>
          <Link href="/drops" className={styles.navLink}>
            Drops
          </Link>
          <Link href="/sell" className={styles.navLink}>
            Sælg
          </Link>
          <Link href="/account" className={styles.navLinkMuted}>
            Konto
          </Link>
        </div>
      </div>
    </header>
  );
}
