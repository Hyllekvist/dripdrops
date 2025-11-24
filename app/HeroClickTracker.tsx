// app/HeroClickTracker.tsx
"use client";

import type { ReactNode } from "react";
import { trackEvent } from "../lib/gtag";

type Props = {
  itemId: string;
  children: ReactNode;
};

export function HeroClickTracker({ itemId, children }: Props) {
  const handleClick = () => {
    trackEvent("dd_hero_click", {
      item_id: itemId,
      position: "mobile_hero",
    });
  };

  return <div onClick={handleClick}>{children}</div>;
}
