// app/api/items/[id]/status/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type ItemRow = {
  id: string;
  is_sold: boolean | null;
  reserved_until: string | null;
};

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  const { data, error } = await supabase
    .from("items")
    .select("id, is_sold, reserved_until")
    .eq("id", id)
    .single<ItemRow>();

  if (error || !data) {
    return NextResponse.json(
      { error: "Item not found" },
      { status: 404 }
    );
  }

  const now = new Date();
  const reserved =
    data.reserved_until &&
    new Date(data.reserved_until).getTime() > now.getTime();

  let status: "available" | "reserved" | "sold" = "available";

  if (data.is_sold) {
    status = "sold";
  } else if (reserved) {
    status = "reserved";
  }

  return NextResponse.json({
    id: data.id,
    status,
    reserved_until: data.reserved_until,
  });
}