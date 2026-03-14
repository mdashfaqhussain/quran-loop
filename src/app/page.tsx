"use client";

import { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import QuranLoopPlayer from "@/components/QuranLoopPlayer";
import EnhancedProgressDashboard from "@/components/EnhancedProgressDashboard";
import EnhancedSurahLibrary from "@/components/EnhancedSurahLibrary";
import Settings from "@/components/Settings";

interface MemorizedItem {
  surahName: string;
  ayatNum: number;
  surahNum: number;
  memorizedAt: Date;
  reviewCount: number;
  difficulty?: "easy" | "medium" | "hard";
  lastReviewed?: Date;
}

export default function Home() {
  const [activeSection, setActiveSection] = useState("player");
  const [memorizedData, setMemorizedData] = useState<MemorizedItem[]>([
    {
      surahName: "Al-Ikhlaas",
      ayatNum: 1,
      surahNum: 112,
      memorizedAt: new Date(),
      reviewCount: 3,
    },
    {
      surahName: "Al-Fatihah",
      ayatNum: 2,
      surahNum: 1,
      memorizedAt: new Date(Date.now() - 86400000),
      reviewCount: 5,
    },
    {
      surahName: "Al-Ikhlaas",
      ayatNum: 2,
      surahNum: 112,
      memorizedAt: new Date(Date.now() - 172800000),
      reviewCount: 2,
    },
    {
      surahName: "Al-Fatihah",
      ayatNum: 1,
      surahNum: 1,
      memorizedAt: new Date(Date.now() - 259200000),
      reviewCount: 7,
    },
  ]);

  const [settings, setSettings] = useState({
    autoPlayNext: true,
    defaultLoopCount: 5,
    defaultSpeed: 1,
    showTranslation: true,
    theme: "light" as const,
    audioQuality: "medium" as const,
  });

  const [selectedSurah, setSelectedSurah] = useState<{
    number: number;
    name: string;
  } | null>(null);

  // Calculate dynamic stats
  const dynamicStats = {
    currentStreak: calculateCurrentStreak(memorizedData),
    longestStreak: calculateLongestStreak(memorizedData),
    weeklyGoal: 7,
    monthlyGoal: 30,
  };

  // Calculate current streak (consecutive days with memorization)
  function calculateCurrentStreak(data: MemorizedItem[]): number {
    if (data.length === 0) return 0;

    const today = new Date();
    const dates = Array.from(
      new Set(data.map((item) => item.memorizedAt.toDateString())),
    );
    dates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    let streak = 0;
    let currentDate = new Date(today);

    for (let i = 0; i < dates.length; i++) {
      const memorizedDate = new Date(dates[i]);
      const daysDiff = Math.floor(
        (currentDate.getTime() - memorizedDate.getTime()) /
          (1000 * 60 * 60 * 24),
      );

      if (daysDiff === streak) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }

  // Calculate longest streak
  function calculateLongestStreak(data: MemorizedItem[]): number {
    if (data.length === 0) return 0;

    const dates = Array.from(
      new Set(data.map((item) => item.memorizedAt.toDateString())),
    );
    dates.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    let longestStreak = 0;
    let currentStreak = 0;
    let lastDate: Date | null = null;

    for (const dateStr of dates) {
      const date = new Date(dateStr);

      if (lastDate) {
        const daysDiff = Math.floor(
          (date.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24),
        );
        if (daysDiff === 1) {
          currentStreak++;
        } else {
          longestStreak = Math.max(longestStreak, currentStreak);
          currentStreak = 1;
        }
      } else {
        currentStreak = 1;
      }

      lastDate = date;
    }

    return Math.max(longestStreak, currentStreak);
  }

  const handleMarkMemorized = (
    surahName: string,
    ayatNum: number,
    surahNum: number,
  ) => {
    setMemorizedData((prev) => {
      const existing = prev.find(
        (item) => item.surahNum === surahNum && item.ayatNum === ayatNum,
      );
      if (existing) {
        return prev.map((item) =>
          item.surahNum === surahNum && item.ayatNum === ayatNum
            ? {
                ...item,
                reviewCount: item.reviewCount + 1,
                memorizedAt: new Date(),
                lastReviewed: new Date(),
              }
            : item,
        );
      } else {
        return [
          ...prev,
          {
            surahName,
            ayatNum,
            surahNum,
            memorizedAt: new Date(),
            lastReviewed: new Date(),
            reviewCount: 1,
            difficulty: "medium" as const,
          },
        ];
      }
    });
  };

  const handleSurahSelect = (surahNum: number, surahName: string) => {
    setSelectedSurah({ number: surahNum, name: surahName });
    setActiveSection("player");
  };

  // Get memorized ayats for library
  const memorizedAyats = memorizedData.map((item) => ({
    surahNum: item.surahNum,
    ayatNum: item.ayatNum,
  }));

  const renderContent = () => {
    switch (activeSection) {
      case "player":
        return (
          <QuranLoopPlayer
            onMarkMemorized={handleMarkMemorized}
            selectedSurahFromLibrary={selectedSurah}
          />
        );
      case "progress":
        return (
          <EnhancedProgressDashboard
            memorized={memorizedData}
            totalAyats={6236} // Total ayats in Quran
            currentStreak={dynamicStats.currentStreak}
            longestStreak={dynamicStats.longestStreak}
          />
        );
      case "library":
        return (
          <EnhancedSurahLibrary
            onSurahSelect={handleSurahSelect}
            memorizedAyats={memorizedAyats}
          />
        );
      case "settings":
        return <Settings settings={settings} onSettingsChange={setSettings} />;
      default:
        return <QuranLoopPlayer />;
    }
  };

  return (
    <AppLayout activeSection={activeSection} onSectionChange={setActiveSection}>
      {renderContent()}
    </AppLayout>
  );
}
