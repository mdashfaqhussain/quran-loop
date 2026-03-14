"use client";

import { useState, useEffect, useCallback } from "react";
import {
  doc,
  onSnapshot,
  setDoc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  userAppDataPath,
  DEFAULT_SETTINGS,
  type UserAppData,
  type MemorizedItemSerialized,
  type UserSettings,
} from "@/lib/userData";

export interface MemorizedItem {
  surahName: string;
  ayatNum: number;
  surahNum: number;
  memorizedAt: Date;
  reviewCount: number;
  difficulty?: "easy" | "medium" | "hard";
  lastReviewed?: Date;
}

function toAppItem(raw: MemorizedItemSerialized): MemorizedItem {
  return {
    ...raw,
    memorizedAt: new Date(raw.memorizedAt),
    lastReviewed: raw.lastReviewed ? new Date(raw.lastReviewed) : undefined,
  };
}

function toSerialized(item: MemorizedItem): MemorizedItemSerialized {
  return {
    surahName: item.surahName,
    ayatNum: item.ayatNum,
    surahNum: item.surahNum,
    memorizedAt: item.memorizedAt.toISOString(),
    reviewCount: item.reviewCount,
    difficulty: item.difficulty,
    lastReviewed: item.lastReviewed?.toISOString(),
  };
}

const defaultAppData: Omit<UserAppData, "updatedAt"> = {
  memorized: [],
  settings: DEFAULT_SETTINGS,
};

export function useUserData(uid: string | null) {
  const [memorized, setMemorizedState] = useState<MemorizedItem[]>([]);
  const [settings, setSettingsState] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!uid || !db) {
      setMemorizedState([]);
      setSettingsState(DEFAULT_SETTINGS);
      setLoading(false);
      return;
    }

    const path = userAppDataPath(uid);
    const ref = doc(db, path);

    const unsubscribe = onSnapshot(
      ref,
      (snap) => {
        if (snap.exists()) {
          const data = snap.data() as UserAppData;
          setMemorizedState((data.memorized || []).map(toAppItem));
          setSettingsState(data.settings || DEFAULT_SETTINGS);
        } else {
          setMemorizedState([]);
          setSettingsState(DEFAULT_SETTINGS);
        }
        setError(null);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [uid]);

  const setMemorized = useCallback(
    async (next: MemorizedItem[] | ((prev: MemorizedItem[]) => MemorizedItem[])) => {
      if (!uid || !db) return;
      const ref = doc(db, userAppDataPath(uid));
      const list = typeof next === "function" ? next(memorized) : next;
      const serialized = list.map(toSerialized);
      const current = await getDoc(ref);
      const currentData = current.exists() ? (current.data() as UserAppData) : null;
      await setDoc(
        ref,
        {
          memorized: serialized,
          settings: currentData?.settings ?? DEFAULT_SETTINGS,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    },
    [uid, memorized]
  );

  const setSettings = useCallback(
    async (next: UserSettings | ((prev: UserSettings) => UserSettings)) => {
      if (!uid || !db) return;
      const ref = doc(db, userAppDataPath(uid));
      const nextSettings = typeof next === "function" ? next(settings) : next;
      const current = await getDoc(ref);
      const currentData = current.exists() ? (current.data() as UserAppData) : null;
      await setDoc(
        ref,
        {
          memorized: currentData?.memorized ?? [],
          settings: nextSettings,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    },
    [uid, settings]
  );

  return {
    memorized,
    settings,
    setMemorized,
    setSettings,
    loading,
    error,
  };
}
