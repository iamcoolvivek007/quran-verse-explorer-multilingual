
import React from 'react';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

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
      <h3 className="text-quran-primary font-bold mb-2">Display Languages:</h3>
      <ToggleGroup type="multiple" value={selectedLanguages} onValueChange={handleValueChange} className="flex flex-wrap gap-2">
        <ToggleGroupItem value="arabic" aria-label="Toggle Arabic" className="px-4">
          Arabic
        </ToggleGroupItem>
        <ToggleGroupItem value="english" aria-label="Toggle English" className="px-4">
          English
        </ToggleGroupItem>
        <ToggleGroupItem value="malayalam" aria-label="Toggle Malayalam" className="px-4">
          Malayalam
        </ToggleGroupItem>
        <ToggleGroupItem value="tamil" aria-label="Toggle Tamil" className="px-4">
          Tamil
        </ToggleGroupItem>
        <ToggleGroupItem value="malayalam_transliteration" aria-label="Toggle Malayalam Transliteration" className="px-4">
          Malayalam Transliteration
        </ToggleGroupItem>
        <ToggleGroupItem value="tamil_transliteration" aria-label="Toggle Tamil Transliteration" className="px-4">
          Tamil Transliteration
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};

export default LanguageSelector;
