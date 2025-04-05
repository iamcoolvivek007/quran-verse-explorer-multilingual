
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchQuranData, fetchSurahInfo, getVersesForSurah } from '@/services/QuranAPI';
import { DisplayVerse, SurahInfo } from '@/types';
import SurahSelector from './SurahSelector';
import LanguageSelector from './LanguageSelector';
import VerseDisplay from './VerseDisplay';
import LoadingSpinner from './LoadingSpinner';
import DownloadButton from './DownloadButton';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const QuranExplorer: React.FC = () => {
  const { toast } = useToast();
  const [selectedSurah, setSelectedSurah] = useState<number>(1);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(['arabic', 'english']);
  const [displayVerses, setDisplayVerses] = useState<DisplayVerse[]>([]);
  const [currentSurahInfo, setCurrentSurahInfo] = useState<SurahInfo | null>(null);

  // Fetch Surah information
  const { 
    data: surahsInfo,
    isLoading: isSurahsLoading,
    error: surahsError 
  } = useQuery({
    queryKey: ['surahInfo'],
    queryFn: fetchSurahInfo,
  });

  // Fetch Quran data
  const { 
    data: quranData,
    isLoading: isQuranLoading,
    error: quranError 
  } = useQuery({
    queryKey: ['quranData'],
    queryFn: fetchQuranData,
  });

  useEffect(() => {
    if (quranData && selectedSurah) {
      const verses = getVersesForSurah(quranData, selectedSurah);
      setDisplayVerses(verses);
    }
  }, [quranData, selectedSurah]);

  useEffect(() => {
    if (surahsInfo && selectedSurah) {
      const currentSurah = surahsInfo.find((surah: SurahInfo) => surah.number === selectedSurah);
      if (currentSurah) {
        setCurrentSurahInfo(currentSurah);
      }
    }
  }, [surahsInfo, selectedSurah]);

  useEffect(() => {
    if (surahsError || quranError) {
      toast({
        title: "Error",
        description: "Failed to load Quran data. Please try again later.",
        variant: "destructive",
        duration: 5000,
      });
    }
  }, [surahsError, quranError, toast]);

  const handleSurahChange = (surahNumber: number) => {
    setSelectedSurah(surahNumber);
  };

  const handleLanguageChange = (languages: string[]) => {
    setSelectedLanguages(languages);
  };

  if (isSurahsLoading || isQuranLoading) {
    return <LoadingSpinner />;
  }

  if (surahsError || quranError) {
    return (
      <Card className="p-6 bg-red-50 text-red-800 border-red-300">
        <CardContent>
          <h2 className="text-xl font-bold mb-2">Error Loading Data</h2>
          <p>There was a problem loading the Quran data. Please try again later.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-quran-primary mb-2">
          {currentSurahInfo ? `Surah ${currentSurahInfo.englishName} (${currentSurahInfo.name})` : 'Select a Surah'}
        </h2>
        {currentSurahInfo && (
          <p className="text-gray-600">
            Verses: {currentSurahInfo.versesCount}
          </p>
        )}
      </div>

      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <SurahSelector 
          surahs={surahsInfo} 
          selectedSurah={selectedSurah} 
          onSurahChange={handleSurahChange} 
        />
        
        <DownloadButton 
          verses={displayVerses} 
          surahName={currentSurahInfo ? currentSurahInfo.englishName : `Surah_${selectedSurah}`} 
        />
      </div>

      <LanguageSelector 
        selectedLanguages={selectedLanguages} 
        onLanguageChange={handleLanguageChange} 
      />

      <div className="verses-container">
        {displayVerses.length > 0 ? (
          displayVerses.map((verse) => (
            <VerseDisplay 
              key={`${verse.surah}-${verse.ayah}`} 
              verse={verse} 
              selectedLanguages={selectedLanguages} 
            />
          ))
        ) : (
          <Card className="p-6">
            <CardContent className="text-center py-12">
              <p className="text-gray-500">No verses found for the selected Surah.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default QuranExplorer;
