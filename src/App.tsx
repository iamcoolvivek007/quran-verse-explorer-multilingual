
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import BookView from "./pages/BookView";
import NotFound from "./pages/NotFound";
import HolyBooksHome from "./pages/HolyBooksHome";
import BookDataManager from "./pages/BookDataManager";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HolyBooksHome />} />
          <Route path="/books/quran" element={<Index bookCode="quran" />} />
          <Route path="/books/bible" element={<Index bookCode="bible" />} />
          <Route path="/books/gita" element={<Index bookCode="gita" />} />
          <Route path="/books/ramayana" element={<Index bookCode="ramayana" />} />
          <Route path="/books/torah" element={<Index bookCode="torah" />} />
          <Route path="/book/:bookCode/:chapterId/:verseId?" element={<BookView />} />
          <Route path="/admin/data-manager" element={<BookDataManager />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
