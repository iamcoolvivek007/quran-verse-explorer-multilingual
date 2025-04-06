
import React, { useState } from 'react';
import QuranExplorer from '@/components/QuranExplorer';
import { Book, BookOpen, Moon, Star, Sun } from 'lucide-react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { QuranSidebar } from '@/components/QuranSidebar';
import { Button } from '@/components/ui/button';

const Index: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };
  
  return (
    <SidebarProvider defaultOpen={false}>
      <div className={`min-h-screen w-full flex ${isDarkMode ? 'dark' : ''}`}>
        <QuranSidebar />
        
        <div className="flex-1 min-h-screen">
          <div className="bg-gradient-to-b from-quran-primary/95 to-quran-primary/90 text-white py-12 shadow-xl relative">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-islamic-border bg-repeat"></div>
            <div className="container mx-auto px-4 relative z-10">
              <div className="flex justify-center items-center mb-3 animate-fade-in">
                <Book className="h-12 w-12 text-quran-gold mr-3" />
                <h1 className="text-5xl md:text-6xl font-arabic font-bold">
                  القرآن الكريم
                </h1>
              </div>
              <div className="flex justify-center mt-4">
                <Star className="h-5 w-5 text-quran-gold mx-2" />
                <p className="text-2xl text-quran-gold font-medium">The Illuminated Noble Quran</p>
                <Star className="h-5 w-5 text-quran-gold mx-2" />
              </div>
              <div className="ornament-divider my-5 max-w-lg mx-auto">
                <div className="w-12 h-5 bg-quran-ornament bg-contain bg-no-repeat bg-center"></div>
              </div>
              <p className="mt-4 text-center max-w-2xl mx-auto text-white/80 italic">
                "An illuminated manuscript for the digital age, preserving the sacred text that has guided 
                kings and prophets through the centuries"
              </p>
            </div>
          </div>
          
          <div className="backdrop-blur-sm bg-white/30 py-8 dark:bg-black/30 royal-decoration">
            <main className="royal-decoration container mx-auto">
              <QuranExplorer />
            </main>
          </div>
          
          <footer className="bg-gradient-to-t from-quran-primary/95 to-quran-primary/90 text-white py-8 mt-8">
            <div className="container mx-auto px-4 text-center relative">
              <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-islamic-border bg-repeat"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-center mb-3">
                  <BookOpen className="h-5 w-5 text-quran-gold mr-2" />
                  <p className="text-lg font-arabic">القرآن الكريم</p>
                </div>
                <p className="text-white/70 text-sm mt-2">
                  The Noble Quran - Digital Illuminated Manuscript
                </p>
                <div className="mt-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={toggleDarkMode}
                    className="bg-transparent border-quran-gold text-quran-gold hover:bg-quran-gold hover:text-quran-primary"
                  >
                    {isDarkMode ? <Sun className="h-4 w-4 mr-2" /> : <Moon className="h-4 w-4 mr-2" />}
                    {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                  </Button>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
