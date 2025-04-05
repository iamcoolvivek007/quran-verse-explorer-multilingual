
import React from 'react';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { GlobeIcon } from 'lucide-react';

interface LanguageSelectorProps {
  selectedLanguages: string[];
  onLanguageChange: (languages: string[]) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguages,
  onLanguageChange
}) => {
  const handleValueChange = (value: string[]) => {
    // Ensure at least one language is always selected
    if (value.length > 0) {
      onLanguageChange(value);
    }
  };

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <GlobeIcon className="h-5 w-5 text-[#1e3a8a]" />
        <h3 className="text-[#1e3a8a] font-bold">Display Languages:</h3>
      </div>
      
      <div className="bg-white/70 p-3 rounded-lg border border-gray-200">
        <ToggleGroup 
          type="multiple" 
          value={selectedLanguages} 
          onValueChange={handleValueChange} 
          className="flex flex-wrap gap-2"
        >
          <ToggleGroupItem 
            value="arabic" 
            aria-label="Toggle Arabic" 
            className="px-4 data-[state=on]:bg-[#1e3a8a] data-[state=on]:text-white"
          >
            Arabic
          </ToggleGroupItem>
          <ToggleGroupItem 
            value="english" 
            aria-label="Toggle English" 
            className="px-4 data-[state=on]:bg-[#1e3a8a] data-[state=on]:text-white"
          >
            English
          </ToggleGroupItem>
          <ToggleGroupItem 
            value="malayalam" 
            aria-label="Toggle Malayalam" 
            className="px-4 data-[state=on]:bg-[#1e3a8a] data-[state=on]:text-white"
          >
            Malayalam
          </ToggleGroupItem>
          <ToggleGroupItem 
            value="tamil" 
            aria-label="Toggle Tamil" 
            className="px-4 data-[state=on]:bg-[#1e3a8a] data-[state=on]:text-white"
          >
            Tamil
          </ToggleGroupItem>
          <ToggleGroupItem 
            value="malayalam_transliteration" 
            aria-label="Toggle Malayalam Transliteration" 
            className="px-4 data-[state=on]:bg-[#1e3a8a] data-[state=on]:text-white"
          >
            Malayalam Transliteration
          </ToggleGroupItem>
          <ToggleGroupItem 
            value="tamil_transliteration" 
            aria-label="Toggle Tamil Transliteration" 
            className="px-4 data-[state=on]:bg-[#1e3a8a] data-[state=on]:text-white"
          >
            Tamil Transliteration
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
};

export default LanguageSelector;
