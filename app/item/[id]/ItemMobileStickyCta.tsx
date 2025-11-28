// components/ItemMobileStickyCta.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Mode = "live" | "upcoming" | "expired";

type ItemStatus = "available" | "reserved" | "sold";

type Props = {
  mode: Mode;
  priceTitle: string;
  priceLabel: string;
  marketLabel: string | null;
  primaryCtaLabel: string;
  itemId: string;
};

type StatusResponse = {
  status: ItemStatus;
  reserved_until?: string | null;
};

export function ItemMobileStickyCta({
  mode,
  priceTitle,
  priceLabel,
  marketLabel,
  primaryCtaLabel,
  itemId,
}: Props) {
  const router = useRouter();

  const [status, setStatus] = useState<ItemStatus>("available");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Poll live status, så CTA'en på mobil ser det samme som command center
  useEffect(() => {
    let cancelled = false;

    async function fetchStatus() {
      try {
        const res = await fetch(`/api/items/${itemId}/status`, {
          cache: "no-store",
        });
        if (!res.ok) return;
        const json: StatusResponse = await res.json();
        if (!cancelled && json.status) {
          setStatus(json.status);
        }
      } catch {
        // ignore
      }
    }

    // Kun interessant for live-mode
    if (mode === "live") {
      fetchStatus();
      const id = setInterval(fetchStatus, 5000);
      return () => {
        cancelled = true;
        clearInterval(id);
      };
    }
  }, [itemId, mode]);

  const isLive = mode === "live";

  let effectiveLabel = primaryCtaLabel;
  let disabled = false;

  if (isLive) {
    if (loading) {
      effectiveLabel = "Reserverer…";
      disabled = true;
    } else if (status === "reserved") {
      effectiveLabel = "Reserveret i checkout";
      disabled = true;
    } else if (status === "sold") {
      effectiveLabel = "Solgt";
      disabled = true;
    }
  }

  const handleClick = async () => {
    setErrorMsg(null);

    // Ikke-live modes har simpelt behavior
    if (mode === "upcoming") {
      const el = document.getElementById("item-command-center");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      return;
    }

    if (mode === "expired") {
      router.push("/drops");
      return;
    }

    // LIVE-mode + evt. locked
    if (status === "reserved" || status === "sold" || loading) {
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`/api/items/${itemId}/reserve`, {
        method: "POST",
      });

      if (!res.ok) {
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

      // Reservation lykkedes → videre til checkout
      router.push(`/checkout?itemId=${itemId}`);
    } catch (err) {
      console.error(err);
      setErrorMsg("Teknisk fejl. Prøv igen om lidt.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-800/80 bg-slate-950/95 px-4 py-3 backdrop-blur md:hidden">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-slate-400">
            {priceTitle}
          </p>
          <p className="text-sm font-semibold text-slate-50">{priceLabel}</p>
          {marketLabel && (
            <p className="text-[11px] text-emerald-400">
              Markedsværdi: {marketLabel}
            </p>
          )}
        </div>

        <div className="flex flex-col items-end gap-1">
          <button
            type="button"
            onClick={handleClick}
            disabled={disabled}
            className={`shrink-0 rounded-full px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] transition
              ${
                disabled
                  ? "cursor-not-allowed border border-slate-700 bg-slate-800 text-slate-400"
                  : "border border-fuchsia-400/70 bg-fuchsia-500 text-slate-950 hover:bg-fuchsia-400 hover:border-fuchsia-300"
              }`}
          >
            {effectiveLabel}
          </button>

          {errorMsg && (
            <p className="max-w-[220px] text-right text-[9px] text-amber-300">
              {errorMsg}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}