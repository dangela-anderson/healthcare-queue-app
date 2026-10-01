import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getQueue } from "@/lib/queue";

export async function GET() {
  // Checks if the user is authenticated
  const cookieStore = await cookies();
  const employeeId = cookieStore.get("employee_id")?.value;

  // Throws an error if the user is not authenticated
  if (!employeeId) {
    return NextResponse.json(
      { error: "Unauthorized: Unable to access report page" },
      { status: 401 },
    );
  }

  try {
    // Gets and returns department queue
    const queue = await getQueue();
    return NextResponse.json(queue);
  } catch (error) {
    // Throws error if unable to get department queue
    return NextResponse.json(
      { error: `Server Error: Unable retrieve the department queue, ${error}` },
      { status: 500 },
    );
  }
}
