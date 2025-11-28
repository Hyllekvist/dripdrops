// app/api/items/[id]/reserve/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  const now = new Date();
  const nowIso = now.toISOString();
  const reserveUntil = new Date(now.getTime() + 2 * 60 * 1000); // 2 min
  const reserveUntilIso = reserveUntil.toISOString();

  // Atomisk-ish: kun opdater hvis IKKE solgt og IKKE aktivt reserveret
  const { data, error } = await supabase
    .from("items")
    .update({ reserved_until: reserveUntilIso })
    .eq("id", id)
    .eq("is_sold", false)
    .or(`reserved_until.is.null,reserved_until.lte.${nowIso}`)
    .select("id, reserved_until")
    .single();

  if (error) {
    console.error("reserve error", error);
    return NextResponse.json(
      { ok: false, reason: "server_error" },
      { status: 500 }
    );
  }

  // Hvis ingen række blev ramt → nogen anden har den
  if (!data) {
    return NextResponse.json(
      { ok: false, reason: "already_reserved_or_sold" },
      { status: 409 }
    );
  }

  return NextResponse.json({
    ok: true,
    itemId: data.id,
    reserved_until: data.reserved_until,
  });
}