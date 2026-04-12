"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AnimatedButton from "../ui/AnimatedButton";

type NavbarProps = {
  variant?: "public" | "auth" | "dashboard";
};

export default function Navbar({ variant = "public" }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const syncAuthState = () => {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");
      setIsLoggedIn(Boolean(token && user));
      setAuthChecked(true);
    };

    syncAuthState();

    window.addEventListener("storage", syncAuthState);
    window.addEventListener("focus", syncAuthState);

    return () => {
      window.removeEventListener("storage", syncAuthState);
      window.removeEventListener("focus", syncAuthState);
    };
  }, []);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setMenuOpen(false);
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/40 backdrop-blur-md">
      {/* TOP BAR */}
      <div className="max-w-7xl mx-auto px-5 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-white font-semibold text-lg">
          CIVICO
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-white/90">
          <Link href="/dashboard" className="hover:text-indigo-400">
            Dashboard
          </Link>
          <Link href="/civic-posts" className="hover:text-indigo-400">
            Civic Posts
          </Link>
          <Link href="/issues" className="hover:text-indigo-400">
            Issues
          </Link>
          <Link href="/civic-posts#departments" className="hover:text-indigo-400">
            Departments
          </Link>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {variant === "public" && authChecked && !isLoggedIn && (
            <AnimatedButton
              text="Login"
              href="/login"
              className="hidden md:inline-flex"
            />
          )}

          {variant === "public" && authChecked && isLoggedIn && (
            <button
              onClick={handleLogout}
              className="hidden md:inline-flex items-center justify-center px-6 py-3 rounded-md bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
            >
              Logout
            </button>
          )}

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-white text-2xl"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
          >
            ☰
          </button>
        </div>
      </div>

      {/* 🔥 MOBILE MENU (DROPDOWN, NOT MODAL) */}
      {menuOpen && (
        <div
          id="mobile-nav"
          className="md:hidden w-full bg-black/70 backdrop-blur-md border-t border-white/10"
        >
          <nav className="flex flex-col px-6 py-6 gap-6 text-white text-lg">
            <Link
              href="/dashboard"
              onClick={() => setMenuOpen(false)}
              className="hover:text-indigo-400"
            >
              Dashboard
            </Link>

            <Link
              href="/civic-posts"
              onClick={() => setMenuOpen(false)}
              className="hover:text-indigo-400"
            >
              Civic Posts
            </Link>

            <Link
              href="/issues"
              onClick={() => setMenuOpen(false)}
              className="hover:text-indigo-400"
            >
              Issues
            </Link>

            <Link
              href="/civic-posts#departments"
              onClick={() => setMenuOpen(false)}
              className="hover:text-indigo-400"
            >
              Departments
            </Link>

            {variant === "public" && authChecked && !isLoggedIn && (
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="mt-4 inline-flex items-center justify-center px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition"
              >
                Login
              </Link>
            )}

            {variant === "public" && authChecked && isLoggedIn && (
              <button
                onClick={handleLogout}
                className="mt-4 inline-flex items-center justify-center px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition"
              >
                Logout
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
