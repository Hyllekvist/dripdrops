import { SellFormClient } from "@/components/sell/SellFormClient";

export const metadata = {
  title: "Sælg på DRIPDROPS",
  description: "Upload dine design- og fashionfund til næste DRIPDROPS-drop.",
};

export default function SellPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 space-y-6">
      <h1 className="text-2xl font-semibold">Sælg i næste drop</h1>
      <p className="text-sm text-slate-400">
        Upload 3–6 billeder, så klarer vi AI-scan, prisestimat og drop-match.
      </p>
      <SellFormClient />
    </div>
  );
}
