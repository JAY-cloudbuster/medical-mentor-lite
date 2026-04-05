import { MedicalTerm } from "@/types/medical";
import { medicalTerms } from "@/data/medicalTerms";

// Simple fuzzy match
function fuzzyMatch(text: string, query: string): number {
  const t = text.toLowerCase();
  const q = query.toLowerCase();
  
  // Exact match
  if (t === q) return 100;
  // Starts with
  if (t.startsWith(q)) return 90;
  // Contains
  if (t.includes(q)) return 70;
  
  // Fuzzy: check if all chars appear in order
  let ti = 0;
  let matched = 0;
  for (let qi = 0; qi < q.length; qi++) {
    while (ti < t.length) {
      if (t[ti] === q[qi]) {
        matched++;
        ti++;
        break;
      }
      ti++;
    }
  }
  
  if (matched === q.length) return 30 + (matched / t.length) * 20;
  if (matched >= q.length * 0.7) return 10 + (matched / q.length) * 10;
  return 0;
}

export function searchTerms(query: string): MedicalTerm[] {
  if (!query.trim()) return [];
  
  const q = query.trim();
  const scored = medicalTerms
    .map(term => {
      const termScore = fuzzyMatch(term.term, q);
      const defScore = fuzzyMatch(term.definition, q) * 0.5;
      const catScore = fuzzyMatch(term.category, q) * 0.3;
      const score = Math.max(termScore, defScore, catScore);
      return { term, score };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score);
  
  return scored.map(s => s.term);
}

export function getTermsByCategory(category: string): MedicalTerm[] {
  return medicalTerms.filter(t => t.category === category);
}

export function getTermById(id: string): MedicalTerm | undefined {
  return medicalTerms.find(t => t.id === id);
}

export function getTermByName(name: string): MedicalTerm | undefined {
  return medicalTerms.find(t => t.term.toLowerCase() === name.toLowerCase());
}

export function getAllTerms(): MedicalTerm[] {
  return medicalTerms;
}
