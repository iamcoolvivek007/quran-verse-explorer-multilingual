
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchSurahInfo, fetchSurahVerses, getVersesForSurah, fetchAudioUrls } from '@/services/QuranAPI';
import { DisplayVerse, SurahInfo } from '@/types';
import { BookSpread } from '@/components/BookSpread';
import { BookControls } from '@/components/BookControls';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeftCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LoadingSpinner from '@/components/LoadingSpinner';

const BookView: React.FC = () => {
  const { surahId = '1', ayahId = '1' } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [currentSurah, setCurrentSurah] = useState<number>(parseInt(surahId));
  const [currentPage, setCurrentPage] = useState<number>(parseInt(ayahId));
  const [isPageTurning, setIsPageTurning] = useState<boolean>(false);
  const [isAutoPlay, setIsAutoPlay] = useState<boolean>(false);
  const [autoPlaySpeed, setAutoPlaySpeed] = useState<number>(5); // seconds
  const [displayVerses, setDisplayVerses] = useState<DisplayVerse[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(
    ['arabic', 'english', 'malayalam', 'tamil']
  );
  const [currentSurahInfo, setCurrentSurahInfo] = useState<SurahInfo | null>(null);
  const [bookmarks, setBookmarks] = useState<string[]>(
    JSON.parse(localStorage.getItem('quran-bookmarks') || '[]')
  );
  
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  
  const { 
    data: surahsInfo,
    isLoading: isSurahsLoading
  } = useQuery({
    queryKey: ['surahInfo'],
    queryFn: fetchSurahInfo,
  });

  const { 
    data: quranData,
    isLoading: isQuranLoading,
  } = useQuery({
    queryKey: ['quranData', currentSurah],
    queryFn: () => fetchSurahVerses(currentSurah),
    enabled: currentSurah > 0,
  });

  const {
    data: audioUrls,
    isLoading: isAudioLoading
  } = useQuery({
    queryKey: ['audioUrls', currentSurah],
    queryFn: () => fetchAudioUrls(currentSurah),
    enabled: currentSurah > 0,
  });
  
  useEffect(() => {
    if (quranData && currentSurah) {
      const verses = getVersesForSurah(quranData, currentSurah);
      
      if (audioUrls) {
        verses.forEach(verse => {
          if (audioUrls[verse.ayah]) {
            verse.audioUrl = audioUrls[verse.ayah];
          }
        });
      }
      
      setDisplayVerses(verses);
    }
  }, [quranData, currentSurah, audioUrls]);

  useEffect(() => {
    if (surahsInfo && currentSurah) {
      const surah = surahsInfo.find((s: SurahInfo) => s.number === currentSurah);
      if (surah) {
        setCurrentSurahInfo(surah);
      }
    }
  }, [surahsInfo, currentSurah]);
  
  useEffect(() => {
    // Update URL without reloading
    navigate(`/book/${currentSurah}/${currentPage}`, { replace: true });
  }, [currentSurah, currentPage, navigate]);
  
  useEffect(() => {
    // Handle auto-play
    if (isAutoPlay) {
      if (autoPlayRef.current) {
        clearTimeout(autoPlayRef.current);
      }
      
      autoPlayRef.current = setTimeout(() => {
        turnPage(1);
      }, autoPlaySpeed * 1000);
    } else if (autoPlayRef.current) {
      clearTimeout(autoPlayRef.current);
    }
    
    return () => {
      if (autoPlayRef.current) {
        clearTimeout(autoPlayRef.current);
      }
    };
  }, [isAutoPlay, currentPage, autoPlaySpeed]);
  
  const turnPage = (direction: number) => {
    if (isPageTurning) return;
    
    setIsPageTurning(true);
    
    setTimeout(() => {
      // Get max page for current surah
      const maxPage = displayVerses.length;
      
      if (direction > 0 && currentPage >= maxPage) {
        // Move to next surah
        if (currentSurah < 114) {
          setCurrentSurah(currentSurah + 1);
          setCurrentPage(1);
        }
      } else if (direction < 0 && currentPage <= 1) {
        // Move to previous surah
        if (currentSurah > 1) {
          setCurrentSurah(currentSurah - 1);
          // Set to last page of previous surah (this is simplified)
          setCurrentPage(99); // Will be updated when displayVerses changes
        }
      } else {
        // Move within current surah
        setCurrentPage(prevPage => Math.min(Math.max(prevPage + direction, 1), maxPage));
      }
      
      setIsPageTurning(false);
    }, 500); // Animation duration
  };
  
  const toggleAutoPlay = () => {
    setIsAutoPlay(!isAutoPlay);
    
    toast({
      title: !isAutoPlay ? "Auto-play enabled" : "Auto-play disabled",
      description: !isAutoPlay ? 
        `Pages will turn automatically every ${autoPlaySpeed} seconds` : 
        "Manual page turning activated",
    });
  };
  
  const changeAutoPlaySpeed = (speed: number) => {
    setAutoPlaySpeed(speed);
    
    if (isAutoPlay) {
      toast({
        title: "Auto-play speed changed",
        description: `Pages will now turn every ${speed} seconds`,
      });
    }
  };
  
  const toggleBookmark = () => {
    const bookmarkId = `${currentSurah}:${currentPage}`;
    let newBookmarks: string[];
    
    if (bookmarks.includes(bookmarkId)) {
      newBookmarks = bookmarks.filter(b => b !== bookmarkId);
      toast({
        title: "Bookmark removed",
        description: `Removed bookmark for Surah ${currentSurah}, Ayah ${currentPage}`,
      });
    } else {
      newBookmarks = [...bookmarks, bookmarkId];
      toast({
        title: "Bookmark added",
        description: `Added bookmark for Surah ${currentSurah}, Ayah ${currentPage}`,
      });
    }
    
    setBookmarks(newBookmarks);
    localStorage.setItem('quran-bookmarks', JSON.stringify(newBookmarks));
  };
  
  const goToBookmark = (bookmark: string) => {
    const [surah, ayah] = bookmark.split(':').map(Number);
    setCurrentSurah(surah);
    setCurrentPage(ayah);
  };
  
  const isLoading = isSurahsLoading || isQuranLoading || isAudioLoading || !displayVerses.length;
  
  return (
    <div className="min-h-screen pt-4 pb-20">
      <Button 
        onClick={() => navigate('/')}
        className="fixed top-4 left-4 z-50 bg-book-leather text-book-gold border-book-gold/30 hover:bg-book-leather/80"
      >
        <ArrowLeftCircle className="mr-2 h-4 w-4" />
        Back to Home
      </Button>
      
      {isLoading ? (
        <div className="flex items-center justify-center h-[80vh]">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="book-container">
          <BookSpread 
            currentVerse={displayVerses[currentPage - 1] || null}
            surahInfo={currentSurahInfo}
            isPageTurning={isPageTurning}
            selectedLanguages={selectedLanguages}
            isBookmarked={bookmarks.includes(`${currentSurah}:${currentPage}`)}
            onToggleBookmark={toggleBookmark}
            currentPage={currentPage}
            totalPages={displayVerses.length}
          />
        </div>
      )}
      
      <BookControls 
        onTurnPage={turnPage}
        isAutoPlay={isAutoPlay}
        onToggleAutoPlay={toggleAutoPlay}
        autoPlaySpeed={autoPlaySpeed}
        onChangeSpeed={changeAutoPlaySpeed}
        bookmarks={bookmarks}
        onGoToBookmark={goToBookmark}
        onChangeLanguages={(langs) => setSelectedLanguages(langs)}
        selectedLanguages={selectedLanguages}
      />
    </div>
  );
};

export default BookView;
