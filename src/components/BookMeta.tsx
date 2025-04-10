
import React from 'react';
import { SurahInfo } from '@/types';

interface BookMetaProps {
  bookCode?: string;
  surahInfo: SurahInfo;
  currentPage: number;
  totalPages: number;
}

export const BookMeta: React.FC<BookMetaProps> = ({ 
  bookCode = 'quran',
  surahInfo,
  currentPage,
  totalPages
}) => {
  // Get appropriate title based on book code
  const getBookTitle = () => {
    switch(bookCode) {
      case 'quran':
        return (
          <>
            <h2 className="text-3xl font-arabic mb-1">
              سورة {surahInfo.name}
            </h2>
            <p className="text-lg">
              Surah {surahInfo.englishName}
            </p>
          </>
        );
      case 'bible':
        return (
          <h2 className="text-3xl mb-1">
            {surahInfo.englishName}
          </h2>
        );
      case 'gita':
        return (
          <>
            <h2 className="text-3xl mb-1">
              {surahInfo.englishName}
            </h2>
            <p className="text-lg">
              {surahInfo.name}
            </p>
          </>
        );
      case 'torah':
        return (
          <h2 className="text-3xl mb-1">
            {surahInfo.englishName}
          </h2>
        );
      default:
        return (
          <h2 className="text-3xl mb-1">
            {surahInfo.englishName}
          </h2>
        );
    }
  };

  return (
    <div className="book-title">
      {getBookTitle()}
      <div className="flex justify-center text-sm mt-2 text-book-title/70">
        <span>{surahInfo.versesCount} verses</span>
        <span className="mx-2">•</span>
        <span>Page {currentPage} of {totalPages}</span>
      </div>
    </div>
  );
};
