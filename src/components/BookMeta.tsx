
import React from 'react';
import { SurahInfo } from '@/types';

interface BookMetaProps {
  surahInfo: SurahInfo;
  currentPage: number;
  totalPages: number;
}

export const BookMeta: React.FC<BookMetaProps> = ({ 
  surahInfo,
  currentPage,
  totalPages
}) => {
  return (
    <div className="book-title">
      <h2 className="text-3xl font-arabic mb-1">
        سورة {surahInfo.name}
      </h2>
      <p className="text-lg">
        Surah {surahInfo.englishName}
      </p>
      <div className="flex justify-center text-sm mt-2 text-book-title/70">
        <span>{surahInfo.versesCount} verses</span>
        <span className="mx-2">•</span>
        <span>Page {currentPage} of {totalPages}</span>
      </div>
    </div>
  );
};
