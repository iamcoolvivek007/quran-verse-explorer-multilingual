
import React from 'react';
import { SurahInfo } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import QuickSurahSelector from './QuickSurahSelector';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Book, Menu } from 'lucide-react';

interface SurahSelectorProps {
  surahs: SurahInfo[];
  selectedSurah: number;
  onSurahChange: (surahNumber: number) => void;
}

const SurahSelector: React.FC<SurahSelectorProps> = ({ 
  surahs = [], // Provide a default empty array to prevent undefined
  selectedSurah,
  onSurahChange 
}) => {
  return (
    <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
      <div className="text-quran-primary font-bold">Select Surah:</div>
      
      <div className="w-full md:w-64">
        <Select
          value={selectedSurah ? selectedSurah.toString() : "1"}
          onValueChange={(value) => onSurahChange(parseInt(value))}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a Surah" />
          </SelectTrigger>
          <SelectContent>
            {Array.isArray(surahs) ? surahs.map((surah) => (
              <SelectItem 
                key={surah.number} 
                value={surah.number.toString()}
              >
                {surah.number}. {surah.englishName} ({surah.name})
              </SelectItem>
            )) : (
              <SelectItem value="1">Loading surahs...</SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>
      
      <div className="hidden md:block">
        <QuickSurahSelector surahs={surahs} onSurahSelect={onSurahChange} />
      </div>
      
      <div className="block md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="h-10 w-10">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="overflow-y-auto">
            <h3 className="text-lg font-bold mb-4 flex items-center">
              <Book className="mr-2 h-5 w-5 text-book-gold" />
              <span>Surahs</span>
            </h3>
            <div className="space-y-1 max-h-[80vh] overflow-y-auto">
              {surahs.map((surah) => (
                <Button 
                  key={surah.number}
                  variant="ghost" 
                  className="w-full justify-start text-left"
                  onClick={() => {
                    onSurahChange(surah.number);
                  }}
                >
                  <div className="flex items-center">
                    <div className="bg-book-title text-book-page h-5 w-5 rounded-full flex items-center justify-center mr-2 text-xs">
                      {surah.number}
                    </div>
                    <span>{surah.englishName}</span>
                    <span className="ml-auto text-xs text-muted-foreground">{surah.name}</span>
                  </div>
                </Button>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default SurahSelector;
