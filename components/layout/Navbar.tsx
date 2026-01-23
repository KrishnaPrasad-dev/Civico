"use client";

import Link from "next/link";
import { useState } from "react";

type NavbarProps = {
  variant?: "public" | "auth" | "dashboard";
};

export default function Navbar({ variant = "public" }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/30 backdrop-blur">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-white font-semibold text-lg">
          CIVICO
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm text-white/90">
          <Link href="#" className="hover:text-indigo-400">Dashboard</Link>
          <Link href="#" className="hover:text-indigo-400">Civic Posts</Link>
          <Link href="#" className="hover:text-indigo-400">Profile</Link>
          <Link href="#" className="hover:text-indigo-400">Roles</Link>
        </nav>

        <div className="flex items-center gap-4">
          {variant === "public" && (
            <Link
              href="/signup"
              className="hidden md:inline-block bg-indigo-600 px-5 py-2 text-sm font-medium hover:bg-indigo-700"
            >
              Sign up
            </Link>
          )}

          <button
            onClick={() => setMenuOpen(true)}
            className="md:hidden text-white"
          >
            ☰
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden fixed inset-0 bg-black/70 flex items-center justify-center">
          <button
            onClick={() => setMenuOpen(false)}
            className="absolute top-6 right-6 text-white"
          >
            ✕
          </button>
        </div>
      )}
    </header>
  );
}
