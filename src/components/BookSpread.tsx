
import React from 'react';
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
}

export const BookSpread: React.FC<BookSpreadProps> = ({
  currentVerse,
  surahInfo,
  isPageTurning,
  selectedLanguages,
  isBookmarked,
  onToggleBookmark,
  currentPage,
  totalPages
}) => {
  if (!currentVerse || !surahInfo) {
    return (
      <div className="book-spread">
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
