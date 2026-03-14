"use client";

import { useState, useMemo } from "react";
import { SURAHS } from "@/lib/surahs";
import { Search, BookOpen, CheckCircle, Filter, Grid, List, Star, Clock, TrendingUp } from "lucide-react";

interface EnhancedSurahLibraryProps {
  onSurahSelect: (surahNum: number, surahName: string) => void;
  memorizedAyats?: Array<{ surahNum: number; ayatNum: number }>;
}

export default function EnhancedSurahLibrary({ onSurahSelect, memorizedAyats = [] }: EnhancedSurahLibraryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'number' | 'name' | 'ayats'>('number');
  const [filterBy, setFilterBy] = useState<'all' | 'memorized' | 'unmemorized'>('all');

  // Calculate memorization stats for each surah
  const surahStats = useMemo(() => {
    return SURAHS.map(surah => {
      const memorizedInSurah = memorizedAyats.filter(item => item.surahNum === surah.number);
      const memorizedCount = memorizedInSurah.length;
      const completionRate = Math.round((memorizedCount / surah.ayatCount) * 100);
      
      return {
        ...surah,
        memorizedCount,
        completionRate,
        isStarted: memorizedCount > 0,
        isCompleted: memorizedCount === surah.ayatCount
      };
    });
  }, [memorizedAyats]);

  // Filter and sort surahs
  const filteredAndSortedSurahs = useMemo(() => {
    let filtered = surahStats.filter(surah => {
      const matchesSearch = searchTerm === "" || 
        surah.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        surah.arabicName.includes(searchTerm) ||
        surah.number.toString().includes(searchTerm);

      const matchesFilter = filterBy === 'all' ||
        (filterBy === 'memorized' && surah.isStarted) ||
        (filterBy === 'unmemorized' && !surah.isStarted);

      return matchesSearch && matchesFilter;
    });

    // Sort surahs
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'number':
          return a.number - b.number;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'ayats':
          return b.ayatCount - a.ayatCount;
        default:
          return 0;
      }
    });
  }, [surahStats, searchTerm, sortBy, filterBy]);

  const stats = useMemo(() => {
    const totalSurahs = SURAHS.length;
    const startedSurahs = surahStats.filter(s => s.isStarted).length;
    const completedSurahs = surahStats.filter(s => s.isCompleted).length;
    const totalMemorizedAyats = memorizedAyats.length;
    
    return {
      totalSurahs,
      startedSurahs,
      completedSurahs,
      totalMemorizedAyats,
      overallProgress: Math.round((startedSurahs / totalSurahs) * 100)
    };
  }, [surahStats, memorizedAyats]);

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card rounded-xl p-6 hover-lift">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold text-ink-DEFAULT">{stats.totalSurahs}</p>
              <p className="text-sm text-ink-fant">Total Surahs</p>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-xl p-6 hover-lift">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold text-ink-DEFAULT">{stats.startedSurahs}</p>
              <p className="text-sm text-ink-fant">Started</p>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-xl p-6 hover-lift">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold text-ink-DEFAULT">{stats.completedSurahs}</p>
              <p className="text-sm text-ink-fant">Completed</p>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-xl p-6 hover-lift">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl">
              <Star className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold text-ink-DEFAULT">{stats.totalMemorizedAyats}</p>
              <p className="text-sm text-ink-fant">Total Ayats</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Controls */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-ink-fant" />
            <input
              type="text"
              placeholder="Search surahs by name, number, or Arabic text..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-parchment-300 bg-parchment-50 text-ink-DEFAULT placeholder-ink-fant focus:outline-none focus:ring-2 focus:ring-emerald-DEFAULT/30 focus:border-emerald-DEFAULT transition-all"
            />
          </div>

          {/* Filter */}
          <div className="flex gap-2">
            {[
              { key: 'all', label: 'All', count: stats.totalSurahs },
              { key: 'memorized', label: 'Started', count: stats.startedSurahs },
              { key: 'unmemorized', label: 'Not Started', count: stats.totalSurahs - stats.startedSurahs }
            ].map(filter => (
              <button
                key={filter.key}
                onClick={() => setFilterBy(filter.key as any)}
                className={`
                  px-4 py-3 rounded-xl text-sm font-medium transition-all hover-lift
                  ${filterBy === filter.key
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg'
                    : 'bg-parchment-100 text-ink-muted hover:bg-parchment-200'
                  }
                `}
              >
                {filter.label}
                <span className="ml-2 px-2 py-1 rounded-full bg-white/20 text-xs">
                  {filter.count}
                </span>
              </button>
            ))}
          </div>

          {/* Sort and View Controls */}
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-3 rounded-xl border border-parchment-300 bg-parchment-50 text-ink-DEFAULT focus:outline-none focus:ring-2 focus:ring-emerald-DEFAULT/30"
            >
              <option value="number">Sort by Number</option>
              <option value="name">Sort by Name</option>
              <option value="ayats">Sort by Ayats</option>
            </select>

            <div className="flex gap-1 bg-parchment-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'grid' 
                    ? 'bg-white text-emerald-600 shadow-sm' 
                    : 'text-ink-muted hover:text-ink-DEFAULT'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'list' 
                    ? 'bg-white text-emerald-600 shadow-sm' 
                    : 'text-ink-muted hover:text-ink-DEFAULT'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-ink-DEFAULT">
            {filteredAndSortedSurahs.length} Surahs Found
          </h3>
          <div className="text-sm text-ink-fant">
            {stats.overallProgress}% Overall Progress
          </div>
        </div>

        {/* Surah Display */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-h-96 overflow-y-auto pr-2">
            {filteredAndSortedSurahs.map((surah, index) => (
              <div
                key={surah.number}
                onClick={() => onSurahSelect(surah.number, surah.name)}
                className="group p-4 bg-white rounded-xl border border-parchment-200 hover:border-emerald-DEFAULT hover:bg-parchment-50 transition-all cursor-pointer hover-lift"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-emerald-DEFAULT">
                      {surah.number}.
                    </span>
                    <div>
                      <p className="font-semibold text-ink-DEFAULT group-hover:text-emerald-DEFAULT">
                        {surah.name}
                      </p>
                      <p className="text-sm font-arabic text-ink-muted">
                        {surah.arabicName}
                      </p>
                    </div>
                  </div>
                  <BookOpen className="w-4 h-4 text-ink-fant group-hover:text-emerald-DEFAULT" />
                </div>

                <div className="flex items-center justify-between text-xs text-ink-fant mb-3">
                  <span>{surah.ayatCount} ayats</span>
                  <span>{surah.hasBismillah ? 'With Bismillah' : 'No Bismillah'}</span>
                </div>

                {/* Progress Bar */}
                {surah.isStarted && (
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs text-ink-muted mb-1">
                      <span>{surah.memorizedCount}/{surah.ayatCount} memorized</span>
                      <span>{surah.completionRate}%</span>
                    </div>
                    <div className="bg-parchment-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          surah.isCompleted 
                            ? 'bg-gradient-to-r from-purple-400 to-purple-600' 
                            : 'bg-gradient-to-r from-emerald-400 to-emerald-600'
                        }`}
                        style={{ width: `${surah.completionRate}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="pt-3 border-t border-parchment-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {surah.isCompleted ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-purple-DEFAULT" />
                          <span className="text-xs text-purple-DEFAULT font-medium">Completed</span>
                        </>
                      ) : surah.isStarted ? (
                        <>
                          <Clock className="w-4 h-4 text-emerald-DEFAULT" />
                          <span className="text-xs text-emerald-DEFAULT font-medium">In Progress</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 text-ink-fant" />
                          <span className="text-xs text-ink-fant">Not Started</span>
                        </>
                      )}
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onSurahSelect(surah.number, surah.name);
                      }}
                      className="text-xs px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg font-medium hover:from-emerald-600 hover:to-emerald-700 transition-all"
                    >
                      {surah.isStarted ? 'Continue' : 'Start'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
            {filteredAndSortedSurahs.map((surah, index) => (
              <div
                key={surah.number}
                onClick={() => onSurahSelect(surah.number, surah.name)}
                className="group p-4 bg-white rounded-xl border border-parchment-200 hover:border-emerald-DEFAULT hover:bg-parchment-50 transition-all cursor-pointer hover-lift"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-bold text-emerald-DEFAULT">
                      {surah.number}.
                    </span>
                    <div>
                      <p className="font-semibold text-ink-DEFAULT group-hover:text-emerald-DEFAULT">
                        {surah.name}
                      </p>
                      <p className="text-sm font-arabic text-ink-muted">
                        {surah.arabicName}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-ink-fant">{surah.ayatCount} ayats</p>
                      {surah.isStarted && (
                        <p className="text-xs text-emerald-DEFAULT">
                          {surah.memorizedCount}/{surah.ayatCount} memorized
                        </p>
                      )}
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onSurahSelect(surah.number, surah.name);
                      }}
                      className="text-xs px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg font-medium hover:from-emerald-600 hover:to-emerald-700 transition-all"
                    >
                      {surah.isStarted ? 'Continue' : 'Start'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredAndSortedSurahs.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-ink-fant" />
            <p className="text-ink-fant text-lg">No surahs found</p>
            <p className="text-ink-muted text-sm mt-2">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
