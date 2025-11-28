// app/hooks/useItemStatus.ts (valgfrit – eller inline)
"use client";

import { useEffect, useState } from "react";

export type ItemStatus = "available" | "reserved" | "sold";

type StatusResponse = {
  status: ItemStatus;
  reserved_until?: string | null;
};

export function useItemStatus(itemId: string) {
  const [status, setStatus] = useState<ItemStatus>("available");
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
          setReservedUntil(json.reserved_until ?? null);
          setLoading(false);
        }
      } catch {
        // ignore
      }
    }

    fetchStatus();
    const interval = setInterval(fetchStatus, 5000); // hvert 5. sekund

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [itemId]);

  return { status, reservedUntil, loading };
}