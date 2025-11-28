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

    if (!itemId) {
      return NextResponse.json(
        { error: "Missing itemId" },
        { status: 400 }
      );
    }

    const now = new Date();
    const nowIso = now.toISOString();
    const expires = new Date(now.getTime() + 2 * 60 * 1000); // 2 min
    const expiresIso = expires.toISOString();
    const token = crypto.randomUUID();

    // Atomic UPDATE: kun hvis ikke solgt OG ingen aktiv reservation
    const { data, error } = await supabase
      .from("items")
      .update({
        reserved_until: expiresIso,
        reserved_by: token,
      })
      .eq("id", itemId)
      .eq("sold", false)
      .or(`reserved_until.is.null,reserved_until.lt.${nowIso}`)
      .select("id, reserved_until")
      .maybeSingle();

    if (error) {
      console.error("Reservation error", error);
      return NextResponse.json(
        { error: "Kunne ikke reservere varen lige nu." },
        { status: 500 }
      );
    }

    if (!data) {
      // Ingen række opdateret = allerede reserveret/solgt
      return NextResponse.json(
        {
          ok: false,
          error:
            "Varen er allerede reserveret eller solgt. Prøv at refreshe siden.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json({
      ok: true,
      itemId,
      token,
      expiresAt: expiresIso,
    });
  } catch (err) {
    console.error("Reservation API error", err);
    return NextResponse.json(
      { error: "Uventet serverfejl ved reservation." },
      { status: 500 }
    );
  }
}
