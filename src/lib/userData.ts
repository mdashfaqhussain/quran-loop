/**
 * Shared types and Firestore paths for user data.
 * Dates are stored as ISO strings for simple serialization.
 */

export interface MemorizedItemSerialized {
  surahName: string;
  ayatNum: number;
  surahNum: number;
  memorizedAt: string;
  reviewCount: number;
  difficulty?: "easy" | "medium" | "hard";
  lastReviewed?: string;
}

export interface UserSettings {
  autoPlayNext: boolean;
  defaultLoopCount: number;
  defaultSpeed: number;
  showTranslation: boolean;
  theme: "light" | "dark";
  audioQuality: "high" | "medium" | "low";
}

export interface UserAppData {
  memorized: MemorizedItemSerialized[];
  settings: UserSettings;
  updatedAt: string;
}

export const DEFAULT_SETTINGS: UserSettings = {
  autoPlayNext: true,
  defaultLoopCount: 5,
  defaultSpeed: 1,
  showTranslation: true,
  theme: "light",
  audioQuality: "medium",
};

export function userAppDataPath(uid: string): string {
  return `users/${uid}/private/appData`;
}

export function userSessionPath(uid: string, dateKey: string): string {
  return `users/${uid}/sessions/${dateKey}`;
}
