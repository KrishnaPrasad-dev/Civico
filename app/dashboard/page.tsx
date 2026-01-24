"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  return (
    <section className="min-h-screen bg-neutral-950 text-white">
      <Navbar />

      <div className="flex flex-col items-center justify-center h-[80vh] text-center px-6">
        <h1 className="text-4xl font-bold mb-4">
          You’re Logged In ✅
        </h1>

        <p className="text-gray-400 text-lg max-w-md">
          CIVICO is under active development.  
          More features are coming very soon 🚀
        </p>

        <button
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            router.push("/login");
          }}
          className="mt-10 px-6 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>
    </section>
  );
}
