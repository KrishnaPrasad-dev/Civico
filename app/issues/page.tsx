"use client";

import { useEffect, useState } from "react";

type Issue = {
  _id: string;
  title: string;
  description: string;
  status: "open" | "in_progress" | "resolved";
  createdAt: string;
  createdBy?: {
    fullname: string;
    email: string;
  };
};

export default function IssuesPage() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const res = await fetch("/api/issues", {
          method: "GET",
          cache: "no-store", // always get latest data
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch issues (${res.status})`);
        }

        const data = await res.json();

        // expected: { success: true, data: Issue[] }
        setIssues(data.data || []);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);

  /* -------------------- UI STATES -------------------- */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading issues...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">All Civic Issues</h1>

      {issues.length === 0 ? (
        <p className="text-slate-400">No issues found.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {issues.map((issue) => (
            <div
              key={issue._id}
              className="rounded-xl bg-slate-800/70 border border-slate-700 p-5"
            >
              <h2 className="text-xl font-semibold mb-1">
                {issue.title}
              </h2>

              <p className="text-slate-300 text-sm mb-4">
                {issue.description}
              </p>

              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="capitalize">
                  Status: {issue.status.replace("_", " ")}
                </span>
                <span>
                  {issue.createdBy?.fullname ?? "Anonymous"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
