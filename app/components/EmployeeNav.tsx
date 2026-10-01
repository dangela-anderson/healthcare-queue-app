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
    <header className="text-cyan-600 bg-white p-4 shadow-xs ring-1 ring-slate-200">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-2">
        <Link href="/dashboard">
          <Image
            className="h-auto"
            alt="Icon"
            src="/full-icon.svg"
            width={140}
            height={30}
            priority
          />
        </Link>
        <nav className="flex flex-col items-end space-y-1">
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="disabled:cursor-not-allowed disabled:opacity-50 px-4 py-1 bg-cyan-600 text-white hover:bg-cyan-700 hover:underline underline-white underline-offset-4 transition-colors duration-500"
          >
            <span className="text-xs">Log Out</span>
          </button>
          <h1 className="text-xs uppercase">
            (Signed in as {lastName},{firstName})
          </h1>
        </nav>
      </div>
    </header>
  );
}
