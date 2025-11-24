import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Brug SERVICE ROLE key KUN på serveren
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const title = String(formData.get("title") ?? "").trim();
    const brand = String(formData.get("brand") ?? "").trim();
    const price = formData.get("price");
    const description = String(formData.get("description") ?? "").trim();
    const condition = String(formData.get("condition") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();

    const images = formData.getAll("images");
    const imageCount = images.length;

    if (!title || !email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const priceNumber =
      typeof price === "string" && price ? Number(price) : null;

    const { error } = await supabase.from("sell_submissions").insert({
      title,
      brand,
      price_idea: priceNumber,
      description,
      condition,
      email,
      status: "pending",
      image_count: imageCount,
      ai_payload: null,
    });

    if (error) {
      console.error("Supabase insert error", error);
      return NextResponse.json(
        { error: "Failed to save submission" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Sell API error", err);
    return NextResponse.json(
      { error: "Unexpected error" },
      { status: 500 }
    );
  }
}
