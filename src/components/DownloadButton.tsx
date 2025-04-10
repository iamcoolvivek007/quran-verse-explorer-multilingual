
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileText } from 'lucide-react';
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
      
      // Show appropriate book name in the toast notification
      const bookName = getBookDisplayName(bookCode);
      
      toast({
        title: "Download Started",
        description: `${bookName} ${surahName} is being downloaded.`,
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

  // Get a display-friendly name for the book
  const getBookDisplayName = (code: string): string => {
    switch(code) {
      case 'quran':
        return 'Quran';
      case 'bible':
        return 'Bible';
      case 'gita':
        return 'Bhagavad Gita';
      case 'ramayana':
        return 'Ramayana';
      case 'torah':
        return 'Torah';
      default:
        return 'Holy Book';
    }
  };

  // Get an appropriate icon and variant based on book type
  const getButtonStyles = () => {
    switch(bookCode) {
      case 'quran':
        return {
          className: "bg-book-title hover:bg-book-title/90 text-white",
          icon: <Download className="h-4 w-4" />
        };
      case 'bible':
        return {
          className: "bg-blue-700 hover:bg-blue-800 text-white",
          icon: <Download className="h-4 w-4" />
        };
      case 'gita':
        return {
          className: "bg-amber-600 hover:bg-amber-700 text-white",
          icon: <FileText className="h-4 w-4" />
        };
      case 'ramayana':
        return {
          className: "bg-orange-600 hover:bg-orange-700 text-white",
          icon: <FileText className="h-4 w-4" />
        };
      case 'torah':
        return {
          className: "bg-gray-700 hover:bg-gray-800 text-white",
          icon: <FileText className="h-4 w-4" />
        };
      default:
        return {
          className: "bg-book-title hover:bg-book-title/90 text-white",
          icon: <Download className="h-4 w-4" />
        };
    }
  };

  const buttonStyles = getButtonStyles();

  return (
    <Button 
      onClick={handleDownload} 
      size="sm"
      className={`flex items-center gap-2 ${buttonStyles.className}`}
    >
      {buttonStyles.icon}
      Download Text
    </Button>
  );
};

export default DownloadButton;
