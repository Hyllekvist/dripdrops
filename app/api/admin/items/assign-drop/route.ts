// app/api/admin/items/assign-drop/route.ts
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
    const dropId = (body?.dropId ?? null) as string | null;

    if (!itemId || typeof itemId !== "string") {
      return NextResponse.json(
        { error: "Mangler gyldigt itemId" },
        { status: 400 }
      );
    }

    // Hvis der er angivet dropId, kan vi (valgfrit) tjekke at det findes
    if (dropId) {
      const { data: drop, error: dropErr } = await supabase
        .from("drops")
        .select("id")
        .eq("id", dropId)
        .maybeSingle();

      if (dropErr) {
        console.error("assign-drop: drop lookup error", dropErr);
        return NextResponse.json(
          { error: "Fejl ved opslag af drop" },
          { status: 500 }
        );
      }

      if (!drop) {
        return NextResponse.json(
          { error: "Drop ikke fundet" },
          { status: 404 }
        );
      }
    }

    const { error: updateErr } = await supabase
      .from("items")
      .update({ drop_id: dropId })
      .eq("id", itemId);

    if (updateErr) {
      console.error("assign-drop: update error", updateErr);
      return NextResponse.json(
        { error: "Kunne ikke opdatere drop-tilknytning" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      itemId,
      dropId,
    });
  } catch (err) {
    console.error("assign-drop: uventet fejl", err);
    return NextResponse.json(
      { error: "Uventet serverfejl" },
      { status: 500 }
    );
  }
}
