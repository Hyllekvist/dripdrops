"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

function format(ms: number): string {
  if (ms <= 0) return "00:00";
  const total = Math.floor(ms / 1000);
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0"
  )}`;
}

export function CheckoutTimer() {
  const searchParams = useSearchParams();
  const exp = searchParams.get("exp");

  const [remaining, setRemaining] = useState(() => {
    if (!exp) return 0;
    const target = new Date(exp).getTime();
    return target - Date.now();
  });

  useEffect(() => {
    if (!exp) return;
    const target = new Date(exp).getTime();

    const tick = () => {
      const diff = target - Date.now();
      setRemaining(diff);
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [exp]);

  const label = exp ? format(remaining) : "02:00";

  return (
    <span className="rounded-full bg-black/60 px-3 py-1 font-mono text-emerald-300">
      {label}
    </span>
  );
}
