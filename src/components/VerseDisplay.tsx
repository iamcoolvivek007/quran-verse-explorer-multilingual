
import React from 'react';
import { DisplayVerse } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { VolumeIcon, VolumeXIcon, BookmarkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VerseDisplayProps {
  verse: DisplayVerse;
  selectedLanguages: string[];
}

const VerseDisplay: React.FC<VerseDisplayProps> = ({ verse, selectedLanguages }) => {
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);

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

  return (
    <Card className="backdrop-blur-sm bg-white/80 border-t-4 border-t-[#1e3a8a] hover:shadow-lg transition-shadow relative overflow-hidden">
      <div className="absolute right-0 opacity-5 h-full">
        <div className="h-full w-24 bg-[url('https://i.imgur.com/B3Kqkfz.png')] bg-contain bg-no-repeat bg-right"></div>
      </div>
      
      <CardHeader className="pb-2 border-b border-[#1e3a8a]/20">
        <CardTitle className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="bg-[#1e3a8a] text-white h-8 w-8 rounded-full flex items-center justify-center mr-2 text-sm">
              {verse.ayah}
            </div>
            <span className="text-[#1e3a8a] font-medium">
              Surah {verse.surah}
            </span>
          </div>
          <span className="text-[#f5b014] text-sm font-arabic">
            {verse.surah}:{verse.ayah}
          </span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-4 relative z-10">
        {selectedLanguages.includes('arabic') && (
          <div className="mb-6 pb-4 border-b border-[#1e3a8a]/10">
            <p className="arabic-text text-2xl md:text-3xl leading-loose tracking-wide" dir="rtl">
              {verse.arabic}
            </p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {selectedLanguages.includes('english') && (
            <div className="space-y-4">
              <div>
                <h3 className="text-[#1e3a8a] font-bold text-sm mb-1 uppercase tracking-wider">English Transliteration</h3>
                <p className="text-gray-800 leading-relaxed">{verse.englishTransliteration}</p>
              </div>
              
              <div>
                <h3 className="text-[#1e3a8a] font-bold text-sm mb-1 uppercase tracking-wider">English Translation</h3>
                <p className="text-gray-800 leading-relaxed">{verse.englishTranslation}</p>
              </div>
            </div>
          )}
          
          {(selectedLanguages.includes('malayalam') || selectedLanguages.includes('tamil')) && (
            <div className="space-y-4">
              {selectedLanguages.includes('malayalam') && (
                <div>
                  <h3 className="text-[#1e3a8a] font-bold text-sm mb-1 uppercase tracking-wider">Malayalam Translation</h3>
                  <p className="text-gray-800 leading-relaxed">{verse.malayalamTranslation}</p>
                </div>
              )}
              
              {selectedLanguages.includes('tamil') && (
                <div>
                  <h3 className="text-[#1e3a8a] font-bold text-sm mb-1 uppercase tracking-wider">Tamil Translation</h3>
                  <p className="text-gray-800 leading-relaxed">{verse.tamilTranslation}</p>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {selectedLanguages.includes('malayalam_transliteration') && verse.malayalamTransliteration && (
            <div>
              <h3 className="text-[#1e3a8a] font-bold text-sm mb-1 uppercase tracking-wider">Malayalam Transliteration</h3>
              <p className="text-gray-800 leading-relaxed">{verse.malayalamTransliteration}</p>
            </div>
          )}
          
          {selectedLanguages.includes('tamil_transliteration') && verse.tamilTransliteration && (
            <div>
              <h3 className="text-[#1e3a8a] font-bold text-sm mb-1 uppercase tracking-wider">Tamil Transliteration</h3>
              <p className="text-gray-800 leading-relaxed">{verse.tamilTransliteration}</p>
            </div>
          )}
        </div>
      </CardContent>
      
      {verse.audioUrl && (
        <CardFooter className="border-t border-[#1e3a8a]/20 pt-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2 text-[#1e3a8a] border-[#1e3a8a]/50 hover:bg-[#1e3a8a]/10"
            onClick={handlePlayAudio}
          >
            {isPlaying ? <VolumeIcon className="h-4 w-4" /> : <VolumeXIcon className="h-4 w-4" />}
            {isPlaying ? "Pause Recitation" : "Play Recitation"}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default VerseDisplay;
