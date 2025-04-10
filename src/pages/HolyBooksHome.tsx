
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { SidebarProvider } from '@/components/ui/sidebar';
import { QuranSidebar } from '@/components/QuranSidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { fetchHolyBooks } from '@/services/HolyBooksAPI';
import { fetchBookChapters } from '@/services/HolyBooksAPI';
import { HolyBook, BookChapter } from '@/types';
import { BookOpen, Book, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import HolyBookSelector from '@/components/HolyBookSelector';
import LoadingSpinner from '@/components/LoadingSpinner';

const HolyBooksHome: React.FC = () => {
  const [selectedBook, setSelectedBook] = useState<string>('quran');
  const navigate = useNavigate();
  
  const { 
    data: books,
    isLoading: isBooksLoading
  } = useQuery({
    queryKey: ['holyBooks'],
    queryFn: fetchHolyBooks,
  });
  
  const {
    data: chapters,
    isLoading: isChaptersLoading
  } = useQuery({
    queryKey: ['bookChapters', selectedBook],
    queryFn: () => fetchBookChapters(selectedBook),
    enabled: !!selectedBook,
  });
  
  const handleBookSelect = (bookCode: string) => {
    setSelectedBook(bookCode);
  };
  
  const handleReadChapter = (bookCode: string, chapterNumber: number) => {
    navigate(`/book/${bookCode}/${chapterNumber}/1`);
  };
  
  const containerAnimation = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };
  
  // Get current book details
  const currentBook = books?.find(book => book.code === selectedBook);
  
  return (
    <SidebarProvider defaultOpen={false}>
      <div className="min-h-screen w-full flex">
        <QuranSidebar />
        
        <div className="flex-1 min-h-screen">
          <header className="relative py-24 text-center">
            <div className="absolute inset-0 bg-book-leather/80 dark:bg-book-leather/90"></div>
            <div className="relative z-10">
              <h1 className="text-6xl md:text-7xl font-bold text-book-gold mb-4">
                Sacred Texts
              </h1>
              <p className="text-2xl text-book-gold/90 font-medium">
                Digital Illuminated Manuscripts of Holy Books
              </p>
              
              <div className="mt-8 flex justify-center">
                <HolyBookSelector 
                  selectedBook={selectedBook} 
                  onBookChange={handleBookSelect} 
                />
              </div>
            </div>
          </header>
          
          <motion.div 
            className="container mx-auto px-4 py-16"
            variants={containerAnimation}
            initial="hidden"
            animate="show"
          >
            {currentBook && (
              <div className="mb-8 text-center">
                <h2 className="text-3xl font-medium text-book-title mb-4">
                  {currentBook.name}
                </h2>
                {currentBook.description && (
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    {currentBook.description}
                  </p>
                )}
              </div>
            )}
            
            <h3 className="text-2xl font-medium text-book-title mb-6">
              Chapters
            </h3>
            
            {isChaptersLoading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {chapters?.slice(0, 12).map((chapter) => (
                  <motion.div 
                    key={`${chapter.bookCode}-${chapter.number}`}
                    variants={itemAnimation}
                    className="mb-4"
                  >
                    <Card className="bg-book-page bg-opacity-90 border-book-gold/30 shadow-lg hover:shadow-xl transition-shadow h-full">
                      <CardContent className="p-6">
                        <div className="flex items-center mb-4">
                          <div className="bg-book-gold/20 text-book-title h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                            {chapter.number}
                          </div>
                          <h3 className="text-xl font-medium text-book-title">{chapter.englishName}</h3>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                          <span>{chapter.versesCount} verses</span>
                          {chapter.name !== chapter.englishName && (
                            <span className="font-arabic">{chapter.name}</span>
                          )}
                        </div>
                        
                        <Button 
                          onClick={() => handleReadChapter(chapter.bookCode, chapter.number)}
                          className="w-full mt-auto bg-book-gold/20 text-book-title hover:bg-book-gold/30 border border-book-gold/40"
                        >
                          <BookOpen className="h-4 w-4 mr-2" />
                          Read
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
            
            {chapters && chapters.length > 12 && (
              <div className="text-center mt-8">
                <Button 
                  onClick={() => navigate(`/books/${selectedBook}`)}
                  variant="outline"
                  className="bg-book-gold/10 hover:bg-book-gold/20 border-book-gold/30 text-book-title"
                >
                  View All {chapters.length} Chapters
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </motion.div>
          
          <footer className="bg-book-leather text-book-gold py-8 mt-8">
            <div className="container mx-auto px-4 text-center">
              <div className="flex items-center justify-center mb-3">
                <Book className="h-5 w-5 text-book-gold mr-2" />
                <p className="text-lg">Sacred Texts</p>
              </div>
              <p className="text-book-gold/70 text-sm mt-2">
                Digital Repository of Holy Books
              </p>
            </div>
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default HolyBooksHome;
