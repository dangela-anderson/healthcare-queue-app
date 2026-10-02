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
      <div className="mx-auto flex min-h-screen max-w-md align-center items-center px-6">
        <div className="mt-2 bg-white p-8 shadow-sm ring-1 ring-slate-200 my-4">
          <div className=" items-center w-full">
            <Link
              href="/"
              className="text-sm text-slate-500 hover:underline hover:underline-text-600 hover:text-slate-600"
            >
              {`<  Return to Home`}
            </Link>

            <div className="flex flex-col items-center space-y-2 my-8 ">
              <div className="items-center shadow-sm ring-2 ring-slate-200 rounded-full p-4">
                <Image
                  alt="Icon"
                  src="/icon.svg"
                  height={160}
                  width={40}
                  priority
                />
              </div>
              <h1 className="text-2xl font-medium text-sky-700">
                Employee Login
              </h1>
              <p className="text-sm text-slate-500">
                Sign in using your Epic account.
              </p>
            </div>

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

            <p className="mt-6 text-xs leading-5 text-center text-slate-500">
              This portfolio application uses Epic SMART on FHIR OAuth for
              employee authentication.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
