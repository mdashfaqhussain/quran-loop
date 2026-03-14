"use client";

import { useState, useMemo } from "react";
import { CheckCircle2, Circle, Clock, Trophy, Target, TrendingUp, Calendar, Filter, Search, Star } from "lucide-react";

interface MemorizedItem {
  surahName: string;
  ayatNum: number;
  surahNum: number;
  memorizedAt: Date;
  reviewCount: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  lastReviewed?: Date;
}

interface EnhancedProgressDashboardProps {
  memorized: MemorizedItem[];
  totalAyats: number;
  currentStreak: number;
  longestStreak: number;
}

export default function EnhancedProgressDashboard({ 
  memorized, 
  totalAyats, 
  currentStreak, 
  longestStreak 
}: EnhancedProgressDashboardProps) {
  const [filter, setFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'reviews'>('date');
  const [selectedItem, setSelectedItem] = useState<MemorizedItem | null>(null);

  // Calculate dynamic stats
  const stats = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thisMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    const todayMemorized = memorized.filter(item => new Date(item.memorizedAt) >= today);
    const weekMemorized = memorized.filter(item => new Date(item.memorizedAt) >= thisWeek);
    const monthMemorized = memorized.filter(item => new Date(item.memorizedAt) >= thisMonth);

    const averageReviews = memorized.length > 0 
      ? memorized.reduce((sum, item) => sum + item.reviewCount, 0) / memorized.length 
      : 0;

    const uniqueSurahs = new Set(memorized.map(item => item.surahNum)).size;

    return {
      todayCount: todayMemorized.length,
      weekCount: weekMemorized.length,
      monthCount: monthMemorized.length,
      averageReviews: Math.round(averageReviews * 10) / 10,
      uniqueSurahs,
      completionRate: Math.round((memorized.length / totalAyats) * 100)
    };
  }, [memorized, totalAyats]);

  // Filter and sort items
  const filteredItems = useMemo(() => {
    let filtered = memorized.filter(item => {
      const matchesSearch = searchTerm === '' || 
        item.surahName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.ayatNum.toString().includes(searchTerm);

      const now = new Date();
      const itemDate = new Date(item.memorizedAt);
      
      const matchesFilter = filter === 'all' ||
        (filter === 'today' && itemDate.toDateString() === now.toDateString()) ||
        (filter === 'week' && itemDate >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)) ||
        (filter === 'month' && itemDate >= new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000));

      return matchesSearch && matchesFilter;
    });

    // Sort items
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.memorizedAt).getTime() - new Date(a.memorizedAt).getTime();
        case 'name':
          return a.surahName.localeCompare(b.surahName);
        case 'reviews':
          return b.reviewCount - a.reviewCount;
        default:
          return 0;
      }
    });
  }, [memorized, filter, searchTerm, sortBy]);

  return (
    <div className="space-y-6">
      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-xl p-6 hover-lift">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center gap-1 text-emerald-600">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">+{stats.todayCount}</span>
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold text-ink-DEFAULT">{memorized.length}</p>
            <p className="text-sm text-ink-fant">Total Memorized</p>
            <div className="mt-2 bg-parchment-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-emerald-400 to-emerald-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${stats.completionRate}%` }}
              />
            </div>
          </div>
        </div>

        <div className="glass-card rounded-xl p-6 hover-lift">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center gap-1 text-blue-600">
              <Star className="w-4 h-4" />
              <span className="text-sm font-medium">{stats.uniqueSurahs}</span>
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold text-ink-DEFAULT">{stats.completionRate}%</p>
            <p className="text-sm text-ink-fant">Completion Rate</p>
            <p className="text-xs text-ink-muted mt-1">{stats.uniqueSurahs} unique surahs</p>
          </div>
        </div>

        <div className="glass-card rounded-xl p-6 hover-lift">
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
            <p className="text-3xl font-bold text-ink-DEFAULT">{currentStreak}</p>
            <p className="text-sm text-ink-fant">Current Streak</p>
            <p className="text-xs text-ink-muted mt-1">Best: {longestStreak} days</p>
          </div>
        </div>

        <div className="glass-card rounded-xl p-6 hover-lift">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center gap-1 text-purple-600">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">{stats.averageReviews}x</span>
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold text-ink-DEFAULT">{stats.averageReviews}</p>
            <p className="text-sm text-ink-fant">Avg Reviews</p>
            <p className="text-xs text-ink-muted mt-1">Per ayat</p>
          </div>
        </div>
      </div>

      {/* Enhanced Filter and Search */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-ink-fant" />
            <input
              type="text"
              placeholder="Search memorized ayats..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-parchment-300 bg-parchment-50 text-ink-DEFAULT placeholder-ink-fant focus:outline-none focus:ring-2 focus:ring-emerald-DEFAULT/30 focus:border-emerald-DEFAULT transition-all"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2">
            {[
              { key: 'all', label: 'All Time', count: memorized.length },
              { key: 'today', label: 'Today', count: stats.todayCount },
              { key: 'week', label: 'This Week', count: stats.weekCount },
              { key: 'month', label: 'This Month', count: stats.monthCount }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key as any)}
                className={`
                  px-4 py-3 rounded-xl text-sm font-medium transition-all hover-lift
                  ${filter === tab.key
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg'
                    : 'bg-parchment-100 text-ink-muted hover:bg-parchment-200'
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
            className="px-4 py-3 rounded-xl border border-parchment-300 bg-parchment-50 text-ink-DEFAULT focus:outline-none focus:ring-2 focus:ring-emerald-DEFAULT/30"
          >
            <option value="date">Sort by Date</option>
            <option value="name">Sort by Name</option>
            <option value="reviews">Sort by Reviews</option>
          </select>
        </div>

        {/* Memorized List */}
        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <Circle className="w-16 h-16 mx-auto mb-4 text-ink-fant" />
              <p className="text-ink-fant text-lg">No memorized ayats found</p>
              <p className="text-ink-muted text-sm mt-2">Try adjusting your search or filters</p>
            </div>
          ) : (
            filteredItems.map((item, index) => (
              <div
                key={`${item.surahNum}-${item.ayatNum}`}
                onClick={() => setSelectedItem(item)}
                className={`
                  p-4 rounded-xl border transition-all cursor-pointer hover-lift
                  ${selectedItem === item 
                    ? 'bg-gradient-to-r from-emerald-50 to-emerald-100 border-emerald-300 shadow-lg' 
                    : 'bg-white border-parchment-200 hover:border-emerald-200 hover:shadow-md'
                  }
                `}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-DEFAULT flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-ink-DEFAULT">
                          {item.surahName} - Ayat {item.ayatNum}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-ink-fant mt-1">
                          <span>Memorized {new Date(item.memorizedAt).toLocaleDateString()}</span>
                          <span>•</span>
                          <span>Reviewed {item.reviewCount} times</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-xs text-ink-muted">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(item.memorizedAt).toLocaleDateString()}</span>
                      </div>
                      <button className="mt-1 px-3 py-1 bg-emerald-DEFAULT text-white rounded-lg text-xs font-medium hover:bg-emerald-700 transition-all">
                        Review Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
