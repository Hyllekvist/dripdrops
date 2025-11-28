"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  itemId: string;
  label: string;
};

export function ReserveAndCheckoutButton({ itemId, label }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.ok) {
        alert(
          data?.error ||
            "Kunne ikke reservere varen lige nu. Prøv igen om lidt."
        );
        return;
      }

      // Success → videre til checkout med aktiv 2-minutters reservation
      router.push(`/checkout/${itemId}`);
    } catch (err) {
      console.error("ReserveAndCheckoutButton error:", err);
      alert("Teknisk fejl – prøv igen om lidt.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="w-full rounded-full bg-gradient-to-r from-[var(--dd-neon-pink)] via-[var(--dd-neon-orange)] to-[var(--dd-neon-cyan)] px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-950 disabled:opacity-70"
    >
      {loading ? "Reserverer…" : label}
    </button>
  );
}
