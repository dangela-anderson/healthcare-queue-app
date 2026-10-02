"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { VISIT_REASONS } from "@/lib/constants";
import type { VisitReason } from "@/lib/types";
import Image from "next/image";

export default function CheckInForm() {
  const [firstName, setFirstName] = useState("");

  const [lastName, setLastName] = useState("");

  const [reason, setReason] = useState<VisitReason | "">("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const dialogRef = useRef<HTMLDialogElement>(null);

  function handleClose() {
    dialogRef.current?.close();
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    setError("");

    if (!firstName.trim() || !lastName.trim() || !reason) {
      setError("Please complete all fields.");

      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      const { error: insertError } = await supabase.from("visits").insert({
        first_name: firstName.trim(),

        last_name: lastName.trim(),

        reason,

        status: "WAITING",
      });

      if (insertError) {
        throw insertError;
      }

      setFirstName("");
      setLastName("");
      setReason("");
      dialogRef.current?.showModal();
    } catch (err) {
      console.error(err);

      setError("Unable to check in. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 items-center align-center shadow-sm rounded-xs ring-1 ring-slate-200"
    >
      <div className="flex flex-col w-full space-y-5">
        <div className="flex flex-col items-center space-y-2">
          <div className="items-center shadow-sm ring-2 ring-slate-200 rounded-full p-4">
            <Image
              alt="Icon"
              src="/icon.svg"
              height={160}
              width={40}
              priority
            />
          </div>
          <p className="text-md mb-4 text-slate-600 font-medium">{`Complete the form below to join the department's waitlist.`}</p>
        </div>

        <div>
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-slate-500"
          >
            First name
          </label>

          <input
            id="firstName"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            className="mt-2 w-full border rounded-xs border-slate-300 px-4 py-3 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            placeholder="First name"
          />
        </div>
        <div>
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-slate-500"
          >
            Last name
          </label>

          <input
            id="lastName"
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            className="mt-2 w-full border rounded-xs border-slate-300 px-4 py-3 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            placeholder="Last name"
          />
        </div>
        <div>
          <label
            htmlFor="reason"
            className="block text-sm font-medium text-slate-500"
          >
            Reason for visit
          </label>

          <select
            id="reason"
            value={reason}
            onChange={(event) => setReason(event.target.value as VisitReason)}
            className="mt-2 w-full text-slate-500 border rounded-xs border-slate-300 bg-white px-4 py-3 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          >
            <option className="text-slate-500" value="">
              Select a reason
            </option>

            {VISIT_REASONS.map((visitReason) => (
              <option
                className="text-slate-500"
                key={visitReason}
                value={visitReason}
              >
                {visitReason}
              </option>
            ))}
          </select>
        </div>
        {error && (
          <div className="bg-red-50 p-3 text-sm text-red-700">{error}</div>
        )}
        <button
          disabled={loading}
          className="w-full bg-sky-900 rounded-xs px-5 py-3 font-medium text-white hover:bg-sky-800 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
        >
          Complete
        </button>
      </div>
      <dialog
        ref={dialogRef}
        className="m-auto w-[calc(100%-2rem)] max-w-md border-0 bg-white p-0 shadow-xl ring-1 ring-slate-200 backdrop:bg-slate-900/30 backdrop:backdrop-blur-sm"
      >
        <div className="border-t-4 border-sky-900">
          <div className="p-8">
            <div className="flex flex-col items-center text-center">
              {/* Success indicator */}
              <div className="mb-5 flex h-14 w-14 items-center justify-center border-2 border-sky-200 bg-sky-50">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-7 w-7 text-sky-800"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m5 12 4 4L19 6"
                  />
                </svg>
              </div>

              <h2 className="text-lg font-semibold text-slate-700">
                You&apos;re checked in
              </h2>

              <div className="mt-3 h-px w-12 bg-slate-200" />

              <p className="mt-4 max-w-sm text-sm leading-6 text-slate-500">
                Please have a seat. A patient registration representative will
                be with you shortly.
              </p>

              <button
                type="button"
                onClick={handleClose}
                className="mt-7 w-full bg-sky-900 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </dialog>
    </form>
  );
}
