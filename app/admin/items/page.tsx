// app/admin/items/page.tsx
export const dynamic = "force-dynamic";

import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type AdminItem = {
  id: string;
  created_at: string;
  title: string;
  brand: string | null;
  price: number | null;
};

export const metadata = {
  title: "Items · Admin – DRIPDROPS",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminItemsPage() {
  const { data, error } = await supabase
    .from("items")
    .select("id, created_at, title, brand, price")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    console.error("Admin items error:", error);
    return (
      <div className="mx-auto max-w-5xl px-4 pb-16 pt-8">
        <h1 className="text-xl font-semibold text-slate-50">
          Items – admin
        </h1>
        <p className="mt-4 text-sm text-rose-400">
          Kunne ikke hente items. Tjek server log.
        </p>
      </div>
    );
  }

  const items = (data ?? []) as AdminItem[];

  return (
    <div className="mx-auto max-w-5xl px-4 pb-16 pt-8 space-y-6">
      <header className="space-y-2">
        <h1 className="text-xl font-semibold text-slate-50">
          Items – admin
        </h1>
        <p className="text-sm text-slate-400">
          Rigtige items i systemet. Bruges til at matche drops og tjekke priser.
        </p>
      </header>

      {items.length === 0 ? (
        <p className="text-sm text-slate-500">
          Der er ingen items endnu. Godkend en sell-submission og opret et item
          derfra.
        </p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <article
              key={item.id}
              className="rounded-2xl border border-slate-800 bg-slate-950/85 p-4 text-sm"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                    {new Date(item.created_at).toLocaleString("da-DK")}
                  </div>
                  <h2 className="text-sm font-semibold text-slate-50">
                    {item.title}
                  </h2>
                  <p className="text-xs text-slate-400">
                    {item.brand || "Ukendt brand"}
                  </p>
                </div>

                <div className="text-right text-xs space-y-1">
                  <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                    Pris
                  </div>
                  <div className="text-sm text-slate-100">
                    {item.price
                      ? `${item.price.toLocaleString("da-DK")} kr`
                      : "Ikke angivet"}
                  </div>
                  <Link
                    href={`/item/${item.id}`}
                    className="text-[11px] text-slate-400 underline hover:text-slate-200"
                  >
                    Se item-side →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
