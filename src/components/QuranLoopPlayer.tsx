"use client";

import { useState, useCallback, useEffect } from "react";
import { SURAHS, getBismillahInfo } from "@/lib/surahs";
import { fetchAyat, getAudioUrls, AyatData } from "@/lib/api";
import { useAudioLoop, PlayState } from "@/lib/useAudioLoop";
import { useBismillahAudio } from "@/lib/useBismillahAudio";
import AyatSelector from "./AyatSelector";
import AyatDisplay from "./AyatDisplay";
import PlaybackControls from "./PlaybackControls";
import ProgressTracker from "./ProgressTracker";

// ─── Main Component ───────────────────────────────────────────────────────────

interface MemorizedItem {
  surahName: string;
  ayatNum: number;
  surahNum: number;
}

export default function QuranLoopPlayer() {
  const [selectedSurah, setSelectedSurah] = useState<number>(112);
  const [ayatInput, setAyatInput] = useState<number>(1);
  const [ayatError, setAyatError] = useState<string>("");

  const [loadedAyat, setLoadedAyat] = useState<AyatData | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState<string>("");

  const [loopCount, setLoopCount] = useState(5); // 0 = infinite
  const [speed, setSpeedVal] = useState(1);
  const [loopsDone, setLoopsDoneLocal] = useState(0);
  const [statusMsg, setStatusMsg] = useState(
    "Select a surah and ayat, then tap Load",
  );
  const [memorized, setMemorized] = useState<MemorizedItem[]>([]);
  const [allDoneBanner, setAllDoneBanner] = useState(false);

  const {
    playState,
    loopsDone: audioLoopsDone,
    load,
    play,
    pause,
    stop,
    setSpeed,
  } = useAudioLoop();
  const {
    isPlaying: isBismillahPlaying,
    playBismillah,
    stopBismillah,
  } = useBismillahAudio();

  // Sync loop count from hook
  useEffect(() => {
    setLoopsDoneLocal(audioLoopsDone);
  }, [audioLoopsDone]);

  // Update status message based on state
  useEffect(() => {
    if (playState === "idle")
      setStatusMsg("Select a surah and ayat, then tap Load");
    else if (playState === "loading") setStatusMsg("Loading audio…");
    else if (playState === "ready" && loadedAyat)
      setStatusMsg("Ready — press Play Loop ▶");
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

  function onSurahChange(n: number) {
    setSelectedSurah(n);
    setAyatInput(1);
    setAyatError("");
    setLoadedAyat(null);
    stop();
    setAllDoneBanner(false);
  }

  const handleLoad = useCallback(async () => {
    if (ayatError) return;
    const surah = SURAHS.find((s) => s.number === selectedSurah)!;
    if (ayatInput < 1 || ayatInput > surah.ayatCount) {
      setAyatError(`Ayat must be between 1 and ${surah.ayatCount}`);
      return;
    }

    setIsFetching(true);
    setFetchError("");
    setLoadedAyat(null);
    stop();
    setAllDoneBanner(false);
    setLoopsDoneLocal(0);

    try {
      const data = await fetchAyat(selectedSurah, ayatInput);
      setLoadedAyat(data);
      const urls = getAudioUrls(selectedSurah, ayatInput, data.audioUrl);
      load({
        urls,
        loops: loopCount,
        speed,
        onLoopComplete: (done) => setLoopsDoneLocal(done),
        onAllDone: () => {
          setAllDoneBanner(true);
          setStatusMsg(
            `✅ All ${loopCount} loops complete — now recite from memory`,
          );
        },
        onError: (msg) => setStatusMsg(msg),
      });
    } catch (e) {
      setFetchError("Failed to fetch ayat. Check internet connection.");
    } finally {
      setIsFetching(false);
    }
  }, [selectedSurah, ayatInput, ayatError, loopCount, speed, load, stop]);

  function togglePlay() {
    if (playState === "playing") pause();
    else play();
  }

  function handleStop() {
    stop();
    setLoopsDoneLocal(0);
    setAllDoneBanner(false);
  }

  function adjLoops(delta: number) {
    const next =
      loopCount === 0
        ? delta > 0
          ? 1
          : 0
        : Math.max(1, Math.min(20, loopCount + delta));
    setLoopCount(next);
  }

  function toggleInfinite() {
    setLoopCount((prev) => (prev === 0 ? 5 : 0));
  }

  function handleSetSpeed(s: number) {
    setSpeedVal(s);
    setSpeed(s);
  }

  function handleMarkMemorized() {
    if (!loadedAyat) return;
    setMemorized((prev) => [
      ...prev,
      {
        surahName: loadedAyat.surahName,
        ayatNum: loadedAyat.ayatNumber,
        surahNum: loadedAyat.surahNumber,
      },
    ]);
    stop();
    setAllDoneBanner(false);
    // Auto-advance to next ayat
    const next = ayatInput + 1;
    if (next <= currentSurah.ayatCount) {
      setAyatInput(next);
      setTimeout(() => {
        // Programmatically load next
        (async () => {
          setIsFetching(true);
          setFetchError("");
          setLoadedAyat(null);
          setLoopsDoneLocal(0);
          try {
            const data = await fetchAyat(selectedSurah, next);
            setLoadedAyat(data);
            const urls = getAudioUrls(selectedSurah, next, data.audioUrl);
            load({
              urls,
              loops: loopCount,
              speed,
              onLoopComplete: (d) => setLoopsDoneLocal(d),
              onAllDone: () => {
                setAllDoneBanner(true);
              },
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

  const bismillahInfo = loadedAyat
    ? getBismillahInfo(loadedAyat.surahNumber, loadedAyat.ayatNumber)
    : null;

  return (
    <div className="min-h-screen bg-parchment-50 py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Header */}
        <header className="text-center mb-8 animate-fade-in">
          <div className="text-4xl mb-3">📖</div>
          <h1 className="text-3xl font-bold text-ink-DEFAULT tracking-tight">
            Quran Loop Player
          </h1>
          <p className="text-ink-faint mt-1.5 text-sm tracking-wide">
            Mishary Rashid Alafasy · Memorize one ayat at a time
          </p>
        </header>

        {/* Error Display */}
        {fetchError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
            {fetchError}
          </div>
        )}

        {/* Ayat Selector */}
        <AyatSelector
          selectedSurah={selectedSurah}
          ayatInput={ayatInput}
          ayatError={ayatError}
          isFetching={isFetching}
          onSurahChange={onSurahChange}
          onAyatChange={validateAndSetAyat}
          onLoadAyat={handleLoad}
        />

        {/* Player Card */}
        <div className="bg-white border border-parchment-200 rounded-2xl p-6 shadow-sm animate-slide-up">
          <AyatDisplay
            loadedAyat={loadedAyat}
            bismillahInfo={
              bismillahInfo || {
                showBanner: false,
                isBismillahItself: false,
                noBismillah: false,
              }
            }
            allDoneBanner={allDoneBanner}
            onPlayBismillah={playBismillah}
            isBismillahPlaying={isBismillahPlaying}
          />

          {/* Playback Controls - only show when ayat is loaded */}
          {loadedAyat && (
            <PlaybackControls
              playState={playState}
              loopCount={loopCount}
              speed={speed}
              loopsDone={loopsDone}
              onTogglePlay={togglePlay}
              onStop={handleStop}
              onAdjustLoops={adjLoops}
              onToggleInfinite={toggleInfinite}
              onSetSpeed={handleSetSpeed}
            />
          )}
        </div>

        {/* Progress Tracker */}
        <ProgressTracker
          playState={playState}
          loopCount={loopCount}
          loopsDone={loopsDone}
          statusMsg={statusMsg}
          loadedAyat={loadedAyat}
          onMarkMemorized={handleMarkMemorized}
          memorized={memorized}
        />
      </div>
    </div>
  );
}
