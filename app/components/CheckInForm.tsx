"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { VISIT_REASONS } from "@/lib/constants";
import type { VisitReason } from "@/lib/types";

export default function CheckInForm() {
  const [firstName, setFirstName] = useState("");

  const [lastName, setLastName] = useState("");

  const [reason, setReason] = useState<VisitReason | "">("");

  const [queueNumber, setQueueNumber] = useState<number | null>(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

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
  }

  if (queueNumber !== null) {
    return (
      <div className="bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
        <div className="mx-auto flex h-16 w-16 items-center justify-center bg-green-100 text-2xl text-green-700">
          ✓
        </div>

        <h2 className="mt-6 text-2xl font-bold">Thank you for checking-in!</h2>

        <p className="mt-2 text-slate-600">
          Please have a seat! The registration staff will call you shortly.
        </p>

        <div className="mt-8">
          <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
            Average Department Wait Time
          </p>

          <p className="mt-2 text-6xl font-bold text-slate-900">WAIT TIME</p>
        </div>

        <button
          onClick={() => setQueueNumber(null)}
          className="mt-8 bg-slate-900 px-5 py-3 font-medium text-white hover:bg-slate-800"
        >
          Check in another patient
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 shadow-sm ring-1 ring-slate-200"
    >
      <div className="space-y-5">
        <div className="text-md mb-4 font-medium">
          Complete the form below to join the waitlist.
        </div>
        <div>
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-slate-700"
          >
            First name
          </label>

          <input
            id="firstName"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            className="mt-2 w-full border border-slate-300 px-4 py-3 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            placeholder="First name"
          />
        </div>
        <div>
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-slate-700"
          >
            Last name
          </label>

          <input
            id="lastName"
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            className="mt-2 w-full border border-slate-300 px-4 py-3 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            placeholder="Last name"
          />
        </div>
        <div>
          <label
            htmlFor="reason"
            className="block text-sm font-medium text-slate-700"
          >
            Reason for visit
          </label>

          <select
            id="reason"
            value={reason}
            onChange={(event) => setReason(event.target.value as VisitReason)}
            className="mt-2 w-full text-slate-700 border border-slate-300 bg-white px-4 py-3 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          >
            <option className="text-slate-700" value="">
              Select a reason
            </option>

            {VISIT_REASONS.map((visitReason) => (
              <option
                className="text-slate-700"
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
          className="w-full bg-slate-900 px-5 py-3 font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Complete
        </button>
      </div>
    </form>
  );
}
