"use client";

import { useEffect, useState } from "react";
import { ArrowBigUp, ArrowBigDown } from "lucide-react";
import Navbar from "../../components/layout/Navbar";

type Issue = {
  _id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  votes: number;
};

export default function IssuesPage() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadIssues = async () => {
      try {
        const res = await fetch("/api/issues");
        const data = await res.json();

        if (!isMounted) return;

        const sorted = (data.data || []).sort(
          (a: Issue, b: Issue) => b.votes - a.votes
        );

        setIssues(sorted);
        setLoading(false);
      } catch (error) {
        console.error("Failed to load issues", error);
        if (isMounted) setLoading(false);
      }
    };

    loadIssues();

    return () => {
      isMounted = false;
    };
  }, []);

  const vote = async (issueId: string, value: 1 | -1) => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      // ✅ FIXED URL
      await fetch(`/api/issues/vote/${issueId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          vote: value,
        }),
      });

      // 🔄 refresh issues after vote
      const res = await fetch("/api/issues");
      const data = await res.json();

      const sorted = (data.data || []).sort(
        (a: Issue, b: Issue) => b.votes - a.votes
      );

      setIssues(sorted);
    } catch (err) {
      console.error("Voting failed", err);
    }
  };

  if (loading) {
    return <p className="text-center text-slate-400">Loading issues...</p>;
  }

  return (
    <section className="min-h-screen bg-slate-950">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">
          Civic Issues Feed
        </h1>

        <div className="space-y-4">
          {issues.map((issue, index) => {
            const isTop = index < 3;

            return (
              <div
                key={issue._id}
                className={`flex gap-4 rounded-xl border p-5 transition
                  ${
                    isTop
                      ? "border-indigo-500/60 bg-indigo-500/5 shadow-lg"
                      : "border-slate-800 bg-slate-900/60"
                  }`}
              >
                {/* Vote Column */}
                <div className="flex flex-col items-center gap-1 text-slate-400">
                  <button
                    onClick={() => vote(issue._id, 1)}
                    className="hover:text-indigo-400 transition"
                  >
                    <ArrowBigUp size={24} />
                  </button>

                  <span className="font-semibold text-white">
                    {issue.votes}
                  </span>

                  <button
                    onClick={() => vote(issue._id, -1)}
                    className="hover:text-rose-400 transition"
                  >
                    <ArrowBigDown size={24} />
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-white">
                    {issue.title}
                  </h2>

                  <p className="text-slate-400 mt-1 text-sm">
                    {issue.description}
                  </p>

                  <div className="mt-3 text-xs text-slate-500 flex gap-4">
                    <span>Status: {issue.status}</span>
                    <span>
                      {new Date(issue.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
