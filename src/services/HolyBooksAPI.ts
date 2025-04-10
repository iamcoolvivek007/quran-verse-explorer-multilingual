
import { HolyBook, BookChapter, BookVerse, DisplayVerse } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { transliterateText } from './QuranAPI';

// Fetch all available holy books
export const fetchHolyBooks = async (): Promise<HolyBook[]> => {
  try {
    const { data, error } = await supabase
      .from('holy_books')
      .select('*')
      .order('id');

    if (error) {
      throw error;
    }

    return data.map(book => ({
      id: book.id,
      name: book.name,
      code: book.code,
      description: book.description,
      language: book.language,
      totalChapters: book.total_chapters
    }));
  } catch (error) {
    console.error('Error fetching holy books:', error);
    return [];
  }
};

// Fetch chapters for a specific holy book
export const fetchBookChapters = async (bookCode: string): Promise<BookChapter[]> => {
  try {
    const { data, error } = await supabase
      .from('book_chapters')
      .select('*')
      .eq('book_code', bookCode)
      .order('number');

    if (error) {
      throw error;
    }

    return data.map(chapter => ({
      id: chapter.id,
      bookCode: chapter.book_code,
      number: chapter.number,
      name: chapter.name,
      englishName: chapter.english_name,
      versesCount: chapter.verses_count
    }));
  } catch (error) {
    console.error(`Error fetching chapters for book ${bookCode}:`, error);
    return [];
  }
};

// Fetch a specific chapter by book code and chapter number
export const fetchBookChapter = async (bookCode: string, chapterNumber: number): Promise<BookChapter | null> => {
  try {
    const { data, error } = await supabase
      .from('book_chapters')
      .select('*')
      .eq('book_code', bookCode)
      .eq('number', chapterNumber)
      .single();

    if (error) {
      throw error;
    }

    return {
      id: data.id,
      bookCode: data.book_code,
      number: data.number,
      name: data.name,
      englishName: data.english_name,
      versesCount: data.verses_count
    };
  } catch (error) {
    console.error(`Error fetching chapter ${chapterNumber} for book ${bookCode}:`, error);
    return null;
  }
};

// Fetch verses for a specific chapter of a holy book
export const fetchBookVerses = async (bookCode: string, chapterNumber: number): Promise<BookVerse[]> => {
  try {
    const { data, error } = await supabase
      .from('book_verses')
      .select('*')
      .eq('book_code', bookCode)
      .eq('chapter_number', chapterNumber)
      .order('verse_number');

    if (error) {
      throw error;
    }

    return data.map(verse => ({
      id: verse.id,
      bookCode: verse.book_code,
      chapterNumber: verse.chapter_number,
      verseNumber: verse.verse_number,
      originalText: verse.original_text,
      englishTranslation: verse.english_translation,
      englishTransliteration: verse.english_transliteration,
      malayalamTranslation: verse.malayalam_translation,
      tamilTranslation: verse.tamil_translation,
      malayalamTransliteration: verse.malayalam_transliteration,
      tamilTransliteration: verse.tamil_transliteration,
      audioUrl: verse.audio_url
    }));
  } catch (error) {
    console.error(`Error fetching verses for chapter ${chapterNumber} of book ${bookCode}:`, error);
    return [];
  }
};

// Convert BookVerse array to DisplayVerse array for consistent UI rendering
export const convertToDisplayVerses = async (bookVerses: BookVerse[]): Promise<DisplayVerse[]> => {
  const displayVerses: DisplayVerse[] = [];

  for (const verse of bookVerses) {
    // Generate transliterations for Malayalam and Tamil if they don't exist
    let malayalamTransliteration = verse.malayalamTransliteration;
    let tamilTransliteration = verse.tamilTransliteration;

    if (verse.malayalamTranslation && (!malayalamTransliteration || malayalamTransliteration.includes("[Transliteration not available]"))) {
      try {
        malayalamTransliteration = await transliterateText(verse.malayalamTranslation, 'ml');
      } catch (error) {
        console.error('Error generating Malayalam transliteration:', error);
        malayalamTransliteration = `[Transliteration not available] ${verse.malayalamTranslation}`;
      }
    }

    if (verse.tamilTranslation && (!tamilTransliteration || tamilTransliteration.includes("[Transliteration not available]"))) {
      try {
        tamilTransliteration = await transliterateText(verse.tamilTranslation, 'ta');
      } catch (error) {
        console.error('Error generating Tamil transliteration:', error);
        tamilTransliteration = `[Transliteration not available] ${verse.tamilTranslation}`;
      }
    }

    displayVerses.push({
      bookCode: verse.bookCode,
      surah: verse.chapterNumber,
      ayah: verse.verseNumber,
      arabic: verse.originalText,
      englishTranslation: verse.englishTranslation || '',
      englishTransliteration: verse.englishTransliteration || '',
      malayalamTranslation: verse.malayalamTranslation || '',
      tamilTranslation: verse.tamilTranslation || '',
      malayalamTransliteration: malayalamTransliteration || '',
      tamilTransliteration: tamilTransliteration || '',
      audioUrl: verse.audioUrl
    });
  }

  return displayVerses;
};

// Download book data in text format
export const exportBookData = (verses: DisplayVerse[], bookName: string): string => {
  let content = `${bookName}\n`;
  content += '='.repeat(bookName.length) + '\n\n';
  
  verses.forEach((verse) => {
    content += `Chapter ${verse.surah}, Verse ${verse.ayah}:\n`;
    content += `Original: ${verse.arabic}\n`;
    
    if (verse.englishTranslation) {
      content += `English Translation: ${verse.englishTranslation}\n`;
    }
    
    if (verse.englishTransliteration) {
      content += `English Transliteration: ${verse.englishTransliteration}\n`;
    }
    
    if (verse.malayalamTranslation) {
      content += `Malayalam Translation: ${verse.malayalamTranslation}\n`;
    }
    
    if (verse.tamilTranslation) {
      content += `Tamil Translation: ${verse.tamilTranslation}\n`;
    }
    
    if (verse.malayalamTransliteration) {
      content += `Malayalam Transliteration: ${verse.malayalamTransliteration}\n`;
    }
    
    if (verse.tamilTransliteration) {
      content += `Tamil Transliteration: ${verse.tamilTransliteration}\n`;
    }
    
    content += '-'.repeat(50) + '\n';
  });
  
  return content;
};

// Download book data as a file
export const downloadBookData = (verses: DisplayVerse[], fileName: string = 'holy_book_verses.txt'): void => {
  const bookName = verses.length > 0 ? `${verses[0].bookCode} - Chapter ${verses[0].surah}` : 'Holy Book';
  const content = exportBookData(verses, bookName);
  
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
