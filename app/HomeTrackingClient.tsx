// app/HomeTrackingClient.tsx
"use client";

import { useEffect } from "react";

// Simpel wrapper omkring gtag – no-op hvis det ikke findes
function trackEvent(name: string, params?: Record<string, any>) {
  if (typeof window === "undefined") return;
  const w = window as any;
  if (typeof w.gtag === "function") {
    w.gtag("event", name, params || {});
  }
}

export function HomeTrackingClient() {
  useEffect(() => {
    trackEvent("dd_home_view", {
      page: "home",
      source: "dripdrops_app",
    });
  }, []);

  return null;
}
