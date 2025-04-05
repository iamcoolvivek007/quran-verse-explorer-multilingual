
import React from 'react';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { GlobeIcon, BookOpenIcon } from 'lucide-react';
import { motion } from 'framer-motion';

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
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-2 mb-4"
      >
        <div className="flex items-center bg-[#1e3a8a] text-white px-4 py-2 rounded-lg shadow-md">
          <BookOpenIcon className="h-5 w-5 text-[#f5b014] mr-2" />
          <h3 className="text-white font-bold">Languages of the Sacred Text</h3>
        </div>
      </motion.div>
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white/70 p-4 rounded-lg border border-[#f5b014]/40 shadow-md backdrop-blur-sm"
      >
        <div className="mb-2 text-sm text-[#1e3a8a]/70 italic">Select languages to display:</div>
        <ToggleGroup 
          type="multiple" 
          value={selectedLanguages} 
          onValueChange={handleValueChange} 
          className="flex flex-wrap gap-3"
        >
          <ToggleGroupItem 
            value="arabic" 
            aria-label="Toggle Arabic" 
            className="px-4 border border-[#1e3a8a]/20 data-[state=on]:bg-[#1e3a8a] data-[state=on]:text-[#f5b014] data-[state=on]:border-[#f5b014]"
          >
            Arabic
          </ToggleGroupItem>
          <ToggleGroupItem 
            value="english" 
            aria-label="Toggle English" 
            className="px-4 border border-[#1e3a8a]/20 data-[state=on]:bg-[#1e3a8a] data-[state=on]:text-[#f5b014] data-[state=on]:border-[#f5b014]"
          >
            English
          </ToggleGroupItem>
          <ToggleGroupItem 
            value="malayalam" 
            aria-label="Toggle Malayalam" 
            className="px-4 border border-[#1e3a8a]/20 data-[state=on]:bg-[#1e3a8a] data-[state=on]:text-[#f5b014] data-[state=on]:border-[#f5b014]"
          >
            Malayalam
          </ToggleGroupItem>
          <ToggleGroupItem 
            value="tamil" 
            aria-label="Toggle Tamil" 
            className="px-4 border border-[#1e3a8a]/20 data-[state=on]:bg-[#1e3a8a] data-[state=on]:text-[#f5b014] data-[state=on]:border-[#f5b014]"
          >
            Tamil
          </ToggleGroupItem>
          <ToggleGroupItem 
            value="malayalam_transliteration" 
            aria-label="Toggle Malayalam Transliteration" 
            className="px-4 border border-[#1e3a8a]/20 data-[state=on]:bg-[#1e3a8a] data-[state=on]:text-[#f5b014] data-[state=on]:border-[#f5b014]"
          >
            Malayalam Transliteration
          </ToggleGroupItem>
          <ToggleGroupItem 
            value="tamil_transliteration" 
            aria-label="Toggle Tamil Transliteration" 
            className="px-4 border border-[#1e3a8a]/20 data-[state=on]:bg-[#1e3a8a] data-[state=on]:text-[#f5b014] data-[state=on]:border-[#f5b014]"
          >
            Tamil Transliteration
          </ToggleGroupItem>
        </ToggleGroup>
      </motion.div>
    </div>
  );
};

export default LanguageSelector;
