// app/item/[id]/ItemCtaTracker.tsx
"use client";

import type { ReactNode } from "react";

type DropMode = "live" | "upcoming" | "expired";

type Props = {
  eventName: string;
  label: string;
  itemId: string;
  dropId: string | null;
  mode: DropMode;
  children: ReactNode;
};

function trackEvent(name: string, params?: Record<string, any>) {
  if (typeof window === "undefined") return;
  const w = window as any;
  if (typeof w.gtag === "function") {
    w.gtag("event", name, params || {});
  }
}

export function ItemCtaTracker({
  eventName,
  label,
  itemId,
  dropId,
  mode,
  children,
}: Props) {
  const handleClick = () => {
    trackEvent(eventName, {
      label,
      item_id: itemId,
      drop_id: dropId,
      mode,
      source: "item_page",
    });
  };

  return <div onClick={handleClick}>{children}</div>;
}
