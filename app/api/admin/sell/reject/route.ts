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

    const { error } = await supabase
      .from("sell_submissions")
      .update({ status: "rejected" })
      .eq("id", id);

    if (error) {
      console.error("Reject error:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ newStatus: "rejected" });
  } catch (err: any) {
    console.error("Reject exception:", err);
    return NextResponse.json(
      { error: "Serverfejl i reject-endpoint" },
      { status: 500 }
    );
  }
}
