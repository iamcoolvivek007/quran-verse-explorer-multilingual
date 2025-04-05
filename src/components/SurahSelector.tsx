
import React from 'react';
import { SurahInfo } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
    </div>
  );
};

export default SurahSelector;
