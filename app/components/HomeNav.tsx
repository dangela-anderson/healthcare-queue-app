"use client";

import Link from "next/link";
import Image from "next/image";

export default function HomeNav() {
  return (
    <header className="text-cyan-600 bg-white shadow-xs ring-1 ring-slate-200 p-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-2">
        <Link href="/">
          <Image
            className="h-auto"
            alt="Icon"
            src="/full-icon.svg"
            width={160}
            height={40}
            priority
          />
        </Link>
        <nav className="flex gap-5 text-md">
          <a
            href="/api/epic/authorize"
            className="font-medium text-sky-900 hover:text-sky-800 transition-colors"
          >
            Employee Login
          </a>
        </nav>
      </div>
    </header>
  );
}
