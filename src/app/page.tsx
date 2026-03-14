"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Play,
  BarChart3,
  Cloud,
  Sparkles,
  ArrowRight,
} from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-emerald-50/70 flex flex-col">
      {/* Header */}
      <header className="px-6 py-4 sm:px-8 sm:py-6 border-b border-neutral-100/50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-neutral-800">
              Quran Loop Player
            </span>
          </div>
          <nav className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 text-sm font-semibold bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              Sign up
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 py-12 sm:px-8 sm:py-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Hero Section */}
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Memorize with Mishary Alafasy
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-900 mb-6 leading-tight">
              Memorize the Quran,{" "}
              <span className="text-primary-600">one verse at a time</span>
            </h1>
            <p className="text-lg text-neutral-600 mb-8 max-w-2xl mx-auto">
              Loop recitation, track your progress, and sync across devices.
              Start your journey today.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg hover:shadow-xl transition-all"
            >
              <Play className="w-5 h-5" />
              Get started
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
            {[
              {
                icon: Play,
                title: "Loop recitation",
                description:
                  "Repeat any verse with configurable loops and speed.",
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
                  className="bg-white/80 backdrop-blur-sm rounded-xl border border-neutral-200/80 p-6 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center mb-4 mx-auto">
                    <Icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <h3 className="font-semibold text-neutral-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-neutral-600">{item.description}</p>
                </div>
              );
            })}
          </div>

          {/* Arabic Verse */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-primary-100 shadow-lg p-8 text-center">
            <p className="font-arabic text-2xl text-neutral-800 leading-loose mb-3">
              وَقَالَ رَسُولُ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ
              خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ
            </p>
            <p className="text-sm text-neutral-500 italic">
              "The best among you are those who learn the Quran and teach it."
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-6 sm:px-8 border-t border-neutral-100/50">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-neutral-500">
            2026 Quran Loop Player. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <Link
              href="/login"
              className="text-sm text-neutral-500 hover:text-neutral-700 transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="text-sm text-neutral-500 hover:text-neutral-700 transition-colors"
            >
              Sign up
            </Link>
            <Link
              href="/login"
              className="text-sm text-primary-600 font-medium hover:underline"
            >
              Continue to app →
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
