import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const id = body?.id as string | undefined;

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("sell_submissions")
      .update({ status: "rejected" })
      .eq("id", id)
      .select("id, status")
      .single();

    if (error) {
      console.error("Supabase reject error:", error);
      return NextResponse.json({ error: "Supabase error" }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      id: data.id,
      newStatus: data.status,
    });
  } catch (err) {
    console.error("Reject route error:", err);
    return NextResponse.json(
      { error: "Server error in reject" },
      { status: 500 }
    );
  }
}
