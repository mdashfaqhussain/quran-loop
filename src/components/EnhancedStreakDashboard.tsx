"use client";

import React, { useState, useEffect } from "react";
import { ActivityTracker, useActivityTracker } from "@/lib/activityTracker";
import { StreakManager } from "@/lib/streakManager";
import { 
  Flame, 
  Calendar, 
  TrendingUp, 
  Award, 
  Clock,
  Target,
  BookOpen,
  Volume2
} from "lucide-react";

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  totalActiveDays: number;
  averageSessionTime: number;
  totalStudyTime: number;
  ayatsMemorized: number;
  ayatsReviewed: number;
  lastActivityDate: string | null;
  todayActivity: any;
}

export function EnhancedStreakDashboard() {
  const [streakData, setStreakData] = useState<StreakData | null>(null);
  const [milestone, setMilestone] = useState<{ type: string; value: number } | null>(null);
  const [showMilestone, setShowMilestone] = useState(false);
  const activityTracker = useActivityTracker();

  useEffect(() => {
    const loadStreakData = () => {
      const stats = ActivityTracker.getActivityStats();
      setStreakData(stats);

      // Check for milestones
      const milestoneData = ActivityTracker.getActivityMilestone();
      if (milestoneData) {
        setMilestone(milestoneData);
        setShowMilestone(true);
        // Auto-hide milestone after 5 seconds
        setTimeout(() => setShowMilestone(false), 5000);
      }
    };

    // Load initial data
    loadStreakData();

    // Update data every minute to catch session changes
    const interval = setInterval(loadStreakData, 60000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getStreakColor = (streak: number): string => {
    if (streak >= 30) return "text-purple-600 bg-purple-100";
    if (streak >= 14) return "text-blue-600 bg-blue-100";
    if (streak >= 7) return "text-green-600 bg-green-100";
    if (streak >= 3) return "text-yellow-600 bg-yellow-100";
    return "text-orange-600 bg-orange-100";
  };

  const getStreakMessage = (streak: number): string => {
    if (streak >= 100) return "Legendary! 🏆";
    if (streak >= 50) return "Incredible! 🔥";
    if (streak >= 30) return "Amazing! ⭐";
    if (streak >= 21) return "Fantastic! 🌟";
    if (streak >= 14) return "Great job! 💪";
    if (streak >= 7) return "Keep it up! 🎯";
    if (streak >= 3) return "Good start! 👍";
    return "Begin your journey! 🌱";
  };

  if (!streakData) {
    return (
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm">
        <div className="animate-pulse">
          <div className="h-4 bg-neutral-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-8 bg-neutral-200 rounded"></div>
            <div className="h-8 bg-neutral-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Milestone Notification */}
      {showMilestone && milestone && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300">
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-4 rounded-xl shadow-xl flex items-center gap-3">
            <Award className="w-6 h-6" />
            <div>
              <p className="font-semibold">Milestone Achieved!</p>
              <p className="text-sm opacity-90">
                {milestone.type === 'streak' && `${milestone.value} day streak!`}
                {milestone.type === 'ayah_memorized' && `${milestone.value} ayats memorized!`}
                {milestone.type === 'study_time' && `${formatTime(milestone.value)} total study time!`}
                {milestone.type === 'active_days' && `${milestone.value} active days!`}
              </p>
            </div>
            <button
              onClick={() => setShowMilestone(false)}
              className="ml-4 text-white/80 hover:text-white transition-colors"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Main Streak Dashboard */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500" />
            <h3 className="text-lg font-semibold text-neutral-900">Learning Streak</h3>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStreakColor(streakData.currentStreak)}`}>
            {getStreakMessage(streakData.currentStreak)}
          </span>
        </div>

        {/* Main Streak Display */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-neutral-900 mb-1">
              {streakData.currentStreak}
            </div>
            <div className="text-sm text-neutral-600 flex items-center justify-center gap-1">
              <Flame className="w-3 h-3" />
              Current Streak
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-neutral-900 mb-1">
              {streakData.longestStreak}
            </div>
            <div className="text-sm text-neutral-600 flex items-center justify-center gap-1">
              <TrendingUp className="w-3 h-3" />
              Longest Streak
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-neutral-900 mb-1">
              {streakData.totalActiveDays}
            </div>
            <div className="text-sm text-neutral-600 flex items-center justify-center gap-1">
              <Calendar className="w-3 h-3" />
              Active Days
            </div>
          </div>
        </div>

        {/* Activity Stats */}
        <div className="border-t border-neutral-200 pt-4">
          <h4 className="text-sm font-medium text-neutral-700 mb-3">Today's Activity</h4>
          
          {streakData.todayActivity && streakData.todayActivity.totalStudyTime > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-primary-50 rounded-lg p-3">
                <div className="flex items-center gap-2 text-primary-600 mb-1">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium">Study Time</span>
                </div>
                <div className="text-lg font-semibold text-primary-700">
                  {formatTime(streakData.todayActivity.totalStudyTime)}
                </div>
              </div>
              
              <div className="bg-green-50 rounded-lg p-3">
                <div className="flex items-center gap-2 text-green-600 mb-1">
                  <BookOpen className="w-4 h-4" />
                  <span className="text-sm font-medium">Memorized</span>
                </div>
                <div className="text-lg font-semibold text-green-700">
                  {streakData.todayActivity.ayatsMemorized}
                </div>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="flex items-center gap-2 text-blue-600 mb-1">
                  <Volume2 className="w-4 h-4" />
                  <span className="text-sm font-medium">Reviewed</span>
                </div>
                <div className="text-lg font-semibold text-blue-700">
                  {streakData.todayActivity.ayatsReviewed}
                </div>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-3">
                <div className="flex items-center gap-2 text-purple-600 mb-1">
                  <Target className="w-4 h-4" />
                  <span className="text-sm font-medium">Sessions</span>
                </div>
                <div className="text-lg font-semibold text-purple-700">
                  {streakData.todayActivity.sessionsCompleted}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-neutral-500">
              <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Flame className="w-6 h-6 text-neutral-400" />
              </div>
              <p className="text-sm">No activity yet today</p>
              <p className="text-xs text-neutral-400 mt-1">Start studying to begin your streak!</p>
            </div>
          )}
        </div>

        {/* Overall Stats */}
        <div className="border-t border-neutral-200 pt-4 mt-4">
          <h4 className="text-sm font-medium text-neutral-700 mb-3">Overall Progress</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between">
              <span className="text-neutral-600">Total Study Time</span>
              <span className="font-medium text-neutral-900">
                {formatTime(streakData.totalStudyTime)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">Ayats Memorized</span>
              <span className="font-medium text-neutral-900">{streakData.ayatsMemorized}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">Ayats Reviewed</span>
              <span className="font-medium text-neutral-900">{streakData.ayatsReviewed}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">Avg Session Time</span>
              <span className="font-medium text-neutral-900">
                {formatTime(streakData.averageSessionTime)}
              </span>
            </div>
          </div>
        </div>

        {/* Streak Tips */}
        {streakData.currentStreak > 0 && streakData.currentStreak < 3 && (
          <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-sm text-yellow-800">
              💡 <strong>Tip:</strong> Study for at least 1 minute daily to maintain your streak!
            </p>
          </div>
        )}

        {streakData.currentStreak >= 7 && (
          <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm text-green-800">
              🎉 <strong>Amazing!</strong> You've been consistent for a week. Keep up the great work!
            </p>
          </div>
        )}
      </div>
    </>
  );
}
