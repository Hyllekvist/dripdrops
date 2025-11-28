import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { itemId } = await req.json();

    if (!itemId || typeof itemId !== "string") {
      return NextResponse.json(
        { error: "Mangler gyldigt itemId" },
        { status: 400 }
      );
    }

    const now = new Date();
    const nowIso = now.toISOString();
    const inTwoMinutesIso = new Date(
      now.getTime() + 2 * 60 * 1000
    ).toISOString();

    // Atomisk update:
    // - kun hvis sold = false
    // - OG (reserved_until IS NULL ELLER reserved_until < nu)
    const { data, error } = await supabase
      .from("items")
      .update({ reserved_until: inTwoMinutesIso })
      .eq("id", itemId)
      .eq("sold", false)
      .or(`reserved_until.is.null,reserved_until.lt.${nowIso}`)
      .select("id, reserved_until")
      .single();

    if (error) {
      console.error("Reservation update error:", error);
      return NextResponse.json(
        { error: "Kunne ikke reservere varen (serverfejl)" },
        { status: 500 }
      );
    }

    // Hvis ingen række matcher betingelserne, er den enten solgt
    // eller stadig reserveret af en anden.
    if (!data) {
      return NextResponse.json(
        {
          error:
            "Varen er allerede reserveret af en anden eller solgt. Prøv igen om lidt.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json({
      ok: true,
      reservedUntil: data.reserved_until,
    });
  } catch (err) {
    console.error("Reservation API error:", err);
    return NextResponse.json(
      { error: "Uventet fejl i reservation-API" },
      { status: 500 }
    );
  }
}
