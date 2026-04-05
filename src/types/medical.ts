export interface MedicalTerm {
  id: string;
  term: string;
  definition: string;
  key_points: string[];
  exam_traps: string[];
  mnemonic?: string;
  category: string;
  related_terms: string[];
}

export interface Category {
  name: string;
  icon: string;
  color: string;
  count: number;
}
