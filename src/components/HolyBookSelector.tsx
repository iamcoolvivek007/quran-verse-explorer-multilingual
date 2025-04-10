
import React, { useEffect } from 'react';
import { HolyBook } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Book, Menu } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchHolyBooks } from '@/services/HolyBooksAPI';

interface HolyBookSelectorProps {
  selectedBook: string;
  onBookChange: (bookCode: string) => void;
}

const HolyBookSelector: React.FC<HolyBookSelectorProps> = ({ 
  selectedBook,
  onBookChange 
}) => {
  const { 
    data: books,
    isLoading,
    error
  } = useQuery({
    queryKey: ['holyBooks'],
    queryFn: fetchHolyBooks,
  });

  useEffect(() => {
    if (error) {
      console.error('Error fetching holy books:', error);
    }
  }, [error]);

  return (
    <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
      <div className="text-quran-primary font-bold">Select Holy Book:</div>
      
      <div className="w-full md:w-64">
        <Select
          value={selectedBook}
          onValueChange={(value) => onBookChange(value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a Holy Book" />
          </SelectTrigger>
          <SelectContent>
            {!isLoading && Array.isArray(books) ? books.map((book) => (
              <SelectItem 
                key={book.code} 
                value={book.code}
              >
                {book.name} ({book.language})
              </SelectItem>
            )) : (
              <SelectItem value="quran">Loading books...</SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>
      
      <div className="block md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="h-10 w-10">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="overflow-y-auto">
            <h3 className="text-lg font-bold mb-4 flex items-center">
              <Book className="mr-2 h-5 w-5 text-book-gold" />
              <span>Holy Books</span>
            </h3>
            <div className="space-y-1 max-h-[80vh] overflow-y-auto">
              {!isLoading && Array.isArray(books) ? books.map((book) => (
                <Button 
                  key={book.code}
                  variant="ghost" 
                  className="w-full justify-start text-left"
                  onClick={() => onBookChange(book.code)}
                >
                  <div className="flex items-center">
                    <div className="bg-book-title text-book-page h-5 w-5 rounded-full flex items-center justify-center mr-2 text-xs">
                      <Book className="h-3 w-3" />
                    </div>
                    <span>{book.name}</span>
                    <span className="ml-auto text-xs text-muted-foreground">{book.totalChapters} chapters</span>
                  </div>
                </Button>
              )) : (
                <div className="p-4 text-center text-gray-500">Loading books...</div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default HolyBookSelector;
