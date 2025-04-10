import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { HolyBook } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { fetchHolyBooks } from '@/services/HolyBooksAPI';
import { Book } from 'lucide-react';

const HolyBooksHome: React.FC = () => {
  const [books, setBooks] = useState<HolyBook[]>([]);
  const { 
    data,
    isLoading,
    error
  } = useQuery({
    queryKey: ['holyBooks'],
    queryFn: fetchHolyBooks,
  });

  useEffect(() => {
    if (data) {
      setBooks(data);
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      console.error('Error fetching holy books:', error);
    }
  }, [error]);
  
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-book-gold/90 text-white shadow-md">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl md:text-4xl font-bold text-center">Holy Books Explorer</h1>
          <p className="text-center mt-2 max-w-2xl mx-auto">
            Explore sacred texts from various religious traditions with translations and audio
          </p>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {isLoading ? (
            <div className="col-span-full text-center">
              Loading holy books...
            </div>
          ) : (
            Array.isArray(books) && books.map((book) => (
              <div key={book.code} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2 text-book-title">
                    {book.name}
                  </h2>
                  <p className="text-gray-600 text-sm mb-4">
                    {book.description || 'No description available.'}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-xs">
                      Language: {book.language || 'Unknown'}
                    </span>
                    <Link to={`/books/${book.code}`}>
                      <Button variant="outline" size="sm">
                        <Book className="h-4 w-4 mr-2" />
                        Explore
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="mt-12 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-4 text-center">Administrative Tools</h2>
          <div className="flex justify-center mt-4">
            <Link to="/admin/data-manager">
              <Button className="bg-book-gold hover:bg-book-gold/90">
                Manage Book Data
              </Button>
            </Link>
          </div>
        </div>
      </main>
      
      <footer className="bg-slate-800 text-white py-8 mt-12">
        <div className="container mx-auto px-4">
          <p className="text-center">
            &copy; {new Date().getFullYear()} Holy Books Explorer. All rights reserved.
          </p>
          <p className="text-center mt-2 text-sm text-gray-400">
            Made with ❤️ by a Developer
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HolyBooksHome;
