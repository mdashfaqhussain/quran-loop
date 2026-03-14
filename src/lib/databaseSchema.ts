// Database Schema for Quran Loop Player

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  lastLoginAt: Date;
  settings: UserSettings;
  streak: UserStreak;
  stats: UserStats;
}

export interface UserSettings {
  autoPlayNext: boolean;
  defaultLoopCount: number;
  defaultSpeed: number;
  showTranslation: boolean;
  theme: "light" | "dark";
  audioQuality: "low" | "medium" | "high";
  notifications: NotificationSettings;
}

export interface NotificationSettings {
  dailyReminder: boolean;
  streakReminder: boolean;
  achievementBadges: boolean;
  weeklyProgress: boolean;
}

export interface UserStreak {
  currentStreak: number;
  longestStreak: number;
  lastLoginDate: string | null;
  totalLogins: number;
  loginDates: string[];
  milestones: number[];
}

export interface UserStats {
  totalAyatsMemorized: number;
  totalTimeSpent: number; // in minutes
  averageSessionTime: number; // in minutes
  favoriteSurahs: { surahNumber: number; count: number }[];
  memorizationTrend: { date: string; count: number }[]; // Daily memorization counts
  speedPreferences: { speed: number; usage: number }[];
  loopPreferences: { loops: number; usage: number }[];
  achievements: Achievement[];
  weeklyGoal: number;
  monthlyGoal: number;
}

export interface Achievement {
  id: string;
  type: "streak" | "memorization" | "time" | "consistency";
  title: string;
  description: string;
  icon: string;
  earnedAt: Date;
  progress: number; // 0-100 for partial achievements
  maxProgress: number;
}

export interface MemorizedAyat {
  id: string;
  userId: string;
  surahNumber: number;
  surahName: string;
  ayatNumber: number;
  arabicText: string;
  translation: string;
  memorizedAt: Date;
  lastReviewedAt: Date;
  reviewCount: number;
  difficulty: "easy" | "medium" | "hard";
  confidence: number; // 1-5 scale
  tags: string[];
  notes: string;
}

export interface StudySession {
  id: string;
  userId: string;
  startedAt: Date;
  endedAt: Date;
  duration: number; // in minutes
  surahNumber: number;
  ayatNumbers: number[];
  loopsCompleted: number;
  averageSpeed: number;
  ayatsMemorized: number[];
  ayatsReviewed: number[];
  sessionType: "memorization" | "review" | "mixed";
  device: string; // web, mobile, etc.
}

export interface DailyProgress {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  ayatsMemorized: number;
  ayatsReviewed: number;
  timeSpent: number; // in minutes
  sessionsCompleted: number;
  averageSpeed: number;
  averageLoops: number;
  streakMaintained: boolean;
}

export interface WeeklyReport {
  id: string;
  userId: string;
  weekStart: string; // YYYY-MM-DD
  weekEnd: string; // YYYY-MM-DD
  totalAyatsMemorized: number;
  totalAyatsReviewed: number;
  totalTimeSpent: number;
  sessionsCompleted: number;
  averageSessionTime: number;
  currentStreak: number;
  longestStreak: number;
  consistencyScore: number; // 0-100
  improvements: string[];
  challenges: string[];
  nextWeekGoals: string[];
}

export interface StudyPlan {
  id: string;
  userId: string;
  name: string;
  description: string;
  targetSurahs: number[];
  targetAyatsPerDay: number;
  estimatedDuration: number; // in days
  difficulty: "beginner" | "intermediate" | "advanced";
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  progress: {
    completedSurahs: number[];
    totalAyatsCompleted: number;
    currentDay: number;
    dailyProgress: { day: number; ayatsMemorized: number; date: string }[];
  };
  isActive: boolean;
}

export interface ReviewSchedule {
  id: string;
  userId: string;
  ayatId: string;
  scheduledFor: Date;
  reviewType: "light" | "medium" | "intensive";
  interval: number; // days until next review
  easeFactor: number; // Spaced repetition factor
  reviewCount: number;
  lastReviewedAt: Date;
  nextReviewAt: Date;
}

// API Response Types
export interface DashboardMetrics {
  user: User;
  todayProgress: DailyProgress | null;
  weeklyReport: WeeklyReport | null;
  upcomingReviews: ReviewSchedule[];
  recentSessions: StudySession[];
  achievements: Achievement[];
  studyPlans: StudyPlan[];
}

// Database Operations Interface
export interface DatabaseOperations {
  // User Operations
  createUser(
    userData: Omit<User, "id" | "createdAt" | "lastLoginAt">,
  ): Promise<User>;
  getUser(userId: string): Promise<User | null>;
  updateUser(userId: string, updates: Partial<User>): Promise<User>;
  deleteUser(userId: string): Promise<void>;

  // Streak Operations
  updateStreak(userId: string): Promise<UserStreak>;
  getStreakHistory(userId: string): Promise<string[]>;

  // Memorized Ayats
  addMemorizedAyat(
    ayat: Omit<
      MemorizedAyat,
      "id" | "memorizedAt" | "lastReviewedAt" | "reviewCount"
    >,
  ): Promise<MemorizedAyat>;
  getMemorizedAyats(userId: string): Promise<MemorizedAyat[]>;
  updateMemorizedAyat(
    ayatId: string,
    updates: Partial<MemorizedAyat>,
  ): Promise<MemorizedAyat>;
  removeMemorizedAyat(ayatId: string): Promise<void>;

  // Study Sessions
  createSession(session: Omit<StudySession, "id">): Promise<StudySession>;
  getSessions(userId: string, limit?: number): Promise<StudySession[]>;
  updateSession(
    sessionId: string,
    updates: Partial<StudySession>,
  ): Promise<StudySession>;

  // Daily Progress
  updateDailyProgress(
    userId: string,
    progress: Partial<DailyProgress>,
  ): Promise<DailyProgress>;
  getDailyProgress(
    userId: string,
    startDate: string,
    endDate: string,
  ): Promise<DailyProgress[]>;

  // Achievements
  unlockAchievement(
    userId: string,
    achievement: Omit<Achievement, "id" | "earnedAt">,
  ): Promise<Achievement>;
  getAchievements(userId: string): Promise<Achievement[]>;

  // Study Plans
  createStudyPlan(
    plan: Omit<StudyPlan, "id" | "createdAt" | "progress">,
  ): Promise<StudyPlan>;
  getStudyPlans(userId: string): Promise<StudyPlan[]>;
  updateStudyPlan(
    planId: string,
    updates: Partial<StudyPlan>,
  ): Promise<StudyPlan>;

  // Reviews
  scheduleReview(review: Omit<ReviewSchedule, "id">): Promise<ReviewSchedule>;
  getUpcomingReviews(userId: string): Promise<ReviewSchedule[]>;
  completeReview(reviewId: string): Promise<ReviewSchedule>;
}

// Database Implementation (would be replaced with actual database calls)
export class MockDatabase implements DatabaseOperations {
  // This would be replaced with actual database implementation
  // For now, it's a placeholder that uses localStorage

  private users: Map<string, User> = new Map();
  private memorizedAyats: Map<string, MemorizedAyat[]> = new Map();
  private sessions: Map<string, StudySession[]> = new Map();
  private dailyProgress: Map<string, DailyProgress[]> = new Map();
  private achievements: Map<string, Achievement[]> = new Map();

  async createUser(
    userData: Omit<User, "id" | "createdAt" | "lastLoginAt">,
  ): Promise<User> {
    const user: User = {
      ...userData,
      id: `user_${Date.now()}`,
      createdAt: new Date(),
      lastLoginAt: new Date(),
    };
    this.users.set(user.id, user);
    return user;
  }

  async getUser(userId: string): Promise<User | null> {
    return this.users.get(userId) || null;
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<User> {
    const user = this.users.get(userId);
    if (!user) throw new Error("User not found");

    const updatedUser = { ...user, ...updates };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  async deleteUser(userId: string): Promise<void> {
    this.users.delete(userId);
    this.memorizedAyats.delete(userId);
    this.sessions.delete(userId);
    this.dailyProgress.delete(userId);
    this.achievements.delete(userId);
  }

  async updateStreak(userId: string): Promise<UserStreak> {
    const user = this.users.get(userId);
    if (!user) throw new Error("User not found");

    // Update streak logic here
    const updatedStreak = user.streak;
    await this.updateUser(userId, { streak: updatedStreak });
    return updatedStreak;
  }

  async getStreakHistory(userId: string): Promise<string[]> {
    const user = this.users.get(userId);
    if (!user) throw new Error("User not found");

    return user.streak.loginDates;
  }

  async addMemorizedAyat(
    ayat: Omit<
      MemorizedAyat,
      "id" | "memorizedAt" | "lastReviewedAt" | "reviewCount"
    >,
  ): Promise<MemorizedAyat> {
    const userAyats = this.memorizedAyats.get(ayat.userId) || [];
    const newAyat: MemorizedAyat = {
      ...ayat,
      id: `ayat_${Date.now()}`,
      memorizedAt: new Date(),
      lastReviewedAt: new Date(),
      reviewCount: 1,
    };

    userAyats.push(newAyat);
    this.memorizedAyats.set(ayat.userId, userAyats);
    return newAyat;
  }

  async getMemorizedAyats(userId: string): Promise<MemorizedAyat[]> {
    return this.memorizedAyats.get(userId) || [];
  }

  async updateMemorizedAyat(
    ayatId: string,
    updates: Partial<MemorizedAyat>,
  ): Promise<MemorizedAyat> {
    // Find the ayat across all users
    const ayatEntries = Array.from(this.memorizedAyats.entries());
    for (const [userId, ayats] of ayatEntries) {
      const ayatIndex = ayats.findIndex((a: MemorizedAyat) => a.id === ayatId);
      if (ayatIndex !== -1) {
        const updatedAyat = { ...ayats[ayatIndex], ...updates };
        ayats[ayatIndex] = updatedAyat;
        this.memorizedAyats.set(userId, ayats);
        return updatedAyat;
      }
    }
    throw new Error("Ayat not found");
  }

  async removeMemorizedAyat(ayatId: string): Promise<void> {
    const ayatEntries = Array.from(this.memorizedAyats.entries());
    for (const [userId, ayats] of ayatEntries) {
      const ayatIndex = ayats.findIndex((a: MemorizedAyat) => a.id === ayatId);
      if (ayatIndex !== -1) {
        ayats.splice(ayatIndex, 1);
        this.memorizedAyats.set(userId, ayats);
        return;
      }
    }
    throw new Error("Ayat not found");
  }

  async createSession(
    session: Omit<StudySession, "id">,
  ): Promise<StudySession> {
    const userSessions = this.sessions.get(session.userId) || [];
    const newSession: StudySession = {
      ...session,
      id: `session_${Date.now()}`,
    };

    userSessions.push(newSession);
    this.sessions.set(session.userId, userSessions);
    return newSession;
  }

  async getSessions(userId: string, limit?: number): Promise<StudySession[]> {
    const sessions = this.sessions.get(userId) || [];
    return limit ? sessions.slice(-limit) : sessions;
  }

  async updateSession(
    sessionId: string,
    updates: Partial<StudySession>,
  ): Promise<StudySession> {
    const sessionEntries = Array.from(this.sessions.entries());
    for (const [userId, sessions] of sessionEntries) {
      const sessionIndex = sessions.findIndex(
        (s: StudySession) => s.id === sessionId,
      );
      if (sessionIndex !== -1) {
        const updatedSession = { ...sessions[sessionIndex], ...updates };
        sessions[sessionIndex] = updatedSession;
        this.sessions.set(userId, sessions);
        return updatedSession;
      }
    }
    throw new Error("Session not found");
  }

  async updateDailyProgress(
    userId: string,
    progress: Partial<DailyProgress>,
  ): Promise<DailyProgress> {
    const userProgress = this.dailyProgress.get(userId) || [];
    const today = new Date().toISOString().split("T")[0];

    let existingProgress = userProgress.find((p) => p.date === today);

    if (existingProgress) {
      existingProgress = { ...existingProgress, ...progress };
      const index = userProgress.findIndex((p) => p.date === today);
      userProgress[index] = existingProgress;
    } else {
      existingProgress = {
        id: `progress_${Date.now()}`,
        userId,
        date: today,
        ayatsMemorized: 0,
        ayatsReviewed: 0,
        timeSpent: 0,
        sessionsCompleted: 0,
        averageSpeed: 1,
        averageLoops: 5,
        streakMaintained: false,
        ...progress,
      };
      userProgress.push(existingProgress);
    }

    this.dailyProgress.set(userId, userProgress);
    return existingProgress;
  }

  async getDailyProgress(
    userId: string,
    startDate: string,
    endDate: string,
  ): Promise<DailyProgress[]> {
    const progress = this.dailyProgress.get(userId) || [];
    return progress.filter((p) => p.date >= startDate && p.date <= endDate);
  }

  async unlockAchievement(
    userId: string,
    achievement: Omit<Achievement, "id" | "earnedAt">,
  ): Promise<Achievement> {
    const userAchievements = this.achievements.get(userId) || [];
    const newAchievement: Achievement = {
      ...achievement,
      id: `achievement_${Date.now()}`,
      earnedAt: new Date(),
    };

    userAchievements.push(newAchievement);
    this.achievements.set(userId, userAchievements);
    return newAchievement;
  }

  async getAchievements(userId: string): Promise<Achievement[]> {
    return this.achievements.get(userId) || [];
  }

  async createStudyPlan(
    plan: Omit<StudyPlan, "id" | "createdAt" | "progress">,
  ): Promise<StudyPlan> {
    // This would need to be stored in a proper database
    throw new Error("Not implemented in mock database");
  }

  async getStudyPlans(userId: string): Promise<StudyPlan[]> {
    // This would need to be stored in a proper database
    return [];
  }

  async updateStudyPlan(
    planId: string,
    updates: Partial<StudyPlan>,
  ): Promise<StudyPlan> {
    // This would need to be stored in a proper database
    throw new Error("Not implemented in mock database");
  }

  async scheduleReview(
    review: Omit<ReviewSchedule, "id">,
  ): Promise<ReviewSchedule> {
    // This would need to be stored in a proper database
    throw new Error("Not implemented in mock database");
  }

  async getUpcomingReviews(userId: string): Promise<ReviewSchedule[]> {
    // This would need to be stored in a proper database
    return [];
  }

  async completeReview(reviewId: string): Promise<ReviewSchedule> {
    // This would need to be stored in a proper database
    throw new Error("Not implemented in mock database");
  }
}
