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

export default async function AdminItemDetailPage({ params }: Props) {
  const { data: item, error } = await supabase
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

  if (error || !item) {
    console.error(error);
    notFound();
  }

  // Fetch drops-list for select-box
  const { data: allDrops } = await supabase
    .from("drops")
    .select("id, title, sequence, starts_at, ends_at, is_live")
    .order("sequence", { ascending: true });

  return (
    <div className="mx-auto max-w-5xl px-4 pb-16 pt-8 space-y-8">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/items"
          className="text-xs text-slate-500 hover:text-slate-300"
        >
          ← Tilbage til items
        </Link>

        <h1 className="text-xl font-semibold text-slate-50">Item – admin</h1>
      </div>

      <section className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 space-y-2">
        <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
          Info
        </div>

        <div className="text-lg text-slate-50 font-semibold">{item.title}</div>
        <div className="text-sm text-slate-400">{item.brand}</div>

        <div className="text-sm text-slate-200">
          Pris:{" "}
          {item.price
            ? `${item.price.toLocaleString("da-DK")} kr`
            : "Ikke angivet"}
        </div>

        <div className="text-xs text-slate-500">
          Oprettet:{" "}
          {new Date(item.created_at).toLocaleString("da-DK", {
            dateStyle: "short",
            timeStyle: "short",
          })}
        </div>
      </section>

      <AdminItemDetailActions
        itemId={item.id}
        dropId={item.drop_id}
        drops={allDrops ?? []}
      />
    </div>
  );
}
