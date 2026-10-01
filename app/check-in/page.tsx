import Link from "next/link";
import CheckInForm from "@/components/CheckInForm";

export default function CheckInPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-lg px-6 py-12">
        <Link href="/" className="text-sm text-slate-500 hover:text-slate-900">
          ← Back
        </Link>

        <div className="mt-8">
          <h1 className="text-3xl font-bold">Check In</h1>

          <p className="mt-2 text-slate-600">
            Enter your information to join the registration queue.
          </p>
        </div>

        <div className="mt-8">
          <CheckInForm />
        </div>
      </div>
    </main>
  );
}
