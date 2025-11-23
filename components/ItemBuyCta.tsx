"use client";

type Props = {
  itemId: string;
  label: string;
  variant?: "primary";
  fullWidth?: boolean;
};

export default function ItemBuyCta({
  itemId,
  label,
  variant = "primary",
  fullWidth,
}: Props) {
  const handleClick = () => {
    // Simpel, defensiv tracking – crasher ikke hvis gtag ikke er sat op
    try {
      // GA4
      // @ts-ignore
      window.gtag?.("event", "item_buy_click", {
        item_id: itemId,
        location: "item_page",
      });

      // Evt. dataLayer
      // @ts-ignore
      window.dataLayer?.push({
        event: "item_buy_click",
        item_id: itemId,
        location: "item_page",
      });
    } catch (e) {
      console.warn("Buy CTA tracking failed", e);
    }
  };

  const base =
    "dd-glow-cta rounded-2xl bg-gradient-to-r from-[var(--dd-neon-pink)] via-[var(--dd-neon-orange)] to-[var(--dd-neon-cyan)] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-slate-950";

  const widthClass = fullWidth ? "w-full text-center" : "";

  return (
    <button className={`${base} ${widthClass}`} onClick={handleClick}>
      {label}
    </button>
  );
}