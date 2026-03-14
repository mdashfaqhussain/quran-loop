"use client";
import { useRef, useState, useCallback, useEffect } from "react";

export type PlayState = "idle" | "loading" | "ready" | "playing" | "paused" | "error";

export interface AudioLoopOptions {
  urls: string[];
  loops: number;        // 0 = infinite
  speed: number;
  onLoopComplete?: (loopsDone: number) => void;
  onAllDone?: () => void;
  onError?: (msg: string) => void;
}

export function useAudioLoop() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const urlIndexRef = useRef(0);
  const loopsDoneRef = useRef(0);
  const optionsRef = useRef<AudioLoopOptions | null>(null);
  const [playState, setPlayState] = useState<PlayState>("idle");
  const [loopsDone, setLoopsDone] = useState(0);

  useEffect(() => {
    const a = new Audio();
    audioRef.current = a;

    a.addEventListener("canplaythrough", () => {
      setPlayState("ready");
    });

    a.addEventListener("ended", () => {
      const opts = optionsRef.current;
      if (!opts) return;
      const done = loopsDoneRef.current + 1;
      loopsDoneRef.current = done;
      setLoopsDone(done);
      opts.onLoopComplete?.(done);

      const infinite = opts.loops === 0;
      if (infinite || done < opts.loops) {
        a.currentTime = 0;
        a.play().catch(() => {});
      } else {
        setPlayState("ready");
        opts.onAllDone?.();
      }
    });

    a.addEventListener("error", () => {
      const opts = optionsRef.current;
      if (!opts) return;
      const next = urlIndexRef.current + 1;
      if (next < opts.urls.length) {
        urlIndexRef.current = next;
        a.src = opts.urls[next];
        a.load();
      } else {
        setPlayState("error");
        opts.onError?.("Could not load audio. Please check your internet connection.");
      }
    });

    return () => {
      a.pause();
      a.src = "";
    };
  }, []);

  const load = useCallback((options: AudioLoopOptions) => {
    const a = audioRef.current;
    if (!a) return;
    optionsRef.current = options;
    urlIndexRef.current = 0;
    loopsDoneRef.current = 0;
    setLoopsDone(0);
    setPlayState("loading");
    a.pause();
    a.src = options.urls[0];
    a.playbackRate = options.speed;
    a.load();
  }, []);

  const play = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    a.playbackRate = optionsRef.current?.speed ?? 1;
    a.play().then(() => setPlayState("playing")).catch(() => {
      setPlayState("error");
    });
  }, []);

  const pause = useCallback(() => {
    audioRef.current?.pause();
    setPlayState("paused");
  }, []);

  const stop = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    a.pause();
    a.currentTime = 0;
    loopsDoneRef.current = 0;
    setLoopsDone(0);
    setPlayState("ready");
  }, []);

  const setSpeed = useCallback((s: number) => {
    if (audioRef.current) audioRef.current.playbackRate = s;
    if (optionsRef.current) optionsRef.current.speed = s;
  }, []);

  return { playState, loopsDone, load, play, pause, stop, setSpeed };
}
