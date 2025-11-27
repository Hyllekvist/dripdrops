// app/admin/items/page.tsx
export const dynamic = "force-dynamic";

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type AdminItemDrop = {
  id: string;
  title: string;
  sequence: number | null;
  is_live: boolean | null;
  starts_at: string | null;
  ends_at: string | null;
};

type AdminItem = {
  id: string;
  created_at: string;
  title: string;
  brand: string | null;
  price: number | null;
  drop_id: string | null;
  // Supabase relation = array (many-to-one via foreign key)
  drops: AdminItemDrop[] | null;
};

export const metadata = {
  title: "Items · Admin – DRIPDROPS",
  robots: {
    index: false,
    follow: false,
  },
};

// helper til status-pill
function getDropStatus(item: AdminItem) {
  const drop =
    item.drops && item.drops.length > 0 ? item.drops[0] : null;

  if (!drop || !item.drop_id) {
    return {
      label: "Uden drop",
      className:
        "border-slate-700 bg-slate-900 text-slate-300",
    };
  }

  const now = new Date();
  const startsAt = drop.starts_at ? new Date(drop.starts_at) : null;
  const endsAt = drop.ends_at ? new Date(drop.ends_at) : null;

  const isLiveExplicit = drop.is_live === true;
  const isLiveByDates =
    !!startsAt && startsAt <= now && (!endsAt || endsAt >= now);

  if (isLiveExplicit || isLiveByDates) {
    return {
      label: "Live drop",
      className:
        "border-emerald-500 bg-emerald-500 text-slate-950",
    };
  }

  if (startsAt && startsAt > now) {
    return {
      label: "Kommende drop",
      className:
        "border-sky-500/70 bg-sky-500/10 text-sky-300",
    };
  }

  return {
    label: "Afsluttet drop",
    className:
      "border-slate-600 bg-slate-800 text-slate-100",
  };
}

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
      drops (
        id,
        title,
        sequence,
        is_live,
        starts_at,
        ends_at
      )
    `
    )
    .order("created_at", { ascending: false });

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
          Der er endnu ingen items i systemet.
        </p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => {
            const drop =
              item.drops && item.drops.length > 0
                ? item.drops[0]
                : null;
            const status = getDropStatus(item);

            return (
              <article
                key={item.id}
                className="rounded-2xl border border-slate-800 bg-slate-950/85 p-4 text-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  {/* Venstre: basic info */}
                  <div className="flex-1 min-w-[200px] space-y-1">
                    <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                      {new Date(item.created_at).toLocaleString("da-DK")}
                    </div>
                    <h2 className="text-sm font-semibold text-slate-50">
                      {item.title}
                    </h2>
                    <p className="text-xs text-slate-400">
                      {item.brand || "Ukendt brand"}
                    </p>

                    {drop && (
                      <p className="mt-1 text-xs text-slate-500">
                        Drop:{" "}
                        <span className="text-slate-200">
                          {drop.sequence != null ? `#${drop.sequence} · ` : ""}
                          {drop.title}
                        </span>
                      </p>
                    )}
                  </div>

                  {/* Højre: pris + status-pill + link */}
                  <div className="min-w-[160px] space-y-2 text-right text-xs">
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                        Pris
                      </div>
                      <div className="text-sm text-slate-100">
                        {item.price
                          ? `${item.price.toLocaleString("da-DK")} kr`
                          : "Ikke angivet"}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span
                        className={[
                          "inline-flex rounded-full border px-3 py-1 text-[11px]",
                          status.className,
                        ].join(" ")}
                      >
                        {status.label}
                      </span>

                      {drop && (
                        <a
                          href={`/drop/${drop.id}`}
                          className="text-[11px] text-slate-400 underline-offset-2 hover:text-slate-200 hover:underline"
                        >
                          Se drop-side →
                        </a>
                      )}
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
