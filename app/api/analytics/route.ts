import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAnalytics } from "@/lib/analytics";

/**
 * Returns the department's traffic and performance data.
 * @returns The department report data.
 */
export async function GET() {
  // Checks if the user is authenticated
  const cookieStore = await cookies();
  const employeeId = cookieStore.get("employee_id")?.value;

  // Throws an error if the user is not authenticated
  if (!employeeId) {
    return NextResponse.json(
      { error: "Unauthorized: Unable to access the report page" },
      { status: 401 },
    );
  }

  try {
    // Gets and returns department report data
    const analytics = await getAnalytics();
    return NextResponse.json(analytics);
  } catch (error) {
    console.error(error);
    // Throws error if unable to get department report data
    return NextResponse.json(
      { error: "Server Error: Unable to retrieve the department analytics" },
      { status: 500 },
    );
  }
}
