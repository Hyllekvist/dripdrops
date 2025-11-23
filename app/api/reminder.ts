// pages/api/reminder.ts eller app/api/reminder/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "0.0.0.0";

  const body = await req.json();
  const { itemId, dropId, type, triggerAt, userId } = body;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // 1) check quota
  const { data: quotaOk } = await supabase.rpc("check_waitlist_quota", {
    p_ip: ip,
    p_user_id: userId,
  });

  if (!quotaOk) {
    return NextResponse.json(
      { ok: false, error: "RATE_LIMIT" },
      { status: 429 }
    );
  }

  // 2) opret reminder
  const { error } = await supabase.from("reminders").insert({
    user_id: userId,
    item_id: itemId,
    drop_id: dropId,
    type,
    trigger_at: triggerAt,
    ip,
  });

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
