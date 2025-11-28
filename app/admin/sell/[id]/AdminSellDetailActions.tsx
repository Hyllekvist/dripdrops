// app/admin/sell/[id]/AdminSellDetailActions.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  id: string;
  status: string;
  itemId: string | null;
};

export function AdminSellDetailActions({ id, status, itemId }: Props) {
  const router = useRouter();

  const [localStatus, setLocalStatus] = useState<string>(status);
  const [localItemId, setLocalItemId] = useState<string | null>(itemId);
  const [loadingStatus, setLoadingStatus] = useState<
    "approved" | "rejected" | null
  >(null);
  const [creatingItem, setCreatingItem] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function updateStatus(nextStatus: "approved" | "rejected") {
    if (nextStatus === localStatus) return;

    setError(null);
    setLoadingStatus(nextStatus);

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

      const newStatus =
        typeof data?.newStatus === "string" ? data.newStatus : nextStatus;

      setLocalStatus(newStatus);
      router.refresh();
    } catch (err: any) {
      console.error("Admin status update error:", err);
      setError(err.message || "Kunne ikke opdatere status.");
    } finally {
      setLoadingStatus(null);
    }
  }

  async function createItem() {
    // Kun hvis godkendt og der ikke allerede findes et item
    if (localItemId || localStatus !== "approved") return;

    setError(null);
    setCreatingItem(true);

    try {
      const res = await fetch("/api/admin/sell/create-item", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error || "Ukendt fejl fra create-item API");
      }

      if (data?.itemId) {
        setLocalItemId(data.itemId as string);
      }

      router.refresh();
    } catch (err: any) {
      console.error("Create item error:", err);
      setError(err.message || "Kunne ikke oprette item.");
    } finally {
      setCreatingItem(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
        Handlinger
      </div>

      {/* Status-knapper */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={loadingStatus !== null || localStatus === "approved"}
          onClick={() => updateStatus("approved")}
          className="rounded-full bg-emerald-500 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loadingStatus === "approved"
            ? "Godkender…"
            : localStatus === "approved"
            ? "Godkendt"
            : "Godkend submission"}
        </button>

        <button
          type="button"
          disabled={loadingStatus !== null || localStatus === "rejected"}
          onClick={() => updateStatus("rejected")}
          className="rounded-full border border-rose-500/70 bg-rose-500/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-rose-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loadingStatus === "rejected"
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

      {/* Item-oprettelse */}
      {localStatus === "approved" && (
        <div className="space-y-2 border-t border-slate-800 pt-2">
          <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
            Item
          </div>

          {localItemId ? (
            <p className="text-[11px] text-emerald-300">
              Item oprettet for denne submission.{" "}
              <a
                href={`/admin/items/${localItemId}`}
                className="underline hover:text-emerald-200"
              >
                Åbn item-admin
              </a>
            </p>
          ) : (
            <button
              type="button"
              onClick={createItem}
              disabled={creatingItem}
              className="rounded-full border border-slate-600 bg-slate-900 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {creatingItem ? "Opretter item…" : "Opret item i items-tabellen"}
            </button>
          )}
        </div>
      )}

      {error && (
        <p className="text-[11px] text-rose-400">
          Fejl: {error}
        </p>
      )}
    </div>
  );
}
