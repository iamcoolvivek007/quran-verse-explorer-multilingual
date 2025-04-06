
import React from 'react';
import { DisplayVerse } from '@/types';
import { motion } from 'framer-motion';

interface BookArabicProps {
  verse: DisplayVerse;
  isAnimating: boolean;
}

export const BookArabic: React.FC<BookArabicProps> = ({ verse, isAnimating }) => {
  return (
    <motion.div
      className="mt-12 mb-8"
      key={`arabic-${verse.surah}-${verse.ayah}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: isAnimating ? 0.3 : 0.5 }}
    >
      <h3 className="text-center text-xl font-semibold mb-8 text-book-title">
        سورة {verse.surah} : {verse.ayah}
      </h3>
      
      <div className="arabic-text text-right text-3xl leading-loose tracking-wide pr-6 pl-4">
        <p className="mb-8 text-center" dir="rtl">
          {verse.arabic}
        </p>
        
        {verse.audioUrl && (
          <div className="text-center mt-8 mb-4">
            <audio
              controls
              className="w-full max-w-md mx-auto"
              src={verse.audioUrl}
            >
              Your browser does not support the audio element.
            </audio>
          </div>
        )}
      </div>
    </motion.div>
  );
};
