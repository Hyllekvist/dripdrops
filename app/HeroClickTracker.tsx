// app/HeroClickTracker.tsx
"use client";

import { trackEvent } from "../lib/gtag";

type Props = {
  itemId: string;
  children: React.ReactNode;
};

export function HeroClickTracker({ itemId, children }: Props) {
  return (
    <div
      onClick={() =>
        trackEvent("dd_hero_click", {
          item_id: itemId,
          position: "mobile_hero",
        })
      }
    >
      {children}
    </div>
  );
}
