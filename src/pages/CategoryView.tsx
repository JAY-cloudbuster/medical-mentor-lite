import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { getTermsByCategory } from "@/services/searchService";

const CategoryView = () => {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();
  const categoryName = decodeURIComponent(name || "");
  const terms = getTermsByCategory(categoryName);

  return (
    <div className="min-h-screen bg-background safe-top safe-bottom">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border px-5 py-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1 -ml-1 text-foreground">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold font-display text-foreground">{categoryName}</h1>
          <span className="text-xs text-muted-foreground ml-auto">{terms.length} terms</span>
        </div>
      </div>

      <div className="px-5 py-4 space-y-2 animate-fade-in">
        {terms.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No terms in this category</p>
        ) : (
          terms.map((term) => (
            <button
              key={term.id}
              onClick={() => navigate(`/term/${term.id}`)}
              className="w-full text-left p-4 rounded-xl bg-card border border-border hover:border-primary/20 transition-colors"
            >
              <p className="font-semibold text-sm text-foreground">{term.term}</p>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{term.definition}</p>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default CategoryView;
