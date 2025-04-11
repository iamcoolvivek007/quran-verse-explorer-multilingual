
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { fetchBookChapters, fetchBookVerses, convertToDisplayVerses } from '@/services/HolyBooksAPI';
import { BookChapter, DisplayVerse, SurahInfo } from '@/types';
import { BookSpread } from './BookSpread';
import LanguageSelector from './LanguageSelector';
import DownloadButton from './DownloadButton';
import LoadingSpinner from './LoadingSpinner';
import { useToast } from '@/hooks/use-toast';

const BibleExplorer: React.FC = () => {
  const { toast } = useToast();
  const [currentChapter, setCurrentChapter] = useState<number>(1);
  const [currentVerse, setCurrentVerse] = useState<DisplayVerse | null>(null);
  const [currentVerseIndex, setCurrentVerseIndex] = useState<number>(0);
  const [isPageTurning, setIsPageTurning] = useState<boolean>(false);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(['english']);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);

  // Fetch Bible chapters
  const {
    data: chapters,
    isLoading: chaptersLoading,
    error: chaptersError
  } = useQuery({
    queryKey: ['bibleChapters'],
    queryFn: () => fetchBookChapters('bible')
  });

  // Fetch verses for the current chapter
  const {
    data: verses,
    isLoading: versesLoading,
    error: versesError
  } = useQuery({
    queryKey: ['bibleVerses', currentChapter],
    queryFn: async () => {
      const bookVerses = await fetchBookVerses('bible', currentChapter);
      return await convertToDisplayVerses(bookVerses);
    }
  });

  // Current chapter information
  const chapterInfo: SurahInfo | null = React.useMemo(() => {
    if (!chapters) return null;
    
    const chapter = chapters.find(c => c.number === currentChapter);
    if (!chapter) return null;
    
    return {
      number: chapter.number,
      name: chapter.name || `Chapter ${chapter.number}`,
      englishName: chapter.englishName || `Chapter ${chapter.number}`,
      versesCount: chapter.versesCount || 0
    };
  }, [chapters, currentChapter]);

  // Set the current verse whenever verses change or the verse index changes
  useEffect(() => {
    if (verses && verses.length > 0) {
      setCurrentVerse(verses[currentVerseIndex]);
    }
  }, [verses, currentVerseIndex]);

  // Handle page flipping
  const handlePageFlip = (direction: number) => {
    if (!verses || verses.length === 0 || isPageTurning) return;
    
    setIsPageTurning(true);
    
    // Calculate the new verse index
    const newIndex = currentVerseIndex + direction;
    
    // Check if we need to change chapters
    if (newIndex < 0) {
      // Go to previous chapter
      if (currentChapter > 1) {
        setCurrentChapter(currentChapter - 1);
        // Will select the last verse of the previous chapter once it loads
        setCurrentVerseIndex(0);
        // We'll adjust this after the verses load
      } else {
        // Already at the first chapter
        toast({
          title: "Beginning of Bible",
          description: "You are at the first verse of Genesis.",
          duration: 3000,
        });
      }
    } else if (newIndex >= verses.length) {
      // Go to next chapter
      if (chapters && currentChapter < chapters.length) {
        setCurrentChapter(currentChapter + 1);
        setCurrentVerseIndex(0); // Start from the first verse of the next chapter
      } else {
        // Already at the last chapter
        toast({
          title: "End of Bible",
          description: "You have reached the end of the Bible.",
          duration: 3000,
        });
      }
    } else {
      // Stay in the same chapter, just change verse
      setCurrentVerseIndex(newIndex);
    }
    
    // Remove the page turning animation after a delay
    setTimeout(() => {
      setIsPageTurning(false);
    }, 500);
  };

  // When changing to a new chapter, we need to update the verse index properly
  useEffect(() => {
    if (verses && verses.length > 0 && currentVerseIndex > verses.length - 1) {
      // If we loaded a chapter and the current verse index is out of bounds,
      // set it to the last verse
      setCurrentVerseIndex(verses.length - 1);
    }
  }, [verses, currentVerseIndex]);

  // Handle language selection
  const handleLanguageChange = (languages: string[]) => {
    setSelectedLanguages(languages);
  };

  // Toggle bookmark
  const handleToggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    
    toast({
      title: isBookmarked ? "Bookmark Removed" : "Bookmark Added",
      description: isBookmarked 
        ? "This verse has been removed from your bookmarks." 
        : "This verse has been added to your bookmarks.",
      duration: 3000,
    });
  };

  // Handle chapter selection
  const handleChapterSelect = (chapterNumber: number) => {
    setCurrentChapter(chapterNumber);
    setCurrentVerseIndex(0);
  };

  if (chaptersLoading || versesLoading) {
    return <LoadingSpinner />;
  }

  if (chaptersError || versesError) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">Error loading Bible data.</p>
        <p className="text-sm text-gray-600 mt-2">
          Please try again or check your connection.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Main content - BookSpread */}
        <div className="flex-1">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div>
              <LanguageSelector 
                availableLanguages={['english', 'malayalam', 'tamil']}
                selectedLanguages={selectedLanguages}
                onLanguageChange={handleLanguageChange}
              />
            </div>
            
            {verses && verses.length > 0 && chapterInfo && (
              <DownloadButton 
                verses={verses} 
                surahName={chapterInfo.englishName}
                bookCode="bible" 
              />
            )}
          </div>
          
          {/* Book display */}
          {currentVerse && chapterInfo && (
            <BookSpread
              bookCode="bible"
              currentVerse={currentVerse}
              surahInfo={chapterInfo}
              isPageTurning={isPageTurning}
              selectedLanguages={selectedLanguages}
              isBookmarked={isBookmarked}
              onToggleBookmark={handleToggleBookmark}
              currentPage={currentVerseIndex + 1}
              totalPages={verses?.length || 0}
              onPageFlip={handlePageFlip}
            />
          )}
        </div>
        
        {/* Sidebar - Bible chapters */}
        <div className="w-full md:w-72 lg:w-80 order-first md:order-last">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <h2 className="text-xl font-semibold mb-2 text-book-title">Books of the Bible</h2>
            <p className="text-sm text-gray-600 mb-4">
              The Holy Bible consists of the Old and New Testaments
            </p>
            
            <div className="max-h-[60vh] overflow-y-auto thin-scrollbar pr-2">
              {chapters && chapters.map((chapter) => (
                <button
                  key={chapter.number}
                  onClick={() => handleChapterSelect(chapter.number)}
                  className={`w-full text-left p-2 mb-1 rounded-md transition-colors ${
                    currentChapter === chapter.number
                      ? 'bg-blue-700 text-white'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center">
                    <span className="font-medium">{chapter.englishName}</span>
                    <span className="ml-auto text-xs opacity-80">
                      {chapter.versesCount} verses
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BibleExplorer;
