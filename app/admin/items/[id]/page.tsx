export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { AdminItemDetailActions } from "./AdminItemDetailActions";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const metadata = {
  title: "Item · Admin – DRIPDROPS",
  robots: { index: false, follow: false },
};

type Props = { params: { id: string } };

type AdminDrop = {
  id: string;
  title: string;
  sequence: number | null;
  is_live: boolean | null;
  starts_at: string | null;
  ends_at: string | null;
};

type AdminItemDetail = {
  id: string;
  created_at: string;
  title: string;
  brand: string | null;
  price: number | null;
  drop_id: string | null;
  drops: AdminDrop[]; // supabase relation
};

export default async function AdminItemDetailPage({ params }: Props) {
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
    .eq("id", params.id)
    .single();

  if (error || !data) {
    console.error(error);
    notFound();
  }

  const item = data as AdminItemDetail;
  const drop = item.drops?.[0] ?? null;

  // Hent alle drops til select-boks i actions
  const { data: allDropsRaw } = await supabase
    .from("drops")
    .select("id, title, sequence, starts_at, ends_at, is_live")
    .order("sequence", { ascending: true });

  const allDrops = (allDropsRaw ?? []) as AdminDrop[];

  // UI-label til drop-status
  let dropStatusLabel = "Ikke tilknyttet drop";
  let dropMode: "none" | "live" | "upcoming" | "ended" = "none";

  if (drop) {
    const now = Date.now();
    const starts = drop.starts_at ? new Date(drop.starts_at).getTime() : null;
    const ends = drop.ends_at ? new Date(drop.ends_at).getTime() : null;

    if (drop.is_live) {
      dropMode = "live";
      dropStatusLabel = "Live drop";
    } else if (starts && starts > now) {
      dropMode = "upcoming";
      dropStatusLabel = "Kommende drop";
    } else if (ends && ends < now) {
      dropMode = "ended";
      dropStatusLabel = "Afsluttet drop";
    } else {
      dropMode = "ended";
      dropStatusLabel = "Afsluttet / uklar status";
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 pb-16 pt-8 space-y-8">
      {/* Topbar */}
      <div className="flex items-center justify-between gap-3">
        <Link
          href="/admin/items"
          className="text-xs text-slate-500 hover:text-slate-300"
        >
          ← Tilbage til items
        </Link>

        <div className="text-right space-y-1">
          <h1 className="text-xl font-semibold text-slate-50">
            Item – admin
          </h1>
          <p className="text-[11px] text-slate-500">
            Oprettet{" "}
            {new Date(item.created_at).toLocaleString("da-DK", {
              dateStyle: "short",
              timeStyle: "short",
            })}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-start">
        {/* VENSTRE: Item-info + drop-status */}
        <section className="space-y-4 rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
          <div className="space-y-1">
            <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
              Item
            </div>
            <h2 className="text-lg font-semibold text-slate-50">
              {item.title}
            </h2>
            {item.brand && (
              <p className="text-sm text-slate-400">{item.brand}</p>
            )}

            <p className="text-sm text-slate-200">
              Pris:{" "}
              {item.price
                ? `${item.price.toLocaleString("da-DK")} kr`
                : "Ikke angivet"}
            </p>
          </div>

          {/* Drop-status blok */}
          <div className="mt-3 rounded-2xl border border-slate-800 bg-slate-950 p-3 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Drop-tilknytning
              </div>
              <div
                className={
                  dropMode === "live"
                    ? "inline-flex items-center rounded-full bg-emerald-500/15 px-3 py-1 text-[11px] font-semibold text-emerald-300"
                    : dropMode === "upcoming"
                    ? "inline-flex items-center rounded-full bg-amber-500/15 px-3 py-1 text-[11px] font-semibold text-amber-300"
                    : dropMode === "ended"
                    ? "inline-flex items-center rounded-full bg-slate-800 px-3 py-1 text-[11px] font-semibold text-slate-200"
                    : "inline-flex items-center rounded-full bg-slate-900 px-3 py-1 text-[11px] text-slate-300"
                }
              >
                {dropStatusLabel}
              </div>
            </div>

            {drop ? (
              <div className="text-sm text-slate-200 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <div className="text-xs text-slate-400">
                      Drop #{drop.sequence ?? "?"}
                    </div>
                    <div className="font-medium text-slate-50">
                      {drop.title}
                    </div>
                  </div>
                  <Link
                    href={`/drop/${drop.id}`}
                    className="text-xs text-slate-300 underline hover:text-slate-100"
                  >
                    Åbn drop-side →
                  </Link>
                </div>

                <div className="text-[11px] text-slate-500">
                  {drop.starts_at && (
                    <span>
                      Starter:{" "}
                      {new Date(drop.starts_at).toLocaleString("da-DK", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </span>
                  )}
                  {drop.ends_at && (
                    <>
                      {" "}
                      · Slutter:{" "}
                      {new Date(drop.ends_at).toLocaleString("da-DK", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-[12px] text-slate-400">
                Dette item er endnu ikke tilknyttet et drop. Brug panelet til
                højre for at tilføje det til et eksisterende drop.
              </p>
            )}
          </div>
        </section>

        {/* HØJRE: Admin-handlinger */}
        <section className="space-y-4 rounded-2xl border border-slate-800 bg-slate-950/80 p-4 text-sm">
          <div className="space-y-1">
            <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
              Drop-håndtering
            </div>
            <p className="text-xs text-slate-400">
              Vælg hvilket drop item’et skal ligge i, og opdater relationen. På
              sigt kan vi også styre “featured”, rækkefølge m.m. herfra.
            </p>
          </div>

          <AdminItemDetailActions
            itemId={item.id}
            dropId={item.drop_id}
            drops={allDrops}
          />

          <p className="pt-2 border-t border-slate-800 text-[11px] text-slate-500">
            Denne side er kun til intern admin. Ændringer her påvirker, hvilke
            items der vises på de offentlige drop- og item-sider.
          </p>
        </section>
      </div>
    </div>
  );
}
