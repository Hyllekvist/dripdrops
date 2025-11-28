// lib/drops.ts
import { supabaseServer } from "./supabaseServer";

export type Drop = {
  id: string;
  sequence: number;
  title: string;
  description: string | null;
  is_live: boolean;
  starts_at: string | null;
  ends_at: string | null;
};

function formatDate(d: string | null) {
  if (!d) return "";
  return new Date(d).toLocaleString("da-DK", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
  });
}

/**
 * ADMIN / INTERN:
 * Hent alle drops (live + upcoming + expired)
 */
export async function listActiveDrops() {
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

  const now = Date.now();

  return (data ?? []).map((d) => {
    const ends = d.ends_at ? new Date(d.ends_at).getTime() : null;
    const timeLeft = ends ? ends - now : null;

    return {
      ...d,
      isLive: d.is_live,
      startsAtLabel: formatDate(d.starts_at),
      endsAtLabel: formatDate(d.ends_at),
      timeLeft,
    };
  });
}

/**
 * ADMIN / INTERN:
 * Hent et hvilket som helst drop (live eller ej)
 */
export async function getDropById(id: string) {
  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from("drops")
    .select("*")
    .eq("id", id)
    .maybeSingle<Drop>();

  if (error || !data) {
    console.error("getDropById error", error);
    return null;
  }

  const now = Date.now();
  const ends = data.ends_at ? new Date(data.ends_at).getTime() : null;
  const timeLeft = ends ? ends - now : null;

  return {
    ...data,
    isLive: data.is_live,
    startsAtLabel: formatDate(data.starts_at),
    endsAtLabel: formatDate(data.ends_at),
    timeLeft,
  };
}

/* ============================================================
   🔥 PUBLIC-ONLY FUNCTIONS (filterer på live drops)
   ============================================================ */

/**
 * PUBLIC:
 * Kun drops der er live lige nu
 */
export async function listPublicLiveDrops() {
  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from("drops")
    .select("*")
    .eq("is_live", true)
    .order("sequence", { ascending: false });

  if (error) {
    console.error("listPublicLiveDrops error", error);
    return [];
  }

  const now = Date.now();

  return (data ?? []).map((d) => {
    const ends = d.ends_at ? new Date(d.ends_at).getTime() : null;
    const timeLeft = ends ? ends - now : null;

    return {
      ...d,
      isLive: true,
      startsAtLabel: formatDate(d.starts_at),
      endsAtLabel: formatDate(d.ends_at),
      timeLeft,
    };
  });
}

/**
 * PUBLIC:
 * Hent et drop kun hvis det er live
 */
export async function getPublicDropById(id: string) {
  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from("drops")
    .select("*")
    .eq("id", id)
    .eq("is_live", true)
    .maybeSingle<Drop>();

  if (error || !data) {
    return null;
  }

  const now = Date.now();
  const ends = data.ends_at ? new Date(data.ends_at).getTime() : null;
  const timeLeft = ends ? ends - now : null;

  return {
    ...data,
    isLive: true,
    startsAtLabel: formatDate(data.starts_at),
    endsAtLabel: formatDate(data.ends_at),
    timeLeft,
  };
}
