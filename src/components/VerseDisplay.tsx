
import React from 'react';
import { DisplayVerse } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { VolumeIcon, VolumeXIcon } from 'lucide-react';
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

        {selectedLanguages.includes('malayalam_transliteration') && verse.malayalamTransliteration && (
          <div className="mb-4">
            <h3 className="text-quran-primary font-bold mb-1">Malayalam Transliteration:</h3>
            <p className="text-gray-800">{verse.malayalamTransliteration}</p>
          </div>
        )}
        
        {selectedLanguages.includes('tamil_transliteration') && verse.tamilTransliteration && (
          <div className="mb-4">
            <h3 className="text-quran-primary font-bold mb-1">Tamil Transliteration:</h3>
            <p className="text-gray-800">{verse.tamilTransliteration}</p>
          </div>
        )}
      </CardContent>
      
      {verse.audioUrl && (
        <CardFooter className="border-t pt-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2"
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
