"use client";

import { useState } from "react";
import { CheckCircle2, Circle, Clock, Trophy, Target } from "lucide-react";

interface MemorizedItem {
  surahName: string;
  ayatNum: number;
  surahNum: number;
  memorizedAt: Date;
  reviewCount: number;
}

interface ProgressDashboardProps {
  memorized: MemorizedItem[];
  totalAyats: number;
  currentStreak: number;
  longestStreak: number;
}

export default function ProgressDashboard({ 
  memorized, 
  totalAyats, 
  currentStreak, 
  longestStreak 
}: ProgressDashboardProps) {
  const [filter, setFilter] = useState<'all' | 'today' | 'week'>('all');

  const filteredItems = memorized.filter(item => {
    const now = new Date();
    const itemDate = new Date(item.memorizedAt);
    
    switch (filter) {
      case 'today':
        return itemDate.toDateString() === now.toDateString();
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return itemDate >= weekAgo;
      default:
        return true;
    }
  });

  const completionRate = totalAyats > 0 ? Math.round((memorized.length / totalAyats) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-parchment-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-light rounded-lg">
              <Trophy className="w-5 h-5 text-emerald-muted" />
            </div>
            <div>
              <p className="text-2xl font-bold text-ink-DEFAULT">{memorized.length}</p>
              <p className="text-xs text-ink-faint">Total Memorized</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-parchment-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-light rounded-lg">
              <Target className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-ink-DEFAULT">{completionRate}%</p>
              <p className="text-xs text-ink-faint">Completion Rate</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-parchment-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-light rounded-lg">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-ink-DEFAULT">{currentStreak}</p>
              <p className="text-xs text-ink-faint">Current Streak</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-parchment-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-light rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-ink-DEFAULT">{longestStreak}</p>
              <p className="text-xs text-ink-faint">Longest Streak</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white border border-parchment-200 rounded-xl p-4 shadow-sm">
        <div className="flex gap-2 mb-4">
          {[
            { key: 'all', label: 'All Time' },
            { key: 'today', label: 'Today' },
            { key: 'week', label: 'This Week' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as any)}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium transition-all
                ${filter === tab.key
                  ? 'bg-emerald-DEFAULT text-white'
                  : 'bg-parchment-100 text-ink-muted hover:bg-parchment-200'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Memorized List */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredItems.length === 0 ? (
            <div className="text-center py-8 text-ink-faint">
              <Circle className="w-12 h-12 mx-auto mb-3 text-ink-faint" />
              <p>No memorized ayats found for this period</p>
            </div>
          ) : (
            filteredItems.map((item, index) => (
              <div
                key={`${item.surahNum}-${item.ayatNum}`}
                className="flex items-center justify-between p-3 bg-parchment-50 rounded-lg border border-parchment-200 hover:bg-parchment-100 transition-all"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-DEFAULT flex-shrink-0" />
                  <div>
                    <p className="font-medium text-ink-DEFAULT">
                      {item.surahName} - Ayat {item.ayatNum}
                    </p>
                    <p className="text-xs text-ink-faint">
                      Memorized {new Date(item.memorizedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-ink-faint">
                    Reviewed {item.reviewCount}x
                  </span>
                  <button className="text-emerald-DEFAULT hover:text-emerald-700 text-sm font-medium">
                    Review
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
