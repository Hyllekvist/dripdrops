// app/admin/sell/[id]/page.tsx
export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { AdminSellDetailActions } from "./AdminSellDetailActions";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type SubmissionDetail = {
  id: string;
  created_at: string;
  title: string;
  brand: string | null;
  price_idea: number | null;
  email: string;
  condition: string | null;
  status: string;
  image_count: number;
  image_urls: unknown;
  item_id: string | null; // ← NY
};

export const metadata = {
  title: "Sell submission · Admin – DRIPDROPS",
  robots: {
    index: false,
    follow: false,
  },
};

type Props = { params: { id: string } };

export default async function AdminSellDetailPage({ params }: Props) {
  const { data, error } = await supabase
    .from("sell_submissions")
    .select(
      "id, created_at, title, brand, price_idea, email, condition, status, image_count, image_urls, item_id"
    ) // ← item_id added
    .eq("id", params.id)
    .single();

  if (error || !data) {
    console.error(error);
    notFound();
  }

  const s = data as SubmissionDetail;
  const imageUrls: string[] = Array.isArray(s.image_urls)
    ? (s.image_urls as string[])
    : [];

  return (
    <div className="mx-auto max-w-5xl px-4 pb-16 pt-8 space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div className="space-y-1">
          <Link
            href="/admin/sell"
            className="text-xs text-slate-500 hover:text-slate-300"
          >
            ← Tilbage til submissions
          </Link>

          <h1 className="text-xl font-semibold text-slate-50">
            Sell submission
          </h1>

          <p className="text-xs text-slate-500">
            Oprettet{" "}
            {new Date(s.created_at).toLocaleString("da-DK", {
              dateStyle: "short",
              timeStyle: "short",
            })}
          </p>
        </div>

        <div className="text-right text-xs space-y-2">
          <div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
              Status
            </div>
            <AdminSellDetailActions id={s.id} status={s.status} showStatusPill />
         
          </div>

          {s.item_id && (
            <div className="text-[11px] text-emerald-300">
              Item oprettet →{" "}
              <Link
                href={`/item/${s.item_id}`}
                className="underline hover:text-emerald-200"
              >
                Se item
              </Link>
            </div>
          )}

          <div className="text-[11px] text-slate-400">{s.email}</div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.9fr)] lg:items-start">
        {/* Billeder + basic info */}
        <section className="space-y-4 rounded-2xl border border-slate-800 bg-slate-950/85 p-4">
          <div className="space-y-1">
            <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
              Item
            </div>
            <h2 className="text-lg font-semibold text-slate-50">
              {s.title}
            </h2>
            <p className="text-sm text-slate-400">
              {s.brand || "Ukendt brand"}
            </p>
            <p className="text-xs text-slate-500">
              Stand: {s.condition || "Ikke angivet"}
            </p>
          </div>

          {imageUrls.length > 0 ? (
            <div className="space-y-3">
              <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950">
                <img
                  src={imageUrls[0]}
                  alt={s.title}
                  className="h-64 w-full object-cover"
                />
              </div>

              {imageUrls.length > 1 && (
                <div className="flex flex-wrap gap-2">
                  {imageUrls.slice(1).map((url) => (
                    <img
                      key={url}
                      src={url}
                      alt={s.title}
                      className="h-20 w-20 rounded-xl border border-slate-800 object-cover"
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-slate-500">
              Ingen billeder uploadet til denne submission.
            </p>
          )}
        </section>

        {/* Admin-panel: pris, kontakt, actions */}
        <section className="space-y-4 rounded-2xl border border-slate-800 bg-slate-950/85 p-4 text-sm">
          <div className="space-y-2">
            <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
              Prisidé & kontakt
            </div>

            <div className="space-y-1">
              <div className="text-xs text-slate-500">Prisidé</div>
              <div className="text-base text-slate-50">
                {s.price_idea
                  ? `${s.price_idea.toLocaleString("da-DK")} kr`
                  : "Ikke angivet"}
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-xs text-slate-500">Email</div>
              <div className="text-xs text-slate-200">{s.email}</div>
            </div>
          </div>

          <AdminSellDetailActions id={s.id} status={s.status} />

          <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-500">
            Når du godkender, opretter vi et rigtigt item i{" "}
            <code>items</code>-tabellen og linker det til denne submission.
          </div>
        </section>
      </div>
    </div>
  );
}
