// app/sell/thanks/page.tsx
export const metadata = {
  title: "Tak for din indsendelse – DRIPDROPS",
};

export default function SellThanksPage() {
  return (
    <div className="mx-auto max-w-md px-4 pb-16 pt-10 space-y-4">
      <h1 className="text-2xl font-semibold text-slate-50">
        Tak for din indsendelse
      </h1>
      <p className="text-sm text-slate-400">
        Vi har modtaget din vare og kører nu AI-scan, prisestimat og drop-match.
        Du får svar på mail, når vi har vurderet, om den passer ind i et
        kommende drop.
      </p>
      <p className="text-xs text-slate-500">
        Vi kan ikke garantere, at alle varer kommer med i et drop. Vi
        prioriterer pieces med tydelig kvalitet, god stand og stærk
        efterspørgsel.
      </p>
    </div>
  );
}
