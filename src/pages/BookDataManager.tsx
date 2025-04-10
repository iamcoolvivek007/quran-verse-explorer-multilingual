
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft, BookOpen, Download } from 'lucide-react';
import BookDataLoader from '@/components/BookDataLoader';

const BookDataManager: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-12">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6">
        <div className="mb-10">
          <Link to="/">
            <Button variant="outline" size="sm" className="mb-4 hover:bg-slate-100">
              <ChevronLeft className="h-4 w-4 mr-2" /> Back to Home
            </Button>
          </Link>
          <div className="text-center">
            <div className="inline-flex items-center justify-center p-2 bg-book-gold/10 rounded-full mb-4">
              <BookOpen className="h-6 w-6 text-book-gold" />
            </div>
            <h1 className="text-4xl font-bold mb-2 text-book-title">Sacred Texts Data Center</h1>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Download and store sacred texts from verified sources to your Supabase database for offline reading and research
            </p>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <BookDataLoader />
        </div>

        <div className="mt-10 text-center text-sm text-slate-500">
          <p>All texts are downloaded from reliable academic sources and stored in your Supabase database.</p>
          <p>You can manage your data and customize the app's content through this interface.</p>
        </div>
      </div>
    </div>
  );
};

export default BookDataManager;
