// app/page.tsx
import type { Metadata } from "next";
import HomePage from "./HomePage";
import { HomeTrackingClient } from "./HomeTrackingClient";

export const metadata: Metadata = {
  title: "DRIPDROPS – Curated secondhand drops",
  description:
    "DRIPDROPS kuraterer de bedste secondhand design- og fashionfund i tidsbegrænsede drops.",
  openGraph: {
    title: "DRIPDROPS – Curated secondhand drops",
    description:
      "Kuraterede design- og fashionfund i high-energy drops. Begrænset tid, verificeret af AI.",
    url: "https://dripdrops.dk",
    siteName: "DRIPDROPS",
    type: "website",
  },
  alternates: {
    canonical: "https://dripdrops.dk",
  },
};

export default function Page() {
  return (
    <>
      <HomeTrackingClient />
      <HomePage />
    </>
  );
}
