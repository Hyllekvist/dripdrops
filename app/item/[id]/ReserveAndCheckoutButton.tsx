"use client";

import { useRouter } from "next/navigation";
import { useItemLiveStatus } from "./useItemLiveStatus";

type Props = {
  itemId: string;
  label: string;
};

export function ReserveAndCheckoutButton({ itemId, label }: Props) {
  const router = useRouter();
  const { status } = useItemLiveStatus(itemId);

  const isDisabled = status === "reserved" || status === "sold";

  let effectiveLabel = label;
  if (status === "reserved") effectiveLabel = "Reserveret i checkout";
  if (status === "sold") effectiveLabel = "Solgt";

  const handleClick = () => {
    if (isDisabled) return;

    // TODO: senere kan vi kalde et reserve-endpoint her.
    router.push(`/checkout?itemId=${itemId}`);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isDisabled}
      className={`inline-flex w-full items-center justify-center rounded-full px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] transition
        ${
          isDisabled
            ? "cursor-not-allowed border border-slate-700 bg-slate-800 text-slate-400"
            : "border border-fuchsia-400/70 bg-fuchsia-500 text-slate-950 hover:bg-fuchsia-400 hover:border-fuchsia-300"
        }`}
    >
      {effectiveLabel}
    </button>
  );
}