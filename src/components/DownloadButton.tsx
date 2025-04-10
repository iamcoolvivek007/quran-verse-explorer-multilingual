
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { DisplayVerse } from '@/types';
import { downloadBookData } from '@/services/HolyBooksAPI';
import { useToast } from '@/hooks/use-toast';

interface DownloadButtonProps {
  verses: DisplayVerse[];
  surahName: string;
  bookCode?: string;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ verses, surahName, bookCode = 'quran' }) => {
  const { toast } = useToast();

  const handleDownload = () => {
    try {
      const fileName = `${bookCode}_${surahName.replace(/\s+/g, '_').toLowerCase()}.txt`;
      
      // Use the appropriate download function based on book code
      downloadBookData(verses, fileName);
      
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
      size="sm"
      className="bg-book-title hover:bg-book-title/90 text-white flex items-center gap-2"
    >
      <Download className="h-4 w-4" />
      Download Text
    </Button>
  );
};

export default DownloadButton;
