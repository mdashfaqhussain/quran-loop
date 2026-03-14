// Streak Management System
export interface UserStreak {
  currentStreak: number;
  longestStreak: number;
  lastLoginDate: string | null;
  totalLogins: number;
  loginDates: string[]; // Array of login dates for tracking
}

export class StreakManager {
  private static readonly STORAGE_KEY = 'quran-streak-data';

  // Get current streak data
  static getStreakData(): UserStreak {
    if (typeof window === 'undefined') {
      return {
        currentStreak: 0,
        longestStreak: 0,
        lastLoginDate: null,
        totalLogins: 0,
        loginDates: []
      };
    }

    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) {
      return {
        currentStreak: 0,
        longestStreak: 0,
        lastLoginDate: null,
        totalLogins: 0,
        loginDates: []
      };
    }

    try {
      return JSON.parse(stored);
    } catch {
      return this.resetStreak();
    }
  }

  // Save streak data
  static saveStreakData(data: UserStreak): void {
    if (typeof window === 'undefined') return;
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

  // Reset streak (for debugging or user request)
  static resetStreak(): UserStreak {
    const resetData = {
      currentStreak: 0,
      longestStreak: 0,
      lastLoginDate: null,
      totalLogins: 0,
      loginDates: []
    };
    
    this.saveStreakData(resetData);
    return resetData;
  }

  // Check and update daily login streak
  static updateDailyStreak(): UserStreak {
    const data = this.getStreakData();
    const today = new Date().toDateString();

    // If already logged in today, return existing data
    if (data.lastLoginDate === today) {
      return data;
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = yesterday.toDateString();

    let newCurrentStreak = data.currentStreak;

    // Check if yesterday was logged in (continuing streak)
    if (data.lastLoginDate === yesterdayString) {
      newCurrentStreak += 1;
    } else {
      // Streak broken, start new streak
      newCurrentStreak = 1;
    }

    // Update longest streak if needed
    const newLongestStreak = Math.max(data.longestStreak, newCurrentStreak);

    // Add today to login dates (keep last 30 days for analysis)
    const newLoginDates = [today, ...data.loginDates.filter(date => date !== today)].slice(0, 30);

    const newData: UserStreak = {
      currentStreak: newCurrentStreak,
      longestStreak: newLongestStreak,
      lastLoginDate: today,
      totalLogins: data.totalLogins + 1,
      loginDates: newLoginDates
    };

    this.saveStreakData(newData);
    return newData;
  }

  // Get streak statistics
  static getStreakStats(): {
    currentStreak: number;
    longestStreak: number;
    totalLogins: number;
    daysThisMonth: number;
    averagePerWeek: number;
  } {
    const data = this.getStreakData();
    
    // Calculate days this month
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const daysThisMonth = data.loginDates.filter(date => {
      const d = new Date(date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    }).length;

    // Calculate average per week (last 4 weeks)
    const fourWeeksAgo = new Date();
    fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);
    const recentLogins = data.loginDates.filter(date => new Date(date) >= fourWeeksAgo);
    const averagePerWeek = recentLogins.length / 4;

    return {
      currentStreak: data.currentStreak,
      longestStreak: data.longestStreak,
      totalLogins: data.totalLogins,
      daysThisMonth,
      averagePerWeek
    };
  }

  // Check if user should get streak milestone notification
  static getStreakMilestone(): number | null {
    const data = this.getStreakData();
    const milestones = [1, 3, 7, 14, 30, 60, 90, 180, 365];
    
    for (const milestone of milestones) {
      if (data.currentStreak === milestone && data.totalLogins > 1) {
        return milestone;
      }
    }
    
    return null;
  }
}
