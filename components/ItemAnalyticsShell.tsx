"use client";

import { useEffect } from "react";

export function ItemAnalyticsShell({ itemId, ai, price }: any) {
  useEffect(() => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "item_view", {
        event_category: "item",
        item_id: itemId,
        ai_score: ai,
        price: price,
      });
    }
  }, []);

  return null;
}