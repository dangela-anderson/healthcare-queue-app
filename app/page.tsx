import CheckInForm from "./components/CheckInForm";
import HomeNav from "./components/HomeNav";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const cookieStore = await cookies();

  const employeeId = cookieStore.get("employee_id")?.value;

  if (employeeId) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <HomeNav />
      <div className="mx-auto max-w-4xl px-6 py-20">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-sky-900">
            An Optimized Registration Experience Awaits
          </h1>
          <p className="mt-3 text-lg text-slate-600">
            No more long lines and crowded waiting room! TeamFlow streamlines
            patient flow management for shorter wait times and an improved
            patient experiece and safety.
          </p>
        </div>
        <div>
          <CheckInForm />
        </div>
      </div>
    </main>
  );
}
