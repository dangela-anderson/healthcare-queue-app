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

    // Check that the visit exists and is still waiting.
    const { data: visit, error: visitError } = await supabase
      .from("visits")
      .select("id, status")
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

    if (visit.status !== "WAITING") {
      return NextResponse.json(
        {
          error: "Visit is no longer waiting.",
        },
        {
          status: 409,
        },
      );
    }

    const assignedAt = new Date().toISOString();

    // Assign the visit.
    const { data: updatedVisit, error: updateError } = await supabase
      .from("visits")
      .update({
        status: "IN_PROGRESS",
        assigned_to: employeeId,
        assigned_at: assignedAt,
      })
      .eq("id", visitId)
      .eq("status", "WAITING")
      .select("id, status, assigned_to, assigned_at")
      .maybeSingle();

    if (updateError) {
      console.error("Visit update error:", updateError);

      return NextResponse.json(
        {
          error: updateError.message,
        },
        {
          status: 500,
        },
      );
    }

    if (!updatedVisit) {
      return NextResponse.json(
        {
          error: "Visit was already assigned or completed.",
        },
        {
          status: 409,
        },
      );
    }

    // Record the assignment event.
    const { error: eventError } = await supabase.from("visit_events").insert({
      visit_id: visitId,
      event_type: "ASSIGNED",
      performed_by: employeeId,
      created_at: assignedAt,
    });

    if (eventError) {
      console.error("Visit event error:", eventError);

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
      visit: updatedVisit,
    });
  } catch (error) {
    console.error("Assign visit error:", error);

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
