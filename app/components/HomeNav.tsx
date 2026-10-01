"use client";

import Link from "next/link";

export default function HomeNav() {
  return (
    <header className="border-b border-slate-200 bg-cyan-800 text-white border-b-2 border-slate-300">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-2 py-2">
        <Link href="/dashboard" className="font-bold text-white">
          Front Desk Queue
        </Link>
        <nav className="flex gap-5 text-sm">
          <a
            href="/api/epic/authorize"
            className="flex w-full items-center justify-center bg-slate-900 px-5 py-3 font-medium text-white hover:bg-slate-800"
          >
            Employee Login
          </a>
        </nav>
      </div>
    </header>
  );
}
