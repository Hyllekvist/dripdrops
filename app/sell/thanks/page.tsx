// app/sell/thanks/page.tsx
import { SellThanksClient } from "./SellThanksClient";

export const metadata = {
  title: "Tak for din indsendelse – DRIPDROPS",
};

export default function SellThanksPage() {
  return (
    <div className="mx-auto max-w-xl px-4 pb-16 pt-10 space-y-6">
      <header className="space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/60 bg-emerald-500/10 px-3 py-1">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)] animate-pulse" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-200">
            Yes. Dit item er landet.
          </span>
        </div>

        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-slate-50">
            Tak for din indsendelse
          </h1>
          <p className="text-sm text-slate-400">
            Vi har modtaget dit item og sat det i kø til AI-scan, prisestimat og
            drop-match.
          </p>
        </div>
      </header>

      {/* Dit item – direkte payoff */}
      <SellThanksClient />

      {/* Hvad der sker nu */}
      <section className="space-y-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-4 text-sm text-slate-300">
        <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
          Hvad sker der nu?
        </div>
        <ol className="mt-2 space-y-2 text-[13px]">
          <li>
            <span className="font-medium text-slate-100">1 · Første check</span>{" "}
            – vi tjekker billeder, info og prisidé og filtrerer åbenlyst
            off-brand items fra.
          </li>
          <li>
            <span className="font-medium text-slate-100">
              2 · AI-scan & prisestimat
            </span>{" "}
            – DRIP AI™ vurderer model, stand og typisk markedspris, så vi kan
            se, om det passer ind i et DRIPDROP.
          </li>
          <li>
            <span className="font-medium text-slate-100">
              3 · Drop-match & svar
            </span>{" "}
            – hvis varen matcher et kommende drop, får du mail med næste step.
            Hvis ikke, får du også besked.
          </li>
        </ol>
        <p className="pt-2 text-[11px] text-slate-500">
          Vi kan ikke garantere, at alle varer kommer med i et drop. Vi
          prioriterer pieces med tydelig kvalitet, god stand og stærk
          efterspørgsel.
        </p>
      </section>
    </div>
  );
}
