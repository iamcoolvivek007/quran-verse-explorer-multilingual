
import React, { useState, useRef, useEffect } from 'react';
import { DisplayVerse } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { VolumeIcon, VolumeXIcon, BookmarkIcon, ZoomInIcon, ArrowLeftIcon, ArrowRightIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';

interface VerseDisplayProps {
  verse: DisplayVerse;
  selectedLanguages: string[];
}

const VerseDisplay: React.FC<VerseDisplayProps> = ({ verse, selectedLanguages }) => {
  const { toast } = useToast();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isEnlarged, setIsEnlarged] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [animationDirection, setAnimationDirection] = useState<'left' | 'right'>('right');
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentPageView, setCurrentPageView] = useState<'main' | 'translation'>('main');

  const handlePlayAudio = () => {
    if (!verse.audioUrl) return;
    
    if (!audioRef.current) {
      audioRef.current = new Audio(verse.audioUrl);
      
      audioRef.current.onended = () => {
        setIsPlaying(false);
      };
      
      audioRef.current.onerror = () => {
        setIsPlaying(false);
        console.error("Error playing audio");
      };
    }

    if (!isPlaying) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => {
          console.error("Error playing audio:", err);
          setIsPlaying(false);
        });
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    // Clean up audio when component unmounts
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const toggleEnlarge = () => {
    setIsEnlarged(!isEnlarged);
  };

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast({
      title: isBookmarked ? "Bookmark removed" : "Bookmark added",
      description: isBookmarked 
        ? `Removed Surah ${verse.surah}:${verse.ayah} from your bookmarks` 
        : `Added Surah ${verse.surah}:${verse.ayah} to your bookmarks`,
      variant: isBookmarked ? "destructive" : "default",
    });
  };

  const handlePageTurn = (direction: 'left' | 'right') => {
    if (isAnimating) return;
    
    setAnimationDirection(direction);
    setIsAnimating(true);
    
    // Toggle between main and translation view
    setTimeout(() => {
      setCurrentPageView(currentPageView === 'main' ? 'translation' : 'main');
      setIsAnimating(false);
    }, 500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`${isEnlarged ? "fixed inset-4 z-50" : "relative"} book-page`}
    >
      <Card 
        className={`
          quran-page relative overflow-hidden
          ${isEnlarged ? "w-full h-full overflow-y-auto" : ""}
          transition-all duration-500 ease-in-out
          transform hover:shadow-2xl
          dark:bg-[#1e293b]/90 dark:border-[#f5b014]/20
        `}
      >
        {/* Ornate corners */}
        <div className="absolute top-0 left-0 w-16 h-16 bg-islamic-corner bg-contain bg-no-repeat opacity-90"></div>
        <div className="absolute top-0 right-0 w-16 h-16 bg-islamic-corner bg-contain bg-no-repeat transform rotate-90 opacity-90"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-islamic-corner bg-contain bg-no-repeat transform -rotate-90 opacity-90"></div>
        <div className="absolute bottom-0 right-0 w-16 h-16 bg-islamic-corner bg-contain bg-no-repeat transform rotate-180 opacity-90"></div>
        
        <div className="absolute right-0 opacity-10 h-full">
          <div className="h-full w-32 bg-quran-ornament bg-contain bg-no-repeat bg-right"></div>
        </div>
        
        <CardHeader className="pb-2 border-b border-quran-primary/20 dark:border-quran-gold/20">
          <CardTitle className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="bg-quran-primary text-quran-gold h-10 w-10 rounded-full flex items-center justify-center mr-3 text-sm border-2 border-quran-gold/50 shadow-inner dark:bg-quran-gold/20">
                {verse.ayah}
              </div>
              <span className="text-quran-primary font-medium text-lg dark:text-quran-gold">
                Surah {verse.surah}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-quran-gold text-lg font-arabic mr-2 dark:text-white">
                {verse.surah}:{verse.ayah}
              </span>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleBookmark}
                      className={`text-quran-primary hover:text-quran-primary/80 p-1 dark:text-quran-gold dark:hover:text-quran-gold/80 ${isBookmarked ? 'text-quran-gold dark:text-quran-gold' : ''}`}
                    >
                      <BookmarkIcon className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isBookmarked ? 'Remove bookmark' : 'Add bookmark'}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={toggleEnlarge}
                      className="text-quran-primary hover:text-quran-primary/80 p-1 dark:text-quran-gold dark:hover:text-quran-gold/80"
                    >
                      <ZoomInIcon className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Enlarge verse</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="pt-6 relative z-10">
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={currentPageView}
              initial={{ 
                rotateY: animationDirection === 'right' ? -90 : 90,
                opacity: 0.5,
                transformOrigin: animationDirection === 'right' ? 'left' : 'right'
              }}
              animate={{ 
                rotateY: 0,
                opacity: 1
              }}
              exit={{ 
                rotateY: animationDirection === 'right' ? 90 : -90,
                opacity: 0.5
              }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="page-content-container"
            >
              {currentPageView === 'main' && selectedLanguages.includes('arabic') && (
                <div className="mb-8 pb-6 border-b border-quran-primary/10 relative dark:border-quran-gold/20">
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-3 w-24 h-5 bg-quran-ornament bg-contain bg-no-repeat bg-center opacity-80 illumination-glow"></div>
                  <p className="arabic-text text-3xl md:text-4xl leading-loose tracking-wide text-center dark:text-white" dir="rtl">
                    {verse.arabic}
                  </p>
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-2 w-24 h-5 bg-quran-ornament bg-contain bg-no-repeat bg-center opacity-80 rotate-180 illumination-glow"></div>
                </div>
              )}
              
              {currentPageView === 'main' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedLanguages.includes('english') && (
                    <div className="space-y-4 p-4 border border-quran-gold/20 rounded-lg bg-white/50 dark:bg-black/20">
                      <div>
                        <h3 className="text-quran-primary font-bold text-sm mb-1 uppercase tracking-wider flex items-center dark:text-quran-gold">
                          <div className="w-3 h-3 bg-quran-primary rounded-full mr-2 dark:bg-quran-gold"></div>
                          English Transliteration
                        </h3>
                        <p className="text-gray-800 leading-relaxed dark:text-gray-200">{verse.englishTransliteration}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-quran-primary font-bold text-sm mb-1 uppercase tracking-wider flex items-center dark:text-quran-gold">
                          <div className="w-3 h-3 bg-quran-primary rounded-full mr-2 dark:bg-quran-gold"></div>
                          English Translation
                        </h3>
                        <p className="text-gray-800 leading-relaxed dark:text-gray-200">{verse.englishTranslation}</p>
                      </div>
                    </div>
                  )}
                  
                  {(selectedLanguages.includes('malayalam') || selectedLanguages.includes('tamil')) && (
                    <div className="space-y-4 p-4 border border-quran-gold/20 rounded-lg bg-white/50 dark:bg-black/20">
                      {selectedLanguages.includes('malayalam') && (
                        <div>
                          <h3 className="text-quran-primary font-bold text-sm mb-1 uppercase tracking-wider flex items-center dark:text-quran-gold">
                            <div className="w-3 h-3 bg-quran-primary rounded-full mr-2 dark:bg-quran-gold"></div>
                            Malayalam Translation
                          </h3>
                          <p className="text-gray-800 leading-relaxed dark:text-gray-200">{verse.malayalamTranslation}</p>
                        </div>
                      )}
                      
                      {selectedLanguages.includes('tamil') && (
                        <div>
                          <h3 className="text-quran-primary font-bold text-sm mb-1 uppercase tracking-wider flex items-center dark:text-quran-gold">
                            <div className="w-3 h-3 bg-quran-primary rounded-full mr-2 dark:bg-quran-gold"></div>
                            Tamil Translation
                          </h3>
                          <p className="text-gray-800 leading-relaxed dark:text-gray-200">{verse.tamilTranslation}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
              
              {currentPageView === 'translation' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedLanguages.includes('malayalam_transliteration') && verse.malayalamTransliteration && (
                    <div className="p-4 border border-quran-gold/20 rounded-lg bg-white/50 dark:bg-black/20">
                      <h3 className="text-quran-primary font-bold text-sm mb-1 uppercase tracking-wider flex items-center dark:text-quran-gold">
                        <div className="w-3 h-3 bg-quran-primary rounded-full mr-2 dark:bg-quran-gold"></div>
                        Malayalam Transliteration
                      </h3>
                      <p className="text-gray-800 leading-relaxed dark:text-gray-200">{verse.malayalamTransliteration}</p>
                    </div>
                  )}
                  
                  {selectedLanguages.includes('tamil_transliteration') && verse.tamilTransliteration && (
                    <div className="p-4 border border-quran-gold/20 rounded-lg bg-white/50 dark:bg-black/20">
                      <h3 className="text-quran-primary font-bold text-sm mb-1 uppercase tracking-wider flex items-center dark:text-quran-gold">
                        <div className="w-3 h-3 bg-quran-primary rounded-full mr-2 dark:bg-quran-gold"></div>
                        Tamil Transliteration
                      </h3>
                      <p className="text-gray-800 leading-relaxed dark:text-gray-200">{verse.tamilTransliteration}</p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
          
          {/* Page turning controls */}
          <div className="flex justify-between mt-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handlePageTurn('left')}
              className="text-quran-primary hover:bg-quran-primary/10 dark:text-quran-gold dark:hover:bg-quran-gold/10"
              disabled={isAnimating}
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Previous
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handlePageTurn('right')}
              className="text-quran-primary hover:bg-quran-primary/10 dark:text-quran-gold dark:hover:bg-quran-gold/10"
              disabled={isAnimating}
            >
              Next
              <ArrowRightIcon className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
        
        {verse.audioUrl && (
          <CardFooter className="border-t border-quran-primary/20 pt-4 flex justify-center dark:border-quran-gold/20">
            <Button 
              variant="outline" 
              size="sm" 
              className={`flex items-center gap-2 text-white border-quran-gold bg-quran-primary hover:bg-quran-primary/90 dark:bg-quran-gold/30 dark:hover:bg-quran-gold/40 dark:text-white ${isPlaying ? 'pulse-animation' : ''}`}
              onClick={handlePlayAudio}
            >
              {isPlaying ? <VolumeIcon className="h-4 w-4 text-quran-gold" /> : <VolumeXIcon className="h-4 w-4 text-quran-gold" />}
              {isPlaying ? "Pause Recitation" : "Play Recitation"}
            </Button>
          </CardFooter>
        )}
      </Card>
      
      {isEnlarged && (
        <div className="fixed inset-0 bg-black/70 z-40" onClick={toggleEnlarge}></div>
      )}
    </motion.div>
  );
};

export default VerseDisplay;
