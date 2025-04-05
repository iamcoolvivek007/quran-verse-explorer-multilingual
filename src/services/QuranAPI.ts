
import { QuranVerse, QuranData, DisplayVerse } from '@/types';

// New API URLs that are more reliable
const SURAH_INFO_URL = 'https://api.alquran.cloud/v1/surah';

// Individual surah endpoint format: https://api.alquran.cloud/v1/surah/{surah_number}/{edition}
const EDITIONS = {
  arabic: 'quran-uthmani',
  english_transliteration: 'en.transliteration',
  english_translation: 'en.sahih',
  malayalam_translation: 'ml.abdulhameed',
  tamil_translation: 'ta.tamil'
};

export const fetchSurahInfo = async (): Promise<any> => {
  try {
    const response = await fetch(SURAH_INFO_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch Surah information');
    }
    const data = await response.json();
    
    // Format the data to match our expected structure
    return data.data.map((surah: any) => ({
      number: surah.number,
      name: surah.name,
      englishName: surah.englishName,
      versesCount: surah.numberOfAyahs
    }));
  } catch (error) {
    console.error('Error fetching Surah info:', error);
    throw error;
  }
};

export const fetchQuranData = async (): Promise<QuranData> => {
  // Initialize structure
  const quranData: QuranData = {
    arabic: [],
    english_transliteration: [],
    english_translation: [],
    malayalam_translation: [],
    tamil_translation: []
  };
  
  // We'll fetch first surah by default for initial load
  // Later when user selects a surah, we'll fetch just that one
  try {
    const surahNumber = 1;
    const fetchPromises = Object.entries(EDITIONS).map(async ([key, edition]) => {
      const url = `https://api.alquran.cloud/v1/surah/${surahNumber}/${edition}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch ${key} data for Surah ${surahNumber}`);
      }
      
      const data = await response.json();
      
      if (!data.data || !data.data.ayahs) {
        throw new Error(`Invalid data format for ${key}`);
      }
      
      return { 
        key, 
        verses: data.data.ayahs.map((ayah: any) => ({
          chapter: surahNumber,
          verse: ayah.numberInSurah,
          text: ayah.text
        }))
      };
    });
    
    const results = await Promise.all(fetchPromises);
    
    // Organize the fetched data
    results.forEach(({ key, verses }) => {
      quranData[key as keyof QuranData] = verses;
    });
    
    return quranData;
  } catch (error) {
    console.error('Error fetching Quran data:', error);
    throw error;
  }
};

export const fetchSurahVerses = async (surahNumber: number): Promise<QuranData> => {
  // Initialize structure
  const quranData: QuranData = {
    arabic: [],
    english_transliteration: [],
    english_translation: [],
    malayalam_translation: [],
    tamil_translation: []
  };
  
  try {
    const fetchPromises = Object.entries(EDITIONS).map(async ([key, edition]) => {
      const url = `https://api.alquran.cloud/v1/surah/${surahNumber}/${edition}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        console.error(`Failed to fetch ${key} data: status ${response.status}`);
        return { 
          key, 
          verses: [] // Return empty array on error
        };
      }
      
      const data = await response.json();
      
      if (!data.data || !data.data.ayahs) {
        console.error(`Invalid data format for ${key}`);
        return { key, verses: [] };
      }
      
      return { 
        key, 
        verses: data.data.ayahs.map((ayah: any) => ({
          chapter: surahNumber,
          verse: ayah.numberInSurah,
          text: ayah.text
        }))
      };
    });
    
    const results = await Promise.all(fetchPromises);
    
    // Organize the fetched data
    results.forEach(({ key, verses }) => {
      quranData[key as keyof QuranData] = verses;
    });
    
    return quranData;
  } catch (error) {
    console.error('Error fetching surah verses:', error);
    throw error;
  }
};

export const getVersesForSurah = (quranData: QuranData, surahNumber: number): DisplayVerse[] => {
  if (!quranData.arabic || quranData.arabic.length === 0) return [];
  
  const verses: DisplayVerse[] = [];
  
  // Filter verses for the specified surah
  quranData.arabic.forEach((verse, index) => {
    if (verse.chapter === surahNumber) {
      const displayVerse: DisplayVerse = {
        surah: verse.chapter,
        ayah: verse.verse,
        arabic: verse.text,
        englishTransliteration: '',
        englishTranslation: '',
        malayalamTranslation: '',
        tamilTranslation: ''
      };
      
      // Add translations if available
      if (quranData.english_transliteration[index]) {
        displayVerse.englishTransliteration = quranData.english_transliteration[index].text;
      }
      
      if (quranData.english_translation[index]) {
        displayVerse.englishTranslation = quranData.english_translation[index].text;
      }
      
      if (quranData.malayalam_translation[index]) {
        displayVerse.malayalamTranslation = quranData.malayalam_translation[index].text;
      }
      
      if (quranData.tamil_translation[index]) {
        displayVerse.tamilTranslation = quranData.tamil_translation[index].text;
      }
      
      verses.push(displayVerse);
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
