"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Play, BarChart3, Cloud, Sparkles } from "lucide-react";

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/app");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-emerald-50/50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-emerald-50/70 overflow-hidden relative">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary-200/30 blur-3xl" />
        <div className="absolute top-1/2 -left-32 w-80 h-80 rounded-full bg-emerald-200/25 blur-3xl" />
        <div className="absolute bottom-20 right-1/3 w-64 h-64 rounded-full bg-primary-100/40 blur-2xl" />
        {/* Subtle pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" className="text-primary-900" />
        </svg>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
        {/* Header */}
        <header className="flex items-center justify-between mb-16 sm:mb-24">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg">
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <span className="font-bold text-lg sm:text-xl text-neutral-800">Quran Loop Player</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/login"
              className="px-4 py-2 rounded-xl text-sm font-medium text-neutral-700 hover:bg-white/80 hover:shadow-md transition-all"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-primary-500 text-white hover:bg-primary-600 shadow-md hover:shadow-lg transition-all"
            >
              Sign up
            </Link>
          </div>
        </header>

        {/* Hero */}
        <section className="text-center max-w-4xl mx-auto mb-16 sm:mb-24">
          <p className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Memorize with Mishary Alafasy
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-900 tracking-tight mb-6 leading-tight">
            Memorize the Quran,{" "}
            <span className="text-primary-600">one verse at a time</span>
          </h1>
          <p className="text-lg sm:text-xl text-neutral-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Loop recitation, track your progress, and sync across devices. Start your journey today.
          </p>
          <Link
            href="/app"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-lg font-semibold bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-xl hover:shadow-2xl hover:from-primary-600 hover:to-primary-700 transition-all"
          >
            <Play className="w-5 h-5" />
            Get started
          </Link>
        </section>

        {/* Visual: Arabic verse accent */}
        <div className="max-w-2xl mx-auto mb-16 sm:mb-24">
          <div className="rounded-3xl bg-white/80 backdrop-blur-sm border border-primary-100 shadow-xl p-8 sm:p-10 text-center">
            <p className="font-arabic text-2xl sm:text-3xl text-neutral-800 leading-loose mb-2">
              وَقَالَ رَسُولُ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ
            </p>
            <p className="text-sm text-neutral-500 italic">
              “The best among you are those who learn the Quran and teach it.”
            </p>
          </div>
        </div>

        {/* Features */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto">
          {[
            {
              icon: Play,
              title: "Loop recitation",
              description: "Repeat any verse with configurable loops and speed.",
            },
            {
              icon: BarChart3,
              title: "Track progress",
              description: "See streaks and memorized verses in one place.",
            },
            {
              icon: Cloud,
              title: "Sync across devices",
              description: "Sign in to save progress and pick up anywhere.",
            },
          ].map((item) => {
            const Icon = item.icon;
        return (
              <div
                key={item.title}
                className="rounded-2xl bg-white/90 backdrop-blur-sm border border-neutral-200/80 p-6 shadow-card hover:shadow-elevated transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="font-semibold text-neutral-900 mb-2">{item.title}</h3>
                <p className="text-sm text-neutral-600">{item.description}</p>
              </div>
            );
          })}
        </section>

        {/* Footer CTA */}
        <footer className="mt-20 text-center">
          <p className="text-neutral-500 text-sm mb-4">
            No account? You can still use the app — sign in later to sync.
          </p>
          <Link
            href="/app"
            className="text-primary-600 font-medium hover:underline"
          >
            Continue to app →
          </Link>
        </footer>
      </div>
    </div>
  );
}
