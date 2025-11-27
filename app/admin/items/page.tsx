// app/admin/items/page.tsx
export const dynamic = "force-dynamic";

import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type DropRef = {
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
  drops: DropRef[];
};

export const metadata = {
  title: "Items · Admin – DRIPDROPS",
  robots: {
    index: false,
    follow: false,
  },
};

function classifyItem(item: AdminItem) {
  const drop = item.drops[0];

  if (!drop) {
    return {
      bucket: "no_drop" as const,
      label: "Uden drop",
      chipClass: "bg-slate-900 text-slate-200",
      drop: null,
    };
  }

  const now = new Date();
  const starts = drop.starts_at ? new Date(drop.starts_at) : null;
  const ends = drop.ends_at ? new Date(drop.ends_at) : null;

  if (drop.is_live) {
    return {
      bucket: "active" as const,
      label: `Live i drop #${drop.sequence ?? "?"}`,
      chipClass: "bg-emerald-500/10 text-emerald-300 border border-emerald-400/60",
      drop,
    };
  }

  if (starts && starts > now) {
    return {
      bucket: "active" as const,
      label: `Kommende drop #${drop.sequence ?? "?"}`,
      chipClass: "bg-sky-500/10 text-sky-300 border border-sky-400/60",
      drop,
    };
  }

  if (ends && ends < now) {
    return {
      bucket: "past" as const,
      label: `Afsluttet drop #${drop.sequence ?? "?"}`,
      chipClass: "bg-slate-900 text-slate-300 border border-slate-700",
      drop,
    };
  }

  // Fallback
  return {
    bucket: "active" as const,
    label: `I drop #${drop.sequence ?? "?"}`,
    chipClass: "bg-slate-900 text-slate-200 border border-slate-700",
    drop,
  };
}

function formatDate(d: string) {
  return new Date(d).toLocaleString("da-DK", {
    dateStyle: "short",
    timeStyle: "short",
  });
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

  const raw = (data ?? []) as any[];

  const items: AdminItem[] = raw.map((row) => ({
    id: row.id,
    created_at: row.created_at,
    title: row.title,
    brand: row.brand,
    price: row.price,
    drop_id: row.drop_id ?? null,
    drops: Array.isArray(row.drops)
      ? (row.drops as DropRef[])
      : row.drops
      ? [row.drops as DropRef]
      : [],
  }));

  const noDrop: AdminItem[] = [];
  const activeDrops: AdminItem[] = [];
  const pastDrops: AdminItem[] = [];

  for (const item of items) {
    const { bucket } = classifyItem(item);
    if (bucket === "no_drop") noDrop.push(item);
    else if (bucket === "active") activeDrops.push(item);
    else pastDrops.push(item);
  }

  const total = items.length;

  return (
    <div className="mx-auto max-w-5xl px-4 pb-16 pt-8 space-y-8">
      <header className="space-y-2">
        <h1 className="text-xl font-semibold text-slate-50">
          Items – admin
        </h1>
        <p className="text-sm text-slate-400">
          Rigtige items i systemet. Bruges til at matche drops, tjekke priser
          og holde styr på, hvad der er live, planlagt og afsluttet.
        </p>
        <p className="text-xs text-slate-500">
          Totalt:{" "}
          <span className="font-medium text-slate-200">{total}</span> items ·{" "}
          <span className="text-emerald-300">{noDrop.length}</span> uden drop ·{" "}
          <span className="text-sky-300">{activeDrops.length}</span> i aktive
          drops · <span className="text-slate-300">{pastDrops.length}</span> i
          afsluttede drops.
        </p>
      </header>

      {/* Items uden drop – vigtigst først */}
      <section className="space-y-3">
        <div className="flex items-baseline justify-between gap-2">
          <div>
            <h2 className="text-sm font-semibold text-slate-100">
              🔶 Items uden drop
            </h2>
            <p className="text-xs text-slate-500">
              Items der er oprettet, men ikke koblet til et drop endnu.
            </p>
          </div>
          <span className="text-xs text-slate-400">
            {noDrop.length} item{noDrop.length === 1 ? "" : "s"}
          </span>
        </div>

        {noDrop.length === 0 ? (
          <p className="text-xs text-slate-500">
            Ingen items venter på at blive koblet til et drop.
          </p>
        ) : (
          <div className="space-y-3">
            {noDrop.map((item) => {
              const meta = classifyItem(item);
              return (
                <article
                  key={item.id}
                  className="rounded-2xl border border-slate-800 bg-slate-950/85 p-4 text-sm"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-1 min-w-[220px]">
                      <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                        {formatDate(item.created_at)}
                      </div>
                      <h3 className="text-sm font-semibold text-slate-50">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-400">
                        {item.brand || "Ukendt brand"}
                      </p>
                    </div>

                    <div className="text-right text-xs space-y-2 min-w-[130px]">
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

                      <div className="inline-flex rounded-full px-3 py-1 text-[11px] border border-slate-700 bg-slate-900 text-slate-200">
                        {meta.label}
                      </div>

                      <Link
                        href={`/admin/sell`}
                        className="text-[11px] text-slate-400 underline underline-offset-2 hover:text-slate-200"
                      >
                        Match med submission
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Items i aktive drops */}
      <section className="space-y-3">
        <div className="flex items-baseline justify-between gap-2">
          <div>
            <h2 className="text-sm font-semibold text-slate-100">
              🔷 Items i aktive drops
            </h2>
            <p className="text-xs text-slate-500">
              Items koblet til kommende eller live drops.
            </p>
          </div>
          <span className="text-xs text-slate-400">
            {activeDrops.length} item{activeDrops.length === 1 ? "" : "s"}
          </span>
        </div>

        {activeDrops.length === 0 ? (
          <p className="text-xs text-slate-500">
            Ingen items i kommende eller live drops endnu.
          </p>
        ) : (
          <div className="space-y-3">
            {activeDrops.map((item) => {
              const meta = classifyItem(item);
              const drop = meta.drop;
              return (
                <article
                  key={item.id}
                  className="rounded-2xl border border-slate-800 bg-slate-950/85 p-4 text-sm"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-1 min-w-[220px]">
                      <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                        {formatDate(item.created_at)}
                      </div>
                      <h3 className="text-sm font-semibold text-slate-50">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-400">
                        {item.brand || "Ukendt brand"}
                      </p>
                      {drop && (
                        <p className="text-[11px] text-slate-500">
                          Drop: {drop.title} (#{drop.sequence ?? "?"})
                        </p>
                      )}
                    </div>

                    <div className="text-right text-xs space-y-2 min-w-[150px]">
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

                      <div
                        className={
                          "inline-flex rounded-full px-3 py-1 text-[11px] " +
                          meta.chipClass
                        }
                      >
                        {meta.label}
                      </div>

                      {drop && (
                        <Link
                          href={`/drop/${drop.id}`}
                          className="text-[11px] text-slate-400 underline underline-offset-2 hover:text-slate-200"
                        >
                          Se drop-side
                        </Link>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Items i afsluttede drops */}
      <section className="space-y-3">
        <div className="flex items-baseline justify-between gap-2">
          <div>
            <h2 className="text-sm font-semibold text-slate-100">
              ⚫ Items i afsluttede drops
            </h2>
            <p className="text-xs text-slate-500">
              Historik – brugbar til læring, prisniveauer og analyse.
            </p>
          </div>
          <span className="text-xs text-slate-400">
            {pastDrops.length} item{pastDrops.length === 1 ? "" : "s"}
          </span>
        </div>

        {pastDrops.length === 0 ? (
          <p className="text-xs text-slate-500">
            Ingen afsluttede drop-items endnu.
          </p>
        ) : (
          <div className="space-y-3">
            {pastDrops.map((item) => {
              const meta = classifyItem(item);
              const drop = meta.drop;
              return (
                <article
                  key={item.id}
                  className="rounded-2xl border border-slate-800 bg-slate-950/85 p-4 text-sm"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-1 min-w-[220px]">
                      <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                        {formatDate(item.created_at)}
                      </div>
                      <h3 className="text-sm font-semibold text-slate-50">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-400">
                        {item.brand || "Ukendt brand"}
                      </p>
                      {drop && (
                        <p className="text-[11px] text-slate-500">
                          Drop: {drop.title} (#{drop.sequence ?? "?"})
                        </p>
                      )}
                    </div>

                    <div className="text-right text-xs space-y-2 min-w-[150px]">
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

                      <div
                        className={
                          "inline-flex rounded-full px-3 py-1 text-[11px] " +
                          meta.chipClass
                        }
                      >
                        {meta.label}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
