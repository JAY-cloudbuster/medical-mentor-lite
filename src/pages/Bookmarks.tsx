import { useNavigate } from "react-router-dom";
import { ArrowLeft, BookmarkX } from "lucide-react";
import { getBookmarks } from "@/services/bookmarkService";
import { getTermById } from "@/services/searchService";

const Bookmarks = () => {
  const navigate = useNavigate();
  const bookmarkIds = getBookmarks();
  const terms = bookmarkIds.map(getTermById).filter(Boolean);

  return (
    <div className="min-h-screen bg-background safe-top safe-bottom">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border px-5 py-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1 -ml-1 text-foreground">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold font-display text-foreground">Bookmarks</h1>
          <span className="text-xs text-muted-foreground ml-auto">{terms.length} saved</span>
        </div>
      </div>

      <div className="px-5 py-4 animate-fade-in">
        {terms.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <BookmarkX className="w-12 h-12 text-muted-foreground/40 mb-3" />
            <p className="text-sm text-muted-foreground">No bookmarks yet</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Tap the bookmark icon on any term to save it</p>
          </div>
        ) : (
          <div className="space-y-2">
            {terms.map((term) => term && (
              <button
                key={term.id}
                onClick={() => navigate(`/term/${term.id}`)}
                className="w-full text-left p-4 rounded-xl bg-card border border-border hover:border-primary/20 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-sm text-foreground">{term.term}</p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{term.definition}</p>
                  </div>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-accent text-accent-foreground shrink-0">
                    {term.category}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookmarks;
