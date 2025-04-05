
import React from 'react';
import { DisplayVerse } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { VolumeIcon, VolumeXIcon, BookmarkIcon, ZoomInIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface VerseDisplayProps {
  verse: DisplayVerse;
  selectedLanguages: string[];
}

const VerseDisplay: React.FC<VerseDisplayProps> = ({ verse, selectedLanguages }) => {
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isEnlarged, setIsEnlarged] = React.useState(false);

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

  React.useEffect(() => {
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`${isEnlarged ? "fixed inset-4 z-50" : "relative"}`}
    >
      <Card 
        className={`
          quran-page relative overflow-hidden
          ${isEnlarged ? "w-full h-full overflow-y-auto" : ""}
          transition-all duration-500 ease-in-out
          transform hover:shadow-2xl
        `}
      >
        {/* Ornate corners */}
        <div className="absolute top-0 left-0 w-16 h-16 bg-[url('https://i.imgur.com/TZvOgUi.png')] bg-contain bg-no-repeat opacity-90"></div>
        <div className="absolute top-0 right-0 w-16 h-16 bg-[url('https://i.imgur.com/TZvOgUi.png')] bg-contain bg-no-repeat transform rotate-90 opacity-90"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-[url('https://i.imgur.com/TZvOgUi.png')] bg-contain bg-no-repeat transform -rotate-90 opacity-90"></div>
        <div className="absolute bottom-0 right-0 w-16 h-16 bg-[url('https://i.imgur.com/TZvOgUi.png')] bg-contain bg-no-repeat transform rotate-180 opacity-90"></div>
        
        <div className="absolute right-0 opacity-10 h-full">
          <div className="h-full w-32 bg-[url('https://i.imgur.com/B3Kqkfz.png')] bg-contain bg-no-repeat bg-right"></div>
        </div>
        
        <CardHeader className="pb-2 border-b border-[#1e3a8a]/20">
          <CardTitle className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="bg-[#1e3a8a] text-[#f5b014] h-10 w-10 rounded-full flex items-center justify-center mr-3 text-sm border-2 border-[#f5b014]/50 shadow-inner">
                {verse.ayah}
              </div>
              <span className="text-[#1e3a8a] font-medium text-lg">
                Surah {verse.surah}
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-[#f5b014] text-lg font-arabic mr-2">
                {verse.surah}:{verse.ayah}
              </span>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={toggleEnlarge}
                className="text-[#1e3a8a] hover:text-[#1e3a8a]/80 p-1"
              >
                <ZoomInIcon className="h-4 w-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="pt-6 relative z-10">
          {selectedLanguages.includes('arabic') && (
            <div className="mb-8 pb-6 border-b border-[#1e3a8a]/10 relative">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-3 w-24 h-5 bg-[url('https://i.imgur.com/B3Kqkfz.png')] bg-contain bg-no-repeat bg-center opacity-80"></div>
              <p className="arabic-text text-3xl md:text-4xl leading-loose tracking-wide text-center" dir="rtl">
                {verse.arabic}
              </p>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-2 w-24 h-5 bg-[url('https://i.imgur.com/B3Kqkfz.png')] bg-contain bg-no-repeat bg-center opacity-80 rotate-180"></div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {selectedLanguages.includes('english') && (
              <div className="space-y-4 p-4 border border-[#f5b014]/20 rounded-lg bg-white/50">
                <div>
                  <h3 className="text-[#1e3a8a] font-bold text-sm mb-1 uppercase tracking-wider flex items-center">
                    <div className="w-3 h-3 bg-[#1e3a8a] rounded-full mr-2"></div>
                    English Transliteration
                  </h3>
                  <p className="text-gray-800 leading-relaxed">{verse.englishTransliteration}</p>
                </div>
                
                <div>
                  <h3 className="text-[#1e3a8a] font-bold text-sm mb-1 uppercase tracking-wider flex items-center">
                    <div className="w-3 h-3 bg-[#1e3a8a] rounded-full mr-2"></div>
                    English Translation
                  </h3>
                  <p className="text-gray-800 leading-relaxed">{verse.englishTranslation}</p>
                </div>
              </div>
            )}
            
            {(selectedLanguages.includes('malayalam') || selectedLanguages.includes('tamil')) && (
              <div className="space-y-4 p-4 border border-[#f5b014]/20 rounded-lg bg-white/50">
                {selectedLanguages.includes('malayalam') && (
                  <div>
                    <h3 className="text-[#1e3a8a] font-bold text-sm mb-1 uppercase tracking-wider flex items-center">
                      <div className="w-3 h-3 bg-[#1e3a8a] rounded-full mr-2"></div>
                      Malayalam Translation
                    </h3>
                    <p className="text-gray-800 leading-relaxed">{verse.malayalamTranslation}</p>
                  </div>
                )}
                
                {selectedLanguages.includes('tamil') && (
                  <div>
                    <h3 className="text-[#1e3a8a] font-bold text-sm mb-1 uppercase tracking-wider flex items-center">
                      <div className="w-3 h-3 bg-[#1e3a8a] rounded-full mr-2"></div>
                      Tamil Translation
                    </h3>
                    <p className="text-gray-800 leading-relaxed">{verse.tamilTranslation}</p>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            {selectedLanguages.includes('malayalam_transliteration') && verse.malayalamTransliteration && (
              <div className="p-4 border border-[#f5b014]/20 rounded-lg bg-white/50">
                <h3 className="text-[#1e3a8a] font-bold text-sm mb-1 uppercase tracking-wider flex items-center">
                  <div className="w-3 h-3 bg-[#1e3a8a] rounded-full mr-2"></div>
                  Malayalam Transliteration
                </h3>
                <p className="text-gray-800 leading-relaxed">{verse.malayalamTransliteration}</p>
              </div>
            )}
            
            {selectedLanguages.includes('tamil_transliteration') && verse.tamilTransliteration && (
              <div className="p-4 border border-[#f5b014]/20 rounded-lg bg-white/50">
                <h3 className="text-[#1e3a8a] font-bold text-sm mb-1 uppercase tracking-wider flex items-center">
                  <div className="w-3 h-3 bg-[#1e3a8a] rounded-full mr-2"></div>
                  Tamil Transliteration
                </h3>
                <p className="text-gray-800 leading-relaxed">{verse.tamilTransliteration}</p>
              </div>
            )}
          </div>
        </CardContent>
        
        {verse.audioUrl && (
          <CardFooter className="border-t border-[#1e3a8a]/20 pt-4 flex justify-center">
            <Button 
              variant="outline" 
              size="sm" 
              className={`flex items-center gap-2 text-white border-[#f5b014] bg-[#1e3a8a] hover:bg-[#1e3a8a]/90 ${isPlaying ? 'pulse-animation' : ''}`}
              onClick={handlePlayAudio}
            >
              {isPlaying ? <VolumeIcon className="h-4 w-4 text-[#f5b014]" /> : <VolumeXIcon className="h-4 w-4 text-[#f5b014]" />}
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
