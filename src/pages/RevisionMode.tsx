import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, ChevronLeft, ChevronRight, Bookmark, BookmarkCheck } from "lucide-react";
import { getAllTerms } from "@/services/searchService";
import { isBookmarked, toggleBookmark } from "@/services/bookmarkService";

const RevisionMode = () => {
  const navigate = useNavigate();
  const terms = getAllTerms();
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [bookmarkedState, setBookmarkedState] = useState(() => isBookmarked(terms[0]?.id || ""));

  const current = terms[index];

  const goNext = useCallback(() => {
    const next = (index + 1) % terms.length;
    setIndex(next);
    setRevealed(false);
    setBookmarkedState(isBookmarked(terms[next].id));
  }, [index, terms]);

  const goPrev = useCallback(() => {
    const prev = (index - 1 + terms.length) % terms.length;
    setIndex(prev);
    setRevealed(false);
    setBookmarkedState(isBookmarked(terms[prev].id));
  }, [index, terms]);

  const handleBookmark = () => {
    toggleBookmark(current.id);
    setBookmarkedState(!bookmarkedState);
  };

  if (!current) return null;

  return (
    <div className="min-h-screen bg-background safe-top safe-bottom flex flex-col">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border px-5 py-3">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="p-1 -ml-1 text-foreground">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-xs text-muted-foreground font-medium">
            {index + 1} / {terms.length}
          </span>
          <button onClick={handleBookmark} className="p-1 -mr-1">
            {bookmarkedState ? (
              <BookmarkCheck className="w-5 h-5 text-primary" />
            ) : (
              <Bookmark className="w-5 h-5 text-muted-foreground" />
            )}
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col px-5 py-6">
        {/* Card */}
        <div
          className="flex-1 flex flex-col items-center justify-center p-6 rounded-2xl bg-card border border-border cursor-pointer select-none"
          onClick={() => setRevealed(!revealed)}
        >
          <span className="text-[10px] font-medium text-primary bg-accent px-2.5 py-1 rounded-full mb-4">
            {current.category}
          </span>
          <h2 className="text-xl font-bold font-display text-foreground text-center mb-2">
            {current.term}
          </h2>

          {!revealed ? (
            <div className="flex items-center gap-1.5 mt-4 text-muted-foreground">
              <Eye className="w-4 h-4" />
              <span className="text-xs">Tap to reveal</span>
            </div>
          ) : (
            <div className="mt-4 space-y-4 w-full animate-fade-in">
              <p className="text-sm text-foreground text-center leading-relaxed">{current.definition}</p>
              
              <div className="text-left space-y-1.5">
                {current.key_points.slice(0, 3).map((point, i) => (
                  <p key={i} className="text-xs text-muted-foreground flex gap-2">
                    <span className="text-primary shrink-0">•</span>
                    {point}
                  </p>
                ))}
              </div>

              {current.mnemonic && (
                <p className="text-xs font-medium text-warning text-center bg-warning/5 px-3 py-2 rounded-lg">
                  💡 {current.mnemonic}
                </p>
              )}

              <div className="flex items-center gap-1.5 justify-center text-muted-foreground">
                <EyeOff className="w-3.5 h-3.5" />
                <span className="text-[10px]">Tap to hide</span>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-5">
          <button
            onClick={goPrev}
            className="flex items-center gap-1 px-4 py-2.5 rounded-xl bg-secondary text-secondary-foreground text-sm font-medium"
          >
            <ChevronLeft className="w-4 h-4" /> Prev
          </button>
          <button
            onClick={() => navigate(`/term/${current.id}`)}
            className="text-xs text-primary font-medium"
          >
            Full Details
          </button>
          <button
            onClick={goNext}
            className="flex items-center gap-1 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RevisionMode;
