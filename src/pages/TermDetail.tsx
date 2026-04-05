import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Bookmark, BookmarkCheck } from "lucide-react";
import { getTermById, getTermByName } from "@/services/searchService";
import { isBookmarked, toggleBookmark } from "@/services/bookmarkService";
import { useState } from "react";

const TermDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const term = getTermById(id || "");
  const [bookmarked, setBookmarked] = useState(() => isBookmarked(id || ""));

  if (!term) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Term not found</p>
          <button onClick={() => navigate("/")} className="mt-3 text-sm text-primary font-medium">
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const handleBookmark = () => {
    toggleBookmark(term.id);
    setBookmarked(!bookmarked);
  };

  const handleRelatedTerm = (name: string) => {
    const related = getTermByName(name);
    if (related) navigate(`/term/${related.id}`);
  };

  return (
    <div className="min-h-screen bg-background safe-top safe-bottom">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border px-5 py-3">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="p-1 -ml-1 text-foreground">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button onClick={handleBookmark} className="p-1 -mr-1">
            {bookmarked ? (
              <BookmarkCheck className="w-5 h-5 text-primary" />
            ) : (
              <Bookmark className="w-5 h-5 text-muted-foreground" />
            )}
          </button>
        </div>
      </div>

      <div className="px-5 py-5 space-y-5 animate-fade-in">
        {/* Title & Category */}
        <div>
          <span className="text-xs font-medium text-primary bg-accent px-2.5 py-1 rounded-full">
            {term.category}
          </span>
          <h1 className="text-2xl font-bold font-display text-foreground mt-2">{term.term}</h1>
        </div>

        {/* Definition */}
        <div className="p-4 rounded-xl bg-card border border-border">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Definition</h3>
          <p className="text-sm text-foreground leading-relaxed">{term.definition}</p>
        </div>

        {/* Key Points */}
        <div className="p-4 rounded-xl bg-card border border-border">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2.5">Key Points</h3>
          <ul className="space-y-2">
            {term.key_points.map((point, i) => (
              <li key={i} className="flex gap-2.5 text-sm text-foreground">
                <span className="text-primary mt-0.5 shrink-0">•</span>
                <span className="leading-relaxed">{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Exam Traps */}
        <div className="p-4 rounded-xl bg-destructive/5 border border-destructive/15">
          <h3 className="text-xs font-semibold text-destructive uppercase tracking-wider mb-2.5">⚠ Exam Traps</h3>
          <ul className="space-y-2">
            {term.exam_traps.map((trap, i) => (
              <li key={i} className="flex gap-2.5 text-sm text-foreground">
                <span className="text-destructive mt-0.5 shrink-0">!</span>
                <span className="leading-relaxed">{trap}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Mnemonic */}
        {term.mnemonic && (
          <div className="p-4 rounded-xl bg-warning/5 border border-warning/15">
            <h3 className="text-xs font-semibold text-warning uppercase tracking-wider mb-1.5">💡 Mnemonic</h3>
            <p className="text-sm font-medium text-foreground">{term.mnemonic}</p>
          </div>
        )}

        {/* Related Terms */}
        {term.related_terms.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2.5">Related Terms</h3>
            <div className="flex flex-wrap gap-2">
              {term.related_terms.map((rt) => (
                <button
                  key={rt}
                  onClick={() => handleRelatedTerm(rt)}
                  className="text-xs font-medium px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  {rt}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="h-8" />
    </div>
  );
};

export default TermDetail;
