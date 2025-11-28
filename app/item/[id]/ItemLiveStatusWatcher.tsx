// app/item/[id]/ItemLiveStatusWatcher.tsx
"use client";

import { useItemLiveStatus } from "./useItemLiveStatus";

type Props = {
  itemId: string;
};

export function ItemLiveStatusWatcher({ itemId }: Props) {
  const { status, reservedUntil, loading } = useItemLiveStatus(itemId);

  if (loading || status === "available") return null;

  if (status === "reserved") {
    return (
      <div className="mt-3 rounded-xl border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-[12px] text-amber-100">
        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-amber-300" />
          <span className="font-medium uppercase tracking-[0.16em]">
            Reserveret i checkout
          </span>
        </div>
        <p className="mt-1 text-[11px] text-amber-100/90">
          En anden køber har lige nu reserveret varen i checkout. Hvis de ikke
          gennemfører, bliver den frigivet igen automatisk.
        </p>
        {reservedUntil && (
          <p className="mt-1 text-[10px] text-amber-200/80">
            Reservationen udløber omkring{" "}
            {new Date(reservedUntil).toLocaleTimeString("da-DK", {
              hour: "2-digit",
              minute: "2-digit",
            })}
            .
          </p>
        )}
      </div>
    );
  }

  if (status === "sold") {
    return (
      <div className="mt-3 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-[12px] text-emerald-100">
        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-300" />
          <span className="font-medium uppercase tracking-[0.16em]">
            Solgt i dette drop
          </span>
        </div>
        <p className="mt-1 text-[11px] text-emerald-100/90">
          Varen er allerede købt under dette drop. Hold øje med kommende drops
          for lignende pieces.
        </p>
      </div>
    );
  }

  return null;
}