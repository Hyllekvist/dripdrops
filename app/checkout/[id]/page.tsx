// app/checkout/page.tsx
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getItemById } from "@/lib/items";
import { getDropById } from "@/lib/drops";
import { CheckoutClient } from "./CheckoutClient";

type Props = {
  searchParams: {
    itemId?: string;
  };
};

type CheckoutStatus = "ok" | "expired" | "missing" | "sold";

export default async function CheckoutPage({ searchParams }: Props) {
  const itemId = searchParams.itemId;

  if (!itemId) {
    redirect("/"); // ingen itemId = tilbage til forsiden
  }

  const item = await getItemById(itemId);
  if (!item) notFound();

  const drop = item.dropId ? await getDropById(item.dropId) : null;
  if (!drop) notFound();

  // Vi forventer at items-tabellen har is_sold + reserved_until
  const raw = item as any;
  const isSold: boolean = raw.is_sold ?? false;
  const reservedUntilRaw: string | null = raw.reserved_until ?? null;

  const now = new Date();
  const reservedUntil = reservedUntilRaw ? new Date(reservedUntilRaw) : null;

  let initialStatus: CheckoutStatus = "ok";

  if (isSold) {
    initialStatus = "sold";
  } else if (!reservedUntil) {
    // ingen aktiv reservation
    initialStatus = "missing";
  } else if (reservedUntil.getTime() <= now.getTime()) {
    // reservationen er udløbet, allerede når vi lander
    initialStatus = "expired";
  } else {
    initialStatus = "ok";
  }

  const priceLabel = `${item.price.toLocaleString("da-DK")} kr`;

  return (
    <div className="mx-auto max-w-3xl px-4 pb-16 pt-8">
      <header className="mb-6 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
            Dripdrops checkout
          </p>
          <h1 className="mt-1 text-lg font-semibold text-slate-50">
            Gennemfør dit køb
          </h1>
        </div>
        <Link
          href={`/item/${item.id}`}
          className="text-xs text-slate-400 hover:text-slate-200"
        >
          Tilbage til varen
        </Link>
      </header>

      <div className="grid gap-6 md:grid-cols-[minmax(0,1.3fr)_minmax(0,0.9fr)]">
        {/* Venstre: ordreoversigt */}
        <section className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/90 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium text-slate-400">Du køber</p>
              <p className="mt-1 text-sm font-semibold text-slate-50">
                {item.title}
              </p>
              {item.brand && (
                <p className="text-xs text-slate-400">{item.brand}</p>
              )}
              <p className="mt-1 text-[11px] text-slate-500">
                Drop #{drop.sequence} · 1/1 piece
              </p>
            </div>
            <p className="text-sm font-semibold text-slate-50">
              {priceLabel}
            </p>
          </div>

          <div className="mt-2 h-px bg-slate-800" />

          <div className="space-y-2 text-[13px] text-slate-200">
            <p>
              Når du gennemfører betalingen, reserverer vi beløbet, indtil
              sælger har sendt varen. Pengene frigives først, når forsendelsen
              er på vej.
            </p>
            <p className="text-[11px] text-slate-400">
              Alle sælgere ID-verificeres, og vi overvåger drops for mistænkelig
              aktivitet.
            </p>
          </div>
        </section>

        {/* Højre: betalingsboks + reservation-logik */}
        <section className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/90 p-4">
          <CheckoutClient
            itemId={item.id}
            priceLabel={priceLabel}
            reservedUntil={reservedUntilRaw}
            initialStatus={initialStatus}
          />

          {/* Placeholder for payment form / PSP integration */}
          <div className="mt-3 space-y-2 rounded-xl border border-slate-800 bg-slate-950/70 p-3">
            <p className="text-xs font-semibold text-slate-100">
              Betalingsmetoder (placeholder)
            </p>
            <p className="text-[11px] text-slate-400">
              Her kobler du senere Stripe/QuickPay/Bambora osv. på. Indtil da
              kan du bruge denne sektion som UI-placeholder.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}