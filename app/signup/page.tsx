"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [role, setRole] = useState<"citizen" | "department">("citizen");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: normalizedEmail,
          password,
          confirmPassword,
          role,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Signup failed");
        setLoading(false);
        return;
      }

      router.push("/login");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-[#0b0f19]">
      <Navbar />

      <div className="relative mx-auto flex min-h-[calc(100svh-72px)] max-w-6xl items-center justify-center px-6 py-10">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_15%,rgba(29,155,240,0.22),transparent_40%),radial-gradient(circle_at_75%_0%,rgba(56,189,248,0.15),transparent_38%)]" />

        <div className="grid w-full max-w-4xl gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div className="hidden lg:block">
            <p className="text-sm font-medium uppercase tracking-[0.22em] text-sky-300/90">CIVICO</p>
            <h1 className="mt-4 text-4xl font-bold leading-tight text-white">
              Join the civic conversation.
            </h1>
            <p className="mt-4 max-w-md text-sm text-slate-300">
              Create a citizen or department account to report, track, and respond to local issues.
            </p>
          </div>

          <div className="w-full rounded-3xl border border-white/10 bg-black/40 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Create your account
            </h1>

            <div className="mt-5 grid grid-cols-2 gap-2 rounded-full bg-slate-900/90 p-1">
              <button
                type="button"
                onClick={() => setRole("citizen")}
                className={`rounded-full px-3 py-2 text-sm font-medium transition ${
                  role === "citizen"
                    ? "bg-sky-500 text-black"
                    : "text-slate-300 hover:bg-slate-800"
                }`}
              >
                Citizen
              </button>
              <button
                type="button"
                onClick={() => setRole("department")}
                className={`rounded-full px-3 py-2 text-sm font-medium transition ${
                  role === "department"
                    ? "bg-sky-500 text-black"
                    : "text-slate-300 hover:bg-slate-800"
                }`}
              >
                Department
              </button>
            </div>

            <p className="mt-3 text-xs text-slate-400">
              Creating account as: <span className="font-semibold capitalize text-sky-300">{role}</span>
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your name"
                  className="block w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2.5 text-sm text-white outline-none transition focus:border-sky-500"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@gmail.com"
                  className="block w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2.5 text-sm text-white outline-none transition focus:border-sky-500"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="block w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2.5 pr-10 text-sm text-white outline-none transition focus:border-sky-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-sky-300"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="block w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2.5 pr-10 text-sm text-white outline-none transition focus:border-sky-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-sky-300"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && <p className="text-center text-sm text-rose-400">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-sky-500 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creating account..." : `Create ${role === "citizen" ? "Citizen" : "Department"} account`}
              </button>

              <p className="text-center text-sm text-slate-400">
                Already have an account?{" "}
                <Link href="/login" className="font-medium text-sky-300 hover:underline">
                  Login here
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
