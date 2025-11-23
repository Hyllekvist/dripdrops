import { notFound } from "next/navigation";
import { getDropById } from "@/lib/drops";

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

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 space-y-4">
      <header>
        <div className="text-xs uppercase tracking-[0.18em] text-slate-400">
          Drop #{drop.sequence}
        </div>
        <h1 className="text-2xl font-semibold">{drop.title}</h1>
        <p className="mt-1 text-sm text-slate-400">
          {drop.isLive ? "Live nu" : drop.startsAtLabel}
        </p>
      </header>

      <p className="text-sm text-slate-400">
        Her kommer drop-feed med swipe-kort for alle items i droppet.
      </p>
    </div>
  );
}
