"use client";

import { useState, useEffect } from "react";
import {
  PlayIcon,
  PauseIcon,
  SquareIcon,
  PlusIcon,
  MinusIcon,
  Volume2Icon,
  CheckCircleIcon,
  BookOpenIcon,
  Loader2Icon,
  RepeatIcon,
  GaugeIcon,
} from "lucide-react";
import { SURAHS } from "@/lib/surahs";
import { fetchAyat, AyatData } from "@/lib/api";
import { getBismillahInfo } from "@/lib/surahs";
import { useAudioLoop } from "@/lib/useAudioLoop";
import { useBismillahAudio } from "@/lib/useBismillahAudio";

interface ModernQuranPlayerProps {
  onMarkMemorized?: (
    surahName: string,
    ayatNum: number,
    surahNum: number,
  ) => void;
  onUnmarkMemorized?: (
    surahName: string,
    ayatNum: number,
    surahNum: number,
  ) => void;
  selectedSurahFromLibrary?: { number: number; name: string } | null;
  memorizedAyats?: { surahNum: number; ayatNum: number }[];
}

const SPEEDS = [
  { label: "0.6×", value: 0.6 },
  { label: "0.75×", value: 0.75 },
  { label: "1×", value: 1 },
  { label: "1.25×", value: 1.25 },
];

export default function ModernQuranPlayer({
  onMarkMemorized,
  onUnmarkMemorized,
  selectedSurahFromLibrary,
  memorizedAyats = [],
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
  const [justMarkedMemorized, setJustMarkedMemorized] = useState(false);
  const [statusMsg, setStatusMsg] = useState(
    "Select a surah and verse, then load to begin",
  );

  const bismillahInfo = getBismillahInfo(selectedSurah, ayatInput);
  const { playState, load, play, pause, stop, setSpeed } = useAudioLoop();
  const {
    playBismillah,
    isPlaying: isBismillahPlaying,
    stopBismillah,
  } = useBismillahAudio();

  const isMemorized =
    loadedAyat &&
    memorizedAyats.some(
      (m) => m.surahNum === loadedAyat.surahNumber && m.ayatNum === loadedAyat.ayatNumber,
    );

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
      setStatusMsg("Select a surah and verse, then load to begin");
    else if (playState === "loading") setStatusMsg("Loading audio…");
    else if (playState === "ready" && loadedAyat)
      setStatusMsg("Ready — press Play to start");
    else if (playState === "playing")
      setStatusMsg("Playing — Mishary Rashid Alafasy");
    else if (playState === "paused") setStatusMsg("Paused");
    else if (playState === "error")
      setStatusMsg("Audio failed to load — check connection");
  }, [playState, loadedAyat]);

  const currentSurah = SURAHS.find((s) => s.number === selectedSurah)!;

  function validateAndSetAyat(val: number) {
    setAyatInput(val);
    if (val < 1 || val > currentSurah.ayatCount) {
      setAyatError(`Verse must be between 1 and ${currentSurah.ayatCount}`);
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
      setFetchError("Failed to fetch verse.");
    } finally {
      setIsFetching(false);
    }
  }

  function handleTogglePlay() {
    if (playState === "playing") pause();
    else if (playState === "ready") play();
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
    setJustMarkedMemorized(true);
    if (onMarkMemorized) {
      onMarkMemorized(
        loadedAyat.surahName,
        loadedAyat.ayatNumber,
        loadedAyat.surahNumber,
      );
    }
    stop();
    setAllDoneBanner(false);
    setTimeout(() => setJustMarkedMemorized(false), 600);
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
            setFetchError("Failed to fetch next verse.");
          } finally {
            setIsFetching(false);
          }
        })();
      }, 200);
    } else {
      setStatusMsg(
        `You completed ${loadedAyat.surahName}. Masha'Allah.`,
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
    <div className="w-full max-w-5xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
        {/* Left: Selection + Load */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-neutral-200/80 shadow-card hover:shadow-elevated transition-all duration-300 overflow-hidden interactive-card">
            <div className="px-6 py-5 border-b border-neutral-100 bg-gradient-to-r from-primary-50/80 to-transparent">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-primary-500/10">
                  <BookOpenIcon className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900">Choose verse</h3>
                  <p className="text-xs text-neutral-500">Surah & verse number</p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wider mb-2">
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
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-white text-neutral-800 focus-ring-soft transition-all duration-200"
                  title="Select a surah"
                >
                  {SURAHS.map((surah) => (
                    <option key={surah.number} value={surah.number}>
                      {surah.number}. {surah.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wider mb-2">
                  Verse
                </label>
                <input
                  type="number"
                  value={ayatInput}
                  onChange={(e) => validateAndSetAyat(Number(e.target.value))}
                  className={`w-full px-4 py-3 rounded-xl border bg-white text-neutral-800 focus-ring-soft transition-all duration-200 placeholder-neutral-400 ${
                    ayatError ? "border-error-300" : "border-neutral-200"
                  }`}
                  placeholder={`1 – ${currentSurah.ayatCount}`}
                  title={`Verse number (1 to ${currentSurah.ayatCount})`}
                />
                {ayatError && (
                  <p className="text-error-600 text-xs mt-1">{ayatError}</p>
                )}
              </div>
              <button
                onClick={handleLoad}
                disabled={isFetching || !!ayatError}
                title="Load this verse for playback"
                className="w-full py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 shadow-card hover:shadow-elevated transition-all duration-250 ease-smooth flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed btn-touch focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2"
              >
                {isFetching ? (
                  <>
                    <Loader2Icon className="w-5 h-5 animate-spin" />
                    Loading…
                  </>
                ) : (
                  <>
                    <BookOpenIcon className="w-5 h-5" />
                    Load verse
                  </>
                )}
              </button>
              {fetchError && (
                <p className="text-error-600 text-sm text-center">{fetchError}</p>
              )}
            </div>
          </div>

          {/* Loop & speed (compact) */}
          {loadedAyat && (
            <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-neutral-200/80 shadow-card hover:shadow-elevated transition-all duration-300 p-6 space-y-5 interactive-card">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider flex items-center gap-2">
                  <RepeatIcon className="w-4 h-4" />
                  Loops
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => adjustLoops(-1)}
                    title="Fewer loops"
                    className="p-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-600 transition-colors btn-touch focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2"
                  >
                    <MinusIcon className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-bold text-lg text-neutral-800" title="Current loop count">
                    {loopCount === 0 ? "∞" : loopCount}
                  </span>
                  <button
                    onClick={() => adjustLoops(1)}
                    title="More loops"
                    className="p-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-600 transition-colors btn-touch focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2"
                  >
                    <PlusIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <label className="flex items-center gap-3 cursor-pointer text-sm text-neutral-600">
                <input
                  type="checkbox"
                  checked={loopCount === 0}
                  onChange={toggleInfinite}
                  className="w-4 h-4 rounded border-neutral-300 text-primary-500 focus:ring-primary-500"
                />
                Infinite loop
              </label>
              <div>
                <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider flex items-center gap-2 mb-3">
                  <GaugeIcon className="w-4 h-4" />
                  Speed
                </span>
                <div className="flex gap-3 flex-wrap">
                  {SPEEDS.map((s) => (
                    <button
                      key={s.value}
                      onClick={() => handleSetSpeed(s.value)}
                      title={`Playback speed ${s.label}`}
                      className={`px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200 btn-touch focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 ${
                        speed === s.value
                          ? "bg-primary-500 text-white border-primary-500 shadow-card"
                          : "bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50 hover:border-neutral-300"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Ayat display + controls */}
        <div className="lg:col-span-8">
          {!loadedAyat ? (
            <div className="bg-white/70 backdrop-blur-md rounded-2xl border-2 border-dashed border-neutral-200 min-h-[360px] flex items-center justify-center p-12 shadow-inner">
              <div className="text-center max-w-md">
                <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center mb-6 shadow-inner">
                  <BookOpenIcon className="w-10 h-10 text-primary-500" />
                </div>
                <p className="text-neutral-700 font-semibold text-lg">No verse loaded yet</p>
                <p className="text-neutral-500 mt-2 leading-relaxed">
                  Choose a surah and verse number on the left, then tap <strong>Load verse</strong> to start listening and memorizing.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-8 animate-fade-in">
              {/* Bismillah */}
              {bismillahInfo?.showBanner && (
                <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/60 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 shadow-card hover:shadow-elevated transition-shadow duration-300">
                  <div className="flex gap-3 min-w-0 flex-1">
                    <div className="p-2 rounded-xl bg-amber-500/20 flex-shrink-0">
                      <Volume2Icon className="w-5 h-5 text-amber-700" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-arabic text-2xl text-neutral-800 text-right leading-relaxed">
                        بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
                      </p>
                      <p className="text-sm text-neutral-600 mt-0.5">
                        In the name of Allah, the Most Gracious, the Most Merciful
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={playBismillah}
                    disabled={isBismillahPlaying}
                    className="flex-shrink-0 px-4 py-2.5 rounded-xl font-medium bg-white border border-amber-200 text-amber-800 hover:bg-amber-50 transition-colors disabled:opacity-60 flex items-center gap-2"
                  >
                    {isBismillahPlaying ? (
                      <>
                        <PauseIcon className="w-4 h-4" />
                        Pause
                      </>
                    ) : (
                      <>
                        <PlayIcon className="w-4 h-4" />
                        Play Bismillah
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Main ayat card */}
              <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-neutral-200/80 shadow-card hover:shadow-elevated transition-all duration-300 overflow-hidden interactive-card">
                <div className="px-6 py-5 border-b border-neutral-100 flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-700 border border-primary-200/60">
                    {loadedAyat.surahName}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-neutral-100 text-neutral-700 border border-neutral-200">
                    Verse {loadedAyat.ayatNumber}
                  </span>
                  {bismillahInfo?.isBismillahItself && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800 border border-amber-200/60">
                      Al-Fatihah opening
                    </span>
                  )}
                  {isMemorized && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-success-100 text-success-700 border border-success-200/60">
                      <CheckCircleIcon className="w-3.5 h-3.5" />
                      Memorized
                    </span>
                  )}
                </div>

                <div className="p-8 lg:p-10">
                  <div className="rounded-2xl bg-gradient-to-b from-primary-50/70 to-accent-50/50 border border-primary-100 p-8 lg:p-10 mb-8 shadow-inner">
                    <p className="font-arabic text-3xl lg:text-4xl text-right leading-loose text-neutral-900">
                      {loadedAyat.arabic}
                    </p>
                  </div>
                  <p className="text-neutral-600 italic text-base lg:text-lg leading-relaxed mb-8 pl-3 border-l-2 border-primary-200/60">
                    "{loadedAyat.translation}"
                  </p>

                  {/* Status line */}
                  <div className="flex items-center gap-3 px-5 py-4 rounded-xl bg-neutral-50 border border-neutral-100 mb-8">
                    <div
                      className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        playState === "playing"
                          ? "bg-primary-500 animate-pulse"
                          : playState === "loading"
                            ? "bg-amber-500 animate-pulse"
                            : "bg-neutral-400"
                      }`}
                    />
                    <span className="text-sm font-medium text-neutral-700 truncate">
                      {statusMsg}
                    </span>
                  </div>

                  {/* Primary controls */}
                  <div className="flex flex-wrap items-center gap-4">
                    <button
                      onClick={handleTogglePlay}
                      disabled={
                        playState !== "ready" &&
                        playState !== "playing" &&
                        playState !== "paused"
                      }
                      title={playState === "playing" ? "Pause" : "Play this verse on loop"}
                      className="flex-1 min-w-[140px] py-3.5 px-5 rounded-xl font-semibold text-white bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 shadow-card hover:shadow-elevated transition-all duration-250 ease-smooth flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed btn-touch focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2"
                    >
                      {playState === "playing" ? (
                        <>
                          <PauseIcon className="w-5 h-5" />
                          Pause
                        </>
                      ) : (
                        <>
                          <PlayIcon className="w-5 h-5" />
                          Play verse
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleStop}
                      disabled={
                        playState !== "ready" &&
                        playState !== "playing" &&
                        playState !== "paused"
                      }
                      className="px-5 py-3.5 rounded-xl border border-neutral-200 bg-white text-neutral-700 font-medium hover:bg-neutral-50 hover:border-neutral-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 btn-touch focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2"
                      title="Stop playback"
                    >
                      <SquareIcon className="w-5 h-5" />
                      <span className="hidden sm:inline">Stop</span>
                    </button>
                    {onMarkMemorized && (
                      <button
                        onClick={handleMarkMemorized}
                        title={isMemorized ? "Already memorized" : "Mark this verse as memorized and load next"}
                        className={`flex-1 min-w-[140px] py-3.5 px-5 rounded-xl font-semibold transition-all duration-250 flex items-center justify-center gap-2 btn-touch focus:outline-none focus-visible:ring-2 focus-visible:ring-success-400 focus-visible:ring-offset-2 ${
                          justMarkedMemorized
                            ? "animate-success-pop bg-success-100 text-success-700 border-2 border-success-400"
                            : isMemorized
                              ? "bg-success-100 text-success-700 border border-success-200 hover:bg-success-200/80"
                              : "bg-gradient-to-r from-success-500 to-success-600 hover:from-success-600 hover:to-success-700 text-white shadow-card hover:shadow-elevated border border-success-400/30"
                        }`}
                      >
                        <CheckCircleIcon className="w-5 h-5" />
                        {isMemorized ? "Memorized" : "Mark memorized"}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Loop progress */}
              {loadedAyat && (loopCount > 0 || loopsDoneLocal > 0) && (
                <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-neutral-200/80 shadow-card hover:shadow-elevated transition-all duration-300 p-6 interactive-card">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-semibold text-neutral-700">
                      Loop progress
                    </span>
                    <span className="text-sm font-bold text-primary-600">
                      {loopsDoneLocal} / {loopCount === 0 ? "∞" : loopCount}
                    </span>
                  </div>
                  <div className="h-2.5 bg-neutral-200 rounded-full overflow-hidden shadow-inner">
                    <div
                      className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-500 ease-smooth"
                      style={{
                        width:
                          loopCount === 0
                            ? "0%"
                            : `${Math.min(100, (loopsDoneLocal / loopCount) * 100)}%`,
                      }}
                    />
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {Array.from(
                      { length: Math.min(loopCount || 10, 20) },
                      (_, i) => (
                        <div
                          key={i}
                          className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-semibold transition-colors ${
                            i < loopsDoneLocal
                              ? "bg-primary-500 text-white shadow-md"
                              : "bg-neutral-200 text-neutral-400"
                          }`}
                        >
                          {i + 1}
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}

              {allDoneBanner && (
                <div className="rounded-2xl bg-success-50 border border-success-200/60 px-6 py-5 text-center shadow-card animate-fade-in">
                  <p className="font-semibold text-success-800 text-lg">
                    All loops completed. Masha'Allah.
                  </p>
                  <p className="text-sm text-success-600 mt-1">You can mark this verse memorized or play again.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
