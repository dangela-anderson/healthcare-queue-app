"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ReportData } from "@/lib/analytics";
import { PeakHourChart } from "@/components/PeakHourChart";
import { ReasonChart } from "@/components/ReasonChart";

/**
 * Returns a formatted duration.
 * @param seconds - The duration in seconds.
 * @returns The duration in 00m 00s format.
 */
export function formatDuration(seconds: number): string {
  const totalSeconds = Math.max(0, Math.round(seconds));

  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;

  return `${mins.toString().padStart(2, "0")}m ${secs
    .toString()
    .padStart(2, "0")}s`;
}

export default function ReportDashboard() {
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);

  // Gets Report Data
  useEffect(() => {
    fetch("/api/analytics")
      .then((response) => response.json())
      .then((data) => {
        setReport(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  // Loading
  if (loading) {
    return (
      <div className="flex h-full w-full justify center items-center text-sm text-slate-600 p-6">
        Loading report...
      </div>
    );
  }

  // Error
  if (!report) {
    return (
      <div className="py-12 text-center text-red-600">
        Unable to load report.
      </div>
    );
  }

  return (
    <div>
      <div>
        <h1 className="text-2xl font-medium text-sky-700 mt-8">
          OP Registration Department Report
        </h1>
        <div className="flex flex-wrap text-xs items-center gap-2 pb-4 mt-1">
          <Link
            href="/dashboard"
            className="text-sm text-slate-500 hover:underline hover:underline-text-600 hover:text-slate-600"
          >
            {`<  Return to Track Board`}
          </Link>
        </div>
      </div>

      <div className="bg-white p-6 bg-white shadow-sm ring-1 ring-slate-200 rounded-xs">
        <h1 className="text-lg text-sky-900">Key Department Metrics</h1>
        <div className="flex flex-col text-xs bg-slate-white divide-y divide-slate-200 pb-4 gap-2 mt-3">
          <div className="flex justify-between pb-2 px-1 text-slate-600">
            <p className="text-xs font-semibold text-slate-500">
              Total Completed Visits:{" "}
            </p>
            <p className="text-slate-500">{report.totalCompletedRegs}</p>
          </div>
          <div className="flex justify-between pb-2 px-1 text-slate-600">
            <p className="text-xs font-semibold text-slate-500">
              Average Wait:{" "}
            </p>
            <p className="text-slate-500">
              {formatDuration(report.avgWaitDuration)}
            </p>
          </div>
          <div className="flex justify-between pb-2 px-1 text-slate-600">
            <p className="text-xs font-semibold text-slate-500">
              Average Service Time:{" "}
            </p>
            <p className="text-slate-500">
              {formatDuration(report.avgRegDuration)}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 bg-white shadow-sm ring-1 ring-slate-200">
        <h1 className="text-lg text-sky-900">User Scorecard Metrics</h1>
        <p className="text-xs font-semibold text-slate-500 mt-3 pb-2 border-b border-slate-200">
          Total Completed Registrations By User
        </p>
        <div className="flex flex-col text-xs bg-slate-white divide-y divide-slate-200 pb-4 gap-2 mt-3">
          {report.userScorecards.map((userScorecard) => {
            return (
              <div
                key={userScorecard.employeeId}
                className="flex justify-between pb-1 px-1 text-slate-600"
              >
                <p className="uppercase">
                  {userScorecard.lastName}, {userScorecard.firstName}
                </p>
                <p className="text-slate-500">
                  {userScorecard.totalCompletedRegs}
                </p>
              </div>
            );
          })}
        </div>
        <p className="text-xs font-semibold text-slate-500 border-b border-slate-200 pb-2">
          Average Service Time By User
        </p>
        <div className="flex flex-col text-xs bg-slate-white divide-y divide-slate-200 pb-4 gap-2 mt-3">
          {report.userScorecards.map((userScorecard) => {
            return (
              <div
                key={userScorecard.employeeId}
                className="flex justify-between pb-1 px-1 text-slate-600"
              >
                <p className="uppercase">
                  {userScorecard.lastName}, {userScorecard.firstName}
                </p>
                <p className="text-slate-500">
                  {formatDuration(userScorecard.avgRegDuration)}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h1 className="text-lg text-sky-900">Department Traffic</h1>
        <div>
          <p className="text-xs font-semibold text-slate-500">
            Patient Volume by Hour
          </p>
          <PeakHourChart data={report.peakHours} />
        </div>
      </div>
    </div>
  );
}
