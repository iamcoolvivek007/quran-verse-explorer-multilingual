
import React from 'react';
import QuranExplorer from '@/components/QuranExplorer';
import { Book, BookOpen, Moon, Star } from 'lucide-react';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-[url('https://i.imgur.com/ZgHcfKN.jpg')] bg-cover bg-fixed">
      <div className="bg-gradient-to-b from-[#1e3a8a]/95 to-[#1e3a8a]/90 text-white py-12 shadow-xl relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://i.imgur.com/K3CTYtK.png')] bg-repeat"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex justify-center items-center mb-3 animate-fade-in">
            <Book className="h-12 w-12 text-[#f5b014] mr-3" />
            <h1 className="text-5xl md:text-6xl font-arabic font-bold">
              القرآن الكريم
            </h1>
          </div>
          <div className="flex justify-center mt-4">
            <Star className="h-5 w-5 text-[#f5b014] mx-2" />
            <p className="text-2xl text-[#f5b014] font-medium">The Illuminated Noble Quran</p>
            <Star className="h-5 w-5 text-[#f5b014] mx-2" />
          </div>
          <div className="ornament-divider my-5 max-w-lg mx-auto">
            <div className="w-12 h-5 bg-[url('https://i.imgur.com/B3Kqkfz.png')] bg-contain bg-no-repeat bg-center"></div>
          </div>
          <p className="mt-4 text-center max-w-2xl mx-auto text-white/80 italic">
            "An illuminated manuscript for the digital age, preserving the sacred text that has guided 
            kings and prophets through the centuries"
          </p>
        </div>
      </div>
      
      <div className="backdrop-blur-sm bg-white/30 py-8">
        <main>
          <QuranExplorer />
        </main>
      </div>
      
      <footer className="bg-gradient-to-t from-[#1e3a8a]/95 to-[#1e3a8a]/90 text-white py-8 mt-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-3">
            <BookOpen className="h-5 w-5 text-[#f5b014] mr-2" />
            <p className="text-lg font-arabic">القرآن الكريم</p>
          </div>
          <p className="text-white/70 text-sm mt-2">
            The Noble Quran - Digital Illuminated Manuscript
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
