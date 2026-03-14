import { PlayState } from "@/lib/useAudioLoop";

interface ProgressTrackerProps {
  playState: PlayState;
  loopCount: number;
  loopsDone: number;
  statusMsg: string;
  loadedAyat: any;
  onMarkMemorized: () => void;
  memorized: Array<{ surahName: string; ayatNum: number }>;
}

function LoopPills({ total, done, current }: { total: number; done: number; current: number }) {
  if (total === 0) {
    return (
      <div className="flex items-center gap-2 text-ink-faint text-sm">
        <span className="text-lg">∞</span>
        <span>Infinite loop active</span>
      </div>
    );
  }
  return (
    <div className="flex gap-2 flex-wrap">
      {Array.from({ length: total }, (_, i) => {
        const n = i + 1;
        const isDone = n <= done;
        const isNow = n === current;
        return (
          <div
            key={n}
            className={`
              w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
              transition-all duration-300
              ${isDone ? "bg-emerald-light border-2 border-emerald-DEFAULT text-emerald-muted scale-95" : ""}
              ${isNow && !isDone ? "bg-emerald-DEFAULT border-2 border-emerald-dark text-white scale-110 shadow-lg shadow-emerald-DEFAULT/30" : ""}
              ${!isDone && !isNow ? "bg-parchment-100 border border-parchment-300 text-ink-faint" : ""}
            `}
          >
            {isDone ? "✓" : n}
          </div>
        );
      })}
    </div>
  );
}

function StatusBar({ state, message }: { state: PlayState; message: string }) {
  const isPlaying = state === "playing";
  const isError = state === "error";
  const isLoading = state === "loading";

  return (
    <div className={`
      flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-300
      ${isError ? "bg-red-50 border border-red-200 text-red-700" : ""}
      ${isPlaying ? "bg-emerald-50 border border-emerald-200 text-emerald-700" : ""}
      ${!isError && !isPlaying ? "bg-parchment-100 border border-parchment-200 text-ink-muted" : ""}
    `}>
      {isLoading && (
        <svg className="animate-spin w-4 h-4 text-emerald-DEFAULT" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
        </svg>
      )}
      {isPlaying && (
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-DEFAULT animate-pulse-dot flex-shrink-0" />
      )}
      {isError && <span className="text-base">⚠️</span>}
      {!isLoading && !isPlaying && !isError && (
        <span className="w-2.5 h-2.5 rounded-full bg-ink-faint flex-shrink-0" />
      )}
      <span>{message}</span>
    </div>
  );
}

export default function ProgressTracker({
  playState,
  loopCount,
  loopsDone,
  statusMsg,
  loadedAyat,
  onMarkMemorized,
  memorized,
}: ProgressTrackerProps) {
  const isPlaying = playState === "playing";
  const currentPill = isPlaying ? loopsDone + 1 : 0;

  return (
    <>
      {/* Progress Card */}
      <div className="bg-white border border-parchment-200 rounded-2xl p-6 shadow-sm animate-slide-up">
        <p className="text-xs font-semibold tracking-widest uppercase text-ink-faint mb-4">Loop Progress</p>
        <LoopPills total={loopCount} done={loopsDone} current={currentPill} />
        <button
          onClick={onMarkMemorized}
          disabled={!loadedAyat}
          className="mt-4 w-full py-3 rounded-xl border-2 border-emerald-DEFAULT text-emerald-muted font-semibold text-sm hover:bg-emerald-light disabled:opacity-35 disabled:cursor-not-allowed transition-all active:scale-[0.99]"
        >
          ✓ Mark as Memorized &amp; go to next ayat
        </button>
        <p className="text-xs text-ink-faint mt-3 leading-relaxed">
          💡 Tip: Start at 0.75× for new ayats. Move to 1× once you feel the rhythm.
        </p>
      </div>

      {/* Status */}
      <StatusBar state={playState} message={statusMsg} />

      {/* Today's log */}
      <div className="bg-white border border-parchment-200 rounded-2xl p-6 shadow-sm animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-semibold tracking-widest uppercase text-ink-faint">Memorized Today</p>
          {memorized.length > 0 && (
            <span className="text-xs px-2.5 py-1 bg-emerald-light rounded-full text-emerald-muted font-bold">
              {memorized.length} ayat{memorized.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>
        {memorized.length === 0 ? (
          <p className="text-sm text-ink-faint">None yet — start memorizing!</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {memorized.map((m, i) => (
              <span key={i} className="text-xs px-3 py-1.5 bg-emerald-light border border-emerald-DEFAULT/30 rounded-full text-emerald-muted font-semibold">
                {m.surahName} : {m.ayatNum}
              </span>
            ))}
          </div>
        )}
        {memorized.length >= 5 && (
          <p className="mt-3 text-xs text-emerald-muted bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2.5 font-medium">
            🌟 MashaAllah! You've memorized {memorized.length} ayats today. Keep going!
          </p>
        )}
      </div>
    </>
  );
}
