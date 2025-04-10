
import { HolyBook, BookChapter, BookVerse, DisplayVerse } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { transliterateText } from './QuranAPI';
import { useToast } from '@/hooks/use-toast';

// Fetch all available holy books
export const fetchHolyBooks = async (): Promise<HolyBook[]> => {
  try {
    // First check if we have holy books in the database
    const { data, error } = await supabase
      .from('holy_books')
      .select('*')
      .order('id');

    if (error) {
      throw error;
    }

    if (data && data.length > 0) {
      return data.map(book => ({
        id: book.id,
        name: book.name,
        code: book.code,
        description: book.description,
        language: book.language,
        totalChapters: book.total_chapters
      }));
    }

    // If no books in the database, return default list
    return [
      {
        id: 1,
        name: 'Quran',
        code: 'quran',
        description: 'The central religious text of Islam',
        language: 'Arabic',
        totalChapters: 114
      },
      {
        id: 2,
        name: 'Bible',
        code: 'bible',
        description: 'The Christian holy book containing the Old and New Testaments',
        language: 'Multiple',
        totalChapters: 66
      },
      {
        id: 3,
        name: 'Bhagavad Gita',
        code: 'gita',
        description: 'A 700-verse Hindu scripture that is part of the epic Mahabharata',
        language: 'Sanskrit',
        totalChapters: 18
      },
      {
        id: 4,
        name: 'Ramayana',
        code: 'ramayana',
        description: 'An ancient Indian epic poem narrating the journey of Rama',
        language: 'Sanskrit',
        totalChapters: 7
      },
      {
        id: 5,
        name: 'Torah',
        code: 'torah',
        description: 'The compilation of the first five books of the Hebrew Bible',
        language: 'Hebrew',
        totalChapters: 5
      }
    ];
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

// Export book data in text format
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

// Create a function to download data from external APIs and store in database
export const downloadAndStoreBook = async (bookCode: string): Promise<{ success: boolean; message: string }> => {
  try {
    console.log(`Initiating download for ${bookCode}...`);
    
    switch (bookCode) {
      case 'bible':
        return await downloadBibleData();
      case 'gita':
        return await downloadGitaData();
      case 'ramayana':
        return await downloadRamayanaData();
      case 'torah':
        return await downloadTorahData();
      default:
        return {
          success: false,
          message: `No download method available for book: ${bookCode}`
        };
    }
  } catch (error) {
    console.error(`Error downloading ${bookCode}:`, error);
    return {
      success: false,
      message: `Error downloading ${bookCode}: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};

// Updated Bible data download with fallback to placeholder data
const downloadBibleData = async (): Promise<{ success: boolean; message: string }> => {
  try {
    // First check if we already have Bible data
    const { count } = await supabase
      .from('book_verses')
      .select('*', { count: 'exact', head: true })
      .eq('book_code', 'bible');
    
    if (count && count > 0) {
      return {
        success: true,
        message: 'Bible data already exists in the database'
      };
    }

    // First, insert the Bible book record
    const { error: holyBookError } = await supabase
      .from('holy_books')
      .upsert({
        code: 'bible',
        name: 'Bible',
        description: 'The Christian holy book containing the Old and New Testaments',
        language: 'Multiple',
        total_chapters: 66
      });

    if (holyBookError) {
      console.error('Error adding Bible to holy_books:', holyBookError);
    }
    
    // Create placeholder Bible data since API is not working
    const bibleBooks = [
      { name: "Genesis", verses: 50 },
      { name: "Exodus", verses: 40 },
      { name: "Leviticus", verses: 27 },
      { name: "Numbers", verses: 36 },
      { name: "Deuteronomy", verses: 34 },
      { name: "Joshua", verses: 24 },
      { name: "Judges", verses: 21 },
      { name: "Ruth", verses: 4 },
      { name: "1 Samuel", verses: 31 },
      { name: "2 Samuel", verses: 24 }
    ];
    
    // Add Bible chapters to database
    for (let i = 0; i < bibleBooks.length; i++) {
      const book = bibleBooks[i];
      
      // Insert chapter into database
      const { error: chapterError } = await supabase
        .from('book_chapters')
        .insert({
          book_code: 'bible',
          number: i + 1,
          name: book.name,
          english_name: book.name,
          verses_count: book.verses
        });
      
      if (chapterError) {
        console.error(`Error adding chapter ${book.name}:`, chapterError);
        continue;
      }
      
      // Add placeholder verses
      for (let j = 1; j <= Math.min(book.verses, 10); j++) {
        const { error: verseError } = await supabase
          .from('book_verses')
          .insert({
            book_code: 'bible',
            chapter_number: i + 1,
            verse_number: j,
            original_text: `Placeholder verse ${j} for ${book.name}`,
            english_translation: `English translation of ${book.name} ${j}`
          });
        
        if (verseError) {
          console.error(`Error adding verse ${book.name} ${j}:`, verseError);
        }
      }
    }
    
    return {
      success: true,
      message: 'Bible placeholder data has been added to the database. Note: This contains sample data due to API limitations.'
    };
  } catch (error) {
    console.error('Error downloading Bible data:', error);
    return {
      success: false,
      message: `Error adding Bible data: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};

// Updated Bhagavad Gita data download with fallback to placeholder data
const downloadGitaData = async (): Promise<{ success: boolean; message: string }> => {
  try {
    // First check if we already have Gita data
    const { count } = await supabase
      .from('book_verses')
      .select('*', { count: 'exact', head: true })
      .eq('book_code', 'gita');
    
    if (count && count > 0) {
      return {
        success: true,
        message: 'Bhagavad Gita data already exists in the database'
      };
    }

    // First, insert the Gita book record
    const { error: holyBookError } = await supabase
      .from('holy_books')
      .upsert({
        code: 'gita',
        name: 'Bhagavad Gita',
        description: 'A 700-verse Hindu scripture that is part of the epic Mahabharata',
        language: 'Sanskrit',
        total_chapters: 18
      });

    if (holyBookError) {
      console.error('Error adding Gita to holy_books:', holyBookError);
    }
    
    // Create placeholder Gita data since API isn't working
    for (let chapter = 1; chapter <= 18; chapter++) {
      // Insert chapter into database
      const { error: chapterError } = await supabase
        .from('book_chapters')
        .insert({
          book_code: 'gita',
          number: chapter,
          name: `अध्याय ${chapter}`,
          english_name: `Chapter ${chapter}`,
          verses_count: 20 + (chapter % 10)  // Random verse count between 20-29
        });
      
      if (chapterError) {
        console.error(`Error adding Gita chapter ${chapter}:`, chapterError);
        continue;
      }
      
      // Add 10 placeholder verses per chapter
      for (let verse = 1; verse <= 10; verse++) {
        const { error: verseError } = await supabase
          .from('book_verses')
          .insert({
            book_code: 'gita',
            chapter_number: chapter,
            verse_number: verse,
            original_text: `संस्कृत श्लोक ${chapter}.${verse} (Placeholder Sanskrit text)`,
            english_translation: `This is a placeholder translation for Bhagavad Gita Chapter ${chapter}, Verse ${verse}.`
          });
        
        if (verseError) {
          console.error(`Error adding Gita verse ${chapter}:${verse}:`, verseError);
        }
      }
    }
    
    return {
      success: true,
      message: 'Bhagavad Gita placeholder data has been added to the database. Note: This contains sample data due to API limitations.'
    };
  } catch (error) {
    console.error('Error downloading Bhagavad Gita data:', error);
    return {
      success: false,
      message: `Error adding Bhagavad Gita data: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};

// Ramayana data download and storage
const downloadRamayanaData = async (): Promise<{ success: boolean; message: string }> => {
  try {
    // First check if we already have Ramayana data
    const { count } = await supabase
      .from('book_verses')
      .select('*', { count: 'exact', head: true })
      .eq('book_code', 'ramayana');
    
    if (count && count > 0) {
      return {
        success: true,
        message: 'Ramayana data already exists in the database'
      };
    }

    // First, insert the Ramayana book record
    const { error: holyBookError } = await supabase
      .from('holy_books')
      .upsert({
        code: 'ramayana',
        name: 'Ramayana',
        description: 'An ancient Indian epic poem narrating the journey of Rama',
        language: 'Sanskrit',
        total_chapters: 7
      });

    if (holyBookError) {
      console.error('Error adding Ramayana to holy_books:', holyBookError);
    }
    
    // Since there's no specific Ramayana API, we'll use a simplified version
    // with the 7 Kandas (chapters) of Valmiki Ramayana
    const ramayanaKandas = [
      { number: 1, name: "बालकाण्ड", english_name: "Bala Kanda (Book of Youth)", verses_count: 77 },
      { number: 2, name: "अयोध्याकाण्ड", english_name: "Ayodhya Kanda (Book of Ayodhya)", verses_count: 119 },
      { number: 3, name: "अरण्यकाण्ड", english_name: "Aranya Kanda (Book of Forest)", verses_count: 75 },
      { number: 4, name: "किष्किन्धाकाण्ड", english_name: "Kishkindha Kanda (Book of Kingdom of Apes)", verses_count: 67 },
      { number: 5, name: "सुन्दरकाण्ड", english_name: "Sundara Kanda (Book of Beauty)", verses_count: 68 },
      { number: 6, name: "युद्धकाण्ड", english_name: "Yuddha Kanda (Book of War)", verses_count: 131 },
      { number: 7, name: "उत्तरकाण्ड", english_name: "Uttara Kanda (Book of Later Events)", verses_count: 111 }
    ];
    
    // Add chapters
    for (const kanda of ramayanaKandas) {
      const { error: chapterError } = await supabase
        .from('book_chapters')
        .insert({
          book_code: 'ramayana',
          number: kanda.number,
          name: kanda.name,
          english_name: kanda.english_name,
          verses_count: kanda.verses_count
        });
      
      if (chapterError) {
        console.error(`Error adding Ramayana kanda ${kanda.number}:`, chapterError);
        continue;
      }
      
      // Add 10 placeholder verses per chapter
      for (let i = 1; i <= 10; i++) {
        const { error: verseError } = await supabase
          .from('book_verses')
          .insert({
            book_code: 'ramayana',
            chapter_number: kanda.number,
            verse_number: i,
            original_text: `संस्कृत श्लोक ${kanda.number}.${i} (Placeholder Sanskrit text for ${kanda.english_name})`,
            english_translation: `This is a placeholder translation for ${kanda.english_name} verse ${i}.`
          });
        
        if (verseError) {
          console.error(`Error adding Ramayana verse ${kanda.number}:${i}:`, verseError);
        }
      }
    }
    
    return {
      success: true,
      message: 'Ramayana placeholder data has been added to the database. This contains sample verses.'
    };
  } catch (error) {
    console.error('Error setting up Ramayana data:', error);
    return {
      success: false,
      message: `Error setting up Ramayana data: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};

// Torah data download and storage
const downloadTorahData = async (): Promise<{ success: boolean; message: string }> => {
  try {
    // First check if we already have Torah data
    const { count } = await supabase
      .from('book_verses')
      .select('*', { count: 'exact', head: true })
      .eq('book_code', 'torah');
    
    if (count && count > 0) {
      return {
        success: true,
        message: 'Torah data already exists in the database'
      };
    }

    // First, insert the Torah book record
    const { error: holyBookError } = await supabase
      .from('holy_books')
      .upsert({
        code: 'torah',
        name: 'Torah',
        description: 'The first five books of the Hebrew Bible',
        language: 'Hebrew',
        total_chapters: 5
      });

    if (holyBookError) {
      console.error('Error adding Torah to holy_books:', holyBookError);
    }
    
    // The Torah consists of the five books of Moses
    const torahBooks = [
      { number: 1, name: "בְּרֵאשִׁית", english_name: "Genesis", verses_count: 50 },
      { number: 2, name: "שְׁמוֹת", english_name: "Exodus", verses_count: 40 },
      { number: 3, name: "וַיִּקְרָא", english_name: "Leviticus", verses_count: 27 },
      { number: 4, name: "בְּמִדְבַּר", english_name: "Numbers", verses_count: 36 },
      { number: 5, name: "דְּבָרִים", english_name: "Deuteronomy", verses_count: 34 }
    ];
    
    // Add Torah books
    for (const book of torahBooks) {
      // Add chapter to database
      const { error: chapterError } = await supabase
        .from('book_chapters')
        .insert({
          book_code: 'torah',
          number: book.number,
          name: book.name,
          english_name: book.english_name,
          verses_count: book.verses_count
        });
      
      if (chapterError) {
        console.error(`Error adding Torah book ${book.english_name}:`, chapterError);
        continue;
      }
      
      // Add 10 placeholder verses per book
      for (let verse = 1; verse <= 10; verse++) {
        const { error: verseError } = await supabase
          .from('book_verses')
          .insert({
            book_code: 'torah',
            chapter_number: book.number,
            verse_number: verse,
            original_text: `עברית פסוק ${book.number}.${verse} (Placeholder Hebrew text for ${book.english_name})`,
            english_translation: `This is a placeholder translation for ${book.english_name} verse ${verse}.`
          });
        
        if (verseError) {
          console.error(`Error adding Torah verse ${book.english_name} ${verse}:`, verseError);
        }
      }
    }
    
    return {
      success: true,
      message: 'Torah placeholder data has been added to the database. This contains sample verses.'
    };
  } catch (error) {
    console.error('Error downloading Torah data:', error);
    return {
      success: false,
      message: `Error downloading Torah data: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};
