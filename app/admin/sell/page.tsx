import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

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
  status: "pending" | "approved" | "rejected" | string;
  image_count: number;
  image_urls: unknown;
  item_id: string | null; // ← NY
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
      `
      id,
      created_at,
      title,
      brand,
      price_idea,
      email,
      condition,
      status,
      image_count,
      image_urls,
      item_id
    `
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
          Indsendte varer til vurdering. Bruges til manuel screening og
          oprettelse i drops via items.
        </p>
      </header>

      {submissions.length === 0 ? (
        <p className="text-sm text-slate-500">
          Der er endnu ingen submissions i systemet.
        </p>
      ) : (
        <div className="space-y-3">
          {submissions.map((s) => {
            const imageUrls: string[] = Array.isArray(s.image_urls)
              ? (s.image_urls as string[])
              : [];

            // Status-pill styling
            let statusLabel = s.status;
            let statusClasses =
              "inline-flex rounded-full bg-slate-900 px-3 py-1 text-[11px] text-slate-200";

            if (s.status === "pending") {
              statusLabel = "Pending";
              statusClasses =
                "inline-flex rounded-full bg-slate-900 px-3 py-1 text-[11px] text-slate-200";
            } else if (s.status === "approved") {
              statusLabel = "Approved";
              statusClasses =
                "inline-flex rounded-full bg-emerald-500/15 border border-emerald-400/70 px-3 py-1 text-[11px] font-medium text-emerald-300";
            } else if (s.status === "rejected") {
              statusLabel = "Rejected";
              statusClasses =
                "inline-flex rounded-full bg-rose-500/15 border border-rose-400/70 px-3 py-1 text-[11px] font-medium text-rose-200";
            }

            return (
              <article
                key={s.id}
                className="rounded-2xl border border-slate-800 bg-slate-950/85 p-4 text-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  {/* VENSTRE: Info + billeder */}
                  <div className="flex-1 min-w-[220px] space-y-1">
                    <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                      {new Date(s.created_at).toLocaleString("da-DK")}
                    </div>
                    <h2 className="text-sm font-semibold text-slate-50">
                      {s.title}
                    </h2>
                    <p className="text-xs text-slate-400">
                      {s.brand || "Ukendt brand"}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Stand: {s.condition || "Ikke angivet"} · Billeder:{" "}
                      {s.image_count}
                    </p>

                    {imageUrls.length > 0 && (
                      <div className="mt-2 flex gap-2">
                        {imageUrls.slice(0, 3).map((url) => (
                          <img
                            key={url}
                            src={url}
                            alt={s.title}
                            className="h-14 w-14 rounded-lg border border-slate-800 object-cover"
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* HØJRE: pris, status, item-link, kontakt */}
                  <div className="text-right text-xs space-y-3 min-w-[180px]">
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                        Prisidé
                      </div>
                      <div className="text-sm text-slate-100">
                        {s.price_idea
                          ? `${s.price_idea.toLocaleString("da-DK")} kr`
                          : "Ikke angivet"}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                        Status
                      </div>
                      <div className={statusClasses}>{statusLabel}</div>

                      {/* Hvis der er oprettet et item, vis link */}
                      {s.item_id && (
                        <div className="text-[11px] text-emerald-300">
                          Item oprettet →{" "}
                          <a
                            href={`/admin/items/${s.item_id}`}
                            className="underline hover:text-emerald-200"
                          >
                            Åbn item-admin
                          </a>
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-slate-500">
                        Kontakt
                      </div>
                      <div className="text-[11px] text-slate-300">
                        {s.email}
                      </div>
                    </div>

                    <div>
                      <a
                        href={`/admin/sell/${s.id}`}
                        className="inline-flex items-center justify-center rounded-full border border-slate-600 bg-slate-900 px-3 py-1.5 text-[11px] font-medium text-slate-100 hover:border-slate-400"
                      >
                        Åbn detaljer →
                      </a>
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
