"use client";
import { useState } from "react";
import RoleCard from "../ui/RoleCard";

export default function Hero() {
  const [text, setText] = useState("");

  return (
    <section className="relative min-h-[90vh]  flex flex-col items-center justify-center text-white px-6">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-indigo-900 via-black to-indigo-800" />

      {/* Badge */}
      <div className="mb-6 flex mt-10 items-center gap-2 border border-white/20 px-4 py-1 rounded-full text-sm">
        <span className="bg-indigo-600 px-3 py-1 rounded-full text-xs">
          NEW
        </span>
        <span>Report. Track. Resolve.</span>
      </div>

      {/* Heading */}
      <h1 className="text-center text-4xl md:text-6xl font-semibold max-w-3xl">
        Modernizing How Civic Issues Are Handled
      </h1>

      {/* Subheading */}
      <p className="text-center text-gray-300 mt-4 max-w-xl">
        CIVICO connects citizens, departments, and administrators
        to resolve local issues transparently and efficiently.
      </p>

      {/* Input */}
      <div className="w-full max-w-xl mt-10 bg-white/10 border border-white/20 rounded-xl p-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          placeholder="Describe a civic issue you want to report..."
          className="w-full bg-transparent outline-none resize-none text-gray-200 placeholder-gray-400"
        />

        <button className="mt-4 ml-auto block bg-indigo-600 hover:bg-indigo-700 transition px-6 py-2 rounded-md">
          Get Started
        </button>
      </div>

      <section className="py-24 px-6 text-white">
  <h2 className="text-center text-3xl md:text-4xl font-semibold">
    Built for everyone involved
  </h2>

  <p className="text-center text-gray-400 mt-4 max-w-xl mx-auto">
    A single platform designed to support every role in the civic ecosystem.
  </p>

  <div className="mt-16 grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
    <RoleCard
      icon="🧍"
      title="Citizens"
      description="Report local issues, follow updates in real time, and stay informed about what’s happening in your community."
    />

    <RoleCard
      icon="🏢"
      title="Departments"
      description="Receive reports directly, post progress updates, and respond efficiently through a centralized system."
    />

    <RoleCard
      icon="🛡️"
      title="Administrators"
      description="Oversee activity, moderate content, and ensure transparency and accountability across the platform."
    />
  </div>
</section>
    </section>
    
  );
}
