import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getEpicAuthorizationUrl } from "@/lib/epic";

export async function GET() {
  const state = randomUUID();

  const response = NextResponse.redirect(getEpicAuthorizationUrl(state));

  response.cookies.set("epic_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });

  return response;
}
