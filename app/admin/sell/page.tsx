// app/admin/sell/page.tsx
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type Submission = {
  id: string;
  created_at: string;
  title: string;
  brand: string | null;
  price_idea: number | null;
  email: string;
  condition: string | null;
  status: string;
  image_count: number;
};

export const metadata = {
  title: "Sell submissions · Admin – DRIPDROPS",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminSellPage() {
  const { data, error } = await supabase
    .from("sell_submissions")
    .select(
      "id, created_at, title, brand, price_idea, email, condition, status, image_count"
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return (
      <div className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-xl font-semibold text-slate-50">
          Sell submissions – admin
        </h1>
        <p className="mt-4 text-sm text-rose-400">
          Kunne ikke hente submissions. Tjek server log.
        </p>
      </div>
    );
  }

  const submissions = (data ?? []) as Submission[];

  return (
    <div className="mx-auto max-w-5xl px-4 pb-16 pt-8 space-y-6">
      <header className="space-y-2">
        <h1 className="text-xl font-semibold text-slate-50">
          Sell submissions – admin
        </h1>
        <p className="text-sm text-slate-400">
          Rå liste over indsendte varer. Bruges til manuel vurdering og evt.
          oprettelse i drops.
        </p>
      </header>

      {submissions.length === 0 ? (
        <p className="text-sm text-slate-500">
          Der er endnu ingen submissions i systemet.
        </p>
      ) : (
        <div className="space-y-3">
          {submissions.map((s) => (
            <article
              key={s.id}
              className="rounded-2xl border border-slate-800 bg-slate-950/85 p-4 text-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                    {new Date(s.created_at).toLocaleString("da-DK")}
                  </div>
                  <h2 className="text-sm font-semibold text-slate-50">
                    {s.title}
                  </h2>
                  <p className="text-xs text-slate-400">
                    {s.brand || "Ukendt brand"}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Stand:{" "}
                    {s.condition
                      ? s.condition
                      : "Ikke angivet"}
                    {" · "}
                    Billeder: {s.image_count}
                  </p>
                </div>

                <div className="text-right text-xs space-y-1 min-w-[140px]">
                  <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                    Prisidé
                  </div>
                  <div className="text-sm text-slate-100">
                    {s.price_idea
                      ? `${s.price_idea.toLocaleString("da-DK")} kr`
                      : "Ikke angivet"}
                  </div>

                  <div className="mt-2 text-[10px] uppercase tracking-[0.18em] text-slate-500">
                    Status
                  </div>
                  <div className="inline-flex rounded-full bg-slate-900 px-3 py-1 text-[11px] text-slate-200">
                    {s.status}
                  </div>

                  <div className="mt-2 text-[10px] uppercase tracking-[0.18em] text-slate-500">
                    Kontakt
                  </div>
                  <div className="text-[11px] text-slate-300">{s.email}</div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
