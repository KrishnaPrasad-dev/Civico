"use client";

import Particles from "../../components/animations/Particles";
import { useEffect, useState } from "react";
import { ArrowBigUp, MoreHorizontal } from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import Image from "next/image";

type Issue = {
  _id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  votes: number;
  hasVoted: boolean;
  images?: string[];
  userId?: string;
};

type User = {
  id?: string;
  _id?: string;
  fullName?: string;
};

export default function IssuesPage() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }

    const loadIssues = async () => {
      try {
        const res = await fetch("/api/issues");
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id || user._id }),
      });
    } catch (error) {
      console.error("Vote failed", error);
    }
  };

  if (loading) {
    return (
      <p className="text-center text-slate-400 min-h-screen flex items-center justify-center">
        Loading issues...
      </p>
    );
  }

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* ===== PARTICLES BACKGROUND (UNCHANGED) ===== */}
      <div className="absolute inset-0 -z-10 w-full h-full pointer-events-none">
        <Particles
          className="h-full w-full"
          particleColors={["#4902ed"]}
          particleCount={220}
          particleSpread={10}
          speed={0.35}
          particleBaseSize={150}
          moveParticlesOnHover={false}
          alphaParticles={false}
          disableRotation={false}
          pixelRatio={1}
        />
      </div>

      <Navbar />

      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-6">
          Civic Issues Feed
        </h1>

        <div className="space-y-6">
          {issues.map((issue) => {
            const isOwner =
              currentUser &&
              (issue.userId === currentUser.id ||
                issue.userId === currentUser._id);

            return (
              <div
                key={issue._id}
                className="rounded-2xl border border-slate-700 bg-black/60 backdrop-blur-md p-4"
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-600/30 flex items-center justify-center text-indigo-400 font-bold">
                      {isOwner
                        ? currentUser?.fullName?.charAt(0)
                        : "C"}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-semibold">
                          {isOwner
                            ? currentUser?.fullName
                            : "Citizen"}
                        </span>
                        <span className="text-slate-500 text-sm">
                          · {new Date(issue.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <p className="text-slate-400 text-sm mt-1">
                        {issue.title}
                      </p>
                    </div>
                  </div>

                  <MoreHorizontal className="text-slate-500" size={18} />
                </div>

                {/* Content */}
                <div className="mt-3 pl-[52px]">
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {issue.description}
                  </p>

                  {/* 🖼️ Images (Twitter-style) */}
                  {issue.images && issue.images.length > 0 && (
                    <div
                      className={`mt-4 grid gap-2 ${
                        issue.images.length === 1
                          ? "grid-cols-1"
                          : "grid-cols-2"
                      }`}
                    >
                      {issue.images.map((img, i) => (
                        <div
                          key={i}
                          className="relative w-full aspect-[4/3] rounded-xl overflow-hidden"
                        >
                          <Image
                            src={img}
                            alt="Issue image"
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Meta */}
                  <div className="mt-3 text-xs text-slate-500">
                    Status:{" "}
                    <span className="capitalize text-indigo-400">
                      {issue.status.replace("_", " ")}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex items-center gap-6 text-slate-500">
                    <button
                      onClick={() => upvote(issue._id)}
                      disabled={issue.hasVoted}
                      className={`flex items-center gap-1 ${
                        issue.hasVoted
                          ? "text-indigo-400 cursor-not-allowed"
                          : "hover:text-indigo-400"
                      }`}
                    >
                      <ArrowBigUp size={18} />
                      <span className="text-sm">{issue.votes}</span>
                    </button>
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
