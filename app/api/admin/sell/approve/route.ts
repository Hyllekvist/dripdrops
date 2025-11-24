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
      .update({ status: "approved" })
      .eq("id", id);

    if (error) {
      console.error("Approve error:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ newStatus: "approved" });
  } catch (err: any) {
    console.error("Approve exception:", err);
    return NextResponse.json(
      { error: "Serverfejl i approve-endpoint" },
      { status: 500 }
    );
  }
}
