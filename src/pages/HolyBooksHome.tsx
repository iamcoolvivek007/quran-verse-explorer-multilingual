
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Book, BookOpen, Database, Download, Library } from 'lucide-react';
import { motion } from 'framer-motion';
import MainNavigation from '@/components/MainNavigation';

const HolyBooksHome: React.FC = () => {
  const books = [
    {
      code: 'quran',
      name: 'Quran',
      description: 'The central religious text of Islam',
      icon: <BookOpen className="h-8 w-8 text-book-gold" />,
      color: 'bg-book-gold/10 border-book-gold/20',
      textColor: 'text-book-gold',
      chapters: 114
    },
    {
      code: 'bible',
      name: 'Bible',
      description: 'The holy scripture of Christianity',
      icon: <Book className="h-8 w-8 text-blue-600" />,
      color: 'bg-blue-50 border-blue-200',
      textColor: 'text-blue-700',
      chapters: 66
    },
    {
      code: 'gita',
      name: 'Bhagavad Gita',
      description: 'A 700-verse Hindu scripture',
      icon: <BookOpen className="h-8 w-8 text-amber-600" />,
      color: 'bg-amber-50 border-amber-200',
      textColor: 'text-amber-700',
      chapters: 18
    },
    {
      code: 'ramayana',
      name: 'Ramayana',
      description: 'Ancient Indian epic poem',
      icon: <BookOpen className="h-8 w-8 text-orange-600" />,
      color: 'bg-orange-50 border-orange-200',
      textColor: 'text-orange-700',
      chapters: 7
    },
    {
      code: 'torah',
      name: 'Torah',
      description: 'The first five books of the Hebrew Bible',
      icon: <Book className="h-8 w-8 text-gray-700" />,
      color: 'bg-gray-50 border-gray-200',
      textColor: 'text-gray-700',
      chapters: 5
    }
  ];
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <header className="bg-white border-b border-slate-100 sticky top-0 z-10 shadow-sm">
        <div className="container max-w-7xl mx-auto py-4 px-4">
          <MainNavigation />
        </div>
      </header>
      
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-book-gold/10 to-book-leather/5 z-0"></div>
        <div className="container max-w-6xl mx-auto px-4 relative z-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">Sacred Texts Explorer</h1>
              <p className="text-lg text-slate-600 mb-6">
                Explore religious and philosophical texts from various traditions, with translations, commentaries, and study tools.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/books/quran">
                  <Button className="bg-book-gold hover:bg-book-gold/90">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Browse Texts
                  </Button>
                </Link>
                <Link to="/admin/data-manager">
                  <Button variant="outline">
                    <Database className="mr-2 h-4 w-4" />
                    Manage Content
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden md:flex justify-center">
              <div className="relative w-80 h-80">
                <div className="absolute top-0 left-0 w-64 h-64 bg-book-leather/80 rounded-lg transform rotate-6 shadow-xl"></div>
                <div className="absolute top-8 left-8 w-64 h-64 bg-book-gold/20 rounded-lg transform -rotate-3 shadow-xl"></div>
                <div className="absolute top-16 left-16 w-64 h-64 bg-white rounded-lg transform rotate-3 shadow-xl flex items-center justify-center">
                  <Library className="h-24 w-24 text-book-gold/70" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-16 bg-white">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-slate-900">Explore Sacred Texts</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Discover wisdom and insights from different religious and philosophical traditions
            </p>
          </div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {books.map((book) => (
              <motion.div key={book.code} variants={itemVariants}>
                <Card className={`overflow-hidden border ${book.color} h-full flex flex-col transition-all hover:shadow-md`}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="rounded-full p-2 bg-white border border-slate-100 shadow-sm mb-2">
                        {book.icon}
                      </div>
                      <span className={`${book.textColor} text-sm font-medium`}>
                        {book.chapters} Chapters
                      </span>
                    </div>
                    <CardTitle className={`text-xl ${book.textColor}`}>{book.name}</CardTitle>
                    <CardDescription>{book.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <ul className="text-sm text-slate-500 space-y-1">
                      <li className="flex items-center">
                        <Check className="mr-2 h-4 w-4 text-green-500" />
                        Original text and translations
                      </li>
                      <li className="flex items-center">
                        <Check className="mr-2 h-4 w-4 text-green-500" />
                        Download capabilities
                      </li>
                      <li className="flex items-center">
                        <Check className="mr-2 h-4 w-4 text-green-500" />
                        Bookmark and save verses
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <div className="flex items-center justify-between w-full">
                      <Link to={`/books/${book.code}`}>
                        <Button variant="outline" size="sm">
                          <Book className="mr-2 h-4 w-4" />
                          Read
                        </Button>
                      </Link>
                      <Button variant="ghost" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      <section className="py-16 bg-slate-50 border-t border-slate-100">
        <div className="container max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-6 text-slate-900">Admin Tools</h2>
          <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
            Manage your sacred texts collection with our data management tools
          </p>
          <Link to="/admin/data-manager">
            <Button size="lg" className="bg-book-gold hover:bg-book-gold/90">
              <Database className="mr-2 h-5 w-5" />
              Access Data Manager
            </Button>
          </Link>
        </div>
      </section>
      
      <footer className="bg-slate-900 text-white py-12">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="flex items-center mb-4 md:mb-0">
              <Library className="h-6 w-6 text-book-gold mr-2" />
              <span className="text-xl font-bold">Sacred Texts Explorer</span>
            </div>
            <div className="flex gap-4">
              <Link to="/">
                <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
                  Home
                </Button>
              </Link>
              <Link to="/books/quran">
                <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
                  Quran
                </Button>
              </Link>
              <Link to="/books/bible">
                <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
                  Bible
                </Button>
              </Link>
              <Link to="/admin/data-manager">
                <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
                  Data Manager
                </Button>
              </Link>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-6 text-center text-slate-400 text-sm">
            <p>&copy; {new Date().getFullYear()} Sacred Texts Explorer. Created for educational purposes.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Add missing Check component
const Check = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default HolyBooksHome;
