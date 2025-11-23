import { notFound } from "next/navigation";
import { getDropById } from "@/lib/drops";
import { listItemsForDrop } from "@/lib/items";

type Props = { params: { id: string } };

export async function generateMetadata({ params }: Props) {
  const drop = await getDropById(params.id);
  if (!drop) return {};
  return {
    title: `Drop #${drop.sequence} – ${drop.title}`,
    description: drop.description ?? "Kurateret DRIPDROPS drop.",
  };
}

export default async function DropPage({ params }: Props) {
  const drop = await getDropById(params.id);
  if (!drop) notFound();

  const items = await listItemsForDrop(params.id);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 space-y-6">
      <header className="space-y-1">
        <div className="text-xs uppercase tracking-[0.18em] text-slate-400">
          Drop #{drop.sequence}
        </div>
        <h1 className="text-2xl font-semibold">{drop.title}</h1>
        <p className="text-sm text-slate-400">
          {drop.isLive ? "Live nu" : drop.startsAtLabel}
        </p>
      </header>

      {items.length === 0 ? (
        <p className="text-sm text-slate-500">
          Ingen items i dette drop endnu.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((item) => (
            <a
              key={item.id}
              href={`/item/${item.id}`}
              className="dd-gradient-border rounded-2xl bg-slate-950/80 p-4 hover:translate-y-0.5 hover:bg-slate-900/80 transition"
            >
              <div className="mb-2 h-40 rounded-xl bg-[radial-gradient(circle_at_center,#eab30833,#020617_70%)]" />
              <div className="space-y-1">
                <div className="text-sm font-semibold text-slate-50">
                  {item.title}
                </div>
                <div className="text-xs text-slate-400">
                  {[item.designer, item.brand].filter(Boolean).join(" · ")}
                </div>
                <div className="mt-1 flex items-center justify-between text-xs">
                  <span className="text-slate-100 font-medium">
                    {item.price.toLocaleString("da-DK")} kr
                  </span>
                  {item.ai_authenticity != null && (
                    <span className="text-emerald-300">
                      {item.ai_authenticity}% AI verified
                    </span>
                  )}
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
