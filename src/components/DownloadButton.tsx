
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { DisplayVerse } from '@/types';
import { downloadQuranData } from '@/services/QuranAPI';
import { useToast } from '@/hooks/use-toast';

interface DownloadButtonProps {
  verses: DisplayVerse[];
  surahName: string;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ verses, surahName }) => {
  const { toast } = useToast();

  const handleDownload = () => {
    try {
      const fileName = `quran_surah_${surahName.replace(/\s+/g, '_').toLowerCase()}.txt`;
      downloadQuranData(verses, fileName);
      
      toast({
        title: "Download Started",
        description: `${fileName} is being downloaded.`,
        duration: 3000,
      });
    } catch (error) {
      console.error('Download error:', error);
      
      toast({
        title: "Download Failed",
        description: "There was an error downloading the file.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  return (
    <Button 
      onClick={handleDownload} 
      className="bg-quran-primary hover:bg-quran-primary/90"
    >
      <Download className="mr-2 h-4 w-4" />
      Download Verses
    </Button>
  );
};

export default DownloadButton;
