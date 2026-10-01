import { NextRequest, NextResponse } from "next/server";
import { exchangeEpicCode, getEpicEmployee } from "@/lib/epic";
import { createAdminClient } from "@/lib/supabase/admin";

function decodeJwtPayload(token: string) {
  const parts = token.split(".");

  if (parts.length !== 3) {
    throw new Error("Invalid JWT");
  }

  const payload = parts[1];

  return JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const code = searchParams.get("code");

  const state = searchParams.get("state");

  const storedState = request.cookies.get("epic_oauth_state")?.value;

  if (!code || !state || state !== storedState) {
    return NextResponse.redirect(
      new URL("/employee/login?error=oauth", request.url),
    );
  }

  try {
    const tokenData = await exchangeEpicCode(code);

    const idToken = tokenData.id_token;
    const accessToken = tokenData.access_token;

    if (!idToken) {
      console.error("Epic did not return an id_token");

      return NextResponse.redirect(
        new URL("/employee/login?error=no_id_token", request.url),
      );
    }

    const idTokenPayload = decodeJwtPayload(idToken);

    const fhirUser = idTokenPayload.fhirUser;

    if (!fhirUser) {
      console.error("No fhirUser in ID token");

      return NextResponse.redirect(
        new URL("/employee/login?error=no_fhir_user", request.url),
      );
    }

    const employeeResource = await getEpicEmployee(fhirUser, accessToken);

    const supabase = createAdminClient();

    const { data: existingEmployee, error: lookupError } = await supabase
      .from("employees")
      .select("*")
      .eq("epic_user_id", fhirUser)
      .maybeSingle();

    if (lookupError) {
      console.error("employee lookup error:", lookupError);

      return NextResponse.redirect(
        new URL("/employee/login?error=employee_lookup", request.url),
      );
    }

    let employee = existingEmployee;

    if (!employee) {
      const name = employeeResource.name?.[0];
      const firstName = name?.given?.[0] ?? null;
      const lastName = name?.family ?? null;

      const { data: newEmployee, error: insertError } = await supabase
        .from("employees")
        .insert({
          epic_user_id: fhirUser,
          first_name: firstName,
          last_name: lastName,
        })
        .select()
        .single();

      if (insertError) {
        console.error("employee insert error:", insertError);

        return NextResponse.redirect(
          new URL("/employee/login?error=employee_creation", request.url),
        );
      }

      employee = newEmployee;
    }

    const response = NextResponse.redirect(new URL("/dashboard", request.url));

    response.cookies.set("employee_id", employee.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    response.cookies.delete("epic_oauth_state");

    return response;
  } catch (error) {
    console.error(error);

    return NextResponse.redirect(
      new URL("/employee/login?error=oauth", request.url),
    );
  }
}
