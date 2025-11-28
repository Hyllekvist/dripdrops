import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);

    const itemId = body?.itemId as string | undefined;

    if (!itemId || typeof itemId !== "string") {
      return NextResponse.json(
        { error: "Mangler gyldigt itemId" },
        { status: 400 }
      );
    }

    // 1) Hent item + tilknyttet drop for at sikre at det er live
    const { data: itemRow, error: itemErr } = await supabase
      .from("items")
      .select(
        `
        id,
        drop_id,
        drops (
          id,
          is_live,
          ends_at
        )
      `
      )
      .eq("id", itemId)
      .maybeSingle();

    if (itemErr || !itemRow) {
      console.error("reserve: item lookup error", itemErr);
      return NextResponse.json(
        { error: "Item ikke fundet" },
        { status: 404 }
      );
    }

    const drop = (itemRow as any).drops as
      | { id: string; is_live: boolean | null; ends_at: string | null }
      | null;

    if (!drop || !drop.is_live) {
      return NextResponse.json(
        { error: "Item er ikke i et live drop" },
        { status: 400 }
      );
    }

    const now = Date.now();
    if (drop.ends_at) {
      const endsMs = new Date(drop.ends_at).getTime();
      if (endsMs <= now) {
        return NextResponse.json(
          { error: "Drop er afsluttet" },
          { status: 400 }
        );
      }
    }

    // 2) Tjek om der allerede findes en aktiv, ikke-udløbet reservation
    const { data: activeRes, error: activeErr } = await supabase
      .from("item_reservations")
      .select("id, expires_at, status")
      .eq("item_id", itemId)
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (activeErr) {
      console.error("reserve: active lookup error", activeErr);
      return NextResponse.json(
        { error: "Fejl ved opslag af reservation" },
        { status: 500 }
      );
    }

    if (activeRes) {
      const expiresMs = new Date(activeRes.expires_at as string).getTime();
      if (expiresMs > now) {
        // der findes allerede en lås
        return NextResponse.json(
          { error: "Item er allerede reserveret lige nu" },
          { status: 409 }
        );
      }
    }

    // 3) Opret ny reservation (2 minutters lås)
    const expiresAt = new Date(now + 2 * 60 * 1000).toISOString();

    const { data: newRes, error: insertErr } = await supabase
      .from("item_reservations")
      .insert({
        item_id: itemId,
        expires_at: expiresAt,
        status: "active",
        // buyer_email kan tilføjes senere, når du har bruger/checkout-flow
      })
      .select("id, expires_at")
      .single();

    if (insertErr || !newRes) {
      console.error("reserve: insert error", insertErr);
      return NextResponse.json(
        { error: "Kunne ikke oprette reservation" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        ok: true,
        reservationId: newRes.id,
        expiresAt: newRes.expires_at,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("reserve: uventet fejl", err);
    return NextResponse.json(
      { error: "Uventet serverfejl" },
      { status: 500 }
    );
  }
}
