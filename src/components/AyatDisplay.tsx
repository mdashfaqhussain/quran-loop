import { AyatData } from "@/lib/api";
import { getBismillahInfo } from "@/lib/surahs";
import BismillahBanner from "./BismillahBanner";

interface AyatDisplayProps {
  loadedAyat: AyatData | null;
  bismillahInfo: ReturnType<typeof getBismillahInfo>;
  allDoneBanner: boolean;
  onPlayBismillah: () => void;
  isBismillahPlaying: boolean;
}

export default function AyatDisplay({
  loadedAyat,
  bismillahInfo,
  allDoneBanner,
  onPlayBismillah,
  isBismillahPlaying,
}: AyatDisplayProps) {
  if (!loadedAyat) {
    return (
      <div className="h-28 flex items-center justify-center text-ink-faint text-sm bg-parchment-50 rounded-xl border border-parchment-200 mb-5">
        Load an ayat to see it here
      </div>
    );
  }

  return (
    <>
      {/* Bismillah Banner */}
      {bismillahInfo?.showBanner && (
        <BismillahBanner 
          onPlay={onPlayBismillah} 
          isPlaying={isBismillahPlaying} 
        />
      )}

      {/* All done celebration */}
      {allDoneBanner && (
        <div className="mb-4 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700 font-medium animate-fade-in">
          🎉 All loops complete — test yourself by reciting from memory!
        </div>
      )}

      {/* Ayat Badge */}
      <div className="flex items-center gap-2 mb-4">
        <span className="px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-xs font-semibold text-emerald-700 tracking-wide">
          {loadedAyat.surahName}
        </span>
        <span className="px-3 py-1 bg-parchment-100 border border-parchment-300 rounded-full text-xs font-semibold text-ink-muted tracking-wide">
          Ayat {loadedAyat.ayatNumber}
        </span>
        {bismillahInfo?.isBismillahItself && (
          <span className="px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-xs font-semibold text-amber-700 tracking-wide">
            Al-Fatihah opening
          </span>
        )}
      </div>

      {/* Arabic Text */}
      <div className="font-arabic text-right text-3xl leading-[2.2] text-ink-DEFAULT bg-parchment-50 border border-parchment-200 rounded-xl px-5 py-4 mb-4 animate-fade-in min-h-[100px]">
        {loadedAyat.arabic}
      </div>

      {/* Translation */}
      <p className="text-sm text-ink-muted italic leading-relaxed mb-5 animate-fade-in">
        "{loadedAyat.translation}"
      </p>

      {/* Bismillah note for non-Fatihah surahs */}
      {bismillahInfo?.showBanner && (
        <div className="mb-4 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700 leading-relaxed">
          <strong>Note:</strong> Bismillah is recited aloud before this ayat but is not a numbered ayat of this surah.
          The audio begins directly from Ayat 1. Use the Play Bismillah button above to hear it first.
        </div>
      )}
    </>
  );
}
