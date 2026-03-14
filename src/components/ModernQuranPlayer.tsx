"use client";

import { useState, useEffect } from "react";
import {
  PlayIcon,
  PauseIcon,
  SquareIcon,
  PlusIcon,
  MinusIcon,
  Volume2Icon,
  ClockIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  SparklesIcon,
  BookOpenIcon,
} from "lucide-react";
import { SURAHS } from "@/lib/surahs";
import { fetchAyat, AyatData } from "@/lib/api";
import { getBismillahInfo } from "@/lib/surahs";
import { useAudioLoop, PlayState } from "@/lib/useAudioLoop";
import { useBismillahAudio } from "@/lib/useBismillahAudio";

interface ModernQuranPlayerProps {
  onMarkMemorized?: (
    surahName: string,
    ayatNum: number,
    surahNum: number,
  ) => void;
  selectedSurahFromLibrary?: { number: number; name: string } | null;
}

const SPEEDS = [
  { label: "0.6×", value: 0.6 },
  { label: "0.75×", value: 0.75 },
  { label: "1×", value: 1 },
  { label: "1.25×", value: 1.25 },
];

export default function ModernQuranPlayer({
  onMarkMemorized,
  selectedSurahFromLibrary,
}: ModernQuranPlayerProps = {}) {
  const [selectedSurah, setSelectedSurah] = useState(112);
  const [ayatInput, setAyatInput] = useState(1);
  const [ayatError, setAyatError] = useState("");

  const [loadedAyat, setLoadedAyat] = useState<AyatData | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState("");

  const [loopCount, setLoopCount] = useState(5);
  const [speed, setSpeedVal] = useState(1);
  const [loopsDoneLocal, setLoopsDoneLocal] = useState(0);
  const [allDoneBanner, setAllDoneBanner] = useState(false);
  const [statusMsg, setStatusMsg] = useState(
    "Select a surah and ayat, then tap Load",
  );

  const bismillahInfo = getBismillahInfo(selectedSurah, ayatInput);
  const { playState, load, play, pause, stop, setSpeed } = useAudioLoop();
  const {
    playBismillah,
    isPlaying: isBismillahPlaying,
    stopBismillah,
  } = useBismillahAudio();

  // Handle surah selection from library
  useEffect(() => {
    if (
      selectedSurahFromLibrary &&
      selectedSurahFromLibrary.number !== selectedSurah
    ) {
      setSelectedSurah(selectedSurahFromLibrary.number);
      setAyatInput(1);
      setAyatError("");
      setLoadedAyat(null);
      stop();
      setAllDoneBanner(false);
    }
  }, [selectedSurahFromLibrary, selectedSurah, stop]);

  useEffect(() => {
    if (playState === "idle")
      setStatusMsg("Select a surah and ayat, then tap Load");
    else if (playState === "loading") setStatusMsg("Loading audio…");
    else if (playState === "ready" && loadedAyat)
      setStatusMsg("Ready — press Play ▶");
    else if (playState === "playing")
      setStatusMsg("Playing — Mishary Rashid Alafasy");
    else if (playState === "paused") setStatusMsg("Paused");
    else if (playState === "error")
      setStatusMsg("Audio failed to load — check internet connection");
  }, [playState, loadedAyat]);

  const currentSurah = SURAHS.find((s) => s.number === selectedSurah)!;

  function validateAndSetAyat(val: number) {
    setAyatInput(val);
    if (val < 1 || val > currentSurah.ayatCount) {
      setAyatError(`Ayat must be between 1 and ${currentSurah.ayatCount}`);
    } else {
      setAyatError("");
    }
  }

  async function handleLoad() {
    setIsFetching(true);
    setFetchError("");
    setLoadedAyat(null);
    setLoopsDoneLocal(0);
    setAllDoneBanner(false);
    try {
      const data = await fetchAyat(selectedSurah, ayatInput);
      setLoadedAyat(data);
      const urls = [data.audioUrl];
      load({
        urls,
        loops: loopCount,
        speed,
        onLoopComplete: (d) => setLoopsDoneLocal(d),
        onAllDone: () => setAllDoneBanner(true),
        onError: (msg) => setStatusMsg(msg),
      });
    } catch {
      setFetchError("Failed to fetch ayat data.");
    } finally {
      setIsFetching(false);
    }
  }

  function handleTogglePlay() {
    if (playState === "playing") {
      pause();
    } else if (playState === "ready") {
      play();
    }
  }

  function handleStop() {
    stop();
    setAllDoneBanner(false);
    stopBismillah();
  }

  function handleSetSpeed(s: number) {
    setSpeedVal(s);
    setSpeed(s);
  }

  function handleMarkMemorized() {
    if (!loadedAyat) return;

    if (onMarkMemorized) {
      onMarkMemorized(
        loadedAyat.surahName,
        loadedAyat.ayatNumber,
        loadedAyat.surahNumber,
      );
    }

    stop();
    setAllDoneBanner(false);

    const next = ayatInput + 1;
    if (next <= currentSurah.ayatCount) {
      setAyatInput(next);
      setTimeout(() => {
        (async () => {
          setIsFetching(true);
          setFetchError("");
          setLoadedAyat(null);
          setLoopsDoneLocal(0);
          try {
            const data = await fetchAyat(selectedSurah, next);
            setLoadedAyat(data);
            const urls = [data.audioUrl];
            load({
              urls,
              loops: loopCount,
              speed,
              onLoopComplete: (d) => setLoopsDoneLocal(d),
              onAllDone: () => setAllDoneBanner(true),
              onError: (msg) => setStatusMsg(msg),
            });
          } catch {
            setFetchError("Failed to fetch next ayat.");
          } finally {
            setIsFetching(false);
          }
        })();
      }, 200);
    } else {
      setStatusMsg(
        `🌟 You completed all of ${loadedAyat.surahName}! MashaAllah!`,
      );
    }
  }

  function adjustLoops(delta: number) {
    if (loopCount === 0 && delta < 0) setLoopCount(5);
    else if (loopCount === 5 && delta > 0) setLoopCount(0);
    else setLoopCount(Math.max(1, Math.min(20, loopCount + delta)));
  }

  function toggleInfinite() {
    setLoopCount((prev) => (prev === 0 ? 5 : 0));
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Selection Card */}
      <div className="card card-hover p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex-shrink-0">
            <BookOpenIcon className="w-6 h-6 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-xl font-semibold text-neutral-900">
              Select Ayat
            </h3>
            <p className="text-sm text-neutral-500">
              Choose surah and ayat to memorize
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Surah
            </label>
            <select
              value={selectedSurah}
              onChange={(e) => {
                const num = Number(e.target.value);
                setSelectedSurah(num);
                setAyatInput(1);
                setAyatError("");
                setLoadedAyat(null);
                stop();
                setAllDoneBanner(false);
              }}
              className="input"
            >
              {SURAHS.map((surah) => (
                <option key={surah.number} value={surah.number}>
                  {surah.number}. {surah.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Ayat Number
            </label>
            <input
              type="number"
              value={ayatInput}
              onChange={(e) => validateAndSetAyat(Number(e.target.value))}
              className={`input ${ayatError ? "input-error" : ""}`}
              placeholder={`1-${currentSurah.ayatCount}`}
            />
            {ayatError && (
              <p className="text-error-600 text-xs mt-1">{ayatError}</p>
            )}
          </div>
        </div>

        <button
          onClick={handleLoad}
          disabled={isFetching || !!ayatError}
          className="btn-primary w-full mt-4"
        >
          {isFetching ? (
            <span className="flex items-center justify-center gap-2">
              <div className="loading-spinner" />
              Loading…
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <SparklesIcon className="w-5 h-5" />
              Load Ayat
            </span>
          )}
        </button>
      </div>

      {/* Player Card */}
      {loadedAyat && (
        <div className="card card-hover">
          {/* Bismillah Banner */}
          {bismillahInfo?.showBanner && (
            <div className="p-6 bg-gradient-to-r from-accent-50 to-accent-100 border-b border-accent-200">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <div className="p-2 bg-accent-500 rounded-lg flex-shrink-0">
                    <Volume2Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-arabic text-2xl text-neutral-900 text-right sm:text-left">
                      بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
                    </p>
                    <p className="text-sm text-neutral-600 mt-1">
                      In the name of Allah, the Most Gracious, the Most Merciful
                    </p>
                  </div>
                </div>
                <button
                  onClick={playBismillah}
                  disabled={isBismillahPlaying}
                  className="btn-secondary flex-shrink-0"
                >
                  {isBismillahPlaying ? (
                    <span className="flex items-center gap-2">
                      <PauseIcon className="w-4 h-4" />
                      Pause
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <PlayIcon className="w-4 h-4" />
                      Play Bismillah
                    </span>
                  )}
                </button>
              </div>
            </div>
          )}

          <div className="p-6">
            {/* Ayat Info */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className="badge badge-primary">{loadedAyat.surahName}</div>
              <div className="badge badge-secondary">
                Ayat {loadedAyat.ayatNumber}
              </div>
              {bismillahInfo?.isBismillahItself && (
                <div className="badge badge-accent">Al-Fatihah opening</div>
              )}
            </div>

            {/* Arabic Text */}
            <div className="mb-6">
              <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-xl p-6 border border-primary-200">
                <p className="font-arabic text-3xl text-right leading-loose text-neutral-900">
                  {loadedAyat.arabic}
                </p>
              </div>
            </div>

            {/* Translation */}
            <div className="mb-6">
              <p className="text-base italic text-neutral-600">
                "{loadedAyat.translation}"
              </p>
            </div>

            {/* Status */}
            <div className="mb-6 p-4 bg-neutral-50 rounded-xl border border-neutral-200">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-neutral-700">
                  {statusMsg}
                </span>
              </div>
            </div>

            {/* Playback Controls */}
            <div className="space-y-6">
              {/* Main Controls */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  onClick={handleTogglePlay}
                  disabled={
                    playState !== "ready" &&
                    playState !== "playing" &&
                    playState !== "paused"
                  }
                  className="btn-primary flex-1"
                >
                  {playState === "playing" ? (
                    <span className="flex items-center justify-center gap-2">
                      <PauseIcon className="w-5 h-5" />
                      Pause
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <PlayIcon className="w-5 h-5" />
                      Play Loop
                    </span>
                  )}
                </button>

                <button
                  onClick={handleStop}
                  disabled={
                    playState !== "ready" &&
                    playState !== "playing" &&
                    playState !== "paused"
                  }
                  className="btn-secondary"
                >
                  <SquareIcon className="w-5 h-5" />
                </button>

                <button
                  onClick={handleMarkMemorized}
                  className="btn-primary bg-gradient-to-r from-success-500 to-success-600 hover:from-success-600 hover:to-success-700"
                >
                  <CheckCircleIcon className="w-5 h-5" />
                  <span className="hidden sm:inline">Mark Memorized</span>
                  <span className="sm:hidden">Memorized</span>
                </button>
              </div>

              {/* Loop Controls */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => adjustLoops(-1)}
                    className="p-2 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-all"
                  >
                    <MinusIcon className="w-4 h-4" />
                  </button>
                  <span className="font-bold text-lg min-w-[3rem] text-center">
                    {loopCount === 0 ? "∞" : loopCount}
                  </span>
                  <button
                    onClick={() => adjustLoops(1)}
                    className="p-2 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-all"
                  >
                    <PlusIcon className="w-4 h-4" />
                  </button>
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={loopCount === 0}
                    onChange={toggleInfinite}
                    className="w-4 h-4 text-primary-500 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm text-neutral-600">
                    Infinite loop
                  </span>
                </label>
              </div>

              {/* Speed Controls */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <span className="text-sm font-medium text-neutral-700">
                  Speed:
                </span>
                <div className="flex flex-wrap gap-2">
                  {SPEEDS.map((s) => (
                    <button
                      key={s.value}
                      onClick={() => handleSetSpeed(s.value)}
                      className={`
                        px-3 py-2 rounded-lg text-sm font-semibold border transition-all
                        ${
                          speed === s.value
                            ? "bg-primary-500 text-white border-primary-500 shadow-glow"
                            : "bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50"
                        }
                      `}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Progress Pills */}
      {loadedAyat && (
        <div className="card p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <h4 className="text-lg font-semibold text-neutral-900">
              Loop Progress
            </h4>
            <div className="badge badge-primary">
              {loopsDoneLocal}/{loopCount === 0 ? "∞" : loopCount}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {Array.from({ length: Math.min(loopCount || 10, 20) }, (_, i) => (
              <div
                key={i}
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold
                  ${
                    i < loopsDoneLocal
                      ? "bg-primary-500 text-white shadow-glow"
                      : "bg-neutral-200 text-neutral-400"
                  }
                `}
              >
                {i + 1}
              </div>
            ))}
            {loopCount > 20 && (
              <div className="flex items-center text-neutral-400">
                <ArrowRightIcon className="w-4 h-4" />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
