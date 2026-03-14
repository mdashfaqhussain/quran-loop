"use client";
import { useState, useRef, useCallback } from "react";

const BISMILLAH_AUDIO_URL = "https://cdn.islamic.network/quran/audio/128/ar.alafasy/1.mp3";

export function useBismillahAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const playBismillah = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(BISMILLAH_AUDIO_URL);
      audioRef.current.addEventListener("ended", () => {
        setIsPlaying(false);
      });
      audioRef.current.addEventListener("error", () => {
        setIsPlaying(false);
      });
    }

    setIsPlaying(true);
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {
      setIsPlaying(false);
    });
  }, []);

  const stopBismillah = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  }, []);

  return { isPlaying, playBismillah, stopBismillah };
}
