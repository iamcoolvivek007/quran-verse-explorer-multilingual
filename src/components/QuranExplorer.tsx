import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  fetchSurahInfo, 
  fetchSurahVerses, 
  getVersesForSurah, 
  populateQuranData,
  fetchAudioUrls
} from '@/services/QuranAPI';
import { DisplayVerse, SurahInfo } from '@/types';
import SurahSelector from './SurahSelector';
import LanguageSelector from './LanguageSelector';
import VerseDisplay from './VerseDisplay';
import LoadingSpinner from './LoadingSpinner';
import DownloadButton from './DownloadButton';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

const QuranExplorer: React.FC = () => {
  const { toast } = useToast();
  const [selectedSurah, setSelectedSurah] = useState<number>(1);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(['arabic', 'english']);
  const [displayVerses, setDisplayVerses] = useState<DisplayVerse[]>([]);
  const [currentSurahInfo, setCurrentSurahInfo] = useState<SurahInfo | null>(null);
  const [isPopulating, setIsPopulating] = useState<boolean>(false);

  const { 
    data: surahsInfo,
    isLoading: isSurahsLoading,
    error: surahsError,
    refetch: refetchSurahInfo
  } = useQuery({
    queryKey: ['surahInfo'],
    queryFn: fetchSurahInfo,
  });

  const { 
    data: quranData,
    isLoading: isQuranLoading,
    error: quranError,
    refetch: refetchQuranData
  } = useQuery({
    queryKey: ['quranData', selectedSurah],
    queryFn: () => fetchSurahVerses(selectedSurah),
    enabled: selectedSurah > 0,
  });

  const {
    data: audioUrls,
    isLoading: isAudioLoading
  } = useQuery({
    queryKey: ['audioUrls', selectedSurah],
    queryFn: () => fetchAudioUrls(selectedSurah),
    enabled: selectedSurah > 0,
  });

  useEffect(() => {
    if (quranData && selectedSurah) {
      const verses = getVersesForSurah(quranData, selectedSurah);
      
      if (audioUrls) {
        verses.forEach(verse => {
          if (audioUrls[verse.ayah]) {
            verse.audioUrl = audioUrls[verse.ayah];
          }
        });
      }
      
      setDisplayVerses(verses);
    }
  }, [quranData, selectedSurah, audioUrls]);

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

  const handlePopulateData = async () => {
    setIsPopulating(true);
    toast({
      title: "Data Population Started",
      description: "Downloading and storing Quran data. This may take a few minutes.",
      duration: 5000,
    });

    try {
      const success = await populateQuranData();
      
      if (success) {
        toast({
          title: "Success",
          description: "Quran data has been successfully populated in the database.",
          duration: 5000,
        });
        
        refetchSurahInfo();
        refetchQuranData();
      } else {
        toast({
          title: "Error",
          description: "Failed to populate Quran data. Please try again later.",
          variant: "destructive",
          duration: 5000,
        });
      }
    } catch (error) {
      console.error("Error populating data:", error);
      toast({
        title: "Error",
        description: "Failed to populate Quran data. Please try again later.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsPopulating(false);
    }
  };

  if (isSurahsLoading) {
    return <LoadingSpinner />;
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
        
        <div className="flex gap-2">
          <Button
            onClick={handlePopulateData}
            disabled={isPopulating}
            className="bg-quran-secondary hover:bg-quran-secondary/90"
          >
            {isPopulating ? "Downloading..." : "Download & Store All Data"}
          </Button>
          
          <DownloadButton 
            verses={displayVerses} 
            surahName={currentSurahInfo ? currentSurahInfo.englishName : `Surah_${selectedSurah}`} 
          />
        </div>
      </div>

      <LanguageSelector 
        selectedLanguages={selectedLanguages} 
        onLanguageChange={handleLanguageChange} 
      />

      <div className="verses-container">
        {isQuranLoading ? (
          <LoadingSpinner />
        ) : displayVerses.length > 0 ? (
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
