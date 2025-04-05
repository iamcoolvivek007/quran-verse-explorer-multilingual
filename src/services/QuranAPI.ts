
import { QuranVerse, QuranData, DisplayVerse } from '@/types';

const SURAH_INFO_URL = 'https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/info.json';

const QURAN_EDITIONS = {
  arabic: 'https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions/ara-quranuthmani.json',
  english_transliteration: 'https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions/eng-transliteration.json',
  english_translation: 'https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions/eng-sahih.json',
  malayalam_translation: 'https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions/mal-abdulhameed.json',
  tamil_translation: 'https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions/tam-kingfahad.json',
};

export const fetchSurahInfo = async (): Promise<any> => {
  try {
    const response = await fetch(SURAH_INFO_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch Surah information');
    }
    const data = await response.json();
    return data.chapters;
  } catch (error) {
    console.error('Error fetching Surah info:', error);
    throw error;
  }
};

export const fetchQuranData = async (): Promise<QuranData> => {
  const quranData: Partial<QuranData> = {};
  
  try {
    // Fetch data from each edition in parallel
    const fetchPromises = Object.entries(QURAN_EDITIONS).map(async ([key, url]) => {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${key} data`);
      }
      const data = await response.json();
      return { key, data: data.quran };
    });
    
    const results = await Promise.all(fetchPromises);
    
    // Organize the fetched data
    results.forEach(({ key, data }) => {
      quranData[key as keyof QuranData] = data;
    });
    
    return quranData as QuranData;
  } catch (error) {
    console.error('Error fetching Quran data:', error);
    throw error;
  }
};

export const getVersesForSurah = (quranData: QuranData, surahNumber: number): DisplayVerse[] => {
  if (!quranData.arabic) return [];
  
  const verses: DisplayVerse[] = [];
  
  // Filter verses for the specified surah
  quranData.arabic.forEach((verse, index) => {
    if (verse.chapter === surahNumber) {
      verses.push({
        surah: verse.chapter,
        ayah: verse.verse,
        arabic: verse.text,
        englishTransliteration: quranData.english_transliteration[index].text,
        englishTranslation: quranData.english_translation[index].text,
        malayalamTranslation: quranData.malayalam_translation[index].text,
        tamilTranslation: quranData.tamil_translation[index].text,
      });
    }
  });
  
  return verses;
};

export const exportQuranData = (verses: DisplayVerse[]): string => {
  let content = '';
  
  verses.forEach((verse) => {
    content += `Surah ${verse.surah}, Ayah ${verse.ayah}:\n`;
    content += `Arabic: ${verse.arabic}\n`;
    content += `English Transliteration: ${verse.englishTransliteration}\n`;
    content += `English Translation: ${verse.englishTranslation}\n`;
    content += `Malayalam Translation: ${verse.malayalamTranslation}\n`;
    content += `Tamil Translation: ${verse.tamilTranslation}\n`;
    content += '-'.repeat(50) + '\n';
  });
  
  return content;
};

export const downloadQuranData = (verses: DisplayVerse[], fileName: string = 'quran_verses.txt'): void => {
  const content = exportQuranData(verses);
  
  // Create a Blob with the content
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  
  // Create a URL for the Blob
  const url = URL.createObjectURL(blob);
  
  // Create a download link
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  
  // Trigger the download
  document.body.appendChild(a);
  a.click();
  
  // Clean up
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
