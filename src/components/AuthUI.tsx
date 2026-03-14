"use client";

import { useState } from "react";
import { LogIn, LogOut, UserPlus, Loader2Icon } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function AuthUI() {
  const { user, signIn, signUp, signOut, loading, isConfigured, error, clearError } =
    useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!isConfigured) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        Add Firebase config to <code className="bg-amber-100 px-1 rounded">.env.local</code> to enable sign in.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-neutral-500">
        <Loader2Icon className="w-4 h-4 animate-spin" />
        <span className="text-sm">Checking auth…</span>
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-sm text-neutral-600">
          <span>Signed in as <strong>{user.displayName || user.email}</strong></span>
        </div>
        <button
          type="button"
          onClick={() => signOut()}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 transition-colors text-sm font-medium"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setSubmitting(true);
    try {
      if (mode === "signin") {
        await signIn(email, password);
      } else {
        await signUp(email, password, displayName || undefined);
      }
      setEmail("");
      setPassword("");
      setDisplayName("");
    } catch {
      // error already set in context
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => { setMode("signin"); clearError(); }}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
            mode === "signin"
              ? "bg-primary-500 text-white"
              : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
          }`}
        >
          <LogIn className="w-4 h-4 inline mr-2" />
          Sign in
        </button>
        <button
          type="button"
          onClick={() => { setMode("signup"); clearError(); }}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
            mode === "signup"
              ? "bg-primary-500 text-white"
              : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
          }`}
        >
          <UserPlus className="w-4 h-4 inline mr-2" />
          Sign up
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {mode === "signup" && (
          <div>
            <label className="block text-xs font-medium text-neutral-500 mb-1">Display name (optional)</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              placeholder="Your name"
            />
          </div>
        )}
        <div>
          <label className="block text-xs font-medium text-neutral-500 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-neutral-500 mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full px-3 py-2 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            placeholder="••••••••"
          />
        </div>
        {error && (
          <p className="text-sm text-error-600">{error}</p>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-2.5 rounded-xl bg-primary-500 text-white font-medium hover:bg-primary-600 disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {submitting ? (
            <Loader2Icon className="w-4 h-4 animate-spin" />
          ) : mode === "signin" ? (
            "Sign in"
          ) : (
            "Create account"
          )}
        </button>
      </form>
    </div>
  );
}
