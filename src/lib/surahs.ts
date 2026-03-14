export interface Surah {
  number: number;
  name: string;
  arabicName: string;
  ayatCount: number;
  hasBismillah: boolean; // false only for At-Tawbah (9)
}

// Full 114 surahs
export const SURAHS: Surah[] = [
  { number: 1,   name: "Al-Fatihah",     arabicName: "الفاتحة",       ayatCount: 7,   hasBismillah: true  },
  { number: 2,   name: "Al-Baqarah",     arabicName: "البقرة",        ayatCount: 286, hasBismillah: true  },
  { number: 3,   name: "Ali Imran",      arabicName: "آل عمران",      ayatCount: 200, hasBismillah: true  },
  { number: 4,   name: "An-Nisa",        arabicName: "النساء",        ayatCount: 176, hasBismillah: true  },
  { number: 5,   name: "Al-Maidah",      arabicName: "المائدة",       ayatCount: 120, hasBismillah: true  },
  { number: 6,   name: "Al-Anam",        arabicName: "الأنعام",       ayatCount: 165, hasBismillah: true  },
  { number: 7,   name: "Al-Araf",        arabicName: "الأعراف",       ayatCount: 206, hasBismillah: true  },
  { number: 8,   name: "Al-Anfal",       arabicName: "الأنفال",       ayatCount: 75,  hasBismillah: true  },
  { number: 9,   name: "At-Tawbah",      arabicName: "التوبة",        ayatCount: 129, hasBismillah: false },
  { number: 10,  name: "Yunus",          arabicName: "يونس",          ayatCount: 109, hasBismillah: true  },
  { number: 11,  name: "Hud",            arabicName: "هود",           ayatCount: 123, hasBismillah: true  },
  { number: 12,  name: "Yusuf",          arabicName: "يوسف",          ayatCount: 111, hasBismillah: true  },
  { number: 13,  name: "Ar-Rad",         arabicName: "الرعد",         ayatCount: 43,  hasBismillah: true  },
  { number: 14,  name: "Ibrahim",        arabicName: "إبراهيم",       ayatCount: 52,  hasBismillah: true  },
  { number: 15,  name: "Al-Hijr",        arabicName: "الحجر",         ayatCount: 99,  hasBismillah: true  },
  { number: 16,  name: "An-Nahl",        arabicName: "النحل",         ayatCount: 128, hasBismillah: true  },
  { number: 17,  name: "Al-Isra",        arabicName: "الإسراء",       ayatCount: 111, hasBismillah: true  },
  { number: 18,  name: "Al-Kahf",        arabicName: "الكهف",         ayatCount: 110, hasBismillah: true  },
  { number: 19,  name: "Maryam",         arabicName: "مريم",          ayatCount: 98,  hasBismillah: true  },
  { number: 20,  name: "Ta-Ha",          arabicName: "طه",            ayatCount: 135, hasBismillah: true  },
  { number: 21,  name: "Al-Anbiya",      arabicName: "الأنبياء",      ayatCount: 112, hasBismillah: true  },
  { number: 22,  name: "Al-Hajj",        arabicName: "الحج",          ayatCount: 78,  hasBismillah: true  },
  { number: 23,  name: "Al-Muminun",     arabicName: "المؤمنون",      ayatCount: 118, hasBismillah: true  },
  { number: 24,  name: "An-Nur",         arabicName: "النور",         ayatCount: 64,  hasBismillah: true  },
  { number: 25,  name: "Al-Furqan",      arabicName: "الفرقان",       ayatCount: 77,  hasBismillah: true  },
  { number: 26,  name: "Ash-Shuara",     arabicName: "الشعراء",       ayatCount: 227, hasBismillah: true  },
  { number: 27,  name: "An-Naml",        arabicName: "النمل",         ayatCount: 93,  hasBismillah: true  },
  { number: 28,  name: "Al-Qasas",       arabicName: "القصص",         ayatCount: 88,  hasBismillah: true  },
  { number: 29,  name: "Al-Ankabut",     arabicName: "العنكبوت",      ayatCount: 69,  hasBismillah: true  },
  { number: 30,  name: "Ar-Rum",         arabicName: "الروم",         ayatCount: 60,  hasBismillah: true  },
  { number: 31,  name: "Luqman",         arabicName: "لقمان",         ayatCount: 34,  hasBismillah: true  },
  { number: 32,  name: "As-Sajdah",      arabicName: "السجدة",        ayatCount: 30,  hasBismillah: true  },
  { number: 33,  name: "Al-Ahzab",       arabicName: "الأحزاب",       ayatCount: 73,  hasBismillah: true  },
  { number: 34,  name: "Saba",           arabicName: "سبأ",           ayatCount: 54,  hasBismillah: true  },
  { number: 35,  name: "Fatir",          arabicName: "فاطر",          ayatCount: 45,  hasBismillah: true  },
  { number: 36,  name: "Ya-Sin",         arabicName: "يس",            ayatCount: 83,  hasBismillah: true  },
  { number: 37,  name: "As-Saffat",      arabicName: "الصافات",       ayatCount: 182, hasBismillah: true  },
  { number: 38,  name: "Sad",            arabicName: "ص",             ayatCount: 88,  hasBismillah: true  },
  { number: 39,  name: "Az-Zumar",       arabicName: "الزمر",         ayatCount: 75,  hasBismillah: true  },
  { number: 40,  name: "Ghafir",         arabicName: "غافر",          ayatCount: 85,  hasBismillah: true  },
  { number: 41,  name: "Fussilat",       arabicName: "فصلت",          ayatCount: 54,  hasBismillah: true  },
  { number: 42,  name: "Ash-Shura",      arabicName: "الشورى",        ayatCount: 53,  hasBismillah: true  },
  { number: 43,  name: "Az-Zukhruf",     arabicName: "الزخرف",        ayatCount: 89,  hasBismillah: true  },
  { number: 44,  name: "Ad-Dukhan",      arabicName: "الدخان",        ayatCount: 59,  hasBismillah: true  },
  { number: 45,  name: "Al-Jathiyah",    arabicName: "الجاثية",       ayatCount: 37,  hasBismillah: true  },
  { number: 46,  name: "Al-Ahqaf",       arabicName: "الأحقاف",       ayatCount: 35,  hasBismillah: true  },
  { number: 47,  name: "Muhammad",       arabicName: "محمد",          ayatCount: 38,  hasBismillah: true  },
  { number: 48,  name: "Al-Fath",        arabicName: "الفتح",         ayatCount: 29,  hasBismillah: true  },
  { number: 49,  name: "Al-Hujurat",     arabicName: "الحجرات",       ayatCount: 18,  hasBismillah: true  },
  { number: 50,  name: "Qaf",            arabicName: "ق",             ayatCount: 45,  hasBismillah: true  },
  { number: 51,  name: "Adh-Dhariyat",   arabicName: "الذاريات",      ayatCount: 60,  hasBismillah: true  },
  { number: 52,  name: "At-Tur",         arabicName: "الطور",         ayatCount: 49,  hasBismillah: true  },
  { number: 53,  name: "An-Najm",        arabicName: "النجم",         ayatCount: 62,  hasBismillah: true  },
  { number: 54,  name: "Al-Qamar",       arabicName: "القمر",         ayatCount: 55,  hasBismillah: true  },
  { number: 55,  name: "Ar-Rahman",      arabicName: "الرحمن",        ayatCount: 78,  hasBismillah: true  },
  { number: 56,  name: "Al-Waqiah",      arabicName: "الواقعة",       ayatCount: 96,  hasBismillah: true  },
  { number: 57,  name: "Al-Hadid",       arabicName: "الحديد",        ayatCount: 29,  hasBismillah: true  },
  { number: 58,  name: "Al-Mujadila",    arabicName: "المجادلة",      ayatCount: 22,  hasBismillah: true  },
  { number: 59,  name: "Al-Hashr",       arabicName: "الحشر",         ayatCount: 24,  hasBismillah: true  },
  { number: 60,  name: "Al-Mumtahanah",  arabicName: "الممتحنة",      ayatCount: 13,  hasBismillah: true  },
  { number: 61,  name: "As-Saf",         arabicName: "الصف",          ayatCount: 14,  hasBismillah: true  },
  { number: 62,  name: "Al-Jumuah",      arabicName: "الجمعة",        ayatCount: 11,  hasBismillah: true  },
  { number: 63,  name: "Al-Munafiqun",   arabicName: "المنافقون",     ayatCount: 11,  hasBismillah: true  },
  { number: 64,  name: "At-Taghabun",    arabicName: "التغابن",       ayatCount: 18,  hasBismillah: true  },
  { number: 65,  name: "At-Talaq",       arabicName: "الطلاق",        ayatCount: 12,  hasBismillah: true  },
  { number: 66,  name: "At-Tahrim",      arabicName: "التحريم",       ayatCount: 12,  hasBismillah: true  },
  { number: 67,  name: "Al-Mulk",        arabicName: "الملك",         ayatCount: 30,  hasBismillah: true  },
  { number: 68,  name: "Al-Qalam",       arabicName: "القلم",         ayatCount: 52,  hasBismillah: true  },
  { number: 69,  name: "Al-Haqqah",      arabicName: "الحاقة",        ayatCount: 52,  hasBismillah: true  },
  { number: 70,  name: "Al-Maarij",      arabicName: "المعارج",       ayatCount: 44,  hasBismillah: true  },
  { number: 71,  name: "Nuh",            arabicName: "نوح",           ayatCount: 28,  hasBismillah: true  },
  { number: 72,  name: "Al-Jinn",        arabicName: "الجن",          ayatCount: 28,  hasBismillah: true  },
  { number: 73,  name: "Al-Muzzammil",   arabicName: "المزمل",        ayatCount: 20,  hasBismillah: true  },
  { number: 74,  name: "Al-Muddaththir", arabicName: "المدثر",        ayatCount: 56,  hasBismillah: true  },
  { number: 75,  name: "Al-Qiyamah",     arabicName: "القيامة",       ayatCount: 40,  hasBismillah: true  },
  { number: 76,  name: "Al-Insan",       arabicName: "الإنسان",       ayatCount: 31,  hasBismillah: true  },
  { number: 77,  name: "Al-Mursalat",    arabicName: "المرسلات",      ayatCount: 50,  hasBismillah: true  },
  { number: 78,  name: "An-Naba",        arabicName: "النبأ",         ayatCount: 40,  hasBismillah: true  },
  { number: 79,  name: "An-Naziat",      arabicName: "النازعات",      ayatCount: 46,  hasBismillah: true  },
  { number: 80,  name: "Abasa",          arabicName: "عبس",           ayatCount: 42,  hasBismillah: true  },
  { number: 81,  name: "At-Takwir",      arabicName: "التكوير",       ayatCount: 29,  hasBismillah: true  },
  { number: 82,  name: "Al-Infitar",     arabicName: "الانفطار",      ayatCount: 19,  hasBismillah: true  },
  { number: 83,  name: "Al-Mutaffifin",  arabicName: "المطففين",      ayatCount: 36,  hasBismillah: true  },
  { number: 84,  name: "Al-Inshiqaq",    arabicName: "الانشقاق",      ayatCount: 25,  hasBismillah: true  },
  { number: 85,  name: "Al-Buruj",       arabicName: "البروج",        ayatCount: 22,  hasBismillah: true  },
  { number: 86,  name: "At-Tariq",       arabicName: "الطارق",        ayatCount: 17,  hasBismillah: true  },
  { number: 87,  name: "Al-Ala",         arabicName: "الأعلى",        ayatCount: 19,  hasBismillah: true  },
  { number: 88,  name: "Al-Ghashiyah",   arabicName: "الغاشية",       ayatCount: 26,  hasBismillah: true  },
  { number: 89,  name: "Al-Fajr",        arabicName: "الفجر",         ayatCount: 30,  hasBismillah: true  },
  { number: 90,  name: "Al-Balad",       arabicName: "البلد",         ayatCount: 20,  hasBismillah: true  },
  { number: 91,  name: "Ash-Shams",      arabicName: "الشمس",         ayatCount: 15,  hasBismillah: true  },
  { number: 92,  name: "Al-Layl",        arabicName: "الليل",         ayatCount: 21,  hasBismillah: true  },
  { number: 93,  name: "Ad-Duhaa",       arabicName: "الضحى",         ayatCount: 11,  hasBismillah: true  },
  { number: 94,  name: "Ash-Sharh",      arabicName: "الشرح",         ayatCount: 8,   hasBismillah: true  },
  { number: 95,  name: "At-Tin",         arabicName: "التين",         ayatCount: 8,   hasBismillah: true  },
  { number: 96,  name: "Al-Alaq",        arabicName: "العلق",         ayatCount: 19,  hasBismillah: true  },
  { number: 97,  name: "Al-Qadr",        arabicName: "القدر",         ayatCount: 5,   hasBismillah: true  },
  { number: 98,  name: "Al-Bayyinah",    arabicName: "البينة",        ayatCount: 8,   hasBismillah: true  },
  { number: 99,  name: "Az-Zalzalah",    arabicName: "الزلزلة",       ayatCount: 8,   hasBismillah: true  },
  { number: 100, name: "Al-Adiyat",      arabicName: "العاديات",      ayatCount: 11,  hasBismillah: true  },
  { number: 101, name: "Al-Qariah",      arabicName: "القارعة",       ayatCount: 11,  hasBismillah: true  },
  { number: 102, name: "At-Takathur",    arabicName: "التكاثر",       ayatCount: 8,   hasBismillah: true  },
  { number: 103, name: "Al-Asr",         arabicName: "العصر",         ayatCount: 3,   hasBismillah: true  },
  { number: 104, name: "Al-Humazah",     arabicName: "الهمزة",        ayatCount: 9,   hasBismillah: true  },
  { number: 105, name: "Al-Fil",         arabicName: "الفيل",         ayatCount: 5,   hasBismillah: true  },
  { number: 106, name: "Quraysh",        arabicName: "قريش",          ayatCount: 4,   hasBismillah: true  },
  { number: 107, name: "Al-Maun",        arabicName: "الماعون",       ayatCount: 7,   hasBismillah: true  },
  { number: 108, name: "Al-Kawthar",     arabicName: "الكوثر",        ayatCount: 3,   hasBismillah: true  },
  { number: 109, name: "Al-Kafirun",     arabicName: "الكافرون",      ayatCount: 6,   hasBismillah: true  },
  { number: 110, name: "An-Nasr",        arabicName: "النصر",         ayatCount: 3,   hasBismillah: true  },
  { number: 111, name: "Al-Masad",       arabicName: "المسد",         ayatCount: 5,   hasBismillah: true  },
  { number: 112, name: "Al-Ikhlas",      arabicName: "الإخلاص",       ayatCount: 4,   hasBismillah: true  },
  { number: 113, name: "Al-Falaq",       arabicName: "الفلق",         ayatCount: 5,   hasBismillah: true  },
  { number: 114, name: "An-Nas",         arabicName: "الناس",         ayatCount: 6,   hasBismillah: true  },
];

/** Converts surah+ayat to global ayah number (1–6236) */
export function toGlobalAyah(surahNum: number, ayatNum: number): number {
  let n = 0;
  for (const s of SURAHS) {
    if (s.number === surahNum) { n += ayatNum; break; }
    n += s.ayatCount;
  }
  return n;
}

/**
 * Bismillah rules:
 * - Al-Fatihah (1): Bismillah IS ayat 1 — audio is correct, just label it properly
 * - At-Tawbah (9): No bismillah at all
 * - All others: Bismillah is recited before ayat 1 but is NOT a numbered ayat.
 *   The API returns ayat 1 without bismillah text prepended.
 *   For display we show the bismillah banner above ayat 1.
 *   For audio: we must play the bismillah audio (global ayah 0 / special) THEN the ayat.
 *   The alquran.cloud API edition ar.alafasy returns audio URLs per ayat.
 *   The bismillah recitation is not a separate audio file in this API — it is embedded
 *   at the start of the first ayat's audio for most surahs. So no separate file needed.
 */
export function getBismillahInfo(surahNum: number, ayatNum: number) {
  const surah = SURAHS.find(s => s.number === surahNum)!;
  return {
    // Show the golden bismillah banner above the arabic text
    showBanner: surah.hasBismillah && ayatNum === 1 && surahNum !== 1,
    // Al-Fatihah ayat 1 IS bismillah — label it so the user knows
    isBismillahItself: surahNum === 1 && ayatNum === 1,
    // No bismillah at all
    noBismillah: !surah.hasBismillah,
  };
}
