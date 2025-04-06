
import React, { useState } from 'react';
import { 
  BookOpen, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  Settings, 
  Bookmark,
  Globe,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface BookControlsProps {
  onTurnPage: (direction: number) => void;
  isAutoPlay: boolean;
  onToggleAutoPlay: () => void;
  autoPlaySpeed: number;
  onChangeSpeed: (speed: number) => void;
  bookmarks: string[];
  onGoToBookmark: (bookmark: string) => void;
  onChangeLanguages: (languages: string[]) => void;
  selectedLanguages: string[];
}

export const BookControls: React.FC<BookControlsProps> = ({
  onTurnPage,
  isAutoPlay,
  onToggleAutoPlay,
  autoPlaySpeed,
  onChangeSpeed,
  bookmarks,
  onGoToBookmark,
  onChangeLanguages,
  selectedLanguages
}) => {
  const [showSettings, setShowSettings] = useState(false);
  
  const handleLanguageChange = (language: string) => {
    if (selectedLanguages.includes(language)) {
      onChangeLanguages(selectedLanguages.filter(l => l !== language));
    } else {
      onChangeLanguages([...selectedLanguages, language]);
    }
  };
  
  return (
    <div className="book-controls">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onTurnPage(-1)}
        className="text-book-gold hover:text-book-gold/80 hover:bg-book-leather/50"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      
      <Button
        variant={isAutoPlay ? "default" : "outline"}
        size="sm"
        onClick={onToggleAutoPlay}
        className={`flex items-center gap-2 ${isAutoPlay ? 'bg-book-gold text-book-leather pulse-gold' : 'border-book-gold/50 text-book-gold hover:bg-book-leather/50'}`}
      >
        {isAutoPlay ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        {isAutoPlay ? "Pause" : "Auto-Play"}
      </Button>
      
      {/* Speed control */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="border-book-gold/50 text-book-gold hover:bg-book-leather/50"
          >
            <Clock className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-4">
            <h4 className="font-medium">Auto-Play Speed</h4>
            <div className="flex items-center gap-2">
              <span className="text-sm">Fast</span>
              <Slider
                value={[autoPlaySpeed]}
                min={1}
                max={10}
                step={1}
                onValueChange={(value) => onChangeSpeed(value[0])}
                className="flex-1"
              />
              <span className="text-sm">Slow</span>
            </div>
            <div className="text-center text-sm">
              {autoPlaySpeed} second{autoPlaySpeed !== 1 ? 's' : ''} per page
            </div>
          </div>
        </PopoverContent>
      </Popover>
      
      {/* Bookmarks dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="border-book-gold/50 text-book-gold hover:bg-book-leather/50"
          >
            <Bookmark className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center">
          <div className="px-2 py-1.5 text-sm font-medium">Bookmarks</div>
          {bookmarks.length === 0 ? (
            <div className="px-2 py-4 text-center text-sm text-muted-foreground">
              No bookmarks yet
            </div>
          ) : (
            bookmarks.map((bookmark) => {
              const [surah, ayah] = bookmark.split(':');
              return (
                <DropdownMenuItem
                  key={bookmark}
                  onClick={() => onGoToBookmark(bookmark)}
                  className="cursor-pointer"
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  <span>Surah {surah}, Ayah {ayah}</span>
                </DropdownMenuItem>
              );
            })
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      
      {/* Language selection */}
      <Popover open={showSettings} onOpenChange={setShowSettings}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="border-book-gold/50 text-book-gold hover:bg-book-leather/50"
          >
            <Globe className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="grid gap-4">
            <h4 className="font-medium">Language Settings</h4>
            <div className="grid grid-cols-1 gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="arabic" 
                  checked={selectedLanguages.includes('arabic')}
                  onCheckedChange={() => handleLanguageChange('arabic')}
                  disabled
                />
                <Label htmlFor="arabic">Arabic (Required)</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="english" 
                  checked={selectedLanguages.includes('english')}
                  onCheckedChange={() => handleLanguageChange('english')}
                />
                <Label htmlFor="english">English Translation</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="english_transliteration" 
                  checked={selectedLanguages.includes('english_transliteration')}
                  onCheckedChange={() => handleLanguageChange('english_transliteration')}
                />
                <Label htmlFor="english_transliteration">English Transliteration</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="malayalam" 
                  checked={selectedLanguages.includes('malayalam')}
                  onCheckedChange={() => handleLanguageChange('malayalam')}
                />
                <Label htmlFor="malayalam">Malayalam Translation</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="malayalam_transliteration" 
                  checked={selectedLanguages.includes('malayalam_transliteration')}
                  onCheckedChange={() => handleLanguageChange('malayalam_transliteration')}
                />
                <Label htmlFor="malayalam_transliteration">Malayalam Transliteration</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="tamil" 
                  checked={selectedLanguages.includes('tamil')}
                  onCheckedChange={() => handleLanguageChange('tamil')}
                />
                <Label htmlFor="tamil">Tamil Translation</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="tamil_transliteration" 
                  checked={selectedLanguages.includes('tamil_transliteration')}
                  onCheckedChange={() => handleLanguageChange('tamil_transliteration')}
                />
                <Label htmlFor="tamil_transliteration">Tamil Transliteration</Label>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onTurnPage(1)}
        className="text-book-gold hover:text-book-gold/80 hover:bg-book-leather/50"
      >
        <ChevronRight className="h-6 w-6" />
      </Button>
    </div>
  );
};
