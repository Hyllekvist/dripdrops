import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Missing submission id" },
        { status: 400 }
      );
    }

    // 1) Hent submission
    const { data: submission, error: subErr } = await supabase
      .from("sell_submissions")
      .select(
        "id, title, brand, price_idea, status, item_id"
      )
      .eq("id", id)
      .single();

    if (subErr || !submission) {
      return NextResponse.json(
        { error: "Submission ikke fundet" },
        { status: 404 }
      );
    }

    if (submission.status !== "approved") {
      return NextResponse.json(
        { error: "Submission skal være approved før der oprettes item" },
        { status: 400 }
      );
    }

    // Hvis vi allerede har oprettet et item, så returnér bare det
    if (submission.item_id) {
      return NextResponse.json(
        { itemId: submission.item_id, newStatus: "approved" },
        { status: 200 }
      );
    }

    // 2) Opret et basic item i items-tabellen
    // JUSTER disse felter så de passer 1:1 til din items-schema
    const { data: item, error: itemErr } = await supabase
      .from("items")
      .insert({
        title: submission.title,
        brand: submission.brand,
        price: submission.price_idea,
        // resten (description, aiAuthenticity osv.) kan udfyldes manuelt senere
      })
      .select("id")
      .single();

    if (itemErr || !item) {
      console.error("Create item error:", itemErr);
      return NextResponse.json(
        { error: "Kunne ikke oprette item" },
        { status: 500 }
      );
    }

    // 3) Link tilbage på submission
    const { error: updateErr } = await supabase
      .from("sell_submissions")
      .update({ item_id: item.id })
      .eq("id", id);

    if (updateErr) {
      console.error("Update submission with item_id error:", updateErr);
      return NextResponse.json(
        { error: "Item oprettet, men kunne ikke linke til submission" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { itemId: item.id, newStatus: "approved" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Create-item API error:", err);
    return NextResponse.json(
      { error: "Uventet fejl i create-item API" },
      { status: 500 }
    );
  }
}
