
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

// Bible data download and storage
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
    
    // Get Bible books from API.Bible or another source
    const bibleResponse = await fetch('https://api.scripture.api.bible/v1/bibles/de4e12af7f28f599-01/books', {
      headers: {
        'api-key': 'f0c2c3fd4e85e0a0c9f77f4903deacd5'
      }
    });
    
    if (!bibleResponse.ok) {
      throw new Error(`Failed to fetch Bible books: ${bibleResponse.status}`);
    }
    
    const bibleData = await bibleResponse.json();
    const bibleBooks = bibleData.data;
    
    // First, add Bible chapters to database
    for (const book of bibleBooks) {
      const chapterResponse = await fetch(`https://api.scripture.api.bible/v1/bibles/de4e12af7f28f599-01/books/${book.id}/chapters`, {
        headers: {
          'api-key': 'f0c2c3fd4e85e0a0c9f77f4903deacd5'
        }
      });
      
      if (!chapterResponse.ok) {
        console.error(`Failed to fetch chapters for ${book.name}: ${chapterResponse.status}`);
        continue;
      }
      
      const chapterData = await chapterResponse.json();
      const chapters = chapterData.data.filter((chapter: any) => chapter.number !== 'intro');
      
      for (const chapter of chapters) {
        // Insert chapter into database
        const { error: chapterError } = await supabase
          .from('book_chapters')
          .insert({
            book_code: 'bible',
            number: parseInt(chapter.number) || 1,
            name: `${book.name} ${chapter.number}`,
            english_name: `${book.name} ${chapter.number}`,
            verses_count: 0 // Will update this after fetching verses
          });
        
        if (chapterError) {
          console.error(`Error adding chapter ${book.name} ${chapter.number}:`, chapterError);
          continue;
        }
        
        // Fetch verses for this chapter
        const versesResponse = await fetch(`https://api.scripture.api.bible/v1/bibles/de4e12af7f28f599-01/chapters/${chapter.id}/verses`, {
          headers: {
            'api-key': 'f0c2c3fd4e85e0a0c9f77f4903deacd5'
          }
        });
        
        if (!versesResponse.ok) {
          console.error(`Failed to fetch verses for ${book.name} ${chapter.number}: ${versesResponse.status}`);
          continue;
        }
        
        const versesData = await versesResponse.json();
        const verses = versesData.data;
        
        // For each verse, get the content
        for (const verse of verses) {
          const verseContentResponse = await fetch(`https://api.scripture.api.bible/v1/bibles/de4e12af7f28f599-01/verses/${verse.id}?content-type=text&include-notes=false&include-titles=false&include-chapter-numbers=false&include-verse-numbers=false`, {
            headers: {
              'api-key': 'f0c2c3fd4e85e0a0c9f77f4903deacd5'
            }
          });
          
          if (!verseContentResponse.ok) {
            console.error(`Failed to fetch content for verse ${verse.id}: ${verseContentResponse.status}`);
            continue;
          }
          
          const verseContent = await verseContentResponse.json();
          const content = verseContent.data.content;
          
          // Add verse to database
          const { error: verseError } = await supabase
            .from('book_verses')
            .insert({
              book_code: 'bible',
              chapter_number: parseInt(chapter.number) || 1,
              verse_number: parseInt(verse.number) || 1,
              original_text: content,
              english_translation: content
            });
          
          if (verseError) {
            console.error(`Error adding verse ${verse.id}:`, verseError);
          }
        }
        
        // Update verses count for this chapter
        const { error: updateError } = await supabase
          .from('book_chapters')
          .update({ verses_count: verses.length })
          .eq('book_code', 'bible')
          .eq('number', parseInt(chapter.number) || 1);
        
        if (updateError) {
          console.error(`Error updating verses count for ${book.name} ${chapter.number}:`, updateError);
        }
      }
    }
    
    return {
      success: true,
      message: 'Bible data has been downloaded and stored in the database'
    };
  } catch (error) {
    console.error('Error downloading Bible data:', error);
    return {
      success: false,
      message: `Error downloading Bible data: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};

// Bhagavad Gita data download and storage
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
    
    // Fetch Bhagavad Gita chapters
    for (let chapter = 1; chapter <= 18; chapter++) {
      const gitaResponse = await fetch(`https://bhagavadgita.io/api/v1/chapters/${chapter}`, {
        headers: {
          'X-API-KEY': 'bbf8b99cXuXr7Oxa2MKHnm3HTxkGsWdnN4lJ0GKP'
        }
      });
      
      if (!gitaResponse.ok) {
        console.error(`Failed to fetch Gita chapter ${chapter}: ${gitaResponse.status}`);
        continue;
      }
      
      const chapterData = await gitaResponse.json();
      
      // Insert chapter into database
      const { error: chapterError } = await supabase
        .from('book_chapters')
        .insert({
          book_code: 'gita',
          number: chapter,
          name: chapterData.name_sanskrit || `Chapter ${chapter}`,
          english_name: chapterData.name_translated || `Chapter ${chapter}`,
          verses_count: chapterData.verses_count || 0
        });
      
      if (chapterError) {
        console.error(`Error adding Gita chapter ${chapter}:`, chapterError);
        continue;
      }
      
      // Fetch verses for this chapter
      const versesResponse = await fetch(`https://bhagavadgita.io/api/v1/chapters/${chapter}/verses`, {
        headers: {
          'X-API-KEY': 'bbf8b99cXuXr7Oxa2MKHnm3HTxkGsWdnN4lJ0GKP'
        }
      });
      
      if (!versesResponse.ok) {
        console.error(`Failed to fetch verses for Gita chapter ${chapter}: ${versesResponse.status}`);
        continue;
      }
      
      const verses = await versesResponse.json();
      
      for (const verse of verses) {
        const { error: verseError } = await supabase
          .from('book_verses')
          .insert({
            book_code: 'gita',
            chapter_number: chapter,
            verse_number: verse.verse_number || 1,
            original_text: verse.text || '',
            english_translation: verse.translations?.[0]?.description || ''
          });
        
        if (verseError) {
          console.error(`Error adding Gita verse ${chapter}:${verse.verse_number}:`, verseError);
        }
      }
    }
    
    return {
      success: true,
      message: 'Bhagavad Gita data has been downloaded and stored in the database'
    };
  } catch (error) {
    console.error('Error downloading Bhagavad Gita data:', error);
    return {
      success: false,
      message: `Error downloading Bhagavad Gita data: ${error instanceof Error ? error.message : String(error)}`
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
      
      // Add placeholder verses
      for (let i = 1; i <= kanda.verses_count; i++) {
        const { error: verseError } = await supabase
          .from('book_verses')
          .insert({
            book_code: 'ramayana',
            chapter_number: kanda.number,
            verse_number: i,
            original_text: `[Placeholder for Ramayana ${kanda.english_name} verse ${i}]`,
            english_translation: `[Placeholder for English translation of ${kanda.english_name} verse ${i}]`
          });
        
        if (verseError) {
          console.error(`Error adding Ramayana verse ${kanda.number}:${i}:`, verseError);
        }
      }
    }
    
    return {
      success: true,
      message: 'Ramayana structure has been created in the database. Note: This contains placeholder verses that should be replaced with actual content.'
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
    
    // The Torah consists of the five books of Moses
    const torahBooks = [
      { number: 1, name: "בְּרֵאשִׁית", english_name: "Genesis", verses_count: 50 },
      { number: 2, name: "שְׁמוֹת", english_name: "Exodus", verses_count: 40 },
      { number: 3, name: "וַיִּקְרָא", english_name: "Leviticus", verses_count: 27 },
      { number: 4, name: "בְּמִדְבַּר", english_name: "Numbers", verses_count: 36 },
      { number: 5, name: "דְּבָרִים", english_name: "Deuteronomy", verses_count: 34 }
    ];
    
    // Use Sefaria API for Torah content
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
      
      // For each chapter in the book
      for (let chapter = 1; chapter <= book.verses_count; chapter++) {
        try {
          const torahResponse = await fetch(`https://www.sefaria.org/api/texts/${book.english_name}.${chapter}`);
          
          if (!torahResponse.ok) {
            console.error(`Failed to fetch Torah ${book.english_name} chapter ${chapter}: ${torahResponse.status}`);
            continue;
          }
          
          const chapterData = await torahResponse.json();
          const verses = chapterData.text;
          const hebrewVerses = chapterData.he;
          
          // Add each verse to database
          for (let i = 0; i < verses.length; i++) {
            const { error: verseError } = await supabase
              .from('book_verses')
              .insert({
                book_code: 'torah',
                chapter_number: book.number,
                verse_number: (i + 1),
                original_text: hebrewVerses[i] || `[Hebrew text unavailable for ${book.english_name} ${chapter}:${i+1}]`,
                english_translation: verses[i] || `[Translation unavailable for ${book.english_name} ${chapter}:${i+1}]`
              });
            
            if (verseError) {
              console.error(`Error adding Torah verse ${book.english_name} ${chapter}:${i+1}:`, verseError);
            }
          }
        } catch (chapterError) {
          console.error(`Error processing Torah ${book.english_name} chapter ${chapter}:`, chapterError);
        }
      }
    }
    
    return {
      success: true,
      message: 'Torah data has been downloaded and stored in the database'
    };
  } catch (error) {
    console.error('Error downloading Torah data:', error);
    return {
      success: false,
      message: `Error downloading Torah data: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};
