export interface Skill {
  name: string;
  category: "direct" | "indirect" | "transition" | "general";
  confidence: number; // 0 to 1
}

export interface JobVacancy {
  job_id: string;
  source: "JobStreet" | "Glints" | "LinkedIn";
  job_title: string;
  company: string;
  industry: string;
  location: string; // e.g. Surabaya, Gresik, Sidoarjo, Jakarta
  salary_min: number | null;
  salary_max: number | null;
  posting_date: string; // ISO date string
  job_description: string;
  qualifications: string;
  employment_type: string; // Full-time, Intern, Contract, etc.
  experience: number; // years
  education: string; // Bachelor, Master, High School, etc.
  url: string;

  // Cleaned state variables
  is_cleaned?: boolean;
  is_duplicate?: boolean;
  has_empty_desc?: boolean;

  // Extracted skill variables (Fase 3)
  extracted_skills?: Skill[];
  green_intensity_score?: number; // 0 to 100
}

export interface OntologyTerm {
  term: string;
  category: "direct" | "indirect" | "transition";
  description: string;
  synonyms: string[];
}

export interface ScraperConfig {
  source: "JobStreet" | "Glints" | "LinkedIn" | "All";
  keywords: string[];
  locations: string[];
  industries: string[];
  targetSampleSize: number;
  delayMs: number;
}

export interface ScraperStats {
  totalScraped: number;
  successCount: number;
  failCount: number;
  bySource: {
    JobStreet: number;
    Glints: number;
    LinkedIn: number;
  };
  logs: string[];
  isRunning: boolean;
  progress: number;
}

export interface CleaningConfig {
  removeDuplicates: boolean;
  removeEmptyDesc: boolean;
  lowercaseText: boolean;
  removePunctuation: boolean;
  removeStopwords: boolean;
  standardizeSalary: boolean;
  standardizeLocation: boolean;
}

export interface ExtractionResult {
  job_id: string;
  job_title: string;
  company: string;
  skills: Skill[];
  green_intensity_score: number;
  direct_count: number;
  indirect_count: number;
  transition_count: number;
  total_count: number;
}
