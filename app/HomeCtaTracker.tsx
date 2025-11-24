// app/HomeCtaTracker.tsx
"use client";

import type { ReactNode } from "react";

type Props = {
  eventName: string;
  payload?: Record<string, any>;
  children: ReactNode;
};

function trackEvent(name: string, params?: Record<string, any>) {
  if (typeof window === "undefined") return;
  const w = window as any;
  if (typeof w.gtag === "function") {
    w.gtag("event", name, params || {});
  }
}

export function HomeCtaTracker({ eventName, payload, children }: Props) {
  const handleClick = () => {
    trackEvent(eventName, payload);
  };

  return <div onClick={handleClick}>{children}</div>;
}
