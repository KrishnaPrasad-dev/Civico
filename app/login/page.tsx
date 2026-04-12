"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);
  const [role, setRole] = useState<"citizen" | "department">("citizen");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setError("");
    setLoading(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: normalizedEmail, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        setLoading(false);
        return;
      }

      // ✅ Store token + user (temporary approach)
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      const redirectParam = new URLSearchParams(window.location.search).get("redirect");
      const redirectTo = redirectParam && redirectParam.startsWith("/") ? redirectParam : "/dashboard";

      // ✅ Redirect after login
      router.push(redirectTo);
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
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_20%,rgba(29,155,240,0.25),transparent_40%),radial-gradient(circle_at_85%_0%,rgba(56,189,248,0.18),transparent_35%)]" />

        <div className="grid w-full max-w-4xl gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div className="hidden lg:block">
            <p className="text-sm font-medium uppercase tracking-[0.22em] text-sky-300/90">CIVICO</p>
            <h1 className="mt-4 text-4xl font-bold leading-tight text-white">
              See what&apos;s happening in your city.
            </h1>
            <p className="mt-4 max-w-md text-sm text-slate-300">
              Login as a citizen or department and collaborate on civic issues with transparent updates.
            </p>
          </div>

          <div className="w-full rounded-3xl border border-white/10 bg-black/40 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Sign in to CIVICO
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
              Signing in as: <span className="font-semibold capitalize text-sky-300">{role}</span>
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
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
                    type={show ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="block w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2.5 pr-10 text-sm text-white outline-none transition focus:border-sky-500"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShow(!show)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-sky-300"
                  >
                    {show ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && <p className="text-center text-sm text-rose-400">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-sky-500 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Logging in..." : `Login as ${role === "citizen" ? "Citizen" : "Department"}`}
              </button>

              <p className="text-center text-sm text-slate-400">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="font-medium text-sky-300 hover:underline">
                  Sign up here
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
