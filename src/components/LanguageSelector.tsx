
import React from 'react';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { BookOpenIcon, AlertCircleIcon, InfoIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface LanguageSelectorProps {
  selectedLanguages: string[];
  onLanguageChange: (languages: string[]) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguages,
  onLanguageChange
}) => {
  const { toast } = useToast();
  
  const handleValueChange = (value: string[]) => {
    // Ensure at least one language is always selected
    if (value.length > 0) {
      onLanguageChange(value);
    }
  };

  const handleSelectTransliterations = () => {
    const newSelection = [...selectedLanguages];
    
    // Add transliteration options if they're not already there
    if (!newSelection.includes('malayalam_transliteration')) {
      newSelection.push('malayalam_transliteration');
    }
    
    if (!newSelection.includes('tamil_transliteration')) {
      newSelection.push('tamil_transliteration');
    }
    
    // Make sure the translations are also selected
    if (!newSelection.includes('malayalam')) {
      newSelection.push('malayalam');
    }
    
    if (!newSelection.includes('tamil')) {
      newSelection.push('tamil');
    }
    
    onLanguageChange(newSelection);
    
    toast({
      title: "Transliterations enabled",
      description: "Malayalam and Tamil transliterations have been enabled.",
    });
  };

  return (
    <div className="mb-6">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-2 mb-4"
      >
        <div className="flex items-center bg-quran-primary text-white px-4 py-2 rounded-lg shadow-md dark:bg-quran-primary/80">
          <BookOpenIcon className="h-5 w-5 text-quran-gold mr-2" />
          <h3 className="text-white font-bold">Languages of the Sacred Text</h3>
        </div>
      </motion.div>
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="quran-page p-4 rounded-lg border border-quran-gold/40 shadow-md backdrop-blur-sm"
      >
        <div className="mb-2 text-sm text-quran-primary/70 italic dark:text-quran-gold/70">Select languages to display:</div>
        <ToggleGroup 
          type="multiple" 
          value={selectedLanguages} 
          onValueChange={handleValueChange} 
          className="flex flex-wrap gap-3"
        >
          <ToggleGroupItem 
            value="arabic" 
            aria-label="Toggle Arabic" 
            className="px-4 border border-quran-primary/20 data-[state=on]:bg-quran-primary data-[state=on]:text-quran-gold data-[state=on]:border-quran-gold dark:border-quran-gold/20 dark:data-[state=on]:bg-quran-gold/20"
          >
            Arabic
          </ToggleGroupItem>
          <ToggleGroupItem 
            value="english" 
            aria-label="Toggle English" 
            className="px-4 border border-quran-primary/20 data-[state=on]:bg-quran-primary data-[state=on]:text-quran-gold data-[state=on]:border-quran-gold dark:border-quran-gold/20 dark:data-[state=on]:bg-quran-gold/20"
          >
            English
          </ToggleGroupItem>
          <ToggleGroupItem 
            value="malayalam" 
            aria-label="Toggle Malayalam" 
            className="px-4 border border-quran-primary/20 data-[state=on]:bg-quran-primary data-[state=on]:text-quran-gold data-[state=on]:border-quran-gold dark:border-quran-gold/20 dark:data-[state=on]:bg-quran-gold/20"
          >
            Malayalam
          </ToggleGroupItem>
          <ToggleGroupItem 
            value="tamil" 
            aria-label="Toggle Tamil" 
            className="px-4 border border-quran-primary/20 data-[state=on]:bg-quran-primary data-[state=on]:text-quran-gold data-[state=on]:border-quran-gold dark:border-quran-gold/20 dark:data-[state=on]:bg-quran-gold/20"
          >
            Tamil
          </ToggleGroupItem>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <ToggleGroupItem 
                  value="malayalam_transliteration" 
                  aria-label="Toggle Malayalam Transliteration" 
                  className="px-4 border border-quran-primary/20 data-[state=on]:bg-quran-primary data-[state=on]:text-quran-gold data-[state=on]:border-quran-gold dark:border-quran-gold/20 dark:data-[state=on]:bg-quran-gold/20 flex items-center gap-1"
                >
                  Malayalam Transliteration
                  <InfoIcon className="h-4 w-4 text-amber-500" />
                </ToggleGroupItem>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-sm">Enhanced Malayalam transliteration is now available using Google's transliteration service.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <ToggleGroupItem 
                  value="tamil_transliteration" 
                  aria-label="Toggle Tamil Transliteration" 
                  className="px-4 border border-quran-primary/20 data-[state=on]:bg-quran-primary data-[state=on]:text-quran-gold data-[state=on]:border-quran-gold dark:border-quran-gold/20 dark:data-[state=on]:bg-quran-gold/20 flex items-center gap-1"
                >
                  Tamil Transliteration
                  <InfoIcon className="h-4 w-4 text-amber-500" />
                </ToggleGroupItem>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-sm">Enhanced Tamil transliteration is now available using Google's transliteration service.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </ToggleGroup>
        
        <div className="mt-6 flex justify-center">
          <Button 
            onClick={handleSelectTransliterations}
            variant="outline"
            className="bg-book-gold/20 hover:bg-book-gold/30 border-book-gold/40 hover:border-book-gold/60 text-book-title"
          >
            Enable All Transliterations
          </Button>
        </div>
        
        <div className="mt-4 text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1 p-2 bg-amber-50 dark:bg-amber-950/30 rounded-md">
          <AlertCircleIcon className="h-4 w-4 flex-shrink-0" />
          <p>Transliterations are now powered by Google's transliteration service with Supabase caching for better performance.</p>
        </div>
      </motion.div>
    </div>
  );
};

export default LanguageSelector;
