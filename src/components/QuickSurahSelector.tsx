
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SurahInfo } from '@/types';
import { 
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem
} from '@/components/ui/command';
import { Book, Search } from 'lucide-react';

interface QuickSurahSelectorProps {
  surahs: SurahInfo[];
  onSurahSelect?: (surahNumber: number) => void;
}

const QuickSurahSelector: React.FC<QuickSurahSelectorProps> = ({ 
  surahs, 
  onSurahSelect 
}) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const handleSurahSelect = (surahNumber: number) => {
    if (onSurahSelect) {
      onSurahSelect(surahNumber);
      setOpen(false);
    } else {
      navigate(`/book/${surahNumber}/1`);
      setOpen(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-book-gold/20 rounded-md hover:bg-book-gold/30 transition-colors text-book-title"
        aria-label="Quick Surah Finder (⌘K)"
      >
        <Search className="h-4 w-4" />
        <span>Find Surah (⌘K)</span>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search for a Surah..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Surahs">
            {surahs?.map((surah) => (
              <CommandItem 
                key={surah.number}
                onSelect={() => handleSurahSelect(surah.number)}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Book className="h-4 w-4 text-book-gold" />
                <span>{surah.number}. {surah.englishName}</span>
                <span className="ml-auto text-xs text-muted-foreground">{surah.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default QuickSurahSelector;
