// app/admin/sell/[id]/AdminSellDetailActions.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  id: string;
  status: string;
};

export function AdminSellDetailActions({ id, status }: Props) {
  const router = useRouter();
  const [localStatus, setLocalStatus] = useState(status);
  const [loading, setLoading] = useState<"approved" | "rejected" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function updateStatus(nextStatus: "approved" | "rejected") {
    setError(null);
    setLoading(nextStatus);

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

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error || "Ukendt fejl fra API");
      }

      // Vi forventer at API’en returnerer newStatus
      const newStatus = data?.newStatus ?? nextStatus;
      setLocalStatus(newStatus);

      // Hent server-data igen (så /admin/sell også ser opdateringen)
      router.refresh();
    } catch (err: any) {
      console.error("Admin status update error:", err);
      setError(err.message || "Kunne ikke opdatere status.");
    } finally {
      setLoading(null);
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
          disabled={loading !== null || localStatus === "approved"}
          onClick={() => updateStatus("approved")}
          className="rounded-full bg-emerald-500 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading === "approved"
            ? "Godkender…"
            : localStatus === "approved"
            ? "Godkendt"
            : "Godkend submission"}
        </button>

        <button
          type="button"
          disabled={loading !== null || localStatus === "rejected"}
          onClick={() => updateStatus("rejected")}
          className="rounded-full border border-rose-500/70 bg-rose-500/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-rose-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading === "rejected"
            ? "Afviser…"
            : localStatus === "rejected"
            ? "Afvist"
            : "Afvis submission"}
        </button>
      </div>

      <p className="text-[11px] text-slate-500">
        Aktuel status (client):{" "}
        <span className="font-semibold">{localStatus}</span>
      </p>

      {error && (
        <p className="text-[11px] text-rose-400">
          Fejl: {error}
        </p>
      )}
    </div>
  );
}
