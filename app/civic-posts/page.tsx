"use client";

import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import { BadgeCheck, Megaphone, ShieldAlert, Scale, Building2, MessageCircle } from "lucide-react";

type CivicPost = {
  _id: string;
  title: string;
  body: string;
  departmentId: string;
  departmentName: string;
  category: "official_update" | "law_update" | "myth_buster";
  truthLabel: "real" | "fake" | "advisory";
  createdAt: string;
  comments?: {
    userId: string;
    userName: string;
    text: string;
    createdAt: string;
  }[];
};

type Department = {
  _id: string;
  fullName: string;
  email: string;
  city?: string;
  state?: string;
  bio?: string;
  isVerified?: boolean;
};

export default function CivicPostsPage() {
  const [posts, setPosts] = useState<CivicPost[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [openDiscussionId, setOpenDiscussionId] = useState<string | null>(null);
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});
  const [submittingCommentId, setSubmittingCommentId] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState<CivicPost["category"]>("official_update");
  const [truthLabel, setTruthLabel] = useState<CivicPost["truthLabel"]>("advisory");
  const [submitting, setSubmitting] = useState(false);

  const currentUser = useMemo(() => {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);

  const canPost = currentUser?.role === "department" || currentUser?.role === "admin";

  useEffect(() => {
    const load = async () => {
      try {
        const [postsRes, deptsRes] = await Promise.all([
          fetch("/api/civic-posts"),
          fetch("/api/departments"),
        ]);

        const postsData = await postsRes.json();
        const deptsData = await deptsRes.json();

        setPosts(postsData.data || []);
        setDepartments(deptsData.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const submitPost = async () => {
    const cleanTitle = title.trim();
    const cleanBody = body.trim();

    if (!cleanTitle || !cleanBody || !currentUser) {
      setMessage("Please fill all post fields.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/civic-posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: cleanTitle,
          body: cleanBody,
          category,
          truthLabel,
          departmentId: currentUser.id || currentUser._id,
          departmentName: currentUser.fullName,
          role: currentUser.role,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Failed to publish post.");
        return;
      }

      setPosts((prev) => [data.data, ...prev]);
      setTitle("");
      setBody("");
      setCategory("official_update");
      setTruthLabel("advisory");
      setMessage("Update posted.");
    } catch (error) {
      console.error(error);
      setMessage("Failed to publish post.");
    } finally {
      setSubmitting(false);
      window.setTimeout(() => setMessage(""), 1800);
    }
  };

  const toggleDiscussion = (postId: string) => {
    setOpenDiscussionId((prev) => (prev === postId ? null : postId));
  };

  const submitComment = async (postId: string) => {
    const text = (commentDrafts[postId] || "").trim();
    if (!text) return;

    if (!currentUser) {
      setMessage("Please login to comment.");
      window.setTimeout(() => setMessage(""), 1800);
      return;
    }

    const userId = currentUser.id || currentUser._id;
    const userName = currentUser.fullName || "Citizen";

    const optimisticComment = {
      userId,
      userName,
      text,
      createdAt: new Date().toISOString(),
    };

    const previousPosts = posts;

    setPosts((prev) =>
      prev.map((post) =>
        post._id === postId
          ? { ...post, comments: [...(post.comments || []), optimisticComment] }
          : post
      )
    );
    setCommentDrafts((prev) => ({ ...prev, [postId]: "" }));
    setSubmittingCommentId(postId);

    try {
      const res = await fetch(`/api/civic-posts/comment/${postId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, userName, text }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Failed to add comment.");
        setPosts(previousPosts);
        setCommentDrafts((prev) => ({ ...prev, [postId]: text }));
        return;
      }

      setPosts((prev) =>
        prev.map((post) => {
          if (post._id !== postId) return post;
          const nextComments = [...(post.comments || [])];
          nextComments[nextComments.length - 1] = data.comment;
          return { ...post, comments: nextComments };
        })
      );
      setMessage("Comment added.");
    } catch (error) {
      console.error(error);
      setPosts(previousPosts);
      setCommentDrafts((prev) => ({ ...prev, [postId]: text }));
      setMessage("Failed to add comment.");
    } finally {
      setSubmittingCommentId(null);
      window.setTimeout(() => setMessage(""), 1800);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-[#0f131d] via-[#0b0e15] to-[#080a10] text-white">
      <Navbar />

      <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[1.6fr_1fr] md:px-6">
        <main className="rounded-2xl border border-white/10 bg-[#0a0d14]/85">
          <div className="border-b border-white/10 px-5 py-4">
            <h1 className="text-xl font-bold">Civic Posts</h1>
            <p className="mt-1 text-sm text-gray-400">
              Official department updates, law notices, and real-vs-fake clarifications.
            </p>
          </div>

          {canPost && (
            <div className="border-b border-white/10 px-5 py-4">
              <h2 className="text-sm font-semibold text-sky-300">Department Publisher</h2>

              <div className="mt-3 space-y-3">
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Post title"
                  className="w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-sm text-white outline-none"
                />
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Write update, advisory, or fact-check note..."
                  rows={4}
                  className="w-full resize-none rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-sm text-white outline-none"
                />

                <div className="grid gap-2 sm:grid-cols-2">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as CivicPost["category"])}
                    className="rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-sm text-white outline-none"
                  >
                    <option value="official_update">Official Update</option>
                    <option value="law_update">Law Update</option>
                    <option value="myth_buster">Myth Buster</option>
                  </select>

                  <select
                    value={truthLabel}
                    onChange={(e) => setTruthLabel(e.target.value as CivicPost["truthLabel"])}
                    className="rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-sm text-white outline-none"
                  >
                    <option value="advisory">Advisory</option>
                    <option value="real">Real / Verified</option>
                    <option value="fake">Fake / Misleading</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-xs text-sky-300">{message}</p>
                  <button
                    onClick={submitPost}
                    disabled={submitting}
                    className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-70"
                  >
                    {submitting ? "Posting..." : "Publish Post"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {!canPost && (
            <div className="border-b border-white/10 px-5 py-4 text-sm text-gray-400">
              Departments and admins can publish official posts here.
            </div>
          )}

          {loading && <div className="px-5 py-10 text-sm text-gray-400">Loading posts...</div>}

          {!loading && posts.length === 0 && (
            <div className="px-5 py-10 text-sm text-gray-400">No civic posts yet.</div>
          )}

          <div>
            {posts.map((post) => (
              <article key={post._id} className="border-b border-white/10 px-5 py-4">
                <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400">
                  <span className="font-semibold text-white">{post.departmentName}</span>
                  <span>· {new Date(post.createdAt).toLocaleDateString()}</span>
                </div>

                <h3 className="mt-2 text-base font-semibold text-white">{post.title}</h3>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-gray-200">{post.body}</p>

                <div className="mt-3 flex flex-wrap gap-2">
                  <Tag text={post.category.replace("_", " ")} tone="blue" icon={<Megaphone size={13} />} />
                  <Tag
                    text={post.truthLabel === "fake" ? "fake info" : post.truthLabel === "real" ? "verified" : "advisory"}
                    tone={post.truthLabel === "fake" ? "red" : post.truthLabel === "real" ? "green" : "yellow"}
                    icon={post.truthLabel === "fake" ? <ShieldAlert size={13} /> : <BadgeCheck size={13} />}
                  />
                </div>

                <div className="mt-4">
                  <button
                    onClick={() => toggleDiscussion(post._id)}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-xs text-gray-300 hover:border-sky-400/40 hover:text-sky-300"
                  >
                    <MessageCircle size={14} />
                    Discuss
                    <span className="text-gray-500">{post.comments?.length || 0}</span>
                  </button>
                </div>

                {openDiscussionId === post._id && (
                  <div className="mt-4 rounded-xl border border-white/10 bg-black/30 p-3">
                    <div className="space-y-3">
                      {(post.comments || []).length === 0 && (
                        <p className="text-xs text-gray-400">No comments yet. Start the discussion.</p>
                      )}

                      {(post.comments || []).map((comment, index) => (
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
                        value={commentDrafts[post._id] || ""}
                        onChange={(e) =>
                          setCommentDrafts((prev) => ({
                            ...prev,
                            [post._id]: e.target.value,
                          }))
                        }
                        placeholder="Write a comment..."
                        className="min-h-[68px] flex-1 resize-none rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-sm text-white outline-none placeholder:text-gray-500"
                      />
                      <button
                        onClick={() => submitComment(post._id)}
                        disabled={submittingCommentId === post._id}
                        className="rounded-md bg-sky-500 px-3 py-2 text-sm font-semibold text-black hover:bg-sky-400 disabled:opacity-70"
                      >
                        {submittingCommentId === post._id ? "..." : "Post"}
                      </button>
                    </div>
                  </div>
                )}
              </article>
            ))}
          </div>
        </main>

        <aside id="departments" className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-[#111623]/75 p-4">
            <h2 className="text-base font-semibold">Department Profiles</h2>
            <p className="mt-1 text-xs text-gray-400">
              Verified departments publishing civic and legal updates.
            </p>
          </div>

          {departments.length === 0 && (
            <div className="rounded-2xl border border-white/10 bg-[#111623]/75 p-4 text-sm text-gray-400">
              No departments found.
            </div>
          )}

          {departments.map((dept) => (
            <div key={dept._id} className="rounded-2xl border border-white/10 bg-[#111623]/75 p-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-full bg-sky-900/40 text-sky-300">
                  <Building2 size={16} />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-semibold text-white">{dept.fullName}</h3>
                    {dept.isVerified && (
                      <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
                        verified
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-gray-400">{dept.email}</p>
                  {(dept.city || dept.state) && (
                    <p className="mt-1 text-xs text-gray-400">
                      {dept.city || ""}{dept.city && dept.state ? ", " : ""}{dept.state || ""}
                    </p>
                  )}
                  {dept.bio && <p className="mt-2 text-xs text-gray-300">{dept.bio}</p>}
                </div>
              </div>
            </div>
          ))}

          <div className="rounded-2xl border border-white/10 bg-[#111623]/75 p-4 text-xs text-gray-300">
            <div className="flex items-center gap-2 text-sky-300">
              <Scale size={14} />
              Law + Fact Guidance
            </div>
            <p className="mt-2 text-gray-400">
              Posts labeled as verified/advisory/fake help citizens identify trustworthy legal updates and avoid misinformation.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}

function Tag({
  text,
  tone,
  icon,
}: {
  text: string;
  tone: "blue" | "green" | "yellow" | "red";
  icon: React.ReactNode;
}) {
  const toneClass = {
    blue: "bg-blue-500/15 text-blue-300 border-blue-500/25",
    green: "bg-emerald-500/15 text-emerald-300 border-emerald-500/25",
    yellow: "bg-amber-500/15 text-amber-300 border-amber-500/25",
    red: "bg-rose-500/15 text-rose-300 border-rose-500/25",
  };

  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] capitalize ${toneClass[tone]}`}>
      {icon}
      {text}
    </span>
  );
}
