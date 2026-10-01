"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ReportData } from "@/lib/analytics";
import { Bar, BarChart } from "recharts";

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
      <div className="py-12 text-center text-slate-500">Loading report...</div>
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
        <h1 className="text-2xl font-medium text-slate-500 mt-8">
          OP Registration Department Report
        </h1>
        <div className="flex flex-wrap text-xs items-center gap-2 pb-4 mt-1">
          <Link
            href="/dashboard"
            className="text-sm text-slate-500 hover:underline hover:underline-text-600 hover:text-slate-600"
          >
            {`Return to Track Board`}
          </Link>
        </div>
      </div>

      <div className="bg-white p-6 bg-white shadow-sm ring-1 ring-slate-200">
        <h1 className="text-lg text-cyan-900">Key Department Metrics</h1>
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
        <h1 className="text-lg text-cyan-900">User Scorecard Metrics</h1>
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
        <h1 className="text-lg text-cyan-900">Department Traffic</h1>
        <p className="text-xs font-semibold text-slate-500">
          Patient Volume by Hour
        </p>

        <div className="mt-8 flex gap-3">
          {/* Y-Axis Section */}
          <div className="flex items-center gap-2 pb-8 pt-6">
            {/* Parallel Y-Axis Label */}
            <span className="-rotate-90 whitespace-nowrap text-xs font-semibold text-slate-500">
              Patients
            </span>

            {/* Y-Axis Tick Values */}
            <div className="flex h-52 flex-col justify-between text-right text-xs text-slate-500">
              <span>{report.maxHourlyCount}</span>
              <span>0</span>
            </div>
          </div>

          {/* Chart Area */}
          <div className="flex flex-1 flex-col">
            <div className="relative">
              {/* Y-Axis Arrow Pointer */}
              <div className="absolute -top-2 -left-[5px] z-10 h-0 w-0 border-x-4 border-b-[8px] border-x-transparent border-b-slate-400" />

              {/* X-Axis Arrow Pointer */}
              <div className="absolute -bottom-[5px] -right-2 z-10 h-0 w-0 border-y-4 border-l-[8px] border-y-transparent border-l-slate-400" />

              {/* Chart Container with Axis Lines & Subtle Background */}
              <div className="flex h-72 items-end gap-2 overflow-x-auto border-b-2 border-l-2 border-slate-400 bg-slate-50/50 pl-2">
                {Object.entries(report.peakHours).map(
                  ([hour, hourlyCount], idx) => {
                    const index = Number(hour);

                    const height =
                      report.maxHourlyCount > 0
                        ? (hourlyCount / report.maxHourlyCount) * 100
                        : 0;

                    return (
                      <div
                        key={hour}
                        className="flex min-w-12 flex-1 flex-col items-center justify-end gap-2"
                      >
                        <span className="text-xs font-medium text-slate-600">
                          {hourlyCount}
                        </span>

                        <div className="flex h-52 w-full items-end">
                          {/* Alternating Bar Colors */}
                          <div
                            className={`w-full ${
                              idx % 2 === 0 ? "bg-cyan-800" : "bg-cyan-600"
                            }`}
                            style={{ height: `${height}%` }}
                          />
                        </div>

                        <span className="text-xs text-slate-500">
                          {index.toString().padStart(2, "0")}:00
                        </span>
                      </div>
                    );
                  },
                )}
              </div>
            </div>

            {/* X-Axis Label */}
            <div className="mt-2 text-center">
              <span className="text-xs font-semibold text-slate-500">
                Hour of Day
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
