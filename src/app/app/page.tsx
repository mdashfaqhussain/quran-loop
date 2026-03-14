"use client";

import { useState, useMemo, useCallback } from "react";
import ModernAppLayout from "@/components/ModernAppLayout";
import ModernQuranPlayer from "@/components/ModernQuranPlayer";
import AdvancedProgressDashboard from "@/components/AdvancedProgressDashboard";
import EnhancedSurahLibrary from "@/components/EnhancedSurahLibrary";
import Settings from "@/components/Settings";
import { useAuth } from "@/contexts/AuthContext";
import { useUserData, type MemorizedItem } from "@/hooks/useUserData";
import { DEFAULT_SETTINGS } from "@/lib/userData";
import AuthWrapper from "@/components/AuthWrapper";

function AppContent() {
  const { user } = useAuth();
  const {
    memorized: cloudMemorized,
    settings: cloudSettings,
    setMemorized: setCloudMemorized,
    setSettings: setCloudSettings,
    loading: userDataLoading,
  } = useUserData(user?.uid ?? null);

  const [activeSection, setActiveSection] = useState("player");
  const [localMemorized, setLocalMemorized] = useState<MemorizedItem[]>([]);
  const [localSettings, setLocalSettings] = useState(DEFAULT_SETTINGS);
  const [selectedSurah, setSelectedSurah] = useState<{
    number: number;
    name: string;
  } | null>(null);

  const isSignedIn = Boolean(user);
  const memorizedData = isSignedIn ? cloudMemorized : localMemorized;
  const settings = isSignedIn ? cloudSettings : localSettings;

  const setMemorizedData = useCallback(
    (value: MemorizedItem[] | ((prev: MemorizedItem[]) => MemorizedItem[])) => {
      if (isSignedIn) {
        const next =
          typeof value === "function" ? value(cloudMemorized) : value;
        setCloudMemorized(next);
      } else {
        setLocalMemorized(
          typeof value === "function" ? value(localMemorized) : value,
        );
      }
    },
    [isSignedIn, cloudMemorized, localMemorized, setCloudMemorized],
  );

  const setSettings = useCallback(
    (
      value:
        | typeof DEFAULT_SETTINGS
        | ((prev: typeof DEFAULT_SETTINGS) => typeof DEFAULT_SETTINGS),
    ) => {
      if (isSignedIn) {
        const next = typeof value === "function" ? value(cloudSettings) : value;
        setCloudSettings(next);
      } else {
        setLocalSettings(
          typeof value === "function" ? value(localSettings) : value,
        );
      }
    },
    [isSignedIn, cloudSettings, localSettings, setCloudSettings],
  );

  const dynamicStats = useMemo(
    () => ({
      currentStreak: calculateCurrentStreak(memorizedData),
      longestStreak: calculateLongestStreak(memorizedData),
      weeklyGoal: 7,
      monthlyGoal: 30,
    }),
    [memorizedData],
  );

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

  const handleMarkMemorized = useCallback(
    (surahName: string, ayatNum: number, surahNum: number) => {
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
        }
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
      });
    },
    [setMemorizedData],
  );

  const handleSurahSelect = (surahNum: number, surahName: string) => {
    setSelectedSurah({ number: surahNum, name: surahName });
    setActiveSection("player");
  };

  const handleReviewAyat = (
    surahNum: number,
    ayatNum: number,
    surahName: string,
  ) => {
    setSelectedSurah({ number: surahNum, name: surahName });
    setActiveSection("player");
  };

  const memorizedAyats = useMemo(
    () =>
      memorizedData.map((item) => ({
        surahNum: item.surahNum,
        ayatNum: item.ayatNum,
      })),
    [memorizedData],
  );

  const handleUnmarkMemorized = useCallback(
    (surahName: string, ayatNum: number, surahNum: number) => {
      setMemorizedData((prev) =>
        prev.filter(
          (item) => !(item.surahNum === surahNum && item.ayatNum === ayatNum),
        ),
      );
    },
    [setMemorizedData],
  );

  const renderContent = () => {
    switch (activeSection) {
      case "player":
        return (
          <ModernQuranPlayer
            onMarkMemorized={handleMarkMemorized}
            onUnmarkMemorized={handleUnmarkMemorized}
            selectedSurahFromLibrary={selectedSurah}
            memorizedAyats={memorizedAyats}
          />
        );
      case "progress":
        return (
          <AdvancedProgressDashboard
            memorized={memorizedData}
            totalAyats={6236}
            currentStreak={dynamicStats.currentStreak}
            longestStreak={dynamicStats.longestStreak}
            onReviewAyat={handleReviewAyat}
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
        return <ModernQuranPlayer />;
    }
  };

  return (
    <ModernAppLayout
      activeSection={activeSection}
      onSectionChange={setActiveSection}
      isSignedIn={isSignedIn}
      userDataLoading={userDataLoading}
    >
      {renderContent()}
    </ModernAppLayout>
  );
}

export default function AppPage() {
  return (
    <AuthWrapper>
      <AppContent />
    </AuthWrapper>
  );
}
