
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SurahInfo } from '@/types';
import { 
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator
} from '@/components/ui/command';
import { Book, Search, Heart, History } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();
  const [recentSearches, setRecentSearches] = useState<number[]>(
    JSON.parse(localStorage.getItem('quran-recent-surahs') || '[]')
  );
  const [favorites, setFavorites] = useState<number[]>(
    JSON.parse(localStorage.getItem('quran-favorite-surahs') || '[]')
  );

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
    // Update recent searches
    const newRecent = [surahNumber, ...recentSearches.filter(s => s !== surahNumber)].slice(0, 5);
    setRecentSearches(newRecent);
    localStorage.setItem('quran-recent-surahs', JSON.stringify(newRecent));
    
    if (onSurahSelect) {
      onSurahSelect(surahNumber);
      setOpen(false);
    } else {
      navigate(`/book/${surahNumber}/1`);
      setOpen(false);
    }
  };
  
  const toggleFavorite = (e: React.MouseEvent, surahNumber: number) => {
    e.stopPropagation(); // Prevent selecting the surah
    
    let newFavorites: number[];
    
    if (favorites.includes(surahNumber)) {
      newFavorites = favorites.filter(f => f !== surahNumber);
      toast({
        title: "Removed from favorites",
        description: `Surah ${surahNumber} has been removed from your favorites`,
      });
    } else {
      newFavorites = [...favorites, surahNumber];
      toast({
        title: "Added to favorites",
        description: `Surah ${surahNumber} has been added to your favorites`,
      });
    }
    
    setFavorites(newFavorites);
    localStorage.setItem('quran-favorite-surahs', JSON.stringify(newFavorites));
  };

  const favoritesList = surahs?.filter(surah => favorites.includes(surah.number)) || [];
  const recentList = surahs?.filter(surah => recentSearches.includes(surah.number)) || [];

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
        <CommandInput placeholder="Search for a Surah by name or number..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          
          {favoritesList.length > 0 && (
            <>
              <CommandGroup heading="Favorite Surahs">
                {favoritesList.map((surah) => (
                  <CommandItem 
                    key={`fav-${surah.number}`}
                    onSelect={() => handleSurahSelect(surah.number)}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Book className="h-4 w-4 text-book-gold" />
                    <span>{surah.number}. {surah.englishName}</span>
                    <span className="ml-auto text-xs text-muted-foreground">{surah.name}</span>
                    <Heart 
                      className="h-4 w-4 text-rose-500 fill-rose-500 ml-2 cursor-pointer"
                      onClick={(e) => toggleFavorite(e, surah.number)}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
            </>
          )}
          
          {recentList.length > 0 && (
            <>
              <CommandGroup heading="Recent Searches">
                {recentList.map((surah) => (
                  <CommandItem 
                    key={`recent-${surah.number}`}
                    onSelect={() => handleSurahSelect(surah.number)}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <History className="h-4 w-4 text-slate-400" />
                    <span>{surah.number}. {surah.englishName}</span>
                    <span className="ml-auto text-xs text-muted-foreground">{surah.name}</span>
                    <Heart 
                      className={`h-4 w-4 ${favorites.includes(surah.number) ? 'text-rose-500 fill-rose-500' : 'text-slate-300'} ml-2 cursor-pointer`}
                      onClick={(e) => toggleFavorite(e, surah.number)}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
            </>
          )}
          
          <CommandGroup heading="All Surahs">
            {surahs?.map((surah) => (
              <CommandItem 
                key={surah.number}
                onSelect={() => handleSurahSelect(surah.number)}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Book className="h-4 w-4 text-book-gold" />
                <span>{surah.number}. {surah.englishName}</span>
                <span className="ml-auto text-xs text-muted-foreground">{surah.name}</span>
                <Heart 
                  className={`h-4 w-4 ${favorites.includes(surah.number) ? 'text-rose-500 fill-rose-500' : 'text-slate-300'} ml-2 cursor-pointer`}
                  onClick={(e) => toggleFavorite(e, surah.number)}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default QuickSurahSelector;
