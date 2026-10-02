import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import EmployeeNav from "@/components/EmployeeNav";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();

  const employeeId = cookieStore.get("employee_id")?.value;

  const supabase = createAdminClient();

  const { data: employee, error } = await supabase
    .from("employees")
    .select("first_name, last_name")
    .eq("id", employeeId)
    .single();

  if (error || !employee) {
    redirect("/employee/login");
  }
  return (
    <div className="h-full w-full bg-slate-50">
      <EmployeeNav
        firstName={employee.first_name}
        lastName={employee.last_name}
      />

      {children}
    </div>
  );
}
