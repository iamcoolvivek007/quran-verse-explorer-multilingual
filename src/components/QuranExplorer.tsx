
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
import { Book, BookOpen, Download } from 'lucide-react';

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
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <div className="bg-gradient-to-r from-[#1e3a8a]/90 to-[#1e3a8a] p-6 rounded-lg shadow-lg mb-8 text-center border-b-4 border-[#f5b014]">
        <div className="flex items-center justify-center mb-2">
          <BookOpen className="h-8 w-8 text-[#f5b014] mr-2" />
          <h2 className="text-3xl font-arabic font-bold text-white">
            {currentSurahInfo ? `سورة ${currentSurahInfo.name}` : 'القرآن الكريم'}
          </h2>
        </div>
        
        {currentSurahInfo && (
          <div className="text-white/90">
            <p className="text-xl mb-1">
              Surah {currentSurahInfo.englishName}
            </p>
            <p className="text-sm">
              Number of Verses: {currentSurahInfo.versesCount}
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8 bg-white/80 p-4 rounded-lg shadow-md border border-gray-200">
        <SurahSelector 
          surahs={surahsInfo} 
          selectedSurah={selectedSurah} 
          onSurahChange={handleSurahChange} 
        />
        
        <div className="flex gap-2">
          <Button
            onClick={handlePopulateData}
            disabled={isPopulating}
            className="bg-[#1e3a8a] hover:bg-[#1e3a8a]/90 text-white flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            {isPopulating ? "Downloading..." : "Download All Data"}
          </Button>
          
          <DownloadButton 
            verses={displayVerses} 
            surahName={currentSurahInfo ? currentSurahInfo.englishName : `Surah_${selectedSurah}`} 
          />
        </div>
      </div>

      <div className="bg-[#f8fafc]/80 p-4 rounded-lg shadow-md mb-8 border border-gray-200">
        <LanguageSelector 
          selectedLanguages={selectedLanguages} 
          onLanguageChange={handleLanguageChange} 
        />
      </div>

      <div className="verses-container bg-[url('https://i.imgur.com/ZXRPRpC.png')] bg-fixed bg-opacity-10 rounded-lg p-6">
        {isQuranLoading ? (
          <LoadingSpinner />
        ) : displayVerses.length > 0 ? (
          <div className="space-y-6">
            {displayVerses.map((verse) => (
              <VerseDisplay 
                key={`${verse.surah}-${verse.ayah}`} 
                verse={verse} 
                selectedLanguages={selectedLanguages} 
              />
            ))}
          </div>
        ) : (
          <Card className="bg-white/90 border-[#1e3a8a]">
            <CardContent className="text-center py-12">
              <Book className="h-16 w-16 mx-auto text-[#1e3a8a] mb-4" />
              <p className="text-gray-600">No verses found for the selected Surah.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default QuranExplorer;
