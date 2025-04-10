
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, BookOpen, Check, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { downloadAndStoreBook } from '@/services/HolyBooksAPI';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

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

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Holy Books Data Manager</h2>
      
      <Tabs defaultValue="bible" className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="bible">Bible</TabsTrigger>
          <TabsTrigger value="gita">Bhagavad Gita</TabsTrigger>
          <TabsTrigger value="ramayana">Ramayana</TabsTrigger>
          <TabsTrigger value="torah">Torah</TabsTrigger>
        </TabsList>
        
        {(['bible', 'gita', 'ramayana', 'torah'] as const).map(bookCode => (
          <TabsContent key={bookCode} value={bookCode}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  {bookCode === 'bible' && 'Bible'}
                  {bookCode === 'gita' && 'Bhagavad Gita'}
                  {bookCode === 'ramayana' && 'Ramayana'}
                  {bookCode === 'torah' && 'Torah'}
                </CardTitle>
                <CardDescription>
                  {bookCode === 'bible' && 'The Christian holy book containing the Old and New Testaments'}
                  {bookCode === 'gita' && 'A 700-verse Hindu scripture that is part of the epic Mahabharata'}
                  {bookCode === 'ramayana' && 'An ancient Indian epic poem narrating the journey of Rama'}
                  {bookCode === 'torah' && 'The compilation of the first five books of the Hebrew Bible'}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {isLoading[bookCode] && (
                  <div className="mb-4">
                    <p className="mb-2 text-sm">Downloading content... {Math.round(progress[bookCode])}%</p>
                    <Progress value={progress[bookCode]} className="h-2" />
                  </div>
                )}
                
                {results[bookCode] && (
                  <div className={`p-4 rounded-md mb-4 ${results[bookCode]?.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                    <div className="flex items-start gap-2">
                      {results[bookCode]?.success ? 
                        <Check className="h-5 w-5 text-green-600 mt-0.5" /> : 
                        <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                      }
                      <div>
                        <p className="font-medium">
                          {results[bookCode]?.success ? 'Success' : 'Error'}
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
                >
                  {isLoading[bookCode] ? (
                    <>Downloading...</>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Download & Store {bookCode === 'bible' ? 'Bible' : 
                                       bookCode === 'gita' ? 'Bhagavad Gita' : 
                                       bookCode === 'ramayana' ? 'Ramayana' : 'Torah'} Data
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default BookDataLoader;
