// app/api/sell/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

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

    const images = formData.getAll("images") as File[];

    if (!title || !email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const priceNumber =
      typeof price === "string" && price ? Number(price) : null;

    // Brug eget id så vi kan navngive sti i Storage
    const submissionId = crypto.randomUUID();

    const imageUrls: string[] = [];
    let uploadedCount = 0;

    // VIGTIGT: bucket-navn skal matche det du har oprettet i Supabase
    const bucketName = "sell-images";

    for (let i = 0; i < images.length; i++) {
      const file = images[i];
      if (!(file instanceof File)) continue;

      const originalName = file.name || `image-${i}.jpg`;
      const ext = originalName.includes(".")
        ? originalName.split(".").pop()
        : "jpg";

      const path = `submissions/${submissionId}/${i}-${Date.now()}.${ext}`;

      const { data: uploadData, error: uploadError } =
        await supabase.storage.from(bucketName).upload(path, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type || "image/jpeg",
        });

      if (uploadError) {
        console.error("Supabase upload error", uploadError);
        continue;
      }

      const { data: publicData } = supabase
        .storage
        .from(bucketName)
        .getPublicUrl(path);

      if (publicData?.publicUrl) {
        imageUrls.push(publicData.publicUrl);
        uploadedCount++;
      }
    }

    const { error } = await supabase.from("sell_submissions").insert({
      id: submissionId,
      title,
      brand,
      price_idea: priceNumber,
      description,
      condition,
      email,
      status: "pending",
      image_count: uploadedCount,
      image_urls: imageUrls,
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
