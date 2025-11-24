// app/item/[id]/ItemTrackingClient.tsx
"use client";

import { useEffect } from "react";

type DropMode = "live" | "upcoming" | "expired";

type Props = {
  itemId: string;
  dropId: string | null;
  mode: DropMode;
};

function trackEvent(name: string, params?: Record<string, any>) {
  if (typeof window === "undefined") return;
  const w = window as any;
  if (typeof w.gtag === "function") {
    w.gtag("event", name, params || {});
  }
}

export function ItemTrackingClient({ itemId, dropId, mode }: Props) {
  useEffect(() => {
    trackEvent("dd_item_view", {
      item_id: itemId,
      drop_id: dropId,
      mode,
      source: "item_page",
    });
  }, [itemId, dropId, mode]);

  return null;
}
