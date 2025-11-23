import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(req: Request) {
  try {
    const supabase = supabaseServer();
    const body = await req.json();
    const { itemId, email } = body;

    if (!itemId || !email) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const { error } = await supabase
      .from("item_waitlist")
      .insert([{ item_id: itemId, email }]);

    if (error) {
      console.error(error);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
