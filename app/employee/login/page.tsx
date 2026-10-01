import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Image from "next/image";

type Props = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function EmployeeLoginPage({ searchParams }: Props) {
  const params = await searchParams;

  const cookieStore = await cookies();
  const employeeId = cookieStore.get("employee_id")?.value;

  if (employeeId) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="text-cyan-600 bg-white border-b border-slate-300 px-4">
        <Link href="/dashboard" className="font-bold">
          <Image alt="Logo" src="/logo.png" width={75} height={20} priority />
        </Link>
      </header>
      <div className="mx-auto flex min-h-screen max-w-md items-center px-6">
        <div className="w-full">
          <Link
            href="/"
            className="text-sm text-slate-50s0 hover:text-slate-900"
          >
            ← Return to Home
          </Link>

          <div className="mt-2 bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <Image alt="Logo" src="/logo.png" width={75} height={20} priority />
            <h1 className="text-2xl font-medium text-cyan-700">
              Employee Login
            </h1>

            <p className="text-sm text-slate-500">
              Sign in using your Epic account.
            </p>

            {params.error && (
              <div className="mt-6 bg-red-50 p-3 text-sm text-red-700">
                Epic authentication failed.
              </div>
            )}

            <a
              href="/api/epic/authorize"
              className="mt-8 flex w-full items-center justify-center bg-slate-900 px-5 py-3 font-medium text-white hover:bg-slate-800"
            >
              Sign in with Epic
            </a>

            <p className="mt-6 text-xs leading-5 text-slate-500">
              This portfolio application uses Epic SMART on FHIR OAuth for
              employee authentication.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
