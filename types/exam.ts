export interface AgeRelaxation {
  category: string; // e.g., 'OBC', 'SC', 'ST', 'PwD', 'Ex-Servicemen'
  years: number; // number of years relaxed
  description?: string;
}

export interface AgeLimit {
  min: number;
  max: number;
  cutoffDate: string; // Target calculation date (e.g. '2026-08-01')
  relaxations: AgeRelaxation[];
}

export interface EducationCriteria {
  minDegree: string; // e.g., 'Graduate', '12th Pass', '10th Pass'
  streams?: string[]; // e.g., ['Science', 'Commerce', 'Arts', 'Engineering']
  minPercentage?: number;
  description: string;
}

export interface PhysicalCriteria {
  heightMin?: {
    male: number; // in cm
    female: number; // in cm
  };
  chestMin?: {
    male: number; // in cm (unexpanded)
    expandedMale?: number; // in cm (expanded)
  };
  description?: string;
}

export interface ExamStage {
  name: string; // e.g., 'Preliminary Examination', 'Main Examination', 'Interview'
  type: 'Objective' | 'Descriptive' | 'Physical' | 'Interview' | 'Practical';
  durationMinutes: number;
  totalMarks: number;
}

export interface Exam {
  id: string;
  slug: string;
  name: string; // e.g., 'UPSC CSE', 'SSC CGL', 'IBPS PO'
  fullName: string; // e.g., 'Union Public Service Commission Civil Services Examination'
  conductingBody: string; // e.g., 'UPSC', 'SSC', 'IBPS'
  officialUrl: string;
  category: 'Civil Services' | 'Defense' | 'Banking' | 'Railways' | 'SSC' | 'State PSC';
  ageLimit: AgeLimit;
  education: EducationCriteria;
  physical?: PhysicalCriteria;
  stages: ExamStage[];
  status: 'Upcoming' | 'Active' | 'Completed' | 'Delayed';
  notificationDate?: string;
  applicationStartDate?: string;
  applicationEndDate?: string;
}

export interface ExamSEODB {
  slug: string;
  examName: string;
  examBoard: string;
  releaseDate: string;
  generalMaxAge: number;
  generalMinAge: number;
  obcRelaxationYears: number;
  scstRelaxationYears: number;
  photoMaxKb: number;
  photoDimensions: string;
  signatureMaxKb: number;
  signatureDimensions: string;
}
