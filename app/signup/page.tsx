"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          email,
          password,
          confirmPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Signup failed");
        setLoading(false);
        return;
      }

      // ✅ Signup success → redirect to login
      router.push("/login");
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen">
      <Navbar />

      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto ">
        <div className="absolute top-0 z-[-2] h-screen w-screen h-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />


        <h1 className="text-3xl font-bold leading-tight mb-4 md:mb-6 md:mt-12  relative  tracking-tight text-gray-900 md:text-4xl dark:text-white">
                Signup Page
              </h1>

        {/* Card */}
        <div className="relative w-full sm:max-w-md bg-gray-800 rounded-xl border border-white/10 shadow-lg">
          <div className="w-full bg-white rounded-lg shadow dark:bg-gray-950 dark:border-gray-900">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold text-white md:text-2xl">
                Create an account
              </h1>

              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                {/* Full Name */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-white">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="eg: Krishna Prasad"
                    className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg block w-full p-2.5"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-white">
                    Your email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@gmail.com"
                    className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg block w-full p-2.5"
                    required
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-white">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg block w-full p-2.5"
                    required
                  />
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-white">
                    Confirm password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg block w-full p-2.5"
                    required
                  />
                </div>

                {/* Error */}
                {error && (
                  <p className="text-sm text-red-500 text-center">{error}</p>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full text-white bg-indigo-600 hover:bg-indigo-700 font-medium rounded-lg text-sm px-5 py-2.5 disabled:opacity-50"
                >
                  {loading ? "Creating account..." : "Create an account"}
                </button>

                {/* Login link */}
                <p className="text-sm text-gray-400 text-center">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="text-indigo-500 hover:underline"
                  >
                    Login here
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
