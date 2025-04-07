
import React, { useEffect, useRef } from 'react';
import { DisplayVerse, SurahInfo } from '@/types';
import { BookArabic } from './BookArabic';
import { BookTranslation } from './BookTranslation';
import { BookMeta } from './BookMeta';
import { motion } from 'framer-motion';
import { BookmarkIcon } from 'lucide-react';

interface BookSpreadProps {
  currentVerse: DisplayVerse | null;
  surahInfo: SurahInfo | null;
  isPageTurning: boolean;
  selectedLanguages: string[];
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  currentPage: number;
  totalPages: number;
  onPageFlip?: (direction: number) => void;
}

export const BookSpread: React.FC<BookSpreadProps> = ({
  currentVerse,
  surahInfo,
  isPageTurning,
  selectedLanguages,
  isBookmarked,
  onToggleBookmark,
  currentPage,
  totalPages,
  onPageFlip
}) => {
  const bookRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (touchStartX.current === null || !onPageFlip) return;
      
      const touchEndX = e.changedTouches[0].clientX;
      const diffX = touchEndX - touchStartX.current;
      
      // Determine if the user swiped far enough to trigger a page turn
      if (Math.abs(diffX) > 50) {
        // Negative diffX means swipe left (next page)
        // Positive diffX means swipe right (previous page)
        onPageFlip(diffX < 0 ? 1 : -1);
      }
      
      touchStartX.current = null;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!onPageFlip) return;
      
      if (e.key === 'ArrowRight') {
        onPageFlip(1);
      } else if (e.key === 'ArrowLeft') {
        onPageFlip(-1);
      }
    };

    const bookElement = bookRef.current;
    
    if (bookElement) {
      bookElement.addEventListener('touchstart', handleTouchStart);
      bookElement.addEventListener('touchend', handleTouchEnd);
      window.addEventListener('keydown', handleKeyDown);
    }
    
    return () => {
      if (bookElement) {
        bookElement.removeEventListener('touchstart', handleTouchStart);
        bookElement.removeEventListener('touchend', handleTouchEnd);
      }
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onPageFlip]);

  if (!currentVerse || !surahInfo) {
    return (
      <div className="book-spread" ref={bookRef}>
        <div className="book-page-left thin-scrollbar">
          <div className="book-title">
            <h2 className="text-3xl font-arabic">القرآن الكريم</h2>
            <p className="text-lg">The Noble Quran</p>
          </div>
          <p className="text-center italic">Loading...</p>
        </div>
        <div className="book-page-right thin-scrollbar">
          <p className="text-center italic mt-32">Loading...</p>
        </div>
      </div>
    );
  }
  
  return (
    <motion.div 
      className="book-spread"
      ref={bookRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Left page - Arabic */}
      <div className="book-page-left thin-scrollbar">
        <div className="relative h-full">
          {/* Ornamental corners */}
          <div className="ornament ornament-tl"></div>
          <div className="ornament ornament-tr"></div>
          <div className="ornament ornament-bl"></div>
          <div className="ornament ornament-br"></div>
          
          {/* Title section */}
          <BookMeta 
            surahInfo={surahInfo} 
            currentPage={currentPage}
            totalPages={totalPages}
          />
          
          {/* Arabic content */}
          <BookArabic 
            verse={currentVerse} 
            isAnimating={isPageTurning}
          />
          
          {/* Bookmark */}
          {isBookmarked && (
            <div 
              className={`bookmark ${isPageTurning ? 'animate-pulse' : ''}`}
              onClick={onToggleBookmark}
            >
              <div className="flex justify-center pt-1">
                <BookmarkIcon className="h-4 w-4 text-book-leather" />
              </div>
            </div>
          )}
          
          {/* Page number */}
          <div className="page-number">
            صفحة {currentPage} - Surah {surahInfo.englishName}
          </div>

          {/* Navigation hints */}
          <div className="absolute bottom-20 left-0 right-0 flex justify-between text-book-gold/50 text-xs px-8 pointer-events-none">
            <span>← Swipe right for previous</span>
            <span>Swipe left for next →</span>
          </div>
        </div>
      </div>
      
      {/* Right page - Translation */}
      <div className="book-page-right thin-scrollbar">
        <div className="relative h-full">
          {/* Ornamental corners */}
          <div className="ornament ornament-tl"></div>
          <div className="ornament ornament-tr"></div>
          <div className="ornament ornament-bl"></div>
          <div className="ornament ornament-br"></div>
          
          {/* Translation content */}
          <BookTranslation 
            verse={currentVerse} 
            selectedLanguages={selectedLanguages}
            isAnimating={isPageTurning}
          />
          
          {/* Bookmark button if not already bookmarked */}
          {!isBookmarked && (
            <button 
              onClick={onToggleBookmark}
              className="absolute top-4 right-4 text-book-gold hover:text-book-gold/80 transition-colors"
              aria-label="Add bookmark"
            >
              <BookmarkIcon className="h-6 w-6" />
            </button>
          )}
          
          {/* Page corner peek effect */}
          <div className="page-corner"></div>
          
          {/* Page number */}
          <div className="page-number">
            Page {currentPage} of {totalPages}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
