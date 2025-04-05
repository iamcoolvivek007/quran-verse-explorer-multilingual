
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
