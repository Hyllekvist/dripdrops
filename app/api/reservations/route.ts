import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null) as { itemId?: string } | null;

    const itemId = body?.itemId;
    if (!itemId) {
      return NextResponse.json(
        { ok: false, error: "missing_item_id" },
        { status: 400 }
      );
    }

    // 1) Hent item
    const { data: item, error: itemErr } = await supabase
      .from("items")
      .select("id, reserved_until, sold")
      .eq("id", itemId)
      .single();

    if (itemErr || !item) {
      console.error("reservations: itemErr", itemErr);
      return NextResponse.json(
        { ok: false, error: "item_not_found" },
        { status: 404 }
      );
    }

    const now = new Date();

    // 2) Tjek om den ER sold / aktivt reserveret
    if (item.sold) {
      return NextResponse.json(
        { ok: false, error: "already_reserved_or_sold" },
        { status: 409 }
      );
    }

    if (item.reserved_until && new Date(item.reserved_until) > now) {
      // stadig inde i gammel reservation
      return NextResponse.json(
        { ok: false, error: "already_reserved_or_sold" },
        { status: 409 }
      );
    }

    // 3) Sæt ny reservation 2 minutter frem
    const expiresAt = new Date(now.getTime() + 2 * 60 * 1000);

    const { data: updated, error: updErr } = await supabase
      .from("items")
      .update({
        reserved_until: expiresAt.toISOString(),
        // reserved_by kan du tilføje senere
      })
      .eq("id", itemId)
      .select("id, reserved_until")
      .single();

    if (updErr || !updated) {
      console.error("reservations: updErr", updErr);
      return NextResponse.json(
        { ok: false, error: "server_error" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      itemId: updated.id,
      reserved_until: updated.reserved_until,
      ttl_seconds: 120,
    });
  } catch (err) {
    console.error("reservations: unexpected", err);
    return NextResponse.json(
      { ok: false, error: "server_error" },
      { status: 500 }
    );
  }
}