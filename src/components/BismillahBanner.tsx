interface BismillahBannerProps {
  onPlay: () => void;
  isPlaying: boolean;
}

export default function BismillahBanner({ onPlay, isPlaying }: BismillahBannerProps) {
  return (
    <div className="text-center mb-5 animate-fade-in">
      <p className="font-arabic text-2xl text-amber-700 tracking-wide leading-loose">
        بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
      </p>
      <div className="flex items-center justify-center gap-3 mt-2">
        <p className="text-xs text-amber-600/70 font-medium tracking-widest uppercase">
          Bismillah — recited before this surah
        </p>
        <button
          onClick={onPlay}
          disabled={isPlaying}
          className="px-3 py-1 bg-amber-100 hover:bg-amber-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-full text-xs font-semibold text-amber-700 transition-all active:scale-95 flex items-center gap-1"
        >
          {isPlaying ? (
            <>
              <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse"></span>
              Playing...
            </>
          ) : (
            <>
              <span>▶</span> Play Bismillah
            </>
          )}
        </button>
      </div>
    </div>
  );
}
