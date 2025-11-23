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

  const isLive = drop.isLive;
  const label = isLive ? "Live lige nu" : "Kommende drop";

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 space-y-8">
      <header className="space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-fuchsia-500/60 bg-fuchsia-500/10 px-3 py-1">
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-fuchsia-100">
            {label}
          </span>
          <span className="text-[11px] text-slate-400">
            Drop #{drop.sequence}
          </span>
        </div>

        <div>
          <h1 className="text-2xl font-semibold text-slate-50 sm:text-3xl">
            {drop.title}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-400">
            {drop.description ??
              "Kurateret session med nøje udvalgte pieces. Ét drop ad gangen – ingen uendelig scroll."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
          {drop.startsAtLabel && (
            <span>
              {isLive ? "Startede" : "Starter"}: {drop.startsAtLabel}
            </span>
          )}
          <span className="h-1 w-1 rounded-full bg-slate-600" />
          <span>{items.length} items i dette drop</span>
        </div>
      </header>

      {/* Items i droppet */}
      {items.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-slate-100">
            Items i dette drop
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {items.map((item) => (
              <Link
                key={item.id}
                href={`/item/${item.id}`}
                className="group flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-4 transition hover:-translate-y-0.5 hover:border-slate-500"
              >
                {/* Placeholder billede */}
                <div className="h-32 rounded-xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950" />

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
                    {item.market_min && item.market_max && (
                      <div className="text-[11px] text-emerald-300">
                        Markedsværdi:{" "}
                        {item.market_min.toLocaleString("da-DK")}–
                        {item.market_max.toLocaleString("da-DK")} kr
                      </div>
                    )}
                  </div>
                  <span className="text-slate-300 group-hover:text-slate-100">
                    Se varen →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : (
        <p className="text-sm text-slate-500">
          Der er endnu ikke tilføjet items til dette drop.
        </p>
      )}
    </div>
  );
}