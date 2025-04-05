
import React from 'react';
import { DisplayVerse } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface VerseDisplayProps {
  verse: DisplayVerse;
  selectedLanguages: string[];
}

const VerseDisplay: React.FC<VerseDisplayProps> = ({ verse, selectedLanguages }) => {
  return (
    <Card className="mb-6 hover:shadow-md transition-shadow">
      <CardHeader className="pb-2 border-b">
        <CardTitle className="flex justify-between items-center">
          <span className="text-quran-primary">
            Surah {verse.surah}, Ayah {verse.ayah}
          </span>
          <span className="text-quran-secondary text-sm">
            {verse.surah}:{verse.ayah}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {selectedLanguages.includes('arabic') && (
          <div className="mb-4">
            <h3 className="text-quran-primary font-bold mb-1">Arabic:</h3>
            <p className="arabic-text" dir="rtl">{verse.arabic}</p>
          </div>
        )}
        
        {selectedLanguages.includes('english') && (
          <div className="mb-4">
            <h3 className="text-quran-primary font-bold mb-1">English Transliteration:</h3>
            <p className="text-gray-800">{verse.englishTransliteration}</p>
            
            <h3 className="text-quran-primary font-bold mt-3 mb-1">English Translation:</h3>
            <p className="text-gray-800">{verse.englishTranslation}</p>
          </div>
        )}
        
        {selectedLanguages.includes('malayalam') && (
          <div className="mb-4">
            <h3 className="text-quran-primary font-bold mb-1">Malayalam Translation:</h3>
            <p className="text-gray-800">{verse.malayalamTranslation}</p>
          </div>
        )}
        
        {selectedLanguages.includes('tamil') && (
          <div className="mb-4">
            <h3 className="text-quran-primary font-bold mb-1">Tamil Translation:</h3>
            <p className="text-gray-800">{verse.tamilTranslation}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VerseDisplay;
