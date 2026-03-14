import { SURAHS } from "@/lib/surahs";

interface AyatSelectorProps {
  selectedSurah: number;
  ayatInput: number;
  ayatError: string;
  isFetching: boolean;
  onSurahChange: (surah: number) => void;
  onAyatChange: (ayat: number) => void;
  onLoadAyat: () => void;
}

export default function AyatSelector({
  selectedSurah,
  ayatInput,
  ayatError,
  isFetching,
  onSurahChange,
  onAyatChange,
  onLoadAyat,
}: AyatSelectorProps) {
  const currentSurah = SURAHS.find((s) => s.number === selectedSurah)!;

  return (
    <div className="bg-white border border-parchment-200 rounded-2xl p-6 shadow-sm animate-slide-up">
      <p className="text-xs font-semibold tracking-widest uppercase text-ink-faint mb-4">
        Select Ayat
      </p>

      <div className="flex flex-wrap gap-3 items-end">
        <div className="flex flex-col gap-1.5 flex-1 min-w-[180px]">
          <label className="text-xs text-ink-muted font-medium">Surah</label>
          <select
            className="w-full px-3 py-2.5 rounded-xl border border-parchment-300 bg-parchment-50 text-ink-DEFAULT text-sm focus:outline-none focus:ring-2 focus:ring-emerald-DEFAULT/30 focus:border-emerald-DEFAULT transition-all"
            value={selectedSurah}
            onChange={(e) => onSurahChange(Number(e.target.value))}
          >
            {SURAHS.map((s) => (
              <option key={s.number} value={s.number}>
                {s.number}. {s.name} — {s.arabicName} ({s.ayatCount})
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-ink-muted font-medium">Ayat #</label>
          <input
            type="number"
            min={1}
            max={currentSurah.ayatCount}
            value={ayatInput}
            onChange={(e) => onAyatChange(Number(e.target.value))}
            className={`
              w-24 px-3 py-2.5 rounded-xl border text-sm text-center text-ink-DEFAULT
              focus:outline-none focus:ring-2 focus:ring-emerald-DEFAULT/30 focus:border-emerald-DEFAULT transition-all
              ${ayatError ? "border-red-400 bg-red-50" : "border-parchment-300 bg-parchment-50"}
            `}
          />
          {ayatError && <p className="text-xs text-red-500">{ayatError}</p>}
        </div>

        <button
          onClick={onLoadAyat}
          disabled={isFetching || !!ayatError}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm transition-all active:scale-95 shadow-md hover:shadow-lg transform"
        >
          {isFetching ? (
            <span className="flex items-center gap-2">
              <svg
                className="animate-spin w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
              Loading…
            </span>
          ) : (
            "Load Ayat"
          )}
        </button>
      </div>

      {/* Surah info pills */}
      <div className="flex gap-2 mt-4 flex-wrap">
        <span className="text-xs px-2.5 py-1 bg-parchment-100 rounded-full text-ink-faint border border-parchment-200">
          {currentSurah.ayatCount} ayats
        </span>
        {!currentSurah.hasBismillah && (
          <span className="text-xs px-2.5 py-1 bg-amber-50 rounded-full text-amber-700 border border-amber-200">
            ⚠ No Bismillah (At-Tawbah)
          </span>
        )}
        {currentSurah.number === 1 && (
          <span className="text-xs px-2.5 py-1 bg-emerald-50 rounded-full text-emerald-700 border border-emerald-200">
            Bismillah is Ayat 1
          </span>
        )}
      </div>
    </div>
  );
}
