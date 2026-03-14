"use client";

import { useState, useMemo } from "react";
import {
  CheckCircle2,
  Circle,
  Clock,
  Trophy,
  Target,
  TrendingUp,
  Calendar,
  Filter,
  Search,
  Star,
  Brain,
  Award,
  Zap,
  BookOpen,
  RefreshCw,
  BarChart3,
  Users,
  Flame,
} from "lucide-react";

interface MemorizedItem {
  surahName: string;
  ayatNum: number;
  surahNum: number;
  memorizedAt: Date;
  reviewCount: number;
  difficulty?: "easy" | "medium" | "hard";
  lastReviewed?: Date;
  masteryLevel?: "new" | "learning" | "reviewing" | "mastered";
  revisionInterval?: number; // days until next review
}

interface StudySession {
  id: string;
  startTime: Date;
  endTime?: Date;
  ayatsStudied: number;
  ayatsMemorized: number;
  sessionType: "memorization" | "review" | "mixed";
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  progress: number;
  target: number;
}

interface AdvancedProgressDashboardProps {
  memorized: MemorizedItem[];
  totalAyats: number;
  currentStreak: number;
  longestStreak: number;
  onReviewAyat?: (surahNum: number, ayatNum: number, surahName: string) => void;
}

export default function AdvancedProgressDashboard({
  memorized,
  totalAyats,
  currentStreak,
  longestStreak,
  onReviewAyat,
}: AdvancedProgressDashboardProps) {
  const [filter, setFilter] = useState<
    "all" | "today" | "week" | "month" | "due" | "overdue"
  >("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<
    "date" | "name" | "reviews" | "nextReview"
  >("nextReview");
  const [selectedItem, setSelectedItem] = useState<MemorizedItem | null>(null);
  const [activeTab, setActiveTab] = useState<
    "overview" | "revision" | "achievements" | "sessions"
  >("overview");

  // Calculate dynamic stats
  const stats = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thisMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    const todayMemorized = memorized.filter(
      (item) => new Date(item.memorizedAt) >= today,
    );
    const weekMemorized = memorized.filter(
      (item) => new Date(item.memorizedAt) >= thisWeek,
    );
    const monthMemorized = memorized.filter(
      (item) => new Date(item.memorizedAt) >= thisMonth,
    );

    const averageReviews =
      memorized.length > 0
        ? memorized.reduce((sum, item) => sum + item.reviewCount, 0) /
          memorized.length
        : 0;

    const uniqueSurahs = new Set(memorized.map((item) => item.surahNum)).size;

    // Calculate mastery levels
    const masteryLevels = {
      new: memorized.filter((item) => item.reviewCount <= 1).length,
      learning: memorized.filter(
        (item) => item.reviewCount >= 2 && item.reviewCount <= 4,
      ).length,
      reviewing: memorized.filter(
        (item) => item.reviewCount >= 5 && item.reviewCount <= 7,
      ).length,
      mastered: memorized.filter((item) => item.reviewCount >= 8).length,
    };

    // Calculate items due for review
    const dueForReview = memorized.filter((item) => {
      if (!item.lastReviewed) return false;
      const daysSinceReview = Math.floor(
        (now.getTime() - new Date(item.lastReviewed).getTime()) /
          (1000 * 60 * 60 * 24),
      );
      const interval = calculateRevisionInterval(item.reviewCount);
      return daysSinceReview >= interval;
    });

    const overdue = memorized.filter((item) => {
      if (!item.lastReviewed) return false;
      const daysSinceReview = Math.floor(
        (now.getTime() - new Date(item.lastReviewed).getTime()) /
          (1000 * 60 * 60 * 24),
      );
      const interval = calculateRevisionInterval(item.reviewCount);
      return daysSinceReview > interval;
    });

    return {
      todayCount: todayMemorized.length,
      weekCount: weekMemorized.length,
      monthCount: monthMemorized.length,
      averageReviews: Math.round(averageReviews * 10) / 10,
      uniqueSurahs,
      completionRate: Math.round((memorized.length / totalAyats) * 100),
      masteryLevels,
      dueForReview: dueForReview.length,
      overdue: overdue.length,
      retentionRate:
        memorized.length > 0
          ? Math.round(
              ((masteryLevels.reviewing + masteryLevels.mastered) /
                memorized.length) *
                100,
            )
          : 0,
    };
  }, [memorized, totalAyats]);

  // Calculate revision interval based on spaced repetition
  function calculateRevisionInterval(reviewCount: number): number {
    if (reviewCount <= 1) return 1; // Review next day
    if (reviewCount <= 2) return 3; // Review in 3 days
    if (reviewCount <= 4) return 7; // Review in 1 week
    if (reviewCount <= 7) return 14; // Review in 2 weeks
    if (reviewCount <= 10) return 30; // Review in 1 month
    return 60; // Review in 2 months
  }

  // Determine mastery level
  function getMasteryLevel(
    reviewCount: number,
  ): "new" | "learning" | "reviewing" | "mastered" {
    if (reviewCount <= 1) return "new";
    if (reviewCount <= 4) return "learning";
    if (reviewCount <= 7) return "reviewing";
    return "mastered";
  }

  // Generate achievements
  const achievements: Achievement[] = useMemo(() => {
    const totalAchievements = [
      {
        id: "first_ayat",
        title: "First Steps",
        description: "Memorize your first ayat",
        icon: "🌱",
        target: 1,
      },
      {
        id: "ten_ayats",
        title: "Growing Strong",
        description: "Memorize 10 ayats",
        icon: "🌿",
        target: 10,
      },
      {
        id: "fifty_ayats",
        title: "Dedicated Student",
        description: "Memorize 50 ayats",
        icon: "🌳",
        target: 50,
      },
      {
        id: "hundred_ayats",
        title: "Quran Scholar",
        description: "Memorize 100 ayats",
        icon: "📚",
        target: 100,
      },
      {
        id: "week_streak",
        title: "Consistent Learner",
        description: "7-day streak",
        icon: "🔥",
        target: 7,
      },
      {
        id: "month_streak",
        title: "Unstoppable",
        description: "30-day streak",
        icon: "💪",
        target: 30,
      },
      {
        id: "first_surah",
        title: "Surah Master",
        description: "Complete your first surah",
        icon: "🏆",
        target: 1,
      },
      {
        id: "five_surahs",
        title: "Surah Expert",
        description: "Complete 5 surahs",
        icon: "👑",
        target: 5,
      },
    ];

    return totalAchievements.map((achievement) => {
      let progress = 0;
      if (achievement.id.includes("ayat")) progress = memorized.length;
      else if (achievement.id.includes("streak")) progress = currentStreak;
      else if (achievement.id.includes("surah")) progress = stats.uniqueSurahs;

      return {
        ...achievement,
        progress,
        unlockedAt: progress >= achievement.target ? new Date() : undefined,
      };
    });
  }, [memorized.length, currentStreak, stats.uniqueSurahs]);

  // Filter and sort items
  const filteredItems = useMemo(() => {
    let filtered = memorized.map((item) => ({
      ...item,
      masteryLevel: getMasteryLevel(item.reviewCount),
      revisionInterval: calculateRevisionInterval(item.reviewCount),
    }));

    // Apply filters
    if (filter !== "all") {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const thisMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

      filtered = filtered.filter((item) => {
        const matchesSearch =
          searchTerm === "" ||
          item.surahName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.ayatNum.toString().includes(searchTerm);

        if (!matchesSearch) return false;

        switch (filter) {
          case "today":
            return new Date(item.memorizedAt) >= today;
          case "week":
            return new Date(item.memorizedAt) >= thisWeek;
          case "month":
            return new Date(item.memorizedAt) >= thisMonth;
          case "due":
            if (!item.lastReviewed) return false;
            const daysSinceReview = Math.floor(
              (now.getTime() - new Date(item.lastReviewed).getTime()) /
                (1000 * 60 * 60 * 24),
            );
            return daysSinceReview >= item.revisionInterval;
          case "overdue":
            if (!item.lastReviewed) return false;
            const daysOverdue = Math.floor(
              (now.getTime() - new Date(item.lastReviewed).getTime()) /
                (1000 * 60 * 60 * 24),
            );
            return daysOverdue > item.revisionInterval;
          default:
            return true;
        }
      });
    }

    // Sort items
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "date":
          return (
            new Date(b.memorizedAt).getTime() -
            new Date(a.memorizedAt).getTime()
          );
        case "name":
          return a.surahName.localeCompare(b.surahName);
        case "reviews":
          return b.reviewCount - a.reviewCount;
        case "nextReview":
          if (!a.lastReviewed && !b.lastReviewed) return 0;
          if (!a.lastReviewed) return 1;
          if (!b.lastReviewed) return -1;
          return (
            new Date(a.lastReviewed).getTime() -
            new Date(b.lastReviewed).getTime()
          );
        default:
          return 0;
      }
    });
  }, [memorized, filter, searchTerm, sortBy]);

  const getMasteryColor = (level: string) => {
    switch (level) {
      case "new":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "learning":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "reviewing":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "mastered":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getMasteryIcon = (level: string) => {
    switch (level) {
      case "new":
        return <Circle className="w-4 h-4" />;
      case "learning":
        return <Brain className="w-4 h-4" />;
      case "reviewing":
        return <RefreshCw className="w-4 h-4" />;
      case "mastered":
        return <Trophy className="w-4 h-4" />;
      default:
        return <Circle className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex gap-2 p-1 bg-neutral-100 rounded-xl">
        {[
          { id: "overview", label: "Overview", icon: BarChart3 },
          { id: "revision", label: "Revision", icon: RefreshCw },
          { id: "achievements", label: "Achievements", icon: Trophy },
          { id: "sessions", label: "Sessions", icon: Clock },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all
                ${
                  activeTab === tab.id
                    ? "bg-white text-primary-600 shadow-sm"
                    : "text-neutral-600 hover:text-neutral-900"
                }
              `}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {activeTab === "overview" && (
        <>
          {/* Enhanced Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="card card-hover p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center gap-1 text-primary-600">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    +{stats.todayCount}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold text-neutral-900">
                  {memorized.length}
                </p>
                <p className="text-sm text-neutral-500">Total Memorized</p>
                <div className="mt-2 bg-neutral-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${stats.completionRate}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="card card-hover p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center gap-1 text-blue-600">
                  <Star className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {stats.uniqueSurahs}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold text-neutral-900">
                  {stats.completionRate}%
                </p>
                <p className="text-sm text-neutral-500">Completion Rate</p>
                <p className="text-xs text-neutral-400 mt-1">
                  {stats.uniqueSurahs} unique surahs
                </p>
              </div>
            </div>

            <div className="card card-hover p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center gap-1 text-orange-600">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm font-medium">{stats.weekCount}</span>
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold text-neutral-900">
                  {currentStreak}
                </p>
                <p className="text-sm text-neutral-500">Current Streak</p>
                <p className="text-xs text-neutral-400 mt-1">
                  Best: {longestStreak} days
                </p>
              </div>
            </div>

            <div className="card card-hover p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center gap-1 text-purple-600">
                  <Zap className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {stats.retentionRate}%
                  </span>
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold text-neutral-900">
                  {stats.retentionRate}%
                </p>
                <p className="text-sm text-neutral-500">Retention Rate</p>
                <p className="text-xs text-neutral-400 mt-1">
                  Avg {stats.averageReviews} reviews
                </p>
              </div>
            </div>
          </div>

          {/* Mastery Distribution */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">
              Mastery Distribution
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(stats.masteryLevels).map(([level, count]) => (
                <div key={level} className="text-center">
                  <div
                    className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium border ${getMasteryColor(level)}`}
                  >
                    {getMasteryIcon(level)}
                    <span className="capitalize">{level}</span>
                  </div>
                  <p className="text-2xl font-bold text-neutral-900 mt-2">
                    {count}
                  </p>
                  <p className="text-xs text-neutral-500">ayats</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {activeTab === "revision" && (
        <div className="card p-6">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Search memorized ayats..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-200 bg-white text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2">
              {[
                { key: "all", label: "All", count: memorized.length },
                { key: "due", label: "Due", count: stats.dueForReview },
                { key: "overdue", label: "Overdue", count: stats.overdue },
                { key: "today", label: "Today", count: stats.todayCount },
                { key: "week", label: "This Week", count: stats.weekCount },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key as any)}
                  className={`
                    px-4 py-3 rounded-xl text-sm font-medium transition-all hover-lift
                    ${
                      filter === tab.key
                        ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg"
                        : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                    }
                  `}
                >
                  {tab.label}
                  <span className="ml-2 px-2 py-1 rounded-full bg-white/20 text-xs">
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-3 rounded-xl border border-neutral-200 bg-white text-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            >
              <option value="nextReview">Next Review</option>
              <option value="date">Sort by Date</option>
              <option value="name">Sort by Name</option>
              <option value="reviews">Sort by Reviews</option>
            </select>
          </div>

          {/* Revision List */}
          <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {filteredItems.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 mx-auto mb-4 text-neutral-300" />
                <p className="text-neutral-500 text-lg">No ayats found</p>
                <p className="text-neutral-400 text-sm mt-2">
                  Try adjusting your search or filters
                </p>
              </div>
            ) : (
              filteredItems.map((item, index) => (
                <div
                  key={`${item.surahNum}-${item.ayatNum}`}
                  className="p-4 rounded-xl border transition-all cursor-pointer hover-lift bg-white border-neutral-200 hover:border-primary-200 hover:shadow-md"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-primary-500 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-neutral-900">
                            {item.surahName} - Ayat {item.ayatNum}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-neutral-500 mt-1">
                            <span>Reviewed {item.reviewCount} times</span>
                            <span>•</span>
                            <span>
                              Next review in {item.revisionInterval} days
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getMasteryColor(item.masteryLevel!)}`}
                      >
                        {getMasteryIcon(item.masteryLevel!)}
                        <span className="capitalize">{item.masteryLevel}</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onReviewAyat) {
                            onReviewAyat(
                              item.surahNum,
                              item.ayatNum,
                              item.surahName,
                            );
                          }
                        }}
                        className="px-3 py-2 bg-primary-500 text-white rounded-lg text-xs font-medium hover:bg-primary-600 transition-all"
                      >
                        Review Now
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === "achievements" && (
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-6">
            Achievements
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`
                  p-4 rounded-xl border transition-all
                  ${
                    achievement.unlockedAt
                      ? "bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200"
                      : "bg-neutral-50 border-neutral-200 opacity-60"
                  }
                `}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-2xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-neutral-900">
                      {achievement.title}
                    </h4>
                    <p className="text-xs text-neutral-500">
                      {achievement.description}
                    </p>
                  </div>
                  {achievement.unlockedAt && (
                    <Award className="w-5 h-5 text-yellow-500" />
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-neutral-600">
                    <span>Progress</span>
                    <span>
                      {achievement.progress}/{achievement.target}
                    </span>
                  </div>
                  <div className="bg-neutral-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        achievement.unlockedAt
                          ? "bg-gradient-to-r from-yellow-400 to-orange-400"
                          : "bg-gradient-to-r from-neutral-300 to-neutral-400"
                      }`}
                      style={{
                        width: `${Math.min((achievement.progress / achievement.target) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "sessions" && (
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-6">
            Study Sessions
          </h3>
          <div className="text-center py-12">
            <Clock className="w-16 h-16 mx-auto mb-4 text-neutral-300" />
            <p className="text-neutral-500 text-lg">No sessions yet</p>
            <p className="text-neutral-400 text-sm mt-2">
              Start memorizing to track your study sessions
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
