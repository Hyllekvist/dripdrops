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

    // 1) Tjek at submission findes
    const { data: submission, error: fetchError } = await supabase
      .from("sell_submissions")
      .select("id, status")
      .eq("id", id)
      .single();

    if (fetchError || !submission) {
      console.error("approve: kunne ikke finde submission", fetchError);
      return NextResponse.json(
        { error: "Submission findes ikke" },
        { status: 404 }
      );
    }

    // 2) Opdater status til approved
    const { error: updateError } = await supabase
      .from("sell_submissions")
      .update({ status: "approved" })
      .eq("id", id);

    if (updateError) {
      console.error("approve: update-fejl", updateError);
      return NextResponse.json(
        { error: "Kunne ikke opdatere status" },
        { status: 500 }
      );
    }

    // 3) Returnér nyt status-flag til clienten
    return NextResponse.json({ ok: true, newStatus: "approved" });
  } catch (err) {
    console.error("approve: uventet fejl", err);
    return NextResponse.json(
      { error: "Uventet serverfejl" },
      { status: 500 }
    );
  }
}
