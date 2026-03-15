"use client";

import { useState } from "react";
import { ActivityTracker } from "@/lib/activityTracker";
import { StreakManager } from "@/lib/streakManager";
import { RefreshCw, Trash2, Play } from "lucide-react";

export function StreakDebugPanel() {
  const [stats, setStats] = useState(() => ActivityTracker.getActivityStats());
  const [streakData, setStreakData] = useState(() =>
    StreakManager.getStreakData(),
  );

  const refreshData = () => {
    const newStats = ActivityTracker.getActivityStats();
    const newStreakData = StreakManager.getStreakData();
    setStats(newStats);
    setStreakData(newStreakData);
    console.log("Refreshed data:", { newStats, newStreakData });
  };

  const resetAllData = () => {
    if (
      confirm("This will reset all streak and activity data. Are you sure?")
    ) {
      StreakManager.resetStreak();
      localStorage.removeItem("quran-activity-data");
      refreshData();
      console.log("All data reset");
    }
  };

  const forceHardReset = () => {
    if (
      confirm(
        "This will perform a HARD RESET of all Quran app data. Are you sure?",
      )
    ) {
      // Clear ALL possible storage keys
      localStorage.removeItem("quran-streak-data");
      localStorage.removeItem("quran-activity-data");
      localStorage.removeItem("quran-user-settings");
      localStorage.removeItem("quran-memorized-data");

      // Also try sessionStorage
      sessionStorage.removeItem("quran-streak-data");
      sessionStorage.removeItem("quran-activity-data");

      // Force refresh
      refreshData();

      // Force page reload after 1 second
      setTimeout(() => {
        window.location.reload();
      }, 1000);

      console.log("HARD RESET performed - page will reload");
    }
  };

  const simulateActivity = () => {
    // Simulate marking an ayat as memorized
    ActivityTracker.trackActivity({
      type: "mark_memorized",
      ayahNumber: 1,
      surahNumber: 1,
      duration: 60,
    });
    refreshData();
    console.log("Simulated memorization activity");
  };

  return (
    <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm mb-4">
      <h3 className="text-lg font-semibold text-neutral-900 mb-3">
        Streak Debug Panel
      </h3>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-neutral-50 rounded-lg p-3">
          <h4 className="text-sm font-medium text-neutral-700 mb-2">
            Activity Stats
          </h4>
          <div className="text-xs space-y-1">
            <div>
              Current Streak:{" "}
              <span className="font-bold">{stats.currentStreak}</span>
            </div>
            <div>
              Longest Streak:{" "}
              <span className="font-bold">{stats.longestStreak}</span>
            </div>
            <div>
              Total Active Days:{" "}
              <span className="font-bold">{stats.totalActiveDays}</span>
            </div>
            <div>
              Total Study Time:{" "}
              <span className="font-bold">
                {Math.round(stats.totalStudyTime / 60)}m
              </span>
            </div>
            <div>
              Ayats Memorized:{" "}
              <span className="font-bold">{stats.ayatsMemorized}</span>
            </div>
          </div>
        </div>

        <div className="bg-neutral-50 rounded-lg p-3">
          <h4 className="text-sm font-medium text-neutral-700 mb-2">
            Streak Manager Data
          </h4>
          <div className="text-xs space-y-1">
            <div>
              Current Streak:{" "}
              <span className="font-bold">{streakData.currentStreak}</span>
            </div>
            <div>
              Longest Streak:{" "}
              <span className="font-bold">{streakData.longestStreak}</span>
            </div>
            <div>
              Total Logins:{" "}
              <span className="font-bold">{streakData.totalLogins}</span>
            </div>
            <div>
              Last Login:{" "}
              <span className="font-bold">
                {streakData.lastLoginDate || "Never"}
              </span>
            </div>
            <div>
              Login Dates Count:{" "}
              <span className="font-bold">{streakData.loginDates.length}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        <button
          onClick={refreshData}
          className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>

        <button
          onClick={simulateActivity}
          className="flex items-center gap-2 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
        >
          <Play className="w-4 h-4" />
          Simulate Activity
        </button>

        <button
          onClick={resetAllData}
          className="flex items-center gap-2 px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm"
        >
          <Trash2 className="w-4 h-4" />
          Reset Data
        </button>

        <button
          onClick={forceHardReset}
          className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-bold"
        >
          <Trash2 className="w-4 h-4" />
          HARD RESET
        </button>
      </div>

      {stats.todayActivity && (
        <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
          <h4 className="text-sm font-medium text-neutral-700 mb-1">
            Today's Activity
          </h4>
          <div className="text-xs space-y-1">
            <div>
              Study Time: {Math.round(stats.todayActivity.totalStudyTime / 60)}m
            </div>
            <div>Ayats Memorized: {stats.todayActivity.ayatsMemorized}</div>
            <div>Ayats Reviewed: {stats.todayActivity.ayatsReviewed}</div>
            <div>Sessions: {stats.todayActivity.sessionsCompleted}</div>
          </div>
        </div>
      )}
    </div>
  );
}
