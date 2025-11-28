// app/api/reservations/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const itemId = body?.itemId as string | undefined;

    if (!itemId) {
      return NextResponse.json(
        { ok: false, error: "missing_item_id" },
        { status: 400 }
      );
    }

    // 2 minutters reservation
    const now = new Date();
    const nowIso = now.toISOString();
    const expiresAt = new Date(now.getTime() + 2 * 60 * 1000).toISOString();

    // Atomar UPDATE:
    //  - id skal matche
    //  - item må enten ikke være reserveret,
    //    eller reservationen skal være udløbet
    const { data, error } = await supabase
      .from("items")
      .update({ reserved_until: expiresAt })
      .eq("id", itemId)
      .or(`reserved_until.is.null,reserved_until.lt.${nowIso}`)
      .select("id, reserved_until")
      .single();

    if (error) {
      // ingen rækker matchet = nogen andre har den stadig låst
      if ((error as any).code === "PGRST116") {
        return NextResponse.json(
          { ok: false, error: "already_reserved_or_sold" },
          { status: 409 }
        );
      }

      console.error("Reservation DB error:", error);
      return NextResponse.json(
        { ok: false, error: "server_error" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        ok: true,
        itemId,
        expiresAt: data.reserved_until,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Reservation API error:", err);
    return NextResponse.json(
      { ok: false, error: "server_error" },
      { status: 500 }
    );
  }
}
