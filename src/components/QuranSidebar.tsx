
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
  User
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchSurahInfo } from '@/services/QuranAPI';
import { SurahInfo } from '@/types';
import { Separator } from '@/components/ui/separator';

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
      className="border-r border-[#f5b014]/30 shadow-xl"
      variant="sidebar"
    >
      <SidebarHeader className="py-4 bg-[#1e3a8a]">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center">
            <SidebarTrigger className="text-[#f5b014]" />
            <div className="flex items-center ml-2">
              <BookOpen className="h-5 w-5 text-[#f5b014] mr-2" />
              <span className="font-arabic text-lg text-white">القرآن الكريم</span>
            </div>
          </div>
          
          <Menu className="h-5 w-5 text-[#f5b014]" />
        </div>
        
        <div className="mt-4 px-2">
          <SidebarInput 
            placeholder="Search surah..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-white/10 text-white border-[#f5b014]/30 focus-visible:ring-[#f5b014]/30 placeholder:text-white/50"
          />
        </div>
      </SidebarHeader>
      
      <SidebarContent className="bg-[#fffcf0] bg-[url('https://i.imgur.com/nSHYktj.png')] bg-repeat bg-blend-overlay">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[#1e3a8a] font-semibold">
            Quick Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton className="text-[#1e3a8a] hover:bg-[#1e3a8a]/10">
                  <Book className="text-[#1e3a8a]" />
                  <span>Continue Reading</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="text-[#1e3a8a] hover:bg-[#1e3a8a]/10">
                  <Bookmark className="text-[#1e3a8a]" />
                  <span>Bookmarks</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="text-[#1e3a8a] hover:bg-[#1e3a8a]/10">
                  <FileText className="text-[#1e3a8a]" />
                  <span>My Notes</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="text-[#1e3a8a] hover:bg-[#1e3a8a]/10">
                  <Download className="text-[#1e3a8a]" />
                  <span>Downloads</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <Separator className="my-2 bg-[#f5b014]/20" />
        
        <SidebarGroup>
          <SidebarGroupLabel className="text-[#1e3a8a] font-semibold flex items-center">
            <Book className="h-4 w-4 mr-1 text-[#1e3a8a]" />
            <span>Surahs</span>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="px-2 py-1.5 mb-2 text-xs text-[#1e3a8a]/60 italic">
              The Noble Quran contains 114 surahs
            </div>
            <SidebarMenu className="max-h-[50vh] overflow-y-auto pr-2">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div 
                    key={i} 
                    className="h-7 bg-[#1e3a8a]/10 animate-pulse rounded-md mb-2"
                  ></div>
                ))
              ) : (
                filteredSurahs.map((surah: SurahInfo) => (
                  <SidebarMenuItem key={surah.number}>
                    <SidebarMenuButton 
                      className="text-[#1e3a8a] hover:bg-[#1e3a8a]/10 justify-between"
                      data-surah-number={surah.number}
                    >
                      <div className="flex items-center">
                        <div className="bg-[#1e3a8a] text-[#f5b014] h-5 w-5 rounded-full flex items-center justify-center mr-2 text-xs">
                          {surah.number}
                        </div>
                        <span>{surah.englishName}</span>
                      </div>
                      <span className="text-xs text-[#1e3a8a]/60">
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
      
      <SidebarFooter className="border-t border-[#f5b014]/30 p-3 bg-[#1e3a8a]/5">
        <div className="flex justify-between items-center">
          <SidebarMenuButton 
            className="h-8 w-auto flex-1 text-[#1e3a8a] hover:bg-[#1e3a8a]/10"
          >
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </SidebarMenuButton>
          
          <SidebarMenuButton 
            className="h-8 w-8 p-0 flex items-center justify-center text-[#1e3a8a] hover:bg-[#1e3a8a]/10 ml-2"
          >
            <Moon className="h-4 w-4" />
          </SidebarMenuButton>
          
          <SidebarMenuButton 
            className="h-8 w-8 p-0 flex items-center justify-center text-[#1e3a8a] hover:bg-[#1e3a8a]/10 ml-2"
          >
            <User className="h-4 w-4" />
          </SidebarMenuButton>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
