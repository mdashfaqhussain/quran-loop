"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useUserData, MemorizedItem } from "@/hooks/useUserData";
import ModernAppLayout from "@/components/ModernAppLayout";
import AyatDisplay from "@/components/AyatDisplay";
import ProgressDashboard from "@/components/ProgressDashboard";
import AdvancedProgressDashboard from "@/components/AdvancedProgressDashboard";
import ModernQuranPlayer from "@/components/ModernQuranPlayer";
import EnhancedSurahLibrary from "@/components/EnhancedSurahLibrary";
import Settings from "@/components/Settings";
import { StreakDebugPanel } from "@/components/StreakDebugPanel";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useActivityTracker } from "@/lib/activityTracker";
import { ActivityTracker } from "@/lib/activityTracker";
import { StreakManager } from "@/lib/streakManager";
import { DEFAULT_SETTINGS } from "@/lib/userData";
import AuthWrapper from "@/components/AuthWrapper";

function AppContent() {
  const { user } = useAuth();
  const activityTracker = useActivityTracker();
  const {
    memorized: cloudMemorized,
    settings: cloudSettings,
    setMemorized: setCloudMemorized,
    setSettings: setCloudSettings,
    loading,
  } = useUserData(user?.uid ?? null);

  const [activeSection, setActiveSection] = useState("player");
  const [localMemorized, setLocalMemorized] = useState<MemorizedItem[]>([]);
  const [localSettings, setLocalSettings] = useState(DEFAULT_SETTINGS);
  const [selectedSurah, setSelectedSurah] = useState<{
    number: number;
    name: string;
  } | null>(null);

  // Track user login/activity
  useEffect(() => {
    if (user && !loading) {
      activityTracker.trackLogin();
    }
  }, [user, loading, activityTracker]);

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

  // Get real-time activity stats - update more frequently
  const [activityStats, setActivityStats] = useState(() => {
    // Force reset streak data on app load to ensure real-time tracking
    const stats = ActivityTracker.getActivityStats();
    console.log("Initial activity stats loaded:", stats);

    // If streak is suspiciously high (like 7), reset it to start fresh
    if (stats.currentStreak === 7 && stats.totalActiveDays === 0) {
      console.log("Resetting suspicious streak data");
      StreakManager.resetStreak();
      return ActivityTracker.getActivityStats();
    }

    return stats;
  });

  // Force refresh activity stats when memorized data changes or periodically
  useEffect(() => {
    const updateStats = () => {
      // Force reset if we detect the problematic 7-day streak
      const currentStreakData = StreakManager.getStreakData();
      console.log("Current StreakManager data:", currentStreakData);

      if (
        currentStreakData.currentStreak === 7 &&
        currentStreakData.totalLogins === 0
      ) {
        console.log("Detected problematic 7-day streak, forcing reset");
        StreakManager.resetStreak();
        localStorage.removeItem("quran-activity-data");
      }

      const newStats = ActivityTracker.getActivityStats();
      setActivityStats(newStats);
      console.log("Updated activity stats:", newStats); // Debug log
    };

    // Initial update
    updateStats();

    // Update every 5 seconds (very frequent for testing)
    const interval = setInterval(updateStats, 5000);

    return () => clearInterval(interval);
  }, [memorizedData]);

  // Force override the streak display with real-time data
  const realTimeStreak = useMemo(() => {
    const stats = ActivityTracker.getActivityStats();
    console.log("Real-time streak calculation:", stats.currentStreak);
    return stats.currentStreak;
  }, [activityStats]);

  const dynamicStats = useMemo(
    () => ({
      currentStreak: realTimeStreak,
      longestStreak: activityStats.longestStreak,
      weeklyGoal: 7,
      monthlyGoal: 30,
    }),
    [realTimeStreak, activityStats],
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
      // Track memorization activity
      activityTracker.trackMarkMemorized(ayatNum, surahNum);

      setMemorizedData((prev) => {
        const existing = prev.find(
          (item) => item.ayatNum === ayatNum && item.surahNum === surahNum,
        );
        if (existing) {
          return prev.filter(
            (item) => !(item.ayatNum === ayatNum && item.surahNum === surahNum),
          );
        } else {
          const newData = [
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

          // Force immediate activity stats update after memorization
          setTimeout(() => {
            const newStats = ActivityTracker.getActivityStats();
            setActivityStats(newStats);
            console.log("Activity stats after memorization:", newStats);
          }, 100);

          return newData;
        }
      });
    },
    [setMemorizedData, activityTracker],
  );

  const handleSurahSelect = (surahNum: number, surahName: string) => {
    setSelectedSurah({ number: surahNum, name: surahName });
    setActiveSection("player");
  };

  const handleReviewAyat = (surahNum: number, ayatNum: number) => {
    // Track review activity
    activityTracker.trackReviewAyat(ayatNum, surahNum);

    setMemorizedData((prev) =>
      prev.map((item) =>
        item.surahNum === surahNum && item.ayatNum === ayatNum
          ? {
              ...item,
              lastReviewed: new Date(),
              reviewCount: item.reviewCount + 1,
            }
          : item,
      ),
    );
  };

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

  const memorizedAyats = useMemo(
    () =>
      memorizedData.map((item) => ({
        surahNum: item.surahNum,
        ayatNum: item.ayatNum,
      })),
    [memorizedData],
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
          <>
            <StreakDebugPanel />
            <AdvancedProgressDashboard
              memorized={memorizedData}
              totalAyats={6236}
              currentStreak={dynamicStats.currentStreak}
              longestStreak={dynamicStats.longestStreak}
              onReviewAyat={handleReviewAyat}
              onRefreshStreak={() => {
                const newStats = ActivityTracker.getActivityStats();
                setActivityStats(newStats);
                console.log("Manual refresh - activity stats:", newStats);
              }}
            />
          </>
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
      userDataLoading={loading}
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
