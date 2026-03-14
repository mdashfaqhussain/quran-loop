import { PlayState } from "@/lib/useAudioLoop";

interface PlaybackControlsProps {
  playState: PlayState;
  loopCount: number;
  speed: number;
  loopsDone: number;
  onTogglePlay: () => void;
  onStop: () => void;
  onAdjustLoops: (delta: number) => void;
  onToggleInfinite: () => void;
  onSetSpeed: (speed: number) => void;
}

const SPEEDS = [
  { label: "0.6×", value: 0.6 },
  { label: "0.75×", value: 0.75 },
  { label: "1×", value: 1 },
  { label: "1.25×", value: 1.25 },
];

export default function PlaybackControls({
  playState,
  loopCount,
  speed,
  loopsDone,
  onTogglePlay,
  onStop,
  onAdjustLoops,
  onToggleInfinite,
  onSetSpeed,
}: PlaybackControlsProps) {
  const canPlay =
    playState === "ready" || playState === "playing" || playState === "paused";
  const isPlaying = playState === "playing";

  return (
    <>
      {/* Play controls */}
      <div className="flex gap-3 items-center flex-wrap mb-5">
        <button
          onClick={onTogglePlay}
          disabled={!canPlay}
          className="flex items-center gap-2.5 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm transition-all active:scale-95 shadow-lg border-2 border-emerald-600"
        >
          {isPlaying ? (
            <>
              <span>⏸</span> Pause
            </>
          ) : (
            <>
              <span>▶</span> Play Loop
            </>
          )}
        </button>
        <button
          onClick={onStop}
          disabled={!canPlay}
          className="px-4 py-3 rounded-xl border border-parchment-300 hover:bg-parchment-100 disabled:opacity-40 disabled:cursor-not-allowed text-ink-DEFAULT font-medium text-sm transition-all active:scale-95"
        >
          ■ Stop
        </button>
      </div>

      {/* Loop count */}
      <div className="flex items-center gap-4 flex-wrap mb-4">
        <span className="text-sm text-ink-muted">Loops:</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onAdjustLoops(-1)}
            className="w-8 h-8 rounded-lg border border-parchment-300 bg-parchment-100 hover:bg-parchment-200 text-ink-DEFAULT text-xl font-bold flex items-center justify-center transition-all active:scale-95"
          >
            −
          </button>
          <span className="text-base font-bold text-ink-DEFAULT min-w-[2rem] text-center">
            {loopCount === 0 ? "∞" : loopCount}
          </span>
          <button
            onClick={() => onAdjustLoops(1)}
            className="w-8 h-8 rounded-lg border border-parchment-300 bg-parchment-100 hover:bg-parchment-200 text-ink-DEFAULT text-xl font-bold flex items-center justify-center transition-all active:scale-95"
          >
            +
          </button>
        </div>
        <label className="flex items-center gap-2 text-sm text-ink-muted cursor-pointer select-none">
          <input
            type="checkbox"
            checked={loopCount === 0}
            onChange={onToggleInfinite}
            className="w-4 h-4 accent-emerald-DEFAULT cursor-pointer"
          />
          Infinite loop
        </label>
      </div>

      {/* Speed */}
      <div className="flex items-center gap-3 mb-5">
        <span className="text-xs text-ink-faint font-medium">Speed:</span>
        <div className="flex gap-1.5">
          {SPEEDS.map((s) => (
            <button
              key={s.value}
              onClick={() => onSetSpeed(s.value)}
              className={`
                px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all active:scale-95
                ${
                  speed === s.value
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                    : "bg-white text-ink-DEFAULT border-ink-200 hover:bg-parchment-50 hover:border-ink-300"
                }
              `}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
