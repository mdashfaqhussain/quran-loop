"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { BookOpen, Loader2Icon, Chrome } from "lucide-react";

export default function LoginPage() {
  const {
    user,
    loading: authLoading,
    signIn,
    signInWithGoogle,
    error,
    clearError,
  } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      router.replace("/app");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    clearError();
  }, [email, password, clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await signIn(email, password);
      router.replace("/app");
    } catch {
      // error shown from context
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleSubmitting(true);
    try {
      await signInWithGoogle();
      router.replace("/app");
    } catch {
      // error shown from context
    } finally {
      setGoogleSubmitting(false);
    }
  };

  if (authLoading || user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-emerald-50/50">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-emerald-50/70 px-4 py-12">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-primary-200/20 blur-3xl" />
        <div className="absolute bottom-0 -left-24 w-64 h-64 rounded-full bg-emerald-200/20 blur-2xl" />
      </div>

      <div className="relative w-full max-w-md">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900 mb-8"
        >
          <BookOpen className="w-5 h-5" />
          <span className="font-semibold">Quran Loop Player</span>
        </Link>

        <div className="bg-white/95 backdrop-blur-sm rounded-3xl border border-neutral-200/80 shadow-elevated p-8 sm:p-10">
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">
            Welcome back
          </h1>
          <p className="text-neutral-600 text-sm mb-6">
            Sign in to sync your progress across devices.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="login-email"
                className="block text-sm font-medium text-neutral-700 mb-1.5"
              >
                Email
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full px-4 py-3.5 rounded-xl border border-neutral-200 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200 placeholder:text-neutral-400"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label
                htmlFor="login-password"
                className="block text-sm font-medium text-neutral-700 mb-1.5"
              >
                Password
              </label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full px-4 py-3.5 rounded-xl border border-neutral-200 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200 placeholder:text-neutral-400"
                placeholder="••••••"
              />
            </div>
            {error && (
              <p className="text-sm text-error-600 bg-error-50 px-3 py-2 rounded-lg">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold hover:from-primary-600 hover:to-primary-700 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed group"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-white">Signing in...</span>
                </>
              ) : (
                <>
                  <span className="text-white">Sign in</span>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-neutral-500">
                Or continue with
              </span>
            </div>
          </div>

          {/* Google Sign-In Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={googleSubmitting}
            className="w-full py-3.5 rounded-xl border border-neutral-200 bg-white text-neutral-700 font-medium hover:bg-neutral-50 hover:border-neutral-300 hover:shadow-md transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed group"
          >
            {googleSubmitting ? (
              <div className="w-5 h-5 flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-neutral-300 border-t-transparent rounded-full animate-spin border-l-transparent"></div>
              </div>
            ) : (
              <>
                <div className="w-5 h-5 rounded-lg bg-white p-1.5 shadow-sm border border-neutral-200 flex items-center justify-center group-hover:border-primary-300 group-hover:shadow-md transition-all">
                  <Chrome className="w-4 h-4 text-neutral-600 group-hover:text-primary-600 transition-colors" />
                </div>
                <span className="font-medium text-neutral-700 group-hover:text-neutral-900 transition-colors">
                  Continue with Google
                </span>
              </>
            )}
          </button>

          <p className="mt-6 text-center text-sm text-neutral-600">
            Don’t have an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-primary-600 hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm text-neutral-500 hover:text-neutral-700"
          >
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
