import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();

  cookieStore.delete("employee_id");
  cookieStore.delete("epic_oauth_state");

  return NextResponse.json({
    success: true,
  });
}
