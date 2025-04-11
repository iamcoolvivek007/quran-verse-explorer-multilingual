
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import QuranExplorer from '@/components/QuranExplorer';
import BibleExplorer from '@/components/BibleExplorer';
import MainNavigation from '@/components/MainNavigation';
import HolyBookSelector from '@/components/HolyBookSelector';
import { useToast } from '@/hooks/use-toast';
import { fetchHolyBooks } from '@/services/HolyBooksAPI';

interface IndexProps {
  bookCode?: string;
}

const Index: React.FC<IndexProps> = ({ bookCode = 'quran' }) => {
  const { toast } = useToast();
  const [selectedBook, setSelectedBook] = useState<string>(bookCode);

  const { 
    data: books,
    isLoading,
    error
  } = useQuery({
    queryKey: ['holyBooks'],
    queryFn: fetchHolyBooks,
  });

  const handleBookChange = (code: string) => {
    setSelectedBook(code);
    // Navigate programmatically or with a Link if needed
  };

  // Display the currently selected book
  const renderBookComponent = () => {
    switch (selectedBook) {
      case 'quran':
        return <QuranExplorer />;
      case 'bible':
        return <BibleExplorer />;
      case 'gita':
      case 'ramayana':
      case 'torah':
        // For now, we'll show the following message for other books
        return (
          <div className="container mx-auto py-8 px-4">
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <h2 className="text-2xl font-bold mb-4">Reading {selectedBook}</h2>
              <p className="mb-4">
                You are now viewing the {selectedBook} content. This section is under development.
              </p>
            </div>
          </div>
        );
      default:
        return <QuranExplorer />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <header className="bg-white border-b border-slate-100 sticky top-0 z-10 shadow-sm">
        <div className="container max-w-7xl mx-auto py-4 px-4">
          <MainNavigation />
        </div>
      </header>

      <div className="container mx-auto py-6 px-4 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <HolyBookSelector 
            selectedBook={selectedBook}
            onBookChange={handleBookChange}
          />
          
          {renderBookComponent()}
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
