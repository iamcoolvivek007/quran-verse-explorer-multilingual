
import React, { useState } from 'react';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarTrigger, 
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInput
} from '@/components/ui/sidebar';
import { 
  Book, 
  BookOpen, 
  Search, 
  Settings, 
  Bookmark, 
  FileText, 
  Download,
  Menu,
  Moon,
  User,
  Heart,
  HelpCircle
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchSurahInfo } from '@/services/QuranAPI';
import { SurahInfo } from '@/types';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';

export const QuranSidebar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const { 
    data: surahs,
    isLoading
  } = useQuery({
    queryKey: ['surahInfo'],
    queryFn: fetchSurahInfo,
  });
  
  const filteredSurahs = surahs ? surahs.filter((surah: SurahInfo) => 
    surah.englishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(surah.number).includes(searchTerm)
  ) : [];
  
  return (
    <Sidebar
      className="border-r border-quran-gold/30 shadow-xl"
      variant="sidebar"
    >
      <SidebarHeader className="py-4 bg-quran-primary royal-decoration relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-islamic-border bg-repeat"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center">
              <SidebarTrigger className="text-quran-gold" />
              <div className="flex items-center ml-2">
                <BookOpen className="h-5 w-5 text-quran-gold mr-2" />
                <motion.span 
                  className="font-arabic text-lg text-white"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  القرآن الكريم
                </motion.span>
              </div>
            </div>
            
            <Menu className="h-5 w-5 text-quran-gold" />
          </div>
          
          <div className="mt-4 px-2">
            <SidebarInput 
              placeholder="Search surah..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white/10 text-white border-quran-gold/30 focus-visible:ring-quran-gold/30 placeholder:text-white/50"
            />
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="bg-quran-parchment bg-paper-texture bg-repeat bg-blend-overlay">
        <SidebarGroup>
          <SidebarGroupLabel className="text-quran-primary font-semibold">
            Quick Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton className="text-quran-primary hover:bg-quran-primary/10 gold-accent">
                  <Book className="text-quran-primary" />
                  <span>Continue Reading</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="text-quran-primary hover:bg-quran-primary/10 gold-accent">
                  <Bookmark className="text-quran-primary" />
                  <span>Bookmarks</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="text-quran-primary hover:bg-quran-primary/10 gold-accent">
                  <FileText className="text-quran-primary" />
                  <span>My Notes</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="text-quran-primary hover:bg-quran-primary/10 gold-accent">
                  <Download className="text-quran-primary" />
                  <span>Downloads</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <Separator className="my-2 bg-quran-gold/20" />
        
        <SidebarGroup>
          <SidebarGroupLabel className="text-quran-primary font-semibold flex items-center">
            <Book className="h-4 w-4 mr-1 text-quran-primary" />
            <span>Surahs</span>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="px-2 py-1.5 mb-2 text-xs text-quran-primary/60 italic">
              The Noble Quran contains 114 surahs
            </div>
            <SidebarMenu className="max-h-[50vh] overflow-y-auto pr-2 scrollbar-none">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div 
                    key={i} 
                    className="h-7 bg-quran-primary/10 animate-pulse rounded-md mb-2"
                  ></div>
                ))
              ) : (
                filteredSurahs.map((surah: SurahInfo) => (
                  <SidebarMenuItem key={surah.number}>
                    <SidebarMenuButton 
                      className="text-quran-primary hover:bg-quran-primary/10 justify-between gold-accent transition-all duration-300"
                      data-surah-number={surah.number}
                    >
                      <div className="flex items-center">
                        <div className="bg-quran-primary text-quran-gold h-5 w-5 rounded-full flex items-center justify-center mr-2 text-xs">
                          {surah.number}
                        </div>
                        <span>{surah.englishName}</span>
                      </div>
                      <span className="text-xs text-quran-primary/60">
                        {surah.versesCount}
                      </span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="border-t border-quran-gold/30 p-3 bg-quran-primary/5 royal-decoration">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <SidebarMenuButton 
              className="h-8 w-auto flex-1 text-quran-primary hover:bg-quran-primary/10"
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </SidebarMenuButton>
            
            <SidebarMenuButton 
              className="h-8 w-8 p-0 flex items-center justify-center text-quran-primary hover:bg-quran-primary/10 ml-2"
            >
              <Moon className="h-4 w-4" />
            </SidebarMenuButton>
            
            <SidebarMenuButton 
              className="h-8 w-8 p-0 flex items-center justify-center text-quran-primary hover:bg-quran-primary/10 ml-2"
            >
              <User className="h-4 w-4" />
            </SidebarMenuButton>
          </div>
          
          <div className="flex justify-between">
            <SidebarMenuButton 
              className="h-8 w-auto flex-1 text-quran-primary hover:bg-quran-primary/10"
            >
              <Heart className="h-4 w-4" />
              <span>Support Project</span>
            </SidebarMenuButton>
            
            <SidebarMenuButton 
              className="h-8 w-8 p-0 flex items-center justify-center text-quran-primary hover:bg-quran-primary/10 ml-2"
            >
              <HelpCircle className="h-4 w-4" />
            </SidebarMenuButton>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
