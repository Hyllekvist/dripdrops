// app/checkout/[id]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { getItemById } from "@/lib/items";
import { getDropById } from "@/lib/drops";
import { CheckoutTimer } from "./CheckoutTimer";

type Props = { params: { id: string } };

export async function generateMetadata({ params }: Props) {
  const item = await getItemById(params.id);
  if (!item) return {};

  const drop = item.dropId ? await getDropById(item.dropId) : null;
  if (!drop || !drop.isLive) {
    return {};
  }

  const title = `Checkout – ${item.title} | DRIPDROPS`;
  const description = `${item.designer ?? ""} ${item.brand ?? ""}`.trim();

  return {
    title,
    description,
  };
}

export default async function CheckoutPage({ params }: Props) {
  const item = await getItemById(params.id);
  if (!item) notFound();

  const drop = item.dropId ? await getDropById(item.dropId) : null;

  // Samme synlighedsregel som item-siden:
  if (!drop || !drop.isLive) {
    notFound();
  }

  const priceLabel = `${item.price.toLocaleString("da-DK")} kr`;
  const marketLabel =
    item.marketMin && item.marketMax
      ? `${item.marketMin.toLocaleString("da-DK")}–${item.marketMax.toLocaleString(
          "da-DK"
        )} kr`
      : null;

  // forventer at getItemById mapper reserved_until -> reservedUntil
  const expiresAt: string | null =
    (item as any).reservedUntil ?? (item as any).reserved_until ?? null;

  return (
    <div className="mx-auto max-w-4xl px-4 pb-16 pt-8 space-y-6">
      {/* TOP-PILL / PROGRESS */}
      <header className="space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-700/70 bg-slate-950/80 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-slate-300">
          <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)] animate-pulse" />
          <span>Checkout</span>
          <span className="text-slate-500">Trin 2 af 2</span>
        </div>

        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold text-slate-50 sm:text-3xl">
              Bekræft dit køb
            </h1>
            <p className="text-sm text-slate-400">
              Du er få sekunder fra at låse dette piece. Tjek detaljer og gå
              videre til betaling.
            </p>
          </div>

          <div className="text-right text-[11px] text-slate-400">
            <div>Drop #{drop.sequence}</div>
            <div>Live lige nu</div>
          </div>
        </div>

        {/* Timer-strip */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/90 p-3">
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_0%_0%,rgba(255,92,222,0.22),transparent_55%),radial-gradient(circle_at_100%_100%,rgba(0,240,255,0.22),transparent_55%)]" />
          <div className="relative z-10 flex items-center justify-between gap-3 text-xs text-slate-100">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              <span>Din session er aktiv</span>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <span className="text-slate-300">Tid tilbage:</span>
              <CheckoutTimer expires={expiresAt} />
            </div>
          </div>
        </div>
      </header>

      {/* MAIN GRID */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.9fr)] lg:items-start">
        {/* VENSTRE: Item-resumé */}
        <section className="space-y-4 rounded-2xl border border-slate-800 bg-slate-950/85 p-4">
          <div className="space-y-1">
            <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
              Item
            </div>
            {item.designer && (
              <div className="text-xs font-medium text-slate-300">
                {item.designer}
              </div>
            )}
            <h2 className="text-lg font-semibold text-slate-50">
              {item.title}
            </h2>
            {item.brand && (
              <p className="text-sm text-slate-400">{item.brand}</p>
            )}
            <p className="text-[11px] text-slate-500">1/1 – ingen restock</p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-800 bg-[radial-gradient(circle_at_top,#1f2937,#020617_70%)]">
            <div className="flex aspect-[4/3] items-center justify-center text-[11px] text-slate-300">
              Produktbillede (samme som item-siden) kommer her senere
            </div>
          </div>

          <div className="space-y-1 text-sm text-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Pris</span>
              <span className="font-semibold text-slate-50">
                {priceLabel}
              </span>
            </div>
            {marketLabel && (
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Estimeret markedsværdi</span>
                <span className="text-emerald-300">{marketLabel}</span>
              </div>
            )}
          </div>

          <p className="pt-2 text-[11px] text-slate-500">
            Når du gennemfører checkout, reserverer vi betalingen, indtil
            sælger har sendt varen. Hvis der er problemer med leveringen, er
            du dækket via DRIPDROPS-support.
          </p>
        </section>

        {/* HØJRE: Checkout-panel */}
        <section className="space-y-4 rounded-2xl border border-slate-800 bg-slate-950/85 p-4 text-sm">
          <div className="space-y-1">
            <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
              Oversigt
            </div>
            <p className="text-xs text-slate-400">
              Tjek din ordre igennem. Betalingstrin kommer i næste iteration
              (for nu er dette et UX-skelet).
            </p>
          </div>

          <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-950 p-3 text-sm text-slate-100">
            <div className="flex items-center justify-between">
              <span>Item</span>
              <span className="line-clamp-1 text-right text-xs text-slate-300">
                {item.title}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Pris</span>
              <span>{priceLabel}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>DRIPDROPS fee</span>
              <span>Inkluderet i pris (placeholder)</span>
            </div>
            <div className="h-px w-full bg-slate-800" />
            <div className="flex items-center justify-between text-sm font-semibold text-slate-50">
              <span>Total</span>
              <span>{priceLabel}</span>
            </div>
          </div>

          {/* “Betal” CTA – dummy for nu */}
          <button
            type="button"
            className="w-full rounded-full bg-gradient-to-r from-[var(--dd-neon-pink)] via-[var(--dd-neon-orange)] to-[var(--dd-neon-cyan)] px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-950 dd-glow-cta"
          >
            Gå til betaling (demo)
          </button>

          <p className="text-[11px] text-slate-500">
            I næste step kan vi koble en rigtig betalingsudbyder på (Stripe,
            Nets eller lignende). For nu fungerer denne side som skeleton for
            checkout-flowet.
          </p>

          <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-500">
            <p>
              Har du fortrudt?{" "}
              <Link
                href={`/item/${item.id}`}
                className="text-slate-200 underline hover:text-slate-50"
              >
                Tilbage til varen
              </Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}