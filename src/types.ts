
export interface QuranVerse {
  chapter: number;
  verse: number;
  text: string;
}

export interface QuranData {
  arabic: QuranVerse[];
  english_transliteration: QuranVerse[];
  english_translation: QuranVerse[];
  malayalam_translation: QuranVerse[];
  tamil_translation: QuranVerse[];
  malayalam_transliteration: QuranVerse[];
  tamil_transliteration: QuranVerse[];
}

export interface DisplayVerse {
  bookCode: string;
  surah: number;
  ayah: number;
  arabic: string;
  englishTransliteration: string;
  englishTranslation: string;
  malayalamTranslation: string;
  tamilTranslation: string;
  malayalamTransliteration: string;
  tamilTransliteration: string;
  audioUrl: string | null;
}

export interface SurahInfo {
  number: number;
  name: string;
  englishName: string;
  versesCount: number;
}

export interface HolyBook {
  id: number;
  name: string;
  code: string;
  description: string | null;
  language: string | null;
  totalChapters: number | null;
}

export interface BookChapter {
  id: number;
  bookCode: string;
  number: number;
  name: string;
  englishName: string;
  versesCount: number;
}

export interface BookVerse {
  id: number;
  bookCode: string;
  chapterNumber: number;
  verseNumber: number;
  originalText: string;
  englishTranslation: string | null;
  englishTransliteration: string | null;
  malayalamTranslation: string | null;
  tamilTranslation: string | null;
  malayalamTransliteration: string | null;
  tamilTransliteration: string | null;
  audioUrl: string | null;
}
