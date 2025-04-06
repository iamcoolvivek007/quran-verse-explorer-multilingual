
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SidebarProvider } from '@/components/ui/sidebar';
import { QuranSidebar } from '@/components/QuranSidebar';
import { Moon, Sun, BookOpen, BookText, Search, ArrowRight, Bookmark, Coffee } from 'lucide-react';
import { fetchSurahInfo } from '@/services/QuranAPI';
import { SurahInfo } from '@/types';
import LoadingSpinner from '@/components/LoadingSpinner';
import { motion } from 'framer-motion';

const Index: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [recentSurahs, setRecentSurahs] = useState<{surah: number; ayah: number}[]>([]);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check for dark mode preference
    const savedMode = localStorage.getItem('quran-dark-mode');
    if (savedMode === 'true') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
    
    // Get recent surahs from localStorage
    const saved = localStorage.getItem('quran-recent');
    if (saved) {
      setRecentSurahs(JSON.parse(saved));
    }
    
    // Get bookmarks from localStorage
    const savedBookmarks = localStorage.getItem('quran-bookmarks');
    if (savedBookmarks) {
      setBookmarks(JSON.parse(savedBookmarks));
    }
  }, []);
  
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('quran-dark-mode', (!isDarkMode).toString());
  };
  
  const { 
    data: surahsInfo,
    isLoading: isSurahsLoading
  } = useQuery({
    queryKey: ['surahInfo'],
    queryFn: fetchSurahInfo,
  });
  
  const handleContinueReading = () => {
    if (recentSurahs.length > 0) {
      const { surah, ayah } = recentSurahs[0];
      navigate(`/book/${surah}/${ayah}`);
    } else {
      navigate('/book/1/1');
    }
  };
  
  const handleOpenBookmark = (bookmark: string) => {
    const [surah, ayah] = bookmark.split(':').map(Number);
    navigate(`/book/${surah}/${ayah}`);
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
  
  return (
    <SidebarProvider defaultOpen={false}>
      <div className={`min-h-screen w-full flex ${isDarkMode ? 'dark' : ''}`}>
        <QuranSidebar />
        
        <div className="flex-1 min-h-screen">
          <header className="relative py-24 text-center">
            <div className="absolute inset-0 bg-book-leather/80 dark:bg-book-leather/90"></div>
            <div className="relative z-10">
              <h1 className="text-6xl md:text-7xl font-arabic font-bold text-book-gold mb-4">
                القرآن الكريم
              </h1>
              <p className="text-2xl text-book-gold/90 font-medium">
                The Noble Quran - Digital Illuminated Manuscript
              </p>
              <div className="mt-8">
                <Button 
                  onClick={handleContinueReading}
                  className="bg-book-gold hover:bg-book-gold/90 text-book-leather font-medium px-6 py-2 text-lg"
                >
                  <BookText className="mr-2 h-5 w-5" />
                  Begin Reading
                </Button>
              </div>
            </div>
          </header>
          
          <motion.div 
            className="container mx-auto px-4 py-16"
            variants={containerAnimation}
            initial="hidden"
            animate="show"
          >
            <h2 className="text-3xl font-medium text-book-title mb-8 text-center">
              Explore the Quran
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div variants={itemAnimation}>
                <Card className="bg-book-page bg-opacity-90 border-book-gold/30 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <BookOpen className="h-6 w-6 text-book-gold mr-3" />
                      <h3 className="text-xl font-medium text-book-title">Continue Reading</h3>
                    </div>
                    
                    {recentSurahs.length > 0 ? (
                      <div className="space-y-3">
                        {recentSurahs.slice(0, 3).map((item, index) => (
                          <Link 
                            key={`${item.surah}-${item.ayah}`}
                            to={`/book/${item.surah}/${item.ayah}`}
                            className="flex items-center justify-between p-2 hover:bg-book-gold/10 rounded-md transition-colors"
                          >
                            <span>Surah {item.surah}, Ayah {item.ayah}</span>
                            <ArrowRight className="h-4 w-4 text-book-gold" />
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground italic">No recent reading history</p>
                    )}
                    
                    <Button 
                      variant="outline" 
                      className="w-full mt-4 border-book-gold/30 text-book-title hover:bg-book-gold/10"
                      onClick={handleContinueReading}
                    >
                      Start Reading
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div variants={itemAnimation}>
                <Card className="bg-book-page bg-opacity-90 border-book-gold/30 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <Search className="h-6 w-6 text-book-gold mr-3" />
                      <h3 className="text-xl font-medium text-book-title">Browse Surahs</h3>
                    </div>
                    
                    {isSurahsLoading ? (
                      <div className="flex justify-center py-4">
                        <LoadingSpinner />
                      </div>
                    ) : (
                      <div className="max-h-36 overflow-y-auto thin-scrollbar">
                        {surahsInfo?.slice(0, 5).map((surah: SurahInfo) => (
                          <Link 
                            key={surah.number}
                            to={`/book/${surah.number}/1`}
                            className="flex items-center justify-between p-2 hover:bg-book-gold/10 rounded-md transition-colors"
                          >
                            <div className="flex items-center">
                              <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-book-gold/20 text-book-title text-xs mr-2">
                                {surah.number}
                              </span>
                              <span>{surah.englishName}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {surah.versesCount} verses
                            </span>
                          </Link>
                        ))}
                      </div>
                    )}
                    
                    <Button 
                      variant="outline" 
                      className="w-full mt-4 border-book-gold/30 text-book-title hover:bg-book-gold/10"
                      onClick={() => navigate('/book/1/1')}
                    >
                      See All Surahs
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div variants={itemAnimation}>
                <Card className="bg-book-page bg-opacity-90 border-book-gold/30 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <Bookmark className="h-6 w-6 text-book-gold mr-3" />
                      <h3 className="text-xl font-medium text-book-title">Your Bookmarks</h3>
                    </div>
                    
                    {bookmarks.length > 0 ? (
                      <div className="space-y-3 max-h-36 overflow-y-auto thin-scrollbar">
                        {bookmarks.slice(0, 5).map((bookmark) => {
                          const [surah, ayah] = bookmark.split(':');
                          return (
                            <div 
                              key={bookmark}
                              className="flex items-center justify-between p-2 hover:bg-book-gold/10 rounded-md transition-colors cursor-pointer"
                              onClick={() => handleOpenBookmark(bookmark)}
                            >
                              <span>Surah {surah}, Ayah {ayah}</span>
                              <ArrowRight className="h-4 w-4 text-book-gold" />
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-muted-foreground italic">No bookmarks yet</p>
                    )}
                    
                    <Button 
                      variant="outline" 
                      className="w-full mt-4 border-book-gold/30 text-book-title hover:bg-book-gold/10"
                      onClick={() => navigate('/book/1/1')}
                    >
                      Open Quran
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
          
          <footer className="bg-book-leather text-book-gold py-8 mt-8">
            <div className="container mx-auto px-4 text-center">
              <div className="flex items-center justify-center mb-3">
                <BookOpen className="h-5 w-5 text-book-gold mr-2" />
                <p className="text-lg font-arabic">القرآن الكريم</p>
              </div>
              <p className="text-book-gold/70 text-sm mt-2">
                The Noble Quran - Digital Illuminated Manuscript
              </p>
              <div className="mt-4 flex justify-center space-x-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={toggleDarkMode}
                  className="bg-transparent border-book-gold text-book-gold hover:bg-book-gold/20"
                >
                  {isDarkMode ? <Sun className="h-4 w-4 mr-2" /> : <Moon className="h-4 w-4 mr-2" />}
                  {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                </Button>
                
                <a 
                  href="https://quran.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="bg-transparent border-book-gold text-book-gold hover:bg-book-gold/20"
                  >
                    <Coffee className="h-4 w-4 mr-2" />
                    Support
                  </Button>
                </a>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
