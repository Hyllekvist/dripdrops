import type { Metadata } from "next";
import "./globals.css";
import { MainHeader } from "@/components/layout/MainHeader";
import { MainFooter } from "@/components/layout/MainFooter";

export const metadata: Metadata = {
  title: {
    default: "DRIPDROPS – One-Tap Drop Marketplace",
    template: "%s · DRIPDROPS",
  },
  description:
    "DRIPDROPS er en drop-baseret secondhand-platform til design og fashion – køb og sælg på få sekunder i kuraterede drops, verificeret af AI.",
  metadataBase: new URL("https://dripdrops.app"),
  openGraph: {
    title: "DRIPDROPS – One-Tap Drop Marketplace",
    description:
      "Køb og sælg secondhand i hype-drops. Begrænset tid, verificeret af AI, under markedspris.",
    url: "https://dripdrops.app",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="da">
      <body className="bg-slate-950 text-slate-50">
        <div className="fixed inset-0 -z-10">
          <div className="absolute -top-40 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,#ff5cde33,#02061700)] blur-3xl" />
          <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,#00f0ff33,#02061700)] blur-3xl" />
        </div>

        <MainHeader />
        <main className="min-h-[calc(100vh-64px-64px)]">{children}</main>
        <MainFooter />
      </body>
    </html>
  );
}
