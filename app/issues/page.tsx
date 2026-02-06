"use client";

import { useEffect, useState } from "react";
import { ArrowBigUp } from "lucide-react";
import Navbar from "../../components/layout/Navbar";

type Issue = {
  _id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  votes: number;
  hasVoted: boolean;
};

export default function IssuesPage() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadIssues = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");

        const res = await fetch("/api/issues", {
          headers: {
            "x-user-id": user.id || "",
          },
        });

        const data = await res.json();
        setIssues(data.data || []);
      } catch (error) {
        console.error("Failed to load issues", error);
      } finally {
        setLoading(false);
      }
    };

    loadIssues();
  }, []);

  const upvote = async (issueId: string) => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    // ⚡ Optimistic UI (instant)
    setIssues((prev) =>
      prev.map((issue) =>
        issue._id === issueId && !issue.hasVoted
          ? { ...issue, votes: issue.votes + 1, hasVoted: true }
          : issue
      )
    );

    try {
      await fetch(`/api/issues/vote/${issueId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user.id }),
      });
    } catch (error) {
      console.error("Vote failed", error);
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
                {/* Upvote */}
                <div className="flex flex-col items-center gap-1">
                  <button
                    onClick={() => upvote(issue._id)}
                    disabled={issue.hasVoted}
                    className={`transition ${
                      issue.hasVoted
                        ? "text-indigo-400 cursor-not-allowed"
                        : "text-slate-400 hover:text-indigo-400"
                    }`}
                  >
                    <ArrowBigUp size={26} />
                  </button>

                  <span className="font-semibold text-white">
                    {issue.votes}
                  </span>
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
