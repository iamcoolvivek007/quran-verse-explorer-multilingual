
import React from 'react';
import { DisplayVerse } from '@/types';
import { motion } from 'framer-motion';

interface BookTranslationProps {
  verse: DisplayVerse;
  selectedLanguages: string[];
  isAnimating: boolean;
}

export const BookTranslation: React.FC<BookTranslationProps> = ({ 
  verse, 
  selectedLanguages,
  isAnimating
}) => {
  return (
    <motion.div
      className="mt-12 mb-8"
      key={`translation-${verse.surah}-${verse.ayah}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: isAnimating ? 0.3 : 0.5 }}
    >
      <h3 className="text-center text-xl font-semibold mb-8 text-book-title">
        Surah {verse.surah} : Verse {verse.ayah}
      </h3>
      
      <div className="translations space-y-8 pr-6 pl-4">
        {selectedLanguages.includes('english') && (
          <div className="mb-6">
            <h4 className="text-lg font-medium text-book-title border-b border-book-gold/30 pb-1 mb-3">
              English Translation
            </h4>
            <p className="text-lg leading-relaxed">{verse.englishTranslation}</p>
            
            {selectedLanguages.includes('english_transliteration') && (
              <div className="mt-4 text-sm italic bg-book-gold/5 p-3 rounded-md">
                <p>{verse.englishTransliteration}</p>
              </div>
            )}
          </div>
        )}
        
        {selectedLanguages.includes('malayalam') && (
          <div className="mb-6">
            <h4 className="text-lg font-medium text-book-title border-b border-book-gold/30 pb-1 mb-3">
              Malayalam Translation
            </h4>
            <p className="text-lg leading-relaxed">{verse.malayalamTranslation}</p>
            
            {selectedLanguages.includes('malayalam_transliteration') && verse.malayalamTransliteration && (
              <div className="mt-4 text-sm italic bg-book-gold/5 p-3 rounded-md">
                <p>{verse.malayalamTransliteration || "Transliteration loading..."}</p>
              </div>
            )}
          </div>
        )}
        
        {selectedLanguages.includes('tamil') && (
          <div className="mb-6">
            <h4 className="text-lg font-medium text-book-title border-b border-book-gold/30 pb-1 mb-3">
              Tamil Translation
            </h4>
            <p className="text-lg leading-relaxed">{verse.tamilTranslation}</p>
            
            {selectedLanguages.includes('tamil_transliteration') && verse.tamilTransliteration && (
              <div className="mt-4 text-sm italic bg-book-gold/5 p-3 rounded-md">
                <p>{verse.tamilTransliteration || "Transliteration loading..."}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};
