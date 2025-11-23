import { supabaseServer } from "./supabaseServer";

export type ItemRow = {
  id: string;
  title: string;
  designer: string | null;
  brand: string | null;
  price: number;
  market_min: number | null;
  market_max: number | null;
  ai_authenticity: number | null;
  description: string | null;
};

export async function getItemById(id: string) {
  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from("items")
    .select("*")
    .eq("id", id)
    .maybeSingle<ItemRow>();

  if (error || !data) {
    console.error("getItemById error", error);
    return null;
  }

  return {
    id: data.id,
    title: data.title,
    designer: data.designer ?? "",
    brand: data.brand ?? "",
    price: data.price,
    marketMin: data.market_min ?? data.price,
    marketMax: data.market_max ?? data.price,
    aiAuthenticity: data.ai_authenticity ?? 80,
    conditionLabel: "Patina, flot",
    description: data.description ?? "",
  };
}
