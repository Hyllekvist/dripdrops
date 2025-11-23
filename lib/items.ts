// lib/items.ts
import { supabaseServer } from "./supabaseServer";

/**
 * Rå række fra Supabase (matcher din items-tabel)
 */
export type ItemRow = {
  id: string;
  drop_id: string | null;
  title: string;
  brand: string | null;
  designer: string | null;
  price: number;
  market_min: number | null;
  market_max: number | null;
  ai_authenticity: number | null;
  description: string | null;
  created_at: string;
};

/**
 * Drop-data som et item kan være knyttet til
 * (brugt til countdown + badge)
 */
export type UIDropForItem = {
  id: string;
  title: string;
  sequence: number;
  is_live: boolean;
  starts_at: string | null;
  ends_at: string | null;
};

/**
 * UI-venlig type (camelCase) som resten af appen bruger
 */
export type UIItem = {
  id: string;
  dropId: string | null;
  title: string;
  brand: string | null;
  designer: string | null;
  price: number;
  marketMin: number | null;
  marketMax: number | null;
  aiAuthenticity: number;
  description: string | null;
  drop?: UIDropForItem | null; // ⬅ ekstra felt når vi henter enkelt item
};

function mapRowToItem(row: ItemRow): UIItem {
  return {
    id: row.id,
    dropId: row.drop_id,
    title: row.title,
    brand: row.brand,
    designer: row.designer,
    price: row.price,
    marketMin: row.market_min,
    marketMax: row.market_max,
    aiAuthenticity: row.ai_authenticity ?? 0,
    description: row.description,
    // drop sættes kun i getItemById, så her lader vi den være undefined
  };
}

/**
 * Hent alle items for et givent drop-id
 */
export async function listItemsForDrop(dropId: string): Promise<UIItem[]> {
  const supabase = supabaseServer();

  const { data, error } = await supabase
    .from("items")
    .select("*")
    .eq("drop_id", dropId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("listItemsForDrop error", error);
    return [];
  }

  const rows = (data ?? []) as ItemRow[];
  return rows.map(mapRowToItem);
}

/**
 * Hent enkelt item efter id – inkl. tilknyttet drop
 */
export async function getItemById(id: string): Promise<UIItem | null> {
  const supabase = supabaseServer();

  const { data, error } = await supabase
    .from("items")
    .select(
      `
      *,
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
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    if (error) console.error("getItemById error", error);
    return null;
  }

  // data har nu både item-felter og et nested "drops"
  const row = data as ItemRow & { drops: UIDropForItem | null };

  const base = mapRowToItem(row);

  return {
    ...base,
    drop: row.drops ?? null,
  };
}