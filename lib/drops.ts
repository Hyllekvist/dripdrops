import { supabaseServer } from "./supabaseServer";

export type Drop = {
  id: string;
  sequence: number;
  title: string;
  description: string | null;
  is_live: boolean;
  starts_at: string | null;
};

export async function listActiveDrops(): Promise<(Drop & { startsAtLabel: string; isLive: boolean })[]> {
  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from("drops")
    .select("*")
    .order("sequence", { ascending: false })
    .limit(10);

  if (error) {
    console.error("listActiveDrops error", error);
    return [];
  }

  const drops = data ?? [];
  return drops.map((d) => ({
    ...d,
    isLive: d.is_live,
    startsAtLabel: d.starts_at
      ? new Date(d.starts_at).toLocaleString("da-DK", {
          hour: "2-digit",
          minute: "2-digit",
          day: "2-digit",
          month: "2-digit",
        })
      : "",
  }));
}

export async function getDropById(id: string): Promise<(Drop & { startsAtLabel: string; isLive: boolean }) | null> {
  const supabase = supabaseServer();
  const { data, error } = await supabase.from("drops").select("*").eq("id", id).maybeSingle<Drop>();
  if (error || !data) {
    console.error("getDropById error", error);
    return null;
  }
  return {
    ...data,
    isLive: data.is_live,
    startsAtLabel: data.starts_at
      ? new Date(data.starts_at).toLocaleString("da-DK", {
          hour: "2-digit",
          minute: "2-digit",
          day: "2-digit",
          month: "2-digit",
        })
      : "",
  };
}
