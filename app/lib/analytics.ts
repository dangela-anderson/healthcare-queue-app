import { createAdminClient } from "@/lib/supabase/admin";
import { calculateDuration, calculateAverage } from "@/lib/utils";

export type UserScorecard = {
  employeeId: string;
  firstName: string | null;
  lastName: string | null;
  totalCompletedRegs: number;
  avgRegDuration: number;
};

export type ReportData = {
  totalCompletedRegs: number;
  avgRegDuration: number;
  avgWaitDuration: number;
  userScorecards: UserScorecard[];
  peakHours: Record<number, number>;
  maxHourlyCount: number;
};

/**
 * Returns the traffic and performance data used for the department report.
 * @returns The department report data object
 */
export async function getAnalytics(): Promise<ReportData> {
  const supabase = createAdminClient();

  // Get all completed visits
  const { data: visitsData, error: visitsError } = await supabase
    .from("visits")
    .select(
      `
      id,
      created_at,
      assigned_at,
      completed_at,
      assigned_to,
      status
    `,
    )
    .eq("status", "COMPLETED")
    .order("created_at", {
      ascending: true,
    });

  if (visitsError) {
    console.error(visitsError);
  }

  const visits = visitsData ?? [];

  // Total completed registrations
  const totalCompletedRegs = visits.length;

  const regDurations: number[] = [];
  const waitDurations: number[] = [];
  const userRegDurations = new Map<string, number[]>();
  const hourlyCounts = new Map<number, number>();
  let maxHourlyCount = 0;

  /**
   * Iterates over all completed visits and creates the following:
   * - A list of the department's reg duration, used for avgRegDurations
   * - A list of  the department's wait duration, used for avgWaitDurations
   * - A map linking employeeIds to the list of their reg duration, used for userRegDurations
   * - A map linking an hour to the count of visits created during that hour, used for hourlyCounts
   */
  for (const visit of visits) {
    // Calculate the visit's reg duration
    const regDuration = calculateDuration(
      visit.assigned_at,
      visit.completed_at,
    );

    //Calculate the visit's wait duration
    const waitDuration = calculateDuration(visit.created_at, visit.assigned_at);

    // Push to a list of registration durations
    if (regDuration !== null) {
      regDurations.push(regDuration);
    }
    // Push to a list of wait durations
    if (waitDuration !== null) {
      waitDurations.push(waitDuration);
    }

    // Maps the employees to a list of their reg durations
    const userDurationList = userRegDurations.get(visit.assigned_to) ?? [];
    userDurationList.push(regDuration);
    userRegDurations.set(visit.assigned_to, userDurationList);

    // Maps the hour to the number of visits created during that hour
    const hour = new Date(visit.created_at).getHours();
    const hourCount = hourlyCounts.get(hour) ?? 0;
    const newCount = hourCount + 1;
    hourlyCounts.set(hour, newCount);

    // Gets max hour count
    maxHourlyCount = Math.max(maxHourlyCount, newCount);
  }

  // Average registration duration
  const avgRegDuration = calculateAverage(regDurations);
  // Average wait duration
  const avgWaitDuration = calculateAverage(waitDurations);

  // The user scorecards
  const userScorecards = [];

  // Gets a list of all employees
  const { data: employeesData, error: employeeError } = await supabase
    .from("employees")
    .select("id, first_name, last_name")
    .in("id", Array.from(userRegDurations.keys()));

  if (employeeError) {
    throw new Error(
      `Failed to load employee analytics: ${employeeError.message}`,
    );
  }
  const employees = employeesData ?? [];

  // Calculates the employees average reg duration and adds the employee information to the user scorecard list
  for (const employee of employees) {
    const regDurations = userRegDurations.get(employee.id);
    const avgRegDuration = regDurations ? calculateAverage(regDurations) : 0;
    const totalCompletedRegs = regDurations ? regDurations.length : 0;
    userScorecards.push({
      employeeId: employee.id,
      firstName: employee.first_name,
      lastName: employee.last_name,
      totalCompletedRegs,
      avgRegDuration,
    });
  }

  return {
    totalCompletedRegs,
    avgRegDuration,
    avgWaitDuration,
    userScorecards: userScorecards.sort(
      (a, b) => a.avgRegDuration - b.avgRegDuration,
    ),
    peakHours: Object.fromEntries(hourlyCounts),
    maxHourlyCount,
  };
}
