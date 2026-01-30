"use client";

import Link from "next/link";
import { useState } from "react";
import AnimatedButton from "../ui/AnimatedButton";

type NavbarProps = {
  variant?: "public" | "auth" | "dashboard";
};

export default function Navbar({ variant = "public" }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/40 backdrop-blur-md">
      {/* TOP BAR */}
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-white font-semibold text-xl">
          CIVICO
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-white/90">
          <Link href="/dashboard" className="hover:text-indigo-400">
            Dashboard
          </Link>
          <Link href="#" className="hover:text-indigo-400">
            Civic Posts
          </Link>
          <Link href="#" className="hover:text-indigo-400">
            Profile
          </Link>
          <Link href="#" className="hover:text-indigo-400">
            Roles
          </Link>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {variant === "public" && (
            <AnimatedButton
              text="Sign up"
              href="/signup"
              className="hidden md:inline-flex"
            />
          )}

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-white text-2xl"
            aria-label="Toggle menu"
          >
            ☰
          </button>
        </div>
      </div>

      {/* 🔥 MOBILE MENU (DROPDOWN, NOT MODAL) */}
      {menuOpen && (
        <div className="md:hidden w-full bg-black/70 backdrop-blur-md border-t border-white/10">
          <nav className="flex flex-col px-6 py-6 gap-6 text-white text-lg">
            <Link
              href="/dashboard"
              onClick={() => setMenuOpen(false)}
              className="hover:text-indigo-400"
            >
              Dashboard
            </Link>

            <Link
              href="#"
              onClick={() => setMenuOpen(false)}
              className="hover:text-indigo-400"
            >
              Civic Posts
            </Link>

            <Link
              href="#"
              onClick={() => setMenuOpen(false)}
              className="hover:text-indigo-400"
            >
              Profile
            </Link>

            <Link
              href="#"
              onClick={() => setMenuOpen(false)}
              className="hover:text-indigo-400"
            >
              Roles
            </Link>

            {variant === "public" && (
              <Link
                href="/signup"
                onClick={() => setMenuOpen(false)}
                className="mt-4 inline-flex items-center justify-center px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition"
              >
                Sign up
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
