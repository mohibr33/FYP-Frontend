"use client";

import Link from "next/link";
import { Pill, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuth } from "./auth/auth-context";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.push("/");
    setIsOpen(false);
  }

  return (
    <nav className="border-b border-blue-100 bg-background sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-xl text-blue-600"
        >
          <Pill className="w-6 h-6" />
          <span>Digital Health</span>
        </Link>

        <div className="hidden md:flex gap-8 items-center">
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground transition"
          >
            Home
          </Link>
          <Link
            href="/articles"
            className="text-muted-foreground hover:text-foreground transition"
          >
            Articles
          </Link>
          <Link
            href="/medicines"
            className="text-muted-foreground hover:text-foreground transition"
          >
            Medicines
          </Link>
          {user && (
            <>
              <Link
                href="/meal-planner"
                className="text-muted-foreground hover:text-foreground transition"
              >
                Meal Planner
              </Link>
              <Link
                href="/support"
                className="text-muted-foreground hover:text-foreground transition"
              >
                Support
              </Link>
            </>
          )}
          <Link
            href="/about"
            className="text-muted-foreground hover:text-foreground transition"
          >
            About Us
          </Link>
        </div>

        <div className="hidden md:flex gap-3 items-center">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="text-muted-foreground hover:text-foreground transition px-4 py-2"
              >
                {user.name}
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition px-4 py-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="text-muted-foreground hover:text-foreground transition px-4 py-2"
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden border-t border-blue-100 p-4 space-y-3">
          <Link
            href="/"
            className="block text-muted-foreground hover:text-foreground"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/articles"
            className="block text-muted-foreground hover:text-foreground"
            onClick={() => setIsOpen(false)}
          >
            Articles
          </Link>
          <Link
            href="/medicines"
            className="block text-muted-foreground hover:text-foreground"
            onClick={() => setIsOpen(false)}
          >
            Medicines
          </Link>
          {user && (
            <>
              <Link
                href="/meal-planner"
                className="block text-muted-foreground hover:text-foreground"
                onClick={() => setIsOpen(false)}
              >
                Meal Planner
              </Link>
              <Link
                href="/support"
                className="block text-muted-foreground hover:text-foreground"
                onClick={() => setIsOpen(false)}
              >
                Support
              </Link>
            </>
          )}
          <Link
            href="/about"
            className="block text-muted-foreground hover:text-foreground"
            onClick={() => setIsOpen(false)}
          >
            About Us
          </Link>
          <div className="pt-3 border-t border-blue-100 space-y-2">
            {user ? (
              <>
                <Link
                  href="/profile"
                  className="block text-muted-foreground hover:text-foreground"
                  onClick={() => setIsOpen(false)}
                >
                  Profile ({user.name})
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left text-muted-foreground hover:text-foreground"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="block text-muted-foreground hover:text-foreground"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="block bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
