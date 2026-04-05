import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { getAllTerms } from "@/services/searchService";

const ExamMode = () => {
  const navigate = useNavigate();
  const terms = getAllTerms();
  const [index, setIndex] = useState(0);
  const current = terms[index];

  const goNext = () => {
    setIndex((index + 1) % terms.length);
  };

  const goPrev = () => {
    setIndex((index - 1 + terms.length) % terms.length);
  };

  if (!current) return null;

  return (
    <div className="min-h-screen bg-background safe-top safe-bottom flex flex-col">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border px-5 py-3">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="p-1 -ml-1 text-foreground">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-sm font-semibold text-foreground">Exam Mode</h1>
          <span className="text-xs text-muted-foreground font-medium">
            {index + 1}/{terms.length}
          </span>
        </div>
      </div>

      <div className="flex-1 px-5 py-5 space-y-4 animate-fade-in">
        <div>
          <span className="text-[10px] font-medium text-primary bg-accent px-2.5 py-1 rounded-full">
            {current.category}
          </span>
          <h2 className="text-xl font-bold font-display text-foreground mt-2">{current.term}</h2>
        </div>

        {/* Key Points */}
        <div className="p-4 rounded-xl bg-card border border-border">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2.5">Key Points</h3>
          <ul className="space-y-2">
            {current.key_points.map((point, i) => (
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
            {current.exam_traps.map((trap, i) => (
              <li key={i} className="flex gap-2.5 text-sm text-foreground">
                <span className="text-destructive mt-0.5 shrink-0">!</span>
                <span className="leading-relaxed">{trap}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Mnemonic */}
        {current.mnemonic && (
          <div className="p-4 rounded-xl bg-warning/5 border border-warning/15">
            <h3 className="text-xs font-semibold text-warning uppercase tracking-wider mb-1.5">💡 Mnemonic</h3>
            <p className="text-sm font-medium text-foreground">{current.mnemonic}</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="px-5 pb-6 flex items-center justify-between">
        <button
          onClick={goPrev}
          className="flex items-center gap-1 px-4 py-2.5 rounded-xl bg-secondary text-secondary-foreground text-sm font-medium"
        >
          <ChevronLeft className="w-4 h-4" /> Prev
        </button>
        <button
          onClick={goNext}
          className="flex items-center gap-1 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium"
        >
          Next <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ExamMode;
