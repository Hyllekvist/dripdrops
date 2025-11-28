// app/api/reservations/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Reservationstid i sekunder
const RESERVE_SECONDS = 120;

export async function POST(req: NextRequest) {
  try {
    const { itemId } = await req.json();

    if (!itemId || typeof itemId !== "string") {
      return NextResponse.json(
        { error: "missing_item_id" },
        { status: 400 }
      );
    }

    const now = new Date();
    const nowIso = now.toISOString();
    const reservedUntil = new Date(
      now.getTime() + RESERVE_SECONDS * 1000
    ).toISOString();

    // ÉN atomar opdatering:
    // - kun hvis item matcher id
    // - kun hvis sold = false
    // - kun hvis reserved_until er NULL ELLER udløbet
    const { data, error } = await supabase
      .from("items")
      .update({
        reserved_until: reservedUntil,
        // her kan vi senere sætte reserved_by til user-id / session-id
      })
      .eq("id", itemId)
      .eq("sold", false)
      .or(`reserved_until.is.null,reserved_until.lt.${nowIso}`)
      .select("id, reserved_until")
      .single();

    // Hvis ingen række blev opdateret, tolker PostgREST det som fejl med code PGRST116
    if (error) {
      // PGRST116 = no rows found efter update med return=representation
      if ((error as any).code === "PGRST116") {
        return NextResponse.json(
          { error: "already_reserved_or_sold" },
          { status: 409 }
        );
      }

      console.error("Reservation update error:", error);
      return NextResponse.json(
        { error: "server_error" },
        { status: 500 }
      );
    }

    if (!data) {
      // defensivt fallback – burde ikke ske, men så behandler vi det som 409
      return NextResponse.json(
        { error: "already_reserved_or_sold" },
        { status: 409 }
      );
    }

    return NextResponse.json({
      ok: true,
      reservedUntil: data.reserved_until,
    });
  } catch (err) {
    console.error("Reservation API crash:", err);
    return NextResponse.json(
      { error: "server_error" },
      { status: 500 }
    );
  }
}