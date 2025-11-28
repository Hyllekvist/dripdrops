"use client";

import { useEffect, useState } from "react";

type Props = {
  itemId: string;
  onLockChange?: (locked: boolean) => void;
};

export function ItemLiveStatusWatcher({ itemId, onLockChange }: Props) {
  const [locked, setLocked] = useState(false);

  async function check() {
    try {
      const res = await fetch(`/api/items/${itemId}/status`, {
        cache: "no-store",
      });
      const data = await res.json();

      if (!res.ok) return;

      const reservedUntil = data.reserved_until
        ? new Date(data.reserved_until).getTime()
        : null;

      const now = Date.now();

      const isLocked =
        data.sold ||
        (reservedUntil !== null && reservedUntil > now);

      setLocked(isLocked);
      onLockChange?.(isLocked);
    } catch (e) {
      console.error("status poll error", e);
    }
  }

  useEffect(() => {
    check();
    const i = setInterval(check, 3000);
    return () => clearInterval(i);
  }, []);

  if (!locked) return null;

  return (
    <div className="rounded-xl bg-rose-500/10 border border-rose-500/40 text-rose-300 text-xs px-3 py-2">
      🔒 Dette piece er i checkout af en anden bruger lige nu.
    </div>
  );
}
