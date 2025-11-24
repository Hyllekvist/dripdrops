// app/admin/sell/[id]/AdminSellDetailActions.tsx
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type Props = {
  id: string;
  status: string;
};

export function AdminSellDetailActions({ id, status }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [localStatus, setLocalStatus] = useState(status);

  const disabled = pending;

  async function updateStatus(nextStatus: "approved" | "rejected") {
    setError(null);

    const endpoint =
      nextStatus === "approved"
        ? "/api/admin/sell/approve"
        : "/api/admin/sell/reject";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        let msg = "Ukendt fejl";
        try {
          const data = await res.json();
          if (data?.error) msg = data.error;
        } catch {
          // ignore
        }
        throw new Error(msg);
      }

      // Optimistisk UI-ændring
      setLocalStatus(nextStatus);

      startTransition(() => {
        // Gå tilbage til oversigten, så du ser opdateret status
        router.push("/admin/sell");
      });
    } catch (err: any) {
      console.error("Admin status update error:", err);
      setError(err.message || "Kunne ikke opdatere status.");
    }
  }

  return (
    <div className="space-y-2">
      <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
        Handlinger
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={disabled || localStatus === "approved"}
          onClick={() => updateStatus("approved")}
          className="rounded-full bg-emerald-500 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {localStatus === "approved" ? "Godkendt" : "Godkend submission"}
        </button>

        <button
          type="button"
          disabled={disabled || localStatus === "rejected"}
          onClick={() => updateStatus("rejected")}
          className="rounded-full border border-rose-500/70 bg-rose-500/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-rose-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {localStatus === "rejected" ? "Afvist" : "Afvis submission"}
        </button>
      </div>

      {pending && (
        <p className="text-[11px] text-slate-400">Opdaterer status…</p>
      )}

      {error && (
        <p className="text-[11px] text-rose-400">
          Fejl: {error}
        </p>
      )}

      <p className="text-[11px] text-slate-500">
        Aktuel status: <span className="font-semibold">{localStatus}</span>
      </p>
    </div>
  );
}
