// app/admin/items/page.tsx
export const dynamic = "force-dynamic";

import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type ItemRow = {
  id: string;
  created_at: string;
  title: string;
  brand: string | null;
  price: number | null;
  drop_id: string | null;
  sell_submissions: { id: string }[] | null;
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
    .select(
      `
      id,
      created_at,
      title,
      brand,
      price,
      drop_id,
      sell_submissions ( id )
    `
    )
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    console.error("Admin items error:", error);
    return (
      <div className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-xl font-semibold text-slate-50">
          Items – admin
        </h1>
        <p className="mt-4 text-sm text-rose-400">
          Kunne ikke hente items. Tjek server log.
        </p>
      </div>
    );
  }

  const items = (data ?? []) as unknown as ItemRow[];

  return (
    <div className="mx-auto max-w-5xl px-4 pb-16 pt-8 space-y-6">
      <header className="space-y-2">
        <h1 className="text-xl font-semibold text-slate-50">
          Items – admin
        </h1>
        <p className="text-sm text-slate-400">
          Oversigt over items i systemet. Bruges til at se, hvilke items der er
          knyttet til drops, og hvilke der kommer fra sælger-flowet.
        </p>
      </header>

      {items.length === 0 ? (
        <p className="text-sm text-slate-500">
          Der er endnu ingen items i systemet.
        </p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => {
            const fromSell =
              Array.isArray(item.sell_submissions) &&
              item.sell_submissions.length > 0;

            return (
              <article
                key={item.id}
                className="rounded-2xl border border-slate-800 bg-slate-950/85 p-4 text-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  {/* Venstre side: basic info */}
                  <div className="min-w-[220px] flex-1 space-y-1">
                    <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                      {new Date(item.created_at).toLocaleString("da-DK")}
                    </div>
                    <h2 className="text-sm font-semibold text-slate-50">
                      {item.title}
                    </h2>
                    <p className="text-xs text-slate-400">
                      {item.brand || "Ukendt brand"}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      ID: <span className="font-mono text-[11px]">{item.id}</span>
                    </p>

                    <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
                      {fromSell && (
                        <span className="inline-flex items-center rounded-full border border-amber-400/70 bg-amber-400/10 px-3 py-1 text-amber-200">
                          Fra sell-submission
                        </span>
                      )}

                      {item.drop_id ? (
                        <span className="inline-flex rounded-full border border-emerald-400/70 bg-emerald-400/10 px-3 py-1 text-emerald-200">
                          Linket til drop (id: {item.drop_id})
                        </span>
                      ) : (
                        <span className="inline-flex rounded-full border border-slate-600 bg-slate-900 px-3 py-1 text-slate-300">
                          Ikke tilknyttet drop
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Højre side: pris + links */}
                  <div className="min-w-[180px] text-right text-xs space-y-2">
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                        Pris
                      </div>
                      <div className="text-sm text-slate-100">
                        {typeof item.price === "number"
                          ? `${item.price.toLocaleString("da-DK")} kr`
                          : "Ikke angivet"}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800 space-y-1">
                      <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                        Links
                      </div>
                      <div className="space-y-1 text-[11px]">
                        <Link
                          href={`/item/${item.id}`}
                          className="text-sky-300 hover:text-sky-200"
                        >
                          Se public item-side →
                        </Link>
                        {fromSell && (
                          <div className="text-slate-400">
                            Relaterede sell-submissions:{" "}
                            {item.sell_submissions!.map((s) => (
                              <Link
                                key={s.id}
                                href={`/admin/sell/${s.id}`}
                                className="ml-1 underline hover:text-slate-200"
                              >
                                {s.id.slice(0, 6)}…
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}