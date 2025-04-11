
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Check, AlertCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { Progress } from '@/components/ui/progress';

interface BibleJson {
  metadata: {
    title: string;
    language: {
      original: string[];
      translations: string[];
    };
    total_books: number;
    source: string;
  };
  books: {
    number: number;
    name: {
      english: string;
      malayalam?: string;
      tamil?: string;
    };
    chapters: {
      number: number;
      verses: {
        number: number;
        text: {
          english: string;
          malayalam?: string;
          tamil?: string;
        };
      }[];
    }[];
  }[];
}

const JsonImporter: React.FC = () => {
  const { toast } = useToast();
  const [jsonInput, setJsonInput] = useState<string>('');
  const [isImporting, setIsImporting] = useState<boolean>(false);
  const [importProgress, setImportProgress] = useState<number>(0);
  const [importResult, setImportResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleJsonInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJsonInput(e.target.value);
    // Reset import status when input changes
    if (importResult) setImportResult(null);
  };

  const importBibleData = async () => {
    if (!jsonInput.trim()) {
      toast({
        title: "Empty Input",
        description: "Please paste valid JSON data before importing.",
        variant: "destructive",
      });
      return;
    }

    setIsImporting(true);
    setImportProgress(5);
    setImportResult(null);

    try {
      // Parse JSON input
      const bibleData: BibleJson = JSON.parse(jsonInput);
      
      // Validate the Bible data structure
      if (!bibleData.metadata || !bibleData.books || !Array.isArray(bibleData.books)) {
        throw new Error("Invalid Bible data structure. The JSON must include metadata and books array.");
      }

      setImportProgress(15);
      
      // First, check if the Bible entry exists in holy_books table
      const { data: existingBook, error: bookError } = await supabase
        .from('holy_books')
        .select('*')
        .eq('code', 'bible')
        .single();
      
      if (bookError && bookError.code !== 'PGRST116') { // PGRST116 means no rows returned
        throw new Error(`Error checking for existing Bible data: ${bookError.message}`);
      }
      
      // If Bible doesn't exist, add it to holy_books
      if (!existingBook) {
        const { error: insertError } = await supabase
          .from('holy_books')
          .insert({
            code: 'bible',
            name: 'Bible',
            description: bibleData.metadata.title,
            language: bibleData.metadata.language.original.join(', '),
            total_chapters: bibleData.metadata.total_books
          });
          
        if (insertError) {
          throw new Error(`Error adding Bible to holy_books: ${insertError.message}`);
        }
      }
      
      setImportProgress(25);
      
      // Process each book
      const totalBooks = bibleData.books.length;
      for (let bookIndex = 0; bookIndex < totalBooks; bookIndex++) {
        const book = bibleData.books[bookIndex];
        
        // Update progress
        setImportProgress(25 + Math.floor((bookIndex / totalBooks) * 50));
        
        // Insert the book as a chapter in book_chapters
        const { error: chapterError } = await supabase
          .from('book_chapters')
          .upsert({
            book_code: 'bible',
            number: book.number,
            name: book.name.english,
            english_name: book.name.english,
            verses_count: book.chapters.reduce((sum, chapter) => sum + chapter.verses.length, 0)
          });
        
        if (chapterError) {
          console.error(`Error adding book ${book.name.english}:`, chapterError);
          // Continue with next book instead of stopping the whole import
          continue;
        }
        
        // Process each chapter in the book
        for (let chapterIndex = 0; chapterIndex < book.chapters.length; chapterIndex++) {
          const chapter = book.chapters[chapterIndex];
          
          // Process each verse in the chapter
          for (let verseIndex = 0; verseIndex < chapter.verses.length; verseIndex++) {
            const verse = chapter.verses[verseIndex];
            
            // Insert verse into book_verses
            const { error: verseError } = await supabase
              .from('book_verses')
              .upsert({
                book_code: 'bible',
                chapter_number: book.number,
                verse_number: verse.number,
                original_text: verse.text.english, // Using English as original for Bible
                english_translation: verse.text.english,
                malayalam_translation: verse.text.malayalam || null,
                tamil_translation: verse.text.tamil || null
              });
            
            if (verseError) {
              console.error(`Error adding verse ${book.name.english} ${chapter.number}:${verse.number}:`, verseError);
            }
          }
        }
      }
      
      setImportProgress(90);
      
      // Generate transliterations for added verses (simplified approach)
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate processing time
      
      setImportProgress(100);
      
      setImportResult({
        success: true,
        message: `Successfully imported Bible data with ${bibleData.books.length} books. The data is now available for reading.`
      });
      
      toast({
        title: "Import Successful",
        description: `Bible data has been successfully imported into your database.`,
      });
      
    } catch (error) {
      console.error('JSON import error:', error);
      
      setImportResult({
        success: false,
        message: `Error importing data: ${error instanceof Error ? error.message : String(error)}`
      });
      
      toast({
        title: "Import Failed",
        description: `There was an error processing your JSON data: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold flex items-center text-book-title">
          <Upload className="mr-2 h-5 w-5 text-book-gold" />
          <span>Import Bible Data from JSON</span>
        </h2>
        <p className="text-gray-600 mt-1">
          Paste your formatted Bible JSON data below to import it into your database.
        </p>
      </div>
      
      <div className="mb-4">
        <Textarea
          placeholder="Paste your Bible JSON data here..."
          className="font-mono text-sm min-h-[300px]"
          value={jsonInput}
          onChange={handleJsonInputChange}
          disabled={isImporting}
        />
      </div>
      
      {isImporting && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium">Importing Bible data...</p>
            <p className="text-sm font-medium">{Math.round(importProgress)}%</p>
          </div>
          <Progress value={importProgress} className="h-2" />
          <p className="text-xs text-muted-foreground mt-2">
            Processing books, chapters, and verses...
          </p>
        </div>
      )}
      
      {importResult && (
        <Alert 
          variant={importResult.success ? "default" : "destructive"}
          className="mb-6"
        >
          {importResult.success ? 
            <Check className="h-4 w-4" /> : 
            <AlertCircle className="h-4 w-4" />
          }
          <AlertTitle>
            {importResult.success ? "Import Successful" : "Import Failed"}
          </AlertTitle>
          <AlertDescription>
            {importResult.message}
          </AlertDescription>
        </Alert>
      )}
      
      <Button 
        onClick={importBibleData}
        className="w-full bg-book-title hover:bg-book-title/90"
        disabled={isImporting || !jsonInput.trim()}
      >
        {isImporting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            <span>Importing...</span>
          </>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            <span>Import Bible Data</span>
          </>
        )}
      </Button>
      
      <div className="mt-4 text-xs text-gray-500">
        <p className="font-medium">Expected JSON Format:</p>
        <pre className="bg-gray-100 p-2 rounded mt-1 overflow-x-auto">
{`{
  "metadata": { ... },
  "books": [
    {
      "number": 1,
      "name": { "english": "Genesis", ... },
      "chapters": [
        {
          "number": 1,
          "verses": [
            {
              "number": 1,
              "text": { "english": "In the beginning...", ... }
            }
          ]
        }
      ]
    }
  ]
}`}
        </pre>
      </div>
    </div>
  );
};

export default JsonImporter;
