import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, BookMarked, Zap, GraduationCap, Sun, Moon } from "lucide-react";
import { categories } from "@/data/medicalTerms";
import { searchTerms } from "@/services/searchService";
import { MedicalTerm } from "@/types/medical";
import { getTheme, setTheme as setThemePersist, initTheme } from "@/services/themeService";

const categoryColors: Record<string, string> = {
  Cardiology: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  Neurology: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  Pharmacology: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  Gastroenterology: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
  Pulmonology: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300",
  Nephrology: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300",
  Hematology: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300",
  Endocrinology: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
  Orthopedics: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300",
  Dermatology: "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/30 dark:text-fuchsia-300",
};

const Home = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<MedicalTerm[]>([]);
  const [currentTheme, setCurrentTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    setCurrentTheme(initTheme());
  }, []);

  const handleSearch = useCallback((value: string) => {
    setQuery(value);
    if (value.trim().length > 0) {
      setResults(searchTerms(value));
    } else {
      setResults([]);
    }
  }, []);

  const toggleTheme = () => {
    const next = currentTheme === "light" ? "dark" : "light";
    setCurrentTheme(next);
    setThemePersist(next);
  };

  return (
    <div className="min-h-screen bg-background safe-top safe-bottom">
      {/* Header */}
      <div className="px-5 pt-6 pb-2">
        <div className="flex items-center justify-between mb-1">
          <div>
            <h1 className="text-2xl font-bold font-display text-foreground">MedTerms</h1>
            <p className="text-sm text-muted-foreground">Medical terminology, simplified</p>
          </div>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-secondary text-secondary-foreground transition-colors"
          >
            {currentTheme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="px-5 py-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search terms, definitions..."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-secondary text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
          />
        </div>
      </div>

      {/* Search Results */}
      {query.trim() && (
        <div className="px-5 pb-4 animate-fade-in">
          {results.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">No results found</p>
          ) : (
            <div className="space-y-2">
              {results.map((term) => (
                <button
                  key={term.id}
                  onClick={() => navigate(`/term/${term.id}`)}
                  className="w-full text-left p-3.5 rounded-xl bg-card border border-border hover:border-primary/20 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-foreground">{term.term}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{term.definition}</p>
                    </div>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0 ${categoryColors[term.category] || "bg-secondary text-secondary-foreground"}`}>
                      {term.category}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Quick Actions */}
      {!query.trim() && (
        <>
          <div className="px-5 py-3 animate-fade-in">
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => navigate("/bookmarks")}
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-card border border-border hover:border-primary/20 transition-colors"
              >
                <BookMarked className="w-6 h-6 text-primary" />
                <span className="text-xs font-medium text-foreground">Bookmarks</span>
              </button>
              <button
                onClick={() => navigate("/revision")}
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-card border border-border hover:border-primary/20 transition-colors"
              >
                <Zap className="w-6 h-6 text-warning" />
                <span className="text-xs font-medium text-foreground">Revision</span>
              </button>
              <button
                onClick={() => navigate("/exam")}
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-card border border-border hover:border-primary/20 transition-colors"
              >
                <GraduationCap className="w-6 h-6 text-success" />
                <span className="text-xs font-medium text-foreground">Exam Mode</span>
              </button>
            </div>
          </div>

          {/* Categories */}
          <div className="px-5 py-3 animate-slide-up">
            <h2 className="text-base font-semibold text-foreground mb-3">Categories</h2>
            <div className="space-y-2">
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => navigate(`/category/${encodeURIComponent(cat.name)}`)}
                  className="w-full flex items-center gap-3 p-3.5 rounded-xl bg-card border border-border hover:border-primary/20 transition-colors"
                >
                  <span className="text-2xl">{cat.icon}</span>
                  <span className="text-sm font-medium text-foreground flex-1 text-left">{cat.name}</span>
                  <span className="text-xs text-muted-foreground">→</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="h-8" />
    </div>
  );
};

export default Home;
