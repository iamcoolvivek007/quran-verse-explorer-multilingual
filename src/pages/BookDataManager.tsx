
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import BookDataLoader from '@/components/BookDataLoader';

const BookDataManager: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="container mx-auto">
        <div className="mb-6">
          <Link to="/">
            <Button variant="outline" size="sm" className="mb-4">
              <ChevronLeft className="h-4 w-4 mr-2" /> Back to Home
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-center mb-2">Holy Books Data Manager</h1>
          <p className="text-center text-gray-600 mb-8">
            Download and store data for various holy books from reliable sources
          </p>
        </div>
        
        <BookDataLoader />
      </div>
    </div>
  );
};

export default BookDataManager;
