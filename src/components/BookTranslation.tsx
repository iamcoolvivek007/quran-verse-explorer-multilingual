
import React from 'react';
import { DisplayVerse } from '@/types';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

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
  // Helper function to determine if a transliteration is loading
  const isTransliterationLoading = (text: string | undefined): boolean => {
    return !text || text.includes('[Transliteration not available]');
  };

  // Helper function to show loading message with proper styling
  const renderLoadingMessage = () => (
    <div className="flex items-center gap-2 text-amber-600">
      <AlertCircle className="h-4 w-4" />
      <p>Transliteration loading... Please wait a moment.</p>
    </div>
  );

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
            
            {selectedLanguages.includes('malayalam_transliteration') && (
              <div className="mt-4 text-sm italic bg-book-gold/5 p-3 rounded-md">
                {isTransliterationLoading(verse.malayalamTransliteration) ? 
                  renderLoadingMessage() : 
                  <p>{verse.malayalamTransliteration}</p>
                }
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
            
            {selectedLanguages.includes('tamil_transliteration') && (
              <div className="mt-4 text-sm italic bg-book-gold/5 p-3 rounded-md">
                {isTransliterationLoading(verse.tamilTransliteration) ? 
                  renderLoadingMessage() : 
                  <p>{verse.tamilTransliteration}</p>
                }
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};
