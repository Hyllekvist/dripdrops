"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useItemLiveStatus } from "./useItemLiveStatus";

type Props = {
  itemId: string;
  label: string;
};

export function ReserveAndCheckoutButton({ itemId, label }: Props) {
  const router = useRouter();
  const { status } = useItemLiveStatus(itemId);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isLocked = status === "reserved" || status === "sold";

  let effectiveLabel = label;
  if (status === "reserved") effectiveLabel = "Reserveret i checkout";
  if (status === "sold") effectiveLabel = "Solgt";
  if (loading) effectiveLabel = "Reserverer…";

  const disabled = isLocked || loading;

  const handleClick = async () => {
    if (disabled) return;
    setErrorMsg(null);
    setLoading(true);

    try {
      const res = await fetch(`/api/items/${itemId}/reserve`, {
        method: "POST",
      });

      if (!res.ok) {
        // 409 = nogen kom først
        if (res.status === 409) {
          setErrorMsg(
            "En anden nåede at reservere varen lige før dig. Prøv at refreshe siden."
          );
        } else {
          setErrorMsg("Noget gik galt med reservationen. Prøv igen om lidt.");
        }
        return;
      }

      const json = await res.json();

      if (!json.ok) {
        setErrorMsg(
          "Kunne ikke reservere varen. Det kan være, at den allerede er taget."
        );
        return;
      }

      // Reservation lykkedes → send til checkout
      router.push(`/checkout?itemId=${itemId}`);
    } catch (err) {
      console.error(err);
      setErrorMsg("Teknisk fejl. Prøv igen om lidt.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-1">
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled}
        className={`inline-flex w-full items-center justify-center rounded-full px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] transition
          ${
            disabled
              ? "cursor-not-allowed border border-slate-700 bg-slate-800 text-slate-400"
              : "border border-fuchsia-400/70 bg-fuchsia-500 text-slate-950 hover:bg-fuchsia-400 hover:border-fuchsia-300"
          }`}
      >
        {effectiveLabel}
      </button>

      {errorMsg && (
        <p className="text-[10px] text-amber-300">
          {errorMsg}
        </p>
      )}
    </div>
  );
}