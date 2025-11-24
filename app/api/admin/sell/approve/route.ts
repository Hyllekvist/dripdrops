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
        { error: "Mangler id" },
        { status: 400 }
      );
    }

    // 1) Hent submission
    const { data: submission, error: fetchError } = await supabase
      .from("sell_submissions")
      .select(
        "id, title, brand, price_idea, condition, email, image_urls"
      )
      .eq("id", id)
      .single();

    if (fetchError || !submission) {
      console.error("Fetch submission error:", fetchError);
      return NextResponse.json(
        { error: "Kunne ikke finde submission" },
        { status: 404 }
      );
    }

    // 2) Opret item i items-tabellen
    // JUSTÉR felter så de matcher din items-schema 1:1
    const { data: item, error: itemError } = await supabase
      .from("items")
      .insert({
        title: submission.title,
        brand: submission.brand,
        price: submission.price_idea,        // prisidé → price
        description: null,                   // kan ændres senere
        dropId: null,                        // sættes manuelt senere
        marketMin: null,
        marketMax: null,
        aiAuthenticity: null,
        image_urls: submission.image_urls ?? null, // kræver image_urls-kolonne på items, ellers fjern denne linje
        status: "draft"                      // kun hvis du har en status-kolonne
      })
      .select("id")
      .single();

    if (itemError || !item) {
      console.error("Create item error:", itemError);
      return NextResponse.json(
        { error: "Kunne ikke oprette item" },
        { status: 500 }
      );
    }

    // 3) Opdater submission → approved + link til item
    const { error: updateError } = await supabase
      .from("sell_submissions")
      .update({
        status: "approved",
        item_id: item.id
      })
      .eq("id", id);

    if (updateError) {
      console.error("Update submission error:", updateError);
      return NextResponse.json(
        { error: "Item oprettet, men kunne ikke opdatere submission" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      newStatus: "approved",
      itemId: item.id
    });
  } catch (err: any) {
    console.error("Approve exception:", err);
    return NextResponse.json(
      { error: "Serverfejl i approve-endpoint" },
      { status: 500 }
    );
  }
}
