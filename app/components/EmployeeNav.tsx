"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

type EmployeeNavProps = {
  firstName: string | null;
  lastName: string | null;
};

export default function EmployeeNav({ firstName, lastName }: EmployeeNavProps) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);

    try {
      const response = await fetch("/api/epic/logout", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      router.push("/employee/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      setLoggingOut(false);
    }
  }

  return (
    <header className="text-sky-600 bg-white shadow-xs ring-1 ring-slate-200 p-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-2">
        <Link href="/dashboard">
          <Image
            className="h-auto"
            alt="Icon"
            src="/full-icon.svg"
            width={160}
            height={40}
            priority
          />
        </Link>
        <nav className="flex flex-col items-end space-y-1">
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="disabled:cursor-not-allowed disabled:opacity-50 px-4 py-1 bg-sky-700 text-white hover:bg-sky-800 rounded-xs transition-colors duration-500"
          >
            <span className="text-sm">Log Out</span>
          </button>
          <h1 className="text-sm uppercase">
            ( Signed in as {lastName}, {firstName} )
          </h1>
        </nav>
      </div>
    </header>
  );
}
