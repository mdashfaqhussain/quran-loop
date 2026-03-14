import { toGlobalAyah } from "./surahs";

export interface AyatData {
  arabic: string;
  translation: string;
  audioUrl: string;
  surahNumber: number;
  ayatNumber: number;
  surahName: string;
  globalAyah: number;
}

const AUDIO_CDN = "https://cdn.islamic.network/quran/audio/128/ar.alafasy";
const AUDIO_CDN_64 = "https://cdn.islamic.network/quran/audio/64/ar.alafasy";

// Remove Bismillah from ayat text if it shouldn't be included
function cleanAyatText(
  text: string,
  surahNum: number,
  ayatNum: number,
): string {
  // Multiple variations of Bismillah that might appear in the API
  const BISMILLAH_VARIATIONS = [
    "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ",
    "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",
    "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    "بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ",
  ];

  // Al-Fatihah (1): Bismillah IS ayat 1 - don't remove
  if (surahNum === 1 && ayatNum === 1) {
    return text;
  }

  // At-Tawbah (9): No Bismillah - don't remove anything
  if (surahNum === 9) {
    return text;
  }

  // All other surahs: Remove Bismillah from ayat 1 if present
  if (ayatNum === 1) {
    let cleanedText = text;
    BISMILLAH_VARIATIONS.forEach((bismillah) => {
      if (cleanedText.includes(bismillah)) {
        cleanedText = cleanedText.replace(bismillah, "").trim();
      }
    });
    return cleanedText;
  }

  return text;
}

export function getAudioUrls(
  surahNum: number,
  ayatNum: number,
  apiAudioUrl?: string,
): string[] {
  const g = toGlobalAyah(surahNum, ayatNum);
  return [
    apiAudioUrl,
    `${AUDIO_CDN}/${g}.mp3`,
    `${AUDIO_CDN_64}/${g}.mp3`,
  ].filter(Boolean) as string[];
}

export async function fetchAyat(
  surahNum: number,
  ayatNum: number,
): Promise<AyatData> {
  const url = `https://api.alquran.cloud/v1/ayah/${surahNum}:${ayatNum}/editions/quran-uthmani,en.sahih,ar.alafasy`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  const json = await res.json();
  if (json.code !== 200) throw new Error("API returned non-200");

  const [arabic, english, alafasy] = json.data;
  const apiAudioUrl: string = alafasy.audio;

  return {
    arabic: cleanAyatText(arabic.text, surahNum, ayatNum),
    translation: english.text,
    audioUrl: apiAudioUrl,
    surahNumber: surahNum,
    ayatNumber: ayatNum,
    surahName: arabic.surah.englishName,
    globalAyah: toGlobalAyah(surahNum, ayatNum),
  };
}
