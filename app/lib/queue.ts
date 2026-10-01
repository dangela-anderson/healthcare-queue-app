import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Returns all active visit for the queue.
 * @returns a list of QueueVisit objects.
 */

export async function getQueue() {
  const supabase = createAdminClient();

  // Gets all uncompleted visits
  const { data: visitsData, error: visitsError } = await supabase
    .from("visits")
    .select(
      `
        id,
        first_name,
        last_name,
        reason,
        status,
        assigned_to,
        created_at,
        assigned_at,
        completed_at
      `,
    )
    .in("status", ["WAITING", "IN_PROGRESS"])
    .order("created_at", { ascending: true });

  if (visitsError) {
    console.error("Database Error: Failed to retrieve visits'", visitsError);
  }

  const visits = visitsData ?? [];
  const employeeIds = new Set<string>();

  // Gets all employeeIds assigned to uncompleted visits
  for (const visit of visits) {
    if (visit.status === "IN_PROGRESS") {
      const employeeId = visit.assigned_to;
      if (!employeeIds.has(employeeId)) {
        employeeIds.add(employeeId);
      }
    }
  }

  // Get all employees assigned to uncompleted visits
  const { data: employeesData, error: employeesError } = await supabase
    .from("employees")
    .select("id, first_name, last_name")
    .in("id", Array.from(employeeIds));

  if (employeesError) {
    console.error(
      "Database Error: Failed to retrieve employees",
      employeesError,
    );
  }

  const employees = employeesData ?? [];

  // Maps an employeeId to the employee
  const employeeMap = new Map(
    employees.map((employee) => [employee.id, employee]),
  );

  return visits.map((visit) => ({
    ...visit,
    assigned_employee: visit.assigned_to
      ? (employeeMap.get(visit.assigned_to) ?? null)
      : null,
  }));
}
