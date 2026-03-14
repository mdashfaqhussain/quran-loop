"use client";

import { useState, useMemo } from "react";
import { SURAHS } from "@/lib/surahs";
import { Search, BookOpen, CheckCircle } from "lucide-react";

interface SurahLibraryProps {
  onSurahSelect: (surahNum: number, surahName: string) => void;
}

export default function SurahLibrary({ onSurahSelect }: SurahLibraryProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter surahs based on search
  const filteredSurahs = useMemo(() => {
    return SURAHS.filter((surah) => {
      return (
        searchTerm === "" ||
        surah.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        surah.arabicName.includes(searchTerm) ||
        surah.number.toString().includes(searchTerm)
      );
    });
  }, [searchTerm]);

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="bg-white border border-parchment-200 rounded-xl p-4 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-ink-faint" />
          <input
            type="text"
            placeholder="Search surahs by name or number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-parchment-300 bg-parchment-50 text-ink-DEFAULT placeholder-ink-faint focus:outline-none focus:ring-2 focus:ring-emerald-DEFAULT/30 focus:border-emerald-DEFAULT"
          />
        </div>
      </div>

      {/* Surah Grid */}
      <div className="bg-white border border-parchment-200 rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-ink-DEFAULT">
            {filteredSurahs.length} Surahs Found
          </h3>
          <div className="text-sm text-ink-faint">All 114 Surahs</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {filteredSurahs.map((surah) => (
            <div
              key={surah.number}
              onClick={() => onSurahSelect(surah.number, surah.name)}
              className="group p-4 bg-parchment-50 rounded-lg border border-parchment-200 hover:border-emerald-DEFAULT hover:bg-parchment-100 transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-2">
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
                <BookOpen className="w-4 h-4 text-ink-faint group-hover:text-emerald-DEFAULT" />
              </div>

              <div className="flex items-center justify-between text-xs text-ink-faint">
                <span>{surah.ayatCount} ayats</span>
                <span>
                  {surah.hasBismillah ? "With Bismillah" : "No Bismillah"}
                </span>
              </div>

              <div className="mt-2 pt-2 border-t border-parchment-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-emerald-DEFAULT" />
                    <span className="text-xs text-emerald-DEFAULT">
                      Ready to memorize
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSurahSelect(surah.number, surah.name);
                    }}
                    className="text-xs px-2 py-1 bg-emerald-DEFAULT text-white rounded hover:bg-emerald-700 transition-all"
                  >
                    Start
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredSurahs.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 mx-auto mb-4 text-ink-faint" />
            <p className="text-ink-faint">
              No surahs found matching your criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
