"use client";

import { useEffect, useState } from "react";

type Issue = {
  _id: string;
  title: string;
  description: string;
  status: string;
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
        const API_URL = process.env.NEXT_PUBLIC_API_URL;

        // 🔍 Hard check for env var
        if (!API_URL) {
          throw new Error("NEXT_PUBLIC_API_URL is not defined");
        }

        console.log("Fetching from 👉", `${API_URL}/issues`);

        const token = localStorage.getItem("token");

        const res = await fetch(`${API_URL}/issues`, {
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });

        // 🚨 Handle backend errors loudly
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`API Error ${res.status}: ${text}`);
        }

        const data = await res.json();

        console.log("API response 👉", data);

        // ✅ Adjust if backend response shape differs
        if (Array.isArray(data)) {
          setIssues(data);
        } else if (Array.isArray(data.data)) {
          setIssues(data.data);
        } else if (Array.isArray(data.issues)) {
          setIssues(data.issues);
        } else {
          throw new Error("Unexpected API response format");
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);

  // ⏳ Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading issues...
      </div>
    );
  }

  // ❌ Error state
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-red-400">
        <p className="text-lg font-semibold">Failed to load issues</p>
        <p className="mt-2 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">All Civic Issues</h1>

      {issues.length === 0 ? (
        <p className="text-slate-400">No issues found.</p>
      ) : (
        <div className="grid gap-4">
          {issues.map((issue) => (
            <div
              key={issue._id}
              className="rounded-xl bg-slate-800/70 border border-slate-700 p-4"
            >
              <h2 className="text-xl font-semibold">{issue.title}</h2>

              <p className="text-slate-300 mt-1">
                {issue.description}
              </p>

              <div className="flex justify-between mt-3 text-sm text-slate-400">
                <span>Status: {issue.status}</span>
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
