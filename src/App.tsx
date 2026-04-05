import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "./pages/Home";
import TermDetail from "./pages/TermDetail";
import CategoryView from "./pages/CategoryView";
import Bookmarks from "./pages/Bookmarks";
import RevisionMode from "./pages/RevisionMode";
import ExamMode from "./pages/ExamMode";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/term/:id" element={<TermDetail />} />
          <Route path="/category/:name" element={<CategoryView />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
          <Route path="/revision" element={<RevisionMode />} />
          <Route path="/exam" element={<ExamMode />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
