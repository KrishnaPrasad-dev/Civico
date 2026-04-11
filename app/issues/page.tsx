"use client";

import { useEffect, useState } from "react";
import { ThumbsUp, MessageCircle, Repeat2, Search } from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import Image from "next/image";
import { useRouter } from "next/navigation";

type Issue = {
  _id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  votes: number;
  hasVoted?: boolean;
  images?: string[];
  userId: string;
  userName?: string;
  comments?: {
    userId: string;
    userName: string;
    text: string;
    createdAt: string;
  }[];
};

export default function IssuesPage() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState("");
  const [openDiscussionId, setOpenDiscussionId] = useState<string | null>(null);
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});
  const [submittingCommentId, setSubmittingCommentId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
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

  const likeIssue = async (issueId: string) => {
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
        body: JSON.stringify({ userId: user._id || user.id }),
      });
    } catch (err) {
      console.error("Like failed", err);
    }
  };

  const buildIssueShareData = (issue: Issue) => {
    const issueUrl = `${window.location.origin}/issues#issue-${issue._id}`;
    const title = `CIVICO Issue: ${issue.title}`;
    const text = `${issue.title}\n\n${issue.description.slice(0, 180)}${
      issue.description.length > 180 ? "..." : ""
    }`;

    return { issueUrl, title, text };
  };

  const handleShareIssue = async (issue: Issue) => {
    try {
      const { issueUrl, title, text } = buildIssueShareData(issue);

      if (navigator.share) {
        await navigator.share({ title, text, url: issueUrl });
        setActionMessage("Issue shared successfully.");
      } else {
        await navigator.clipboard.writeText(`${title}\n${text}\n${issueUrl}`);
        setActionMessage("Issue link copied to clipboard.");
      }
    } catch (err) {
      console.error("Share failed", err);
      setActionMessage("Could not share right now.");
    } finally {
      window.setTimeout(() => setActionMessage(""), 1800);
    }
  };

  const toggleDiscussion = (issueId: string) => {
    setOpenDiscussionId((prev) => (prev === issueId ? null : issueId));
  };

  const handleCommentChange = (issueId: string, text: string) => {
    setCommentDrafts((prev) => ({ ...prev, [issueId]: text }));
  };

  const submitComment = async (issueId: string) => {
    const text = (commentDrafts[issueId] || "").trim();
    if (!text) return;

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = user._id || user.id;
    const userName = user.fullName || "Citizen";

    if (!userId) {
      setActionMessage("Please login to comment.");
      window.setTimeout(() => setActionMessage(""), 1800);
      router.push("/login?redirect=/issues");
      return;
    }

    const optimisticComment = {
      userId,
      userName,
      text,
      createdAt: new Date().toISOString(),
    };

    const previousIssues = issues;

    setIssues((prev) =>
      prev.map((issue) =>
        issue._id === issueId
          ? {
              ...issue,
              comments: [...(issue.comments || []), optimisticComment],
            }
          : issue
      )
    );
    setCommentDrafts((prev) => ({ ...prev, [issueId]: "" }));

    setSubmittingCommentId(issueId);

    try {
      const res = await fetch(`/api/issues/comment/${issueId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, userName, text }),
      });

      const data = await res.json();

      if (!res.ok) {
        setActionMessage(data.message || "Failed to add comment.");
        setIssues(previousIssues);
        setCommentDrafts((prev) => ({ ...prev, [issueId]: text }));
        return;
      }

      setIssues((prev) =>
        prev.map((issue) => {
          if (issue._id !== issueId) return issue;

          const nextComments = [...(issue.comments || [])];
          nextComments[nextComments.length - 1] = data.comment;

          return {
            ...issue,
            comments: nextComments,
          };
        })
      );
      setActionMessage("Comment added.");
    } catch (err) {
      console.error("Comment failed", err);
      setActionMessage("Failed to add comment.");
      setIssues(previousIssues);
      setCommentDrafts((prev) => ({ ...prev, [issueId]: text }));
    } finally {
      setSubmittingCommentId(null);
      window.setTimeout(() => setActionMessage(""), 1800);
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
    <section className="min-h-screen bg-gradient-to-b from-[#0f131d] via-[#0b0e15] to-[#080a10] text-white">
      <Navbar />

      <div className="mx-auto flex w-full max-w-7xl gap-6 px-4 py-6 md:px-6">
        <aside className="sticky top-24 hidden h-fit w-72 rounded-2xl border border-white/10 bg-neutral-950/70 p-5 lg:block">
          <h2 className="text-lg font-semibold">Discover</h2>
          <p className="mt-2 text-sm text-gray-400">
            Follow local civic updates and trending community reports.
          </p>
          <button
            onClick={() => router.push("/raise-issue")}
            className="mt-5 w-full rounded-full bg-sky-500 px-4 py-2.5 font-semibold text-black transition hover:bg-sky-400"
          >
            Post an Issue
          </button>
        </aside>

        <main className="min-w-0 flex-1 overflow-hidden rounded-2xl border border-white/10 bg-[#0a0d14]/85">
          <div className="sticky top-0 z-10 border-b border-white/10 bg-[#0f131c]/90 px-4 py-3 backdrop-blur-md">
            <h1 className="text-xl font-bold">Civic Feed</h1>
            <p className="mt-1 text-sm text-gray-400">Live reports from your city</p>
            {actionMessage && (
              <p className="mt-2 text-xs font-medium text-sky-300">{actionMessage}</p>
            )}
          </div>

          {issues.length === 0 && (
            <div className="px-6 py-16 text-center">
              <p className="text-lg font-medium">No issues yet</p>
              <p className="mt-2 text-sm text-gray-400">Be the first to post what needs attention.</p>
            </div>
          )}

          {issues.map((issue) => (
            <article id={`issue-${issue._id}`} key={issue._id} className="border-b border-white/10 px-4 py-4 sm:px-6">
              <div className="flex gap-3">
                <button
                  onClick={() => router.push(`/dashboard?userId=${issue.userId}`)}
                  className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sky-900/40 text-sm font-semibold text-sky-300"
                >
                  {(issue.userName || "Citizen").charAt(0).toUpperCase()}
                </button>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <button
                      onClick={() => router.push(`/dashboard?userId=${issue.userId}`)}
                      className="font-semibold hover:underline"
                    >
                      {issue.userName || "Citizen"}
                    </button>
                    <span className="text-sm text-gray-500">@{issue.userId.slice(0, 8)}</span>
                    <span className="text-sm text-gray-500">· {new Date(issue.createdAt).toLocaleDateString()}</span>
                    <span className="rounded-full bg-sky-500/15 px-2 py-0.5 text-xs font-medium capitalize text-sky-300">
                      {issue.status.replace("_", " ")}
                    </span>
                  </div>

                  <h2 className="mt-1 text-base font-semibold text-white">{issue.title}</h2>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-gray-200">
                    {issue.description}
                  </p>

                  {issue.images && issue.images.length > 0 && (
                    <div className={`mt-3 grid gap-2 ${issue.images.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
                      {issue.images.map((img, i) => (
                        <div key={i} className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10">
                          <Image src={img} alt="Issue image" fill unoptimized className="object-cover" />
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-4 flex items-center justify-between text-gray-400">
                    <button
                      onClick={() => toggleDiscussion(issue._id)}
                      className="flex items-center gap-2 rounded-full px-3 py-1.5 text-sm transition hover:bg-white/5 hover:text-sky-300"
                    >
                      <MessageCircle size={16} />
                      <span>Discuss</span>
                      <span className="text-xs text-gray-500">{issue.comments?.length || 0}</span>
                    </button>

                    <button
                      onClick={() => handleShareIssue(issue)}
                      className="flex items-center gap-2 rounded-full px-3 py-1.5 text-sm transition hover:bg-white/5 hover:text-emerald-300"
                    >
                      <Repeat2 size={16} />
                      <span>Share</span>
                    </button>

                    <button
                      onClick={() => likeIssue(issue._id)}
                      disabled={issue.hasVoted}
                      className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm transition ${
                        issue.hasVoted
                          ? "cursor-not-allowed text-sky-300"
                          : "hover:bg-white/5 hover:text-sky-300"
                      }`}
                    >
                      <ThumbsUp size={16} className={issue.hasVoted ? "fill-sky-300" : "fill-transparent"} />
                      <span>{issue.votes}</span>
                    </button>
                  </div>

                  {openDiscussionId === issue._id && (
                    <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3">
                      <h3 className="text-sm font-semibold text-white">Discussion</h3>

                      <div className="mt-3 space-y-3">
                        {(issue.comments || []).length === 0 && (
                          <p className="text-xs text-gray-400">No comments yet. Start the discussion.</p>
                        )}

                        {(issue.comments || []).map((comment, index) => (
                          <div key={`${comment.userId}-${index}`} className="rounded-lg border border-white/10 bg-black/40 p-2.5">
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-xs font-semibold text-sky-300">{comment.userName}</p>
                              <p className="text-[11px] text-gray-500">{new Date(comment.createdAt).toLocaleString()}</p>
                            </div>
                            <p className="mt-1 text-sm text-gray-200">{comment.text}</p>
                          </div>
                        ))}
                      </div>

                      <div className="mt-3 flex items-start gap-2">
                        <textarea
                          rows={2}
                          value={commentDrafts[issue._id] || ""}
                          onChange={(e) => handleCommentChange(issue._id, e.target.value)}
                          placeholder="Write a comment..."
                          className="min-h-[72px] flex-1 resize-none rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-sm text-white outline-none placeholder:text-gray-500 focus:border-sky-500"
                        />
                        <button
                          onClick={() => submitComment(issue._id)}
                          disabled={submittingCommentId === issue._id}
                          className="rounded-md bg-sky-500 px-3 py-2 text-sm font-semibold text-black transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                          {submittingCommentId === issue._id ? "..." : "Post"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))}
        </main>

        <aside className="sticky top-24 hidden h-fit w-80 space-y-4 xl:block">
          <div className="rounded-2xl border border-white/10 bg-neutral-950/70 p-4">
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black px-3 py-2 text-sm text-gray-400">
              <Search size={14} />
              Search issues
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-neutral-950/70 p-4">
            <h3 className="text-base font-semibold">Trending Topics</h3>
            <ul className="mt-3 space-y-3 text-sm text-gray-300">
              <li>#RoadSafety</li>
              <li>#StreetLights</li>
              <li>#WaterSupply</li>
              <li>#WasteManagement</li>
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
}
