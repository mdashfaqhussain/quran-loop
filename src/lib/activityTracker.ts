// Activity Tracking System for Real Streak Calculation
import { StreakManager, UserStreak } from './streakManager';

export interface ActivityEvent {
  id: string;
  type: 'login' | 'play_audio' | 'mark_memorized' | 'review_ayat' | 'complete_session' | 'loop_ayah';
  timestamp: Date;
  ayahNumber?: number;
  surahNumber?: number;
  duration?: number; // in seconds for audio/listening activities
  metadata?: Record<string, any>;
}

export interface DailyActivity {
  date: string; // YYYY-MM-DD format
  events: ActivityEvent[];
  totalStudyTime: number; // in seconds
  ayatsMemorized: number;
  ayatsReviewed: number;
  sessionsCompleted: number;
  loginCount: number;
}

export interface ActivityStats {
  currentStreak: number;
  longestStreak: number;
  totalActiveDays: number;
  averageSessionTime: number;
  totalStudyTime: number;
  ayatsMemorized: number;
  ayatsReviewed: number;
  lastActivityDate: string | null;
  todayActivity: DailyActivity | null;
}

export class ActivityTracker {
  private static readonly STORAGE_KEY = 'quran-activity-data';
  private static readonly MAX_DAYS_TO_KEEP = 90; // Keep 90 days of activity data

  // Get all activity data
  static getActivityData(): DailyActivity[] {
    if (typeof window === 'undefined') {
      return [];
    }

    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) {
      return [];
    }

    try {
      const data = JSON.parse(stored);
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  }

  // Save activity data
  private static saveActivityData(data: DailyActivity[]): void {
    if (typeof window === 'undefined') return;
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

  // Get activity for a specific date
  static getDailyActivity(date: Date): DailyActivity | null {
    const dateString = date.toISOString().split('T')[0];
    const allData = this.getActivityData();
    return allData.find(day => day.date === dateString) || null;
  }

  // Get today's activity
  static getTodayActivity(): DailyActivity | null {
    return this.getDailyActivity(new Date());
  }

  // Track a new activity event
  static trackActivity(event: Omit<ActivityEvent, 'id' | 'timestamp'>): void {
    const today = new Date();
    const dateString = today.toISOString().split('T')[0];
    
    const allData = this.getActivityData();
    let todayActivity = allData.find(day => day.date === dateString);

    if (!todayActivity) {
      todayActivity = {
        date: dateString,
        events: [],
        totalStudyTime: 0,
        ayatsMemorized: 0,
        ayatsReviewed: 0,
        sessionsCompleted: 0,
        loginCount: 0
      };
      allData.push(todayActivity);
    }

    const newEvent: ActivityEvent = {
      ...event,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: today
    };

    todayActivity.events.push(newEvent);

    // Update daily statistics based on event type
    switch (event.type) {
      case 'login':
        todayActivity.loginCount++;
        break;
      case 'mark_memorized':
        todayActivity.ayatsMemorized++;
        break;
      case 'review_ayat':
        todayActivity.ayatsReviewed++;
        break;
      case 'complete_session':
        todayActivity.sessionsCompleted++;
        break;
      case 'play_audio':
      case 'loop_ayah':
        if (event.duration) {
          todayActivity.totalStudyTime += event.duration;
        }
        break;
    }

    // Clean old data and save
    const cleanedData = this.cleanOldData(allData);
    this.saveActivityData(cleanedData);

    // Update streak based on activity
    this.updateStreakBasedOnActivity(todayActivity);
  }

  // Update streak based on meaningful activity
  private static updateStreakBasedOnActivity(todayActivity: DailyActivity): void {
    // Only update streak if there's meaningful activity
    const hasMeaningfulActivity = 
      todayActivity.ayatsMemorized > 0 || 
      todayActivity.ayatsReviewed > 0 || 
      todayActivity.sessionsCompleted > 0 ||
      todayActivity.totalStudyTime > 60; // At least 1 minute of study

    if (hasMeaningfulActivity) {
      StreakManager.updateDailyStreak();
    }
  }

  // Clean old activity data
  private static cleanOldData(data: DailyActivity[]): DailyActivity[] {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - this.MAX_DAYS_TO_KEEP);
    
    return data.filter(day => new Date(day.date) >= cutoffDate);
  }

  // Get comprehensive activity statistics
  static getActivityStats(): ActivityStats {
    const streakData = StreakManager.getStreakData();
    const activityData = this.getActivityData();
    const todayActivity = this.getTodayActivity();

    // Calculate total statistics
    const totals = activityData.reduce((acc, day) => ({
      totalStudyTime: acc.totalStudyTime + day.totalStudyTime,
      ayatsMemorized: acc.ayatsMemorized + day.ayatsMemorized,
      ayatsReviewed: acc.ayatsReviewed + day.ayatsReviewed,
      sessionsCompleted: acc.sessionsCompleted + day.sessionsCompleted,
      totalActiveDays: acc.totalActiveDays + (day.totalStudyTime > 0 || day.ayatsMemorized > 0 || day.ayatsReviewed > 0 ? 1 : 0)
    }), {
      totalStudyTime: 0,
      ayatsMemorized: 0,
      ayatsReviewed: 0,
      sessionsCompleted: 0,
      totalActiveDays: 0
    });

    // Calculate average session time
    const averageSessionTime = totals.sessionsCompleted > 0 
      ? Math.round(totals.totalStudyTime / totals.sessionsCompleted) 
      : 0;

    return {
      currentStreak: streakData.currentStreak,
      longestStreak: streakData.longestStreak,
      totalActiveDays: totals.totalActiveDays,
      averageSessionTime,
      totalStudyTime: totals.totalStudyTime,
      ayatsMemorized: totals.ayatsMemorized,
      ayatsReviewed: totals.ayatsReviewed,
      lastActivityDate: streakData.lastLoginDate,
      todayActivity
    };
  }

  // Get weekly activity pattern
  static getWeeklyPattern(): { [key: string]: number } {
    const activityData = this.getActivityData();
    const pattern: { [key: string]: number } = {
      'Sunday': 0,
      'Monday': 0,
      'Tuesday': 0,
      'Wednesday': 0,
      'Thursday': 0,
      'Friday': 0,
      'Saturday': 0
    };

    activityData.forEach(day => {
      const dayName = new Date(day.date).toLocaleDateString('en-US', { weekday: 'long' });
      if (day.totalStudyTime > 0 || day.ayatsMemorized > 0 || day.ayatsReviewed > 0) {
        pattern[dayName]++;
      }
    });

    return pattern;
  }

  // Get monthly activity summary
  static getMonthlySummary(year: number, month: number): {
    activeDays: number;
    totalStudyTime: number;
    ayatsMemorized: number;
    ayatsReviewed: number;
  } {
    const activityData = this.getActivityData();
    const monthData = activityData.filter(day => {
      const date = new Date(day.date);
      return date.getFullYear() === year && date.getMonth() === month;
    });

    return monthData.reduce((acc, day) => ({
      activeDays: acc.activeDays + (day.totalStudyTime > 0 || day.ayatsMemorized > 0 || day.ayatsReviewed > 0 ? 1 : 0),
      totalStudyTime: acc.totalStudyTime + day.totalStudyTime,
      ayatsMemorized: acc.ayatsMemorized + day.ayatsMemorized,
      ayatsReviewed: acc.ayatsReviewed + day.ayatsReviewed
    }), {
      activeDays: 0,
      totalStudyTime: 0,
      ayatsMemorized: 0,
      ayatsReviewed: 0
    });
  }

  // Check if user should get activity milestone notification
  static getActivityMilestone(): { type: string; value: number } | null {
    const stats = this.getActivityStats();
    const milestones = [
      { type: 'streak', value: 1 },
      { type: 'streak', value: 3 },
      { type: 'streak', value: 7 },
      { type: 'streak', value: 14 },
      { type: 'streak', value: 30 },
      { type: 'streak', value: 60 },
      { type: 'streak', value: 90 },
      { type: 'streak', value: 100 },
      { type: 'streak', value: 365 },
      { type: 'ayah_memorized', value: 10 },
      { type: 'ayah_memorized', value: 50 },
      { type: 'ayah_memorized', value: 100 },
      { type: 'ayah_memorized', value: 500 },
      { type: 'ayah_memorized', value: 1000 },
      { type: 'study_time', value: 3600 }, // 1 hour
      { type: 'study_time', value: 36000 }, // 10 hours
      { type: 'study_time', value: 360000 }, // 100 hours
      { type: 'active_days', value: 7 },
      { type: 'active_days', value: 30 },
      { type: 'active_days', value: 100 },
      { type: 'active_days', value: 365 }
    ];

    for (const milestone of milestones) {
      let currentValue = 0;
      switch (milestone.type) {
        case 'streak':
          currentValue = stats.currentStreak;
          break;
        case 'ayah_memorized':
          currentValue = stats.ayatsMemorized;
          break;
        case 'study_time':
          currentValue = stats.totalStudyTime;
          break;
        case 'active_days':
          currentValue = stats.totalActiveDays;
          break;
      }

      if (currentValue === milestone.value) {
        return milestone;
      }
    }

    return null;
  }

  // Export activity data for backup
  static exportActivityData(): string {
    const data = {
      activityData: this.getActivityData(),
      streakData: StreakManager.getStreakData(),
      exportDate: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
  }

  // Import activity data from backup
  static importActivityData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      if (data.activityData && Array.isArray(data.activityData)) {
        this.saveActivityData(data.activityData);
        if (data.streakData) {
          StreakManager.saveStreakData(data.streakData);
        }
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }
}

// Convenience hooks for React components
export const useActivityTracker = () => {
  const trackLogin = () => {
    ActivityTracker.trackActivity({ type: 'login' });
  };

  const trackAudioPlay = (duration: number, ayahNumber?: number, surahNumber?: number) => {
    ActivityTracker.trackActivity({ 
      type: 'play_audio', 
      duration, 
      ayahNumber, 
      surahNumber 
    });
  };

  const trackLoopAyah = (duration: number, ayahNumber: number, surahNumber: number) => {
    ActivityTracker.trackActivity({ 
      type: 'loop_ayah', 
      duration, 
      ayahNumber, 
      surahNumber 
    });
  };

  const trackMarkMemorized = (ayahNumber: number, surahNumber: number) => {
    ActivityTracker.trackActivity({ 
      type: 'mark_memorized', 
      ayahNumber, 
      surahNumber 
    });
  };

  const trackReviewAyat = (ayahNumber: number, surahNumber: number) => {
    ActivityTracker.trackActivity({ 
      type: 'review_ayat', 
      ayahNumber, 
      surahNumber 
    });
  };

  const trackCompleteSession = (duration?: number) => {
    ActivityTracker.trackActivity({ 
      type: 'complete_session', 
      duration 
    });
  };

  return {
    trackLogin,
    trackAudioPlay,
    trackLoopAyah,
    trackMarkMemorized,
    trackReviewAyat,
    trackCompleteSession,
    getStats: ActivityTracker.getActivityStats,
    getTodayActivity: ActivityTracker.getTodayActivity,
    getWeeklyPattern: ActivityTracker.getWeeklyPattern,
    getMonthlySummary: ActivityTracker.getMonthlySummary,
    getMilestone: ActivityTracker.getActivityMilestone
  };
};
