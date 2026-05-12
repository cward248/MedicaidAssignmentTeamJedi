"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/browser-client";
import type { User } from "@supabase/supabase-js";

export default function AuthHeader() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setCurrentUser(data.user ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user ?? null);
    });

    return () => listener?.subscription.unsubscribe();
  }, [supabase]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    setCurrentUser(null);
  }

  return (
    <header className="border-b border-white/10 bg-slate-950/70 backdrop-blur">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-lg font-semibold text-white">
              Missouri Medicaid Portal
            </Link>
            <span className="hidden text-slate-500 sm:inline">|</span>
          </div>

          <nav className="flex flex-wrap items-center  gap-12 text-md text-slate-300 ">
            <Link href="/" className="transition hover:text-white">
              Home
            </Link>
            <Link href="/requirements" className="transition hover:text-white">
              Requirements
            </Link>
            {currentUser ? (
              <>
                <Link href="/apply" className="text-[1.0rem] text-slate-200 hover:text-white">
                  Submit Application
                </Link>
                <Link href="/verify" className="rounded-full border border-slate-700/60 bg-slate-900/60 px-3 py-1 text-[1.0rem] text-slate-200">
                  Dashboard
                </Link>
              </>
            ) : (
              <span className="rounded-full border border-blue-300/30 bg-blue-500/10 px-3 py-1 text-[1.2rem] text-white">
                Sign in to apply!
              </span>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-3 text-sm">
          {currentUser ? (
            <>
              <span className="text-slate-300">{currentUser.email ?? currentUser.id}</span>
              <button
                type="button"
                onClick={handleSignOut}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-slate-100 transition hover:bg-white/10"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              href="/email-password"
              className="rounded-full bg-blue-500 px-3 py-1 text-sm font-semibold text-white transition hover:bg-blue-400"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
