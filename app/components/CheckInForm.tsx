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
    } catch (err) {
      console.error(err);

      setError("Unable to check in. Please try again.");
    } finally {
      setLoading(false);
    }
    dialogRef.current?.showModal();
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
        className="m-auto max-w-sm backdrop:bg-black/20 backdrop:backdrop-blur-sm items-center bg-white p-8 shadow-md rounded-xs ring-1 ring-slate-200"
        ref={dialogRef}
      >
        <div className="text-center space-y-4">
          <p className="text-md mb-4 text-slate-600 font-medium">{`You're checked-in!`}</p>
          <p className="text-sm font-medium text-slate-500">
            Please have a seat and a patient registration representative will be
            with you shortly
          </p>
          <button
            className="w-full bg-sky-900 rounded-xs px-5 mt-8 py-3 font-medium text-white hover:bg-sky-800 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            onClick={handleClose}
          >
            Close
          </button>
        </div>
      </dialog>
    </form>
  );
}
