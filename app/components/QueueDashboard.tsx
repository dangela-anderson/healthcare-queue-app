"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { calculateDuration, formatDateTime, formatDuration } from "@/lib/utils";
import { QueueVisit } from "@/lib/types";

type FilterType = "ALL" | "WAITING" | "IN_PROGRESS";

export default function QueueDashboard() {
  const [visits, setVisits] = useState<QueueVisit[]>([]);
  const [selectedVisitId, setSelectedVisitId] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>("ALL");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [now, setNow] = useState(() => Date.now());
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  // Updated UI on 1-second interval for accurate wait and reg durations.
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // Refreshes the department queue.
  const refreshVisits = useCallback(() => {
    fetch("/api/queue")
      .then((response) => response.json())
      .then((data) => {
        setVisits(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(
          `API Error: Unable to retrieve the department queue, ${error}`,
        );
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const initialLoad = window.setTimeout(() => {
      refreshVisits();
    }, 0);

    // Subscribes to Supabase RealTime to get live visit updates.
    const channel = supabase
      .channel("queue-updates")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "visits",
        },
        () => {
          refreshVisits();
        },
      )
      .subscribe();

    return () => {
      window.clearTimeout(initialLoad);
      supabase.removeChannel(channel);
    };
  }, [refreshVisits, supabase]);

  // Checks if the selected visit is active.
  const selectedVisit = useMemo(
    () => visits.find((visit) => visit.id === selectedVisitId) ?? null,
    [visits, selectedVisitId],
  );

  // The number of visits waiting to be registered.
  const readyForRegCount = visits.filter(
    (visit) => visit.status === "WAITING",
  ).length;

  // The number of visits being registered.
  const inProgressCount = visits.filter(
    (visit) => visit.status === "IN_PROGRESS",
  ).length;

  // Used to filter the list by visit status
  const filteredVisits = useMemo(() => {
    switch (filter) {
      case "WAITING":
        return visits.filter((visit) => visit.status === "WAITING");

      case "IN_PROGRESS":
        return visits.filter((visit) => visit.status === "IN_PROGRESS");

      default:
        return visits;
    }
  }, [filter, visits]);

  function getAssignedName(visit: QueueVisit): string {
    if (!visit.assigned_employee) {
      return "N/A";
    }

    const firstName = visit.assigned_employee.first_name ?? "";

    const lastName = visit.assigned_employee.last_name ?? "";

    return `${lastName}, ${firstName}`.trim() || "N/A";
  }

  /**
   * If filtered by visit status "WAITING", gets formatted wait time.
   * If filtered by visit status is "IN_PROGRESS", gets formatted reg duration or N/A.
   * @returns formatted string of duration or N/A
   */
  function getDurationByFilter(visit: QueueVisit): string {
    const currentDateTime = new Date().toISOString();

    if (filter !== "IN_PROGRESS") {
      return formatDuration(
        calculateDuration(visit.created_at, currentDateTime),
      );
    } else {
      return visit.assigned_at
        ? formatDuration(calculateDuration(visit.assigned_at, currentDateTime))
        : "N/A";
    }
  }

  async function handleAssign() {
    if (!selectedVisit) {
      return;
    }

    if (selectedVisit.status !== "WAITING" || selectedVisit.assigned_to) {
      return;
    }

    setActionLoading(true);
    setError("");

    try {
      const response = await fetch("/api/queue/assign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          visitId: selectedVisit.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to assign patient.");
      }

      await refreshVisits();
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error ? err.message : "Failed to assign patient.",
      );
    } finally {
      setActionLoading(false);
    }
  }

  async function handleComplete() {
    if (!selectedVisit) {
      return;
    }

    if (selectedVisit.status !== "IN_PROGRESS" || !selectedVisit.assigned_to) {
      return;
    }

    setActionLoading(true);
    setError("");

    try {
      const response = await fetch("/api/queue/complete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          visitId: selectedVisit.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to complete registration.");
      }

      setSelectedVisitId(null);

      await refreshVisits();
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error ? err.message : "Failed to complete registration.",
      );
    } finally {
      setActionLoading(false);
    }
  }

  const assignDisabled =
    !selectedVisit ||
    selectedVisit.status !== "WAITING" ||
    Boolean(selectedVisit.assigned_to) ||
    actionLoading;

  const completeDisabled =
    !selectedVisit ||
    selectedVisit.status !== "IN_PROGRESS" ||
    !selectedVisit.assigned_to ||
    actionLoading;

  if (loading) {
    return <div className="p-6 text-sm text-slate-600">Loading queue...</div>;
  }

  return (
    <div>
      <div>
        <h1 className="text-2xl font-medium text-cyan-700 mt-8">
          OP Registration Track Board
        </h1>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap text-xs items-center border-b-1 border-slate-200 gap-2 pb-4 mt-1 mb-3">
        <button
          type="button"
          onClick={refreshVisits}
          disabled={actionLoading}
          className="border-r pr-2 border-slate-300 text-slate-500 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Refresh
        </button>

        <button
          type="button"
          onClick={handleAssign}
          disabled={assignDisabled}
          className="text-slate-500 enabled:hover:text-slate-700 disabled:cursor-not-allowed"
        >
          Assign
        </button>

        <button
          type="button"
          onClick={handleComplete}
          disabled={completeDisabled}
          className="text-slate-500 enabled:hover:text-slate-700 disabled:cursor-not-allowed"
        >
          Complete
        </button>

        <button
          type="button"
          onClick={() => router.push("/dashboard/reports")}
          className="border-l pl-2 border-slate-300 text-slate-500 hover:text-slate-700"
        >
          Open Report
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="border border-red-200 bg-red-50 px-2 py-1 text-sm text-red-700 mb-2">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-1 text-xs">
        <button
          type="button"
          onClick={() => setFilter("ALL")}
          className={`p-1 ${
            filter === "ALL"
              ? "bg-cyan-600 text-white"
              : "border border-slate-300 bg-white text-slate-500 hover:bg-cyan-50 hover:border-slate-400 transition-colors duration-300"
          }`}
        >
          All Patients ({visits.length})
        </button>

        <button
          type="button"
          onClick={() => setFilter("WAITING")}
          className={`p-1 ${
            filter === "WAITING"
              ? "bg-cyan-600 text-white"
              : "border border-slate-300 bg-white text-slate-500 hover:bg-cyan-50 hover:border-slate-400 transition-colors duration-300"
          }`}
        >
          Ready for Reg ({readyForRegCount})
        </button>

        <button
          type="button"
          onClick={() => setFilter("IN_PROGRESS")}
          className={`p-1 ${
            filter === "IN_PROGRESS"
              ? "bg-cyan-600 text-white"
              : "border border-slate-300 bg-white text-slate-500 hover:bg-cyan-50 hover:border-slate-400 transition-colors duration-300"
          }`}
        >
          In Progress ({inProgressCount})
        </button>
      </div>

      {/* Queue Table */}
      <div className="h-[500px] overflow-auto bg-white border border-slate-300 mt-2">
        <table className="w-full min-w-[900px] bg-white">
          <thead className="sticky top-0 z-10">
            <tr className="text-left text-xs divide-x border-b border-slate-300 divide-slate-300 text-slate-500">
              <th className="font-normal px-1 py-2">Patient</th>
              <th className="font-normal px-1 py-2">Arrival Time</th>
              <th className="font-normal px-1 py-2">Reason for Visit</th>

              {filter === "ALL" && (
                <th className="font-normal px-1 py-2">Reg Status</th>
              )}

              {(filter === "ALL" || filter === "IN_PROGRESS") && (
                <th className="font-normal px-1 py-2">Assigned To</th>
              )}

              <th className="font-normal px-1 py-2">
                {filter === "IN_PROGRESS" ? "Reg Time Elapsed" : "Time Elapsed"}
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200">
            {filteredVisits.map((visit) => {
              return (
                <tr
                  key={visit.id}
                  onClick={() =>
                    setSelectedVisitId(
                      selectedVisitId === visit.id ? null : visit.id,
                    )
                  }
                  className={`cursor-pointer transition hover:bg-slate-100 ${
                    selectedVisitId === visit.id ? "bg-slate-100 " : ""
                  }`}
                >
                  <td className="px-1 py-2 text-xs border-y-1 uppercase border-r-1 border-slate-200 text-slate-500">
                    {visit.last_name}, {visit.first_name}
                  </td>

                  <td className="px-1 py-2 text-xs border-1 border-slate-200 text-slate-500">
                    {formatDateTime(visit.created_at)}
                  </td>

                  <td className="px-1 py-2 text-xs border-1 border-slate-200 text-slate-500">
                    {visit.reason}
                  </td>

                  {filter === "ALL" && (
                    <td className="px-1 py-2 border-1 border-slate-200">
                      <span className="inline-flex text-xs text-slate-500">
                        {visit.status === "IN_PROGRESS"
                          ? "In Progress"
                          : "Ready for Reg"}
                      </span>
                    </td>
                  )}

                  {(filter === "ALL" || filter === "IN_PROGRESS") && (
                    <td className="px-1 py-2 text-xs border-1 border-slate-200 text-slate-500 uppercase">
                      {getAssignedName(visit)}
                    </td>
                  )}

                  <td className="px-1 py-2 text-xs border-y-1 border-l-1 border-slate-200 text-slate-500">
                    {getDurationByFilter(visit)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
