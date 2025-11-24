import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { error: "Mangler gyldigt id" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("sell_submissions")
      .update({ status: "rejected" })
      .eq("id", id);

    if (error) {
      console.error("reject: update-fejl", error);
      return NextResponse.json(
        { error: "Kunne ikke opdatere status" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, newStatus: "rejected" });
  } catch (err) {
    console.error("reject: uventet fejl", err);
    return NextResponse.json(
      { error: "Uventet serverfejl" },
      { status: 500 }
    );
  }
}
