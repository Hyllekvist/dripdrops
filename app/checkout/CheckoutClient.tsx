// app/checkout/CheckoutClient.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type CheckoutStatus = "ok" | "expired" | "missing" | "sold";

type Props = {
  itemId: string;
  priceLabel: string;
  reservedUntil: string | null;
  initialStatus: CheckoutStatus;
};

type LocalStatus = CheckoutStatus;

export function CheckoutClient({
  itemId,
  priceLabel,
  reservedUntil,
  initialStatus,
}: Props) {
  const router = useRouter();

  const [status, setStatus] = useState<LocalStatus>(initialStatus);
  const [remainingMs, setRemainingMs] = useState<number | null>(null);

  // Init countdown hvis vi har en fremtidig reservation
  useEffect(() => {
    if (!reservedUntil || initialStatus !== "ok") {
      setRemainingMs(null);
      return;
    }

    const deadline = new Date(reservedUntil).getTime();

    const tick = () => {
      const now = Date.now();
      const diff = deadline - now;
      if (diff <= 0) {
        setRemainingMs(0);
        setStatus("expired");
        return;
      }
      setRemainingMs(diff);
    };

    tick();
    const id = setInterval(tick, 1000);

    return () => clearInterval(id);
  }, [reservedUntil, initialStatus]);

  // Auto-redirect tilbage til varen, hvis reservationen er død / varen solgt
  useEffect(() => {
    if (status === "expired" || status === "sold" || status === "missing") {
      const timeout = setTimeout(() => {
        router.push(`/item/${itemId}`);
      }, 4000); // 4 sekunder til at læse beskeden

      return () => clearTimeout(timeout);
    }
  }, [status, router, itemId]);

  const countdownLabel = useMemo(() => {
    if (status !== "ok" || remainingMs == null) return null;
    const totalSec = Math.floor(remainingMs / 1000);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    const mm = m.toString().padStart(1, "0");
    const ss = s.toString().padStart(2, "0");
    return `${mm}:${ss}`;
  }, [remainingMs, status]);

  const disabled =
    status === "expired" || status === "missing" || status === "sold";

  let bannerTitle = "";
  let bannerBody = "";
  let bannerStyle = "";

  if (status === "ok") {
    bannerTitle = "Reserveret i checkout";
    bannerBody =
      "Denne vare er låst til dig, så længe nedtællingen kører. Når tiden udløber, frigives den til næste køber.";
    bannerStyle =
      "border-emerald-500/40 bg-emerald-500/10 text-emerald-50";
  } else if (status === "expired") {
    bannerTitle = "Reservationen er udløbet";
    bannerBody =
      "Din reservation er udløbet. Vi sender dig tilbage til varen, så du kan se, om den stadig er tilgængelig.";
    bannerStyle =
      "border-amber-500/40 bg-amber-500/10 text-amber-50";
  } else if (status === "missing") {
    bannerTitle = "Ingen aktiv reservation";
    bannerBody =
      "Vi kunne ikke finde en aktiv reservation på denne vare. Det kan være, at den ikke er låst til dig længere. Du sendes tilbage til varen om et øjeblik.";
    bannerStyle =
      "border-amber-500/40 bg-amber-500/10 text-amber-50";
  } else if (status === "sold") {
    bannerTitle = "Varen er allerede solgt";
    bannerBody =
      "Varen blev solgt, før du nåede at gennemføre checkout. Vi sender dig tilbage til varen, så du kan tjekke droppet eller finde lignende pieces.";
    bannerStyle = "border-slate-500/40 bg-slate-800/60 text-slate-50";
  }

  const buttonLabel = disabled
    ? status === "sold"
      ? "Varen er solgt"
      : "Reservationen er udløbet"
    : "Gennemfør køb nu";

  return (
    <div className="space-y-4">
      {/* Reservation banner */}
      <div
        className={`rounded-xl border px-3 py-2.5 text-[12px] ${bannerStyle}`}
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="font-medium uppercase tracking-[0.16em]">
              {bannerTitle}
            </p>
            <p className="mt-1 text-[11px] opacity-90">{bannerBody}</p>
            {(status === "expired" ||
              status === "missing" ||
              status === "sold") && (
              <button
                type="button"
                onClick={() => router.push(`/item/${itemId}`)}
                className="mt-1 text-[11px] underline underline-offset-2"
              >
                Gå tilbage til varen nu
              </button>
            )}
          </div>

          {status === "ok" && countdownLabel && (
            <div className="flex flex-col items-end text-right">
              <p className="text-[10px] uppercase tracking-[0.16em] opacity-80">
                Tid tilbage
              </p>
              <p className="text-sm font-semibold">{countdownLabel}</p>
            </div>
          )}
        </div>
      </div>

      {/* Price + CTA */}
      <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-950/70 p-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-slate-400">
              Total
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-50">
              {priceLabel}
            </p>
          </div>
        </div>

        <button
          type="button"
          disabled={disabled}
          className={`mt-2 inline-flex w-full items-center justify-center rounded-full px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] transition
            ${
              disabled
                ? "cursor-not-allowed border border-slate-700 bg-slate-800 text-slate-400"
                : "border border-fuchsia-400/70 bg-fuchsia-500 text-slate-950 hover:bg-fuchsia-400 hover:border-fuchsia-300"
            }`}
        >
          {buttonLabel}
        </button>

        <p className="mt-1 text-[10px] text-slate-500">
          Vi anbefaler, at du gennemfører betalingen, mens nedtællingen kører.
          Når tiden udløber, kan en anden køber overtage varen.
        </p>
      </div>
    </div>
  );
}