import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const employeeId = cookieStore.get("employee_id")?.value;

    if (!employeeId) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    const body = await request.json();
    const visitId = body.visitId;

    if (!visitId) {
      return NextResponse.json(
        {
          error: "Missing visitId",
        },
        {
          status: 400,
        },
      );
    }

    const supabase = createAdminClient();

    // Check that the visit exists and is currently assigned to this employee member.
    const { data: visit, error: visitError } = await supabase
      .from("visits")
      .select("id, status, assigned_to")
      .eq("id", visitId)
      .maybeSingle();

    if (visitError) {
      console.error("Visit lookup error:", visitError);

      return NextResponse.json(
        {
          error: visitError.message,
        },
        {
          status: 500,
        },
      );
    }

    if (!visit) {
      return NextResponse.json(
        {
          error: "Visit not found.",
        },
        {
          status: 404,
        },
      );
    }

    if (visit.status !== "IN_PROGRESS") {
      return NextResponse.json(
        {
          error: "Visit is not currently in progress.",
        },
        {
          status: 409,
        },
      );
    }

    if (visit.assigned_to !== employeeId) {
      return NextResponse.json(
        {
          error: "This visit is assigned to another employee member.",
        },
        {
          status: 403,
        },
      );
    }

    const completedAt = new Date().toISOString();

    // Complete the visit.
    const { data: completedVisit, error: updateError } = await supabase
      .from("visits")
      .update({
        status: "COMPLETED",
        completed_at: completedAt,
      })
      .eq("id", visitId)
      .eq("status", "IN_PROGRESS")
      .eq("assigned_to", employeeId)
      .select("id, status, assigned_to, completed_at")
      .maybeSingle();

    if (updateError) {
      console.error("Visit completion error:", updateError);

      return NextResponse.json(
        {
          error: updateError.message,
        },
        {
          status: 500,
        },
      );
    }

    if (!completedVisit) {
      return NextResponse.json(
        {
          error: "Visit was already completed or is no longer assigned to you.",
        },
        {
          status: 409,
        },
      );
    }

    // Record the completion event.
    const { error: eventError } = await supabase.from("visit_events").insert({
      visit_id: visitId,
      event_type: "COMPLETED",
      performed_by: employeeId,
      created_at: completedAt,
    });

    if (eventError) {
      console.error("Completion event error:", eventError);

      return NextResponse.json(
        {
          error: eventError.message,
        },
        {
          status: 500,
        },
      );
    }

    return NextResponse.json({
      success: true,
      visit: completedVisit,
    });
  } catch (error) {
    console.error("Complete visit error:", error);

    return NextResponse.json(
      {
        error: "An unexpected error occurred.",
      },
      {
        status: 500,
      },
    );
  }
}
