// app/item/[id]/useItemLiveStatus.ts
"use client";

import { useEffect, useState } from "react";

export type ItemLiveStatus = "available" | "reserved" | "sold";

type StatusResponse = {
  id: string;
  status: ItemLiveStatus;
  reserved_until: string | null;
};

export function useItemLiveStatus(itemId: string) {
  const [status, setStatus] = useState<ItemLiveStatus>("available");
  const [reservedUntil, setReservedUntil] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchStatus() {
      try {
        const res = await fetch(`/api/items/${itemId}/status`, {
          cache: "no-store",
        });
        if (!res.ok) return;

        const json: StatusResponse = await res.json();
        if (!cancelled) {
          setStatus(json.status);
          setReservedUntil(json.reserved_until);
          setLoading(false);
        }
      } catch {
        // ignore
      }
    }

    fetchStatus();
    const intervalId = setInterval(fetchStatus, 5000); // poll hver 5. sekund

    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, [itemId]);

  return { status, reservedUntil, loading };
}