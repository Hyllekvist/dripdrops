// app/drop/[id]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import { getDropById } from "@/lib/drops";
import { listItemsForDrop } from "@/lib/items";

type Props = { params: { id: string } };

export async function generateMetadata({ params }: Props) {
  const drop = await getDropById(params.id);
  if (!drop) return {};

  const title = `${drop.title} – Drop #${drop.sequence} | DRIPDROPS`;
  const description =
    drop.description ??
    "Kurateret drop med design, møbler og fashion i begrænset tid.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function DropPage({ params }: Props) {
  const drop = await getDropById(params.id);
  if (!drop) notFound();

  const items = await listItemsForDrop(drop.id);

  // --- STATE: live / upcoming / ended (fallback) ---------------------------
  type DropMode = "live" | "upcoming" | "ended";

  let mode: DropMode = "ended";

  if (drop.isLive) {
    mode = "live";
  } else if (drop.starts_at) {
    const starts = new Date(drop.starts_at);
    const now = new Date();
    mode = starts.getTime() > now.getTime() ? "upcoming" : "ended";
  }

  const isLive = mode === "live";
  const isUpcoming = mode === "upcoming";

  const statusLabel = isLive
    ? "Live lige nu"
    : isUpcoming
    ? "Kommende drop"
    : "Tidligere drop";

  const statusBadgeClass = isLive
    ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/60"
    : isUpcoming
    ? "bg-slate-900 text-slate-300 border-slate-600"
    : "bg-slate-900 text-slate-300 border-slate-700";

  return (
    <div className="mx-auto max-w-5xl px-4 pb-16 pt-6 space-y-8">
      {/* HEADER / HERO */}
      <header className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]">
          <span
            className={
              "inline-flex h-1.5 w-1.5 rounded-full " +
              (isLive
                ? "bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)] animate-pulse"
                : "bg-slate-500")
            }
          />
          <span className={statusBadgeClass}>{statusLabel}</span>
          <span className="text-[11px] text-slate-400">
            Drop #{drop.sequence}
          </span>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-[radial-gradient(circle_at_top,#020617,#020617_55%)] p-5 shadow-[0_18px_55px_rgba(15,23,42,0.95)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold text-slate-50 sm:text-3xl">
                {drop.title}
              </h1>
              <p className="max-w-2xl text-sm text-slate-400">
                {drop.description ??
                  "Kurateret session med nøje udvalgte pieces. Ét drop ad gangen – ingen uendelig scroll."}
              </p>
            </div>

            <div className="w-full max-w-xs rounded-2xl border border-slate-700 bg-slate-950/80 p-3 text-xs text-slate-300">
              <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                Drop-status
              </div>

              <div className="mt-1 space-y-1">
                {drop.startsAtLabel && (
                  <p>
                    {isLive
                      ? `Startede: ${drop.startsAtLabel}`
                      : isUpcoming
                      ? `Starter: ${drop.startsAtLabel}`
                      : `Start: ${drop.startsAtLabel}`}
                  </p>
                )}
                <p>{items.length} item{items.length === 1 ? "" : "s"} i dette drop</p>
              </div>

              <div className="mt-3 h-px w-full bg-gradient-to-r from-slate-800 via-slate-600 to-slate-800" />

              {isLive && (
                <p className="mt-3 text-[11px] leading-relaxed text-emerald-300">
                  Drop er live nu. Vælg et piece, og reserver det i en kort
                  session – først derefter går du til betaling.
                </p>
              )}
              {isUpcoming && (
                <p className="mt-3 text-[11px] leading-relaxed text-slate-300">
                  Dropper snart. Du kan allerede nu studere items og vælge dine
                  favoritter, så du er klar, når timeren starter.
                </p>
              )}
              {!isLive && !isUpcoming && (
                <p className="mt-3 text-[11px] leading-relaxed text-slate-400">
                  Dette drop er afsluttet. Brug det som inspiration til kommende
                  drops – enkelte styles kan dukke op igen.
                </p>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ITEMS GRID */}
      {items.length > 0 ? (
        <section className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-slate-100">
              Items i dette drop
            </h2>
            <span className="text-xs text-slate-400">
              {items.length} item{items.length === 1 ? "" : "s"}
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {items.map((item) => {
              const marketLabel =
                item.marketMin && item.marketMax
                  ? `${item.marketMin.toLocaleString(
                      "da-DK",
                    )}–${item.marketMax.toLocaleString("da-DK")} kr`
                  : null;

              return (
                <Link
                  key={item.id}
                  href={`/item/${item.id}`}
                  className="group flex flex-col gap-3 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/85 p-4 transition hover:-translate-y-0.5 hover:border-slate-500 hover:bg-slate-900/90"
                >
                  {/* BILLEDE / VISUAL */}
                  <div className="relative h-32 rounded-xl bg-[radial-gradient(circle_at_top,#1f2937,#020617_70%)]">
                    <div className="absolute inset-0 opacity-40 group-hover:opacity-60 bg-[radial-gradient(circle_at_20%_0%,rgba(255,92,222,0.25),transparent_60%),radial-gradient(circle_at_80%_100%,rgba(0,240,255,0.25),transparent_55%)] transition-opacity" />
                    <div className="relative z-10 flex h-full w-full items-center justify-center">
                      <span className="rounded-full bg-black/55 px-3 py-1 text-[11px] text-slate-100 backdrop-blur-sm">
                        {isLive
                          ? "Live i droppet"
                          : isUpcoming
                          ? "Preview – droppet åbner snart"
                          : "Tidligere drop-piece"}
                      </span>
                    </div>
                  </div>

                  {/* TEKST + META */}
                  <div className="space-y-1">
                    <div className="line-clamp-1 text-sm font-semibold text-slate-50">
                      {item.title}
                    </div>
                    <p className="line-clamp-1 text-xs text-slate-400">
                      {[item.designer, item.brand].filter(Boolean).join(" · ")}
                    </p>
                  </div>

                  <div className="mt-1 flex items-center justify-between text-xs text-slate-400">
                    <div>
                      <div className="text-slate-100">
                        {item.price.toLocaleString("da-DK")} kr
                      </div>
                      {marketLabel && (
                        <div className="text-[11px] text-emerald-300">
                          Markedsværdi: {marketLabel}
                        </div>
                      )}
                    </div>
                    <span className="text-slate-300 group-hover:text-slate-100">
                      Se varen →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      ) : (
        <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6 text-sm text-slate-400">
          <p>
            Der er endnu ikke tilføjet items til dette drop. Når sælgerne har
            lagt deres pieces ind, dukker de op her.
          </p>
        </div>
      )}
    </div>
  );
}
