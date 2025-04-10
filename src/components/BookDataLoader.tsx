
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, BookOpen, Check, AlertCircle, Loader2, Database, DownloadCloud } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { downloadAndStoreBook } from '@/services/HolyBooksAPI';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const BookDataLoader: React.FC = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({
    bible: false,
    gita: false,
    ramayana: false,
    torah: false
  });
  const [progress, setProgress] = useState<Record<string, number>>({
    bible: 0,
    gita: 0,
    ramayana: 0,
    torah: 0
  });
  const [results, setResults] = useState<Record<string, { success: boolean; message: string } | null>>({
    bible: null,
    gita: null,
    ramayana: null,
    torah: null
  });

  const handleDownload = async (bookCode: string) => {
    if (isLoading[bookCode]) return;
    
    setIsLoading(prev => ({ ...prev, [bookCode]: true }));
    setProgress(prev => ({ ...prev, [bookCode]: 10 }));
    
    try {
      // Simulate progress updates (since the actual download doesn't provide progress)
      const progressInterval = setInterval(() => {
        setProgress(prev => ({
          ...prev,
          [bookCode]: Math.min(prev[bookCode] + Math.random() * 15, 90)
        }));
      }, 1000);
      
      const result = await downloadAndStoreBook(bookCode);
      
      clearInterval(progressInterval);
      setProgress(prev => ({ ...prev, [bookCode]: 100 }));
      setResults(prev => ({ ...prev, [bookCode]: result }));
      
      toast({
        title: result.success ? "Download Complete" : "Download Failed",
        description: result.message,
        variant: result.success ? "default" : "destructive",
        duration: 5000,
      });
    } catch (error) {
      setResults(prev => ({ 
        ...prev, 
        [bookCode]: { 
          success: false, 
          message: `Unexpected error: ${error instanceof Error ? error.message : String(error)}` 
        } 
      }));
      
      toast({
        title: "Download Failed",
        description: `There was an error downloading ${bookCode} data.`,
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(prev => ({ ...prev, [bookCode]: false }));
    }
  };

  const getBookInfo = (bookCode: string) => {
    switch(bookCode) {
      case 'bible':
        return {
          title: 'Bible',
          description: 'The Christian holy book containing the Old and New Testaments',
          icon: <BookOpen className="h-5 w-5" />,
          textCount: '~31,000 verses',
          languages: ['Hebrew', 'Greek', 'English']
        };
      case 'gita':
        return {
          title: 'Bhagavad Gita',
          description: 'A 700-verse Hindu scripture that is part of the epic Mahabharata',
          icon: <BookOpen className="h-5 w-5" />,
          textCount: '~700 verses',
          languages: ['Sanskrit', 'English']
        };
      case 'ramayana':
        return {
          title: 'Ramayana',
          description: 'An ancient Indian epic poem narrating the journey of Rama',
          icon: <BookOpen className="h-5 w-5" />,
          textCount: '~24,000 verses',
          languages: ['Sanskrit', 'English']
        };
      case 'torah':
        return {
          title: 'Torah',
          description: 'The compilation of the first five books of the Hebrew Bible',
          icon: <BookOpen className="h-5 w-5" />,
          textCount: '~5,800 verses',
          languages: ['Hebrew', 'English']
        };
      default:
        return {
          title: 'Unknown',
          description: '',
          icon: <BookOpen className="h-5 w-5" />,
          textCount: '',
          languages: []
        };
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <Database className="mr-2 h-5 w-5 text-book-gold" />
        <span>Sacred Text Repository</span>
      </h2>
      
      <Tabs defaultValue="bible" className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="bible">Bible</TabsTrigger>
          <TabsTrigger value="gita">Bhagavad Gita</TabsTrigger>
          <TabsTrigger value="ramayana">Ramayana</TabsTrigger>
          <TabsTrigger value="torah">Torah</TabsTrigger>
        </TabsList>
        
        {(['bible', 'gita', 'ramayana', 'torah'] as const).map(bookCode => {
          const bookInfo = getBookInfo(bookCode);
          
          return (
            <TabsContent key={bookCode} value={bookCode}>
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {bookInfo.icon}
                        {bookInfo.title}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {bookInfo.description}
                      </CardDescription>
                    </div>
                    <div className="flex flex-col items-end">
                      <Badge variant="outline" className="mb-1">{bookInfo.textCount}</Badge>
                      <div className="flex gap-1">
                        {bookInfo.languages.map(lang => (
                          <Badge key={lang} variant="secondary" className="text-xs">{lang}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  {isLoading[bookCode] && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium">Downloading content...</p>
                        <p className="text-sm font-medium">{Math.round(progress[bookCode])}%</p>
                      </div>
                      <Progress value={progress[bookCode]} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-2">
                        Retrieving text from original sources, preparing translations, and saving to database
                      </p>
                    </div>
                  )}
                  
                  {results[bookCode] && (
                    <div className={`p-4 rounded-md mb-4 ${results[bookCode]?.success ? 'bg-green-50 text-green-800 border border-green-100' : 'bg-red-50 text-red-800 border border-red-100'}`}>
                      <div className="flex items-start gap-2">
                        {results[bookCode]?.success ? 
                          <Check className="h-5 w-5 text-green-600 mt-0.5" /> : 
                          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                        }
                        <div>
                          <p className="font-medium">
                            {results[bookCode]?.success ? 'Data Successfully Stored' : 'Download Error'}
                          </p>
                          <p className="text-sm">{results[bookCode]?.message}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
                
                <CardFooter>
                  <Button 
                    className="w-full"
                    onClick={() => handleDownload(bookCode)}
                    disabled={isLoading[bookCode]}
                    variant={results[bookCode]?.success ? "outline" : "default"}
                  >
                    {isLoading[bookCode] ? (
                      <div className="flex items-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        <span>Downloading...</span>
                      </div>
                    ) : results[bookCode]?.success ? (
                      <div className="flex items-center">
                        <Check className="mr-2 h-4 w-4" />
                        <span>Data Available</span>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <DownloadCloud className="mr-2 h-4 w-4" />
                        <span>Download & Store {bookInfo.title} Data</span>
                      </div>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
};

export default BookDataLoader;
