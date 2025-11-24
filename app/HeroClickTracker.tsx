// app/HeroClickTracker.tsx
"use client";

import type { ReactNode } from "react";

type Props = {
  itemId: string;
  children: ReactNode;
};

// Lokal, defensiv wrapper omkring window.gtag
function trackEvent(name: string, params?: Record<string, any>) {
  if (typeof window === "undefined") return;
  const w = window as any;
  if (typeof w.gtag === "function") {
    w.gtag("event", name, params || {});
  }
}

export function HeroClickTracker({ itemId, children }: Props) {
  const handleClick = () => {
    trackEvent("dd_hero_click", {
      item_id: itemId,
      position: "mobile_hero",
    });
  };

  return <div onClick={handleClick}>{children}</div>;
}
