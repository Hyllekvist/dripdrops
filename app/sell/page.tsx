// app/sell/page.tsx
import { SellFormClient } from "@/components/sell/SellFormClient";

export const metadata = {
  title: "Sælg på DRIPDROPS",
  description: "Upload dine design- og fashionfund til næste DRIPDROPS-drop.",
};

export default function SellPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-16 pt-6 space-y-8">
      {/* HEADER */}
      <header className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-700/70 bg-slate-950/80 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-slate-300">
          <span className="inline-flex h-1.5 w-1.5 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.9)]" />
          <span>Sælger-flow</span>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-slate-50 sm:text-3xl">
            Sælg i næste drop
          </h1>
          <p className="text-sm text-slate-400">
            Upload 3–6 billeder, så klarer vi AI-scan, prisestimat og
            drop-match. Du behøver ikke kende den præcise model – bare vise
            varen tydeligt.
          </p>
        </div>

        {/* HOW IT WORKS */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 text-xs text-slate-300 sm:text-[13px]">
          <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            Sådan fungerer det
          </div>
          <ol className="mt-2 space-y-1.5 list-decimal list-inside">
            <li>Upload billeder af varen (forfra, fra siden, detaljer).</li>
            <li>
              DRIP AI™ estimerer model, prisniveau og efterspørgsel ud fra
              billeder og dine inputs.
            </li>
            <li>
              Vi matcher varen til et kommende drop og vender tilbage, når den
              er klar til at gå live.
            </li>
          </ol>
          <p className="mt-3 text-[11px] text-slate-500">
            Du betaler først fee, hvis varen bliver godkendt til et drop.
          </p>
        </div>
      </header>

      {/* FORM CARD */}
      <section className="space-y-4">
        <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-4 shadow-[0_18px_55px_rgba(15,23,42,0.95)] sm:p-5">
          <div className="mb-4 space-y-1">
            <h2 className="text-sm font-semibold text-slate-100">
              Opret dit item
            </h2>
            <p className="text-xs text-slate-400">
              Start med billeder og basale detaljer. Du kan altid uddybe
              senere, hvis vi har brug for mere info.
            </p>
          </div>

          {/* Selve formularen */}
          <SellFormClient />
        </div>

        {/* SMALL GUIDELINES */}
        <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-4 text-xs text-slate-300">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Hvad vi leder efter
            </div>
            <ul className="mt-2 space-y-1 list-disc list-inside">
              <li>Designmøbler, belysning, kunst og objekter.</li>
              <li>Fashion med tydelig kvalitet (archive, design, nichebrands).</li>
              <li>Varen skal være i pæn stand og 100% ægte.</li>
            </ul>
          </div>

          <div>
            <div className="mt-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Gode billeder
            </div>
            <ul className="mt-2 space-y-1 list-disc list-inside">
              <li>Naturligt lys, ingen hårde skygger.</li>
              <li>Tag mindst ét billede tæt på detaljer og slitage.</li>
              <li>Ingen collager – hellere flere enkelte billeder.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
