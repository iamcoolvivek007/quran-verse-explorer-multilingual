
import React from 'react';
import QuranExplorer from '@/components/QuranExplorer';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-quran-light to-white">
      <header className="bg-quran-primary text-white py-6 shadow-md">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold">Quran Verse Explorer</h1>
          <p className="mt-2 text-quran-secondary">Explore Quranic verses in multiple languages</p>
        </div>
      </header>
      
      <main>
        <QuranExplorer />
      </main>
      
      <footer className="bg-quran-primary text-white py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>Quran Verse Explorer - Multilingual Edition</p>
          <p className="text-sm mt-2">Data provided by the Quran API</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
