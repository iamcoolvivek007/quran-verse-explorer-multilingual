import { QuranVerse, QuranData, DisplayVerse, SurahInfo } from '@/types';
import { supabase } from '@/integrations/supabase/client';

// Define interface for the grouped results
interface GroupedResult {
  verses: QuranVerse[];
  sources: string[];
}

// Fetch Surah information from Supabase
export const fetchSurahInfo = async (): Promise<SurahInfo[]> => {
  try {
    const { data, error } = await supabase
      .from('surahs')
      .select('*')
      .order('number');

    if (error) {
      throw error;
    }

    // Map the data to match our existing SurahInfo interface
    return data.map((surah) => ({
      number: surah.number,
      name: surah.name,
      englishName: surah.english_name,
      versesCount: surah.verses_count
    }));
  } catch (error) {
    console.error('Error fetching Surah info from Supabase:', error);
    
    // Fallback to the API if Supabase fails
    return fetchSurahInfoFromAPI();
  }
};

// Fallback to fetch Surah information from API
export const fetchSurahInfoFromAPI = async (): Promise<any> => {
  try {
    const response = await fetch('https://api.alquran.cloud/v1/surah');
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
    console.error('Error fetching Surah info from API:', error);
    throw error;
  }
};

// Try to fetch verses from Supabase first, fallback to API if needed
export const fetchSurahVerses = async (surahNumber: number): Promise<QuranData> => {
  try {
    const { data, error } = await supabase
      .from('verses')
      .select('*')
      .eq('surah_number', surahNumber)
      .order('ayah_number');

    if (error) {
      throw error;
    }

    if (data && data.length > 0) {
      console.log(`Fetched ${data.length} verses for Surah ${surahNumber} from Supabase`);
      
      // Format to match our existing QuranData structure
      const quranData: QuranData = {
        arabic: [],
        english_transliteration: [],
        english_translation: [],
        malayalam_translation: [],
        tamil_translation: [],
        malayalam_transliteration: [],
        tamil_transliteration: []
      };

      data.forEach(verse => {
        if (verse.arabic) {
          quranData.arabic.push({
            chapter: verse.surah_number,
            verse: verse.ayah_number,
            text: verse.arabic
          });
        }

        if (verse.english_transliteration) {
          quranData.english_transliteration.push({
            chapter: verse.surah_number,
            verse: verse.ayah_number,
            text: verse.english_transliteration
          });
        }

        if (verse.english_translation) {
          quranData.english_translation.push({
            chapter: verse.surah_number,
            verse: verse.ayah_number,
            text: verse.english_translation
          });
        }

        if (verse.malayalam_translation) {
          quranData.malayalam_translation.push({
            chapter: verse.surah_number,
            verse: verse.ayah_number,
            text: verse.malayalam_translation
          });
        }

        if (verse.tamil_translation) {
          quranData.tamil_translation.push({
            chapter: verse.surah_number,
            verse: verse.ayah_number,
            text: verse.tamil_translation
          });
        }

        if (verse.malayalam_transliteration) {
          quranData.malayalam_transliteration.push({
            chapter: verse.surah_number,
            verse: verse.ayah_number,
            text: verse.malayalam_transliteration
          });
        }

        if (verse.tamil_transliteration) {
          quranData.tamil_transliteration.push({
            chapter: verse.surah_number,
            verse: verse.ayah_number,
            text: verse.tamil_transliteration
          });
        }
      });

      return quranData;
    } else {
      console.log(`No verses found in Supabase for Surah ${surahNumber}, fetching from API...`);
      return fetchSurahVersesFromAPI(surahNumber);
    }
  } catch (error) {
    console.error('Error fetching from Supabase:', error);
    return fetchSurahVersesFromAPI(surahNumber);
  }
};

// Fallback to fetch from the API
export const fetchSurahVersesFromAPI = async (surahNumber: number): Promise<QuranData> => {
  // Initialize structure
  const quranData: QuranData = {
    arabic: [],
    english_transliteration: [],
    english_translation: [],
    malayalam_translation: [],
    tamil_translation: [],
    malayalam_transliteration: [],
    tamil_transliteration: []
  };
  
  try {
    const EDITIONS = {
      arabic: 'quran-uthmani',
      english_transliteration: 'en.transliteration',
      english_translation: 'en.sahih',
      malayalam_translation: 'ml.abdulhameed',
      tamil_translation: 'ta.tamil'
    };

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

    // Try multiple sources for transliterations
    const transliterationPromises = [];
    
    // Source 1: QuranEnc API
    const QURAN_ENC_URLS = {
      malayalam_transliteration: `https://quranenc.com/api/v1/translation/sura/malayalam_abdulhameed/${surahNumber}`,
      tamil_transliteration: `https://quranenc.com/api/v1/translation/sura/tamil/${surahNumber}`
    };

    for (const [key, url] of Object.entries(QURAN_ENC_URLS)) {
      transliterationPromises.push(fetchTransliterationData(key, url, surahNumber));
    }
    
    // Source 2: Alternative API (tanzil.net) - Try using their translation API for transliteration
    const TANZIL_URLS = {
      malayalam_transliteration: `https://tanzil.net/trans/ml.abdulhameed/${surahNumber}`,
      tamil_transliteration: `https://tanzil.net/trans/ta.tamil/${surahNumber}`
    };
    
    for (const [key, url] of Object.entries(TANZIL_URLS)) {
      transliterationPromises.push(fetchTransliterationData(key, url, surahNumber, 'tanzil'));
    }
    
    // Source 3: Another alternative API (alquranenglish.com)
    const ALQURAN_ENGLISH_URLS = {
      malayalam_transliteration: `https://alquranenglish.com/surah/${surahNumber}/malayalam-transliteration`,
      tamil_transliteration: `https://alquranenglish.com/surah/${surahNumber}/tamil-transliteration`
    };
    
    for (const [key, url] of Object.entries(ALQURAN_ENGLISH_URLS)) {
      transliterationPromises.push(fetchTransliterationData(key, url, surahNumber, 'alquran_english'));
    }
    
    // Source 4: Use the translation as a fallback if no transliteration is available
    // This will copy the translation to transliteration fields if no transliteration is found
    transliterationPromises.push(
      Promise.resolve({
        key: 'malayalam_transliteration',
        verses: [],
        source: 'fallback'
      }),
      Promise.resolve({
        key: 'tamil_transliteration',
        verses: [],
        source: 'fallback'
      })
    );
    
    const results = await Promise.all([...fetchPromises, ...transliterationPromises]);
    
    // Group results by key to handle multiple sources for the same key
    const groupedResults: Record<string, GroupedResult> = {};
    
    results.forEach(result => {
      if (!result) return;
      
      const { key, verses, source } = result as { key: string; verses: QuranVerse[]; source?: string };
      
      if (!groupedResults[key]) {
        groupedResults[key] = { verses: [], sources: [] };
      }
      
      // Only add non-empty results
      if (verses && verses.length > 0) {
        groupedResults[key].verses = verses;
        groupedResults[key].sources.push(source || 'primary');
      }
    });
    
    // Use translations as a fallback for missing transliterations
    if (groupedResults['malayalam_transliteration']?.verses.length === 0 && 
        groupedResults['malayalam_translation']?.verses.length > 0) {
      console.log('Using Malayalam translation as fallback for transliteration');
      groupedResults['malayalam_transliteration'].verses = groupedResults['malayalam_translation'].verses.map(verse => ({
        ...verse,
        text: `[Transliteration not available] ${verse.text}`
      }));
      groupedResults['malayalam_transliteration'].sources.push('translation_fallback');
    }
    
    if (groupedResults['tamil_transliteration']?.verses.length === 0 && 
        groupedResults['tamil_translation']?.verses.length > 0) {
      console.log('Using Tamil translation as fallback for transliteration');
      groupedResults['tamil_transliteration'].verses = groupedResults['tamil_translation'].verses.map(verse => ({
        ...verse,
        text: `[Transliteration not available] ${verse.text}`
      }));
      groupedResults['tamil_transliteration'].sources.push('translation_fallback');
    }
    
    // Organize the fetched data
    Object.entries(groupedResults).forEach(([key, data]) => {
      if (key in quranData && data.verses.length > 0) {
        quranData[key as keyof QuranData] = data.verses;
        console.log(`Using ${data.sources.join(', ')} source for ${key}`);
      }
    });
    
    return quranData;
  } catch (error) {
    console.error('Error fetching surah verses:', error);
    throw error;
  }
};

// Helper function to fetch transliteration data from different sources
async function fetchTransliterationData(key: string, url: string, surahNumber: number, source = 'quranenc'): Promise<{ key: string; verses: QuranVerse[]; source: string }> {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error(`Failed to fetch ${key} data from ${source}: status ${response.status}`);
      return { key, verses: [], source };
    }
    
    const data = await response.json();
    
    if (source === 'quranenc') {
      if (!data.result || !Array.isArray(data.result)) {
        console.error(`Invalid data format for ${key} from ${source}`);
        return { key, verses: [], source };
      }
      
      return { 
        key, 
        verses: data.result.map((ayah: any) => ({
          chapter: surahNumber,
          verse: parseInt(ayah.aya || ayah.id || "0"),
          text: ayah.translation || ayah.text || ""
        })),
        source
      };
    } else if (source === 'tanzil') {
      if (!data.verses || !Array.isArray(data.verses)) {
        console.error(`Invalid data format for ${key} from ${source}`);
        return { key, verses: [], source };
      }
      
      return { 
        key, 
        verses: data.verses.map((ayah: any) => ({
          chapter: surahNumber,
          verse: ayah.verse,
          text: ayah.text || ""
        })),
        source
      };
    } else if (source === 'alquran_english') {
      if (!data.transliteration || !Array.isArray(data.transliteration)) {
        console.error(`Invalid data format for ${key} from ${source}`);
        return { key, verses: [], source };
      }
      
      return { 
        key, 
        verses: data.transliteration.map((ayah: any) => ({
          chapter: surahNumber,
          verse: ayah.verseNumber,
          text: ayah.text || ""
        })),
        source
      };
    }
    
    return { key, verses: [], source };
  } catch (error) {
    console.error(`Error fetching ${key} from ${source}:`, error);
    return { key, verses: [], source };
  }
}

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
        tamilTranslation: '',
        malayalamTransliteration: '',
        tamilTransliteration: '',
        audioUrl: null
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

      if (quranData.malayalam_transliteration[index]) {
        displayVerse.malayalamTransliteration = quranData.malayalam_transliteration[index].text;
      }
      
      if (quranData.tamil_transliteration[index]) {
        displayVerse.tamilTransliteration = quranData.tamil_transliteration[index].text;
      }
      
      verses.push(displayVerse);
    }
  });
  
  return verses;
};

// Fetch data about which verses have audio
export const fetchAudioUrls = async (surahNumber: number): Promise<Record<number, string>> => {
  try {
    const { data, error } = await supabase
      .from('verses')
      .select('ayah_number, audio_url')
      .eq('surah_number', surahNumber)
      .not('audio_url', 'is', null);

    if (error) {
      throw error;
    }

    // Create a mapping of ayah number to audio URL
    const audioMap: Record<number, string> = {};
    
    data.forEach(verse => {
      if (verse.audio_url) {
        audioMap[verse.ayah_number] = verse.audio_url;
      }
    });

    return audioMap;
  } catch (error) {
    console.error('Error fetching audio URLs:', error);
    return {};
  }
};

// General function to download data and populate Supabase
export const populateQuranData = async (): Promise<boolean> => {
  try {
    const response = await supabase.functions.invoke('populate-quran-data', {
      method: 'POST'
    });

    if (!response.data?.success) {
      console.error('Error in populate-quran-data function:', response.error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error calling populate-quran-data function:', error);
    return false;
  }
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
    content += `Malayalam Transliteration: ${verse.malayalamTransliteration}\n`;
    content += `Tamil Transliteration: ${verse.tamilTransliteration}\n`;
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

export const fetchQuranData = async (): Promise<QuranData> => {
  // This is a legacy function that will be redirected to use Supabase
  // We'll keep it for backward compatibility
  return fetchSurahVerses(1); // Default to first surah
};
