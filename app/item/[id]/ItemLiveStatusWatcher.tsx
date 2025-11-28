// app/item/[id]/ItemLiveStatusWatcher.tsx
"use client";

import { useEffect, useState } from "react";

type Props = {
  itemId: string;
};

type StatusPayload = {
  sold: boolean;
  reserved_until: string | null;
};

export function ItemLiveStatusWatcher({ itemId }: Props) {
  const [status, setStatus] = useState<StatusPayload | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchStatus() {
      try {
        const res = await fetch(`/api/items/${itemId}/status`, {
          cache: "no-store",
        });

        if (!res.ok) {
          return;
        }

        const data = (await res.json()) as StatusPayload;

        if (!cancelled) {
          setStatus(data);
        }
      } catch (err) {
        if (!cancelled) {
          // vi ignorerer fejl her – UI skal bare være "best effort"
          console.error("ItemLiveStatusWatcher error", err);
        }
      }
    }

    // første fetch
    fetchStatus();

    // poll fx hver 3. sekund
    const intervalId = setInterval(fetchStatus, 3000);

    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, [itemId]);

  if (!status) return null;

  const now = Date.now();

  const hasActiveReservation =
    !status.sold &&
    !!status.reserved_until &&
    new Date(status.reserved_until).getTime() > now;

  // 1) Solgt – hård lock
  if (status.sold) {
    return (
      <div className="mb-2 flex items-center gap-2 rounded-xl border border-rose-500/60 bg-rose-500/10 px-3 py-2 text-[11px] text-rose-100">
        <span className="inline-block h-2 w-2 rounded-full bg-rose-400" />
        <span>Denne vare er allerede solgt.</span>
      </div>
    );
  }

  // 2) Midlertidigt låst af en anden (checkout i gang)
  if (hasActiveReservation) {
    return (
      <div className="mb-2 flex items-center gap-2 rounded-xl border border-amber-500/60 bg-amber-500/10 px-3 py-2 text-[11px] text-amber-100">
        <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-amber-300" />
        <span>
          En anden er lige nu i gang med at checke ud. Hvis de ikke når at betale, låses varen op igen.
        </span>
      </div>
    );
  }

  // 3) Ingen aktiv reservation / ikke solgt → vis ingenting
  return null;
}
