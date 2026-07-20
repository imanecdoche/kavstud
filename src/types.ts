export type UserRole = 'teacher' | 'student';

export interface UserProfile {
  uid: string;
  fullName: string;
  email: string;
  role: UserRole;
  createdAt: any; // Firestore Timestamp
  updatedAt?: any; // Firestore Timestamp
  phone?: string;
  photoURL?: string;
  dateOfBirth?: string; // YYYY-MM-DD format
  age?: number;
  gender?: string;
  bio?: string;
  language?: 'English' | 'Bahasa Indonesia';
  theme?: 'Light' | 'Dark' | 'System';
  notifications?: {
    email: boolean;
    assignment: boolean;
    score: boolean;
  };
}

export interface Assignment {
  id: string;
  title: string;
  question: string;
  studentId: string;
  studentName: string;
  teacherId: string;
  teacherName: string;
  createdAt: any; // Firestore Timestamp
}

export interface Submission {
  id: string;
  assignmentId: string;
  assignmentTitle: string;
  studentId: string;
  studentName: string;
  answer: string;
  status: 'submitted' | 'graded';
  score: number | null;
  feedback: string | null;
  submittedAt: any; // Firestore Timestamp
  gradedAt: any; // Firestore Timestamp | null
}

export interface ChangelogEntry {
  version: string;
  date: string;
  changes: {
    type: 'add' | 'change' | 'remove';
    text: string;
  }[];
}

// Design Token Showcase compatibility types
export interface ColorToken {
  name: string;
  variable: string;
  hex: string;
  description: string;
  category: 'primary' | 'secondary' | 'functional' | 'neutral';
}

export interface TypographyToken {
  name: string;
  specs: string;
  usage: string;
  example: string;
}

export interface RadiusToken {
  name: string;
  value: string;
  className: string;
  description: string;
}

export interface ShadowToken {
  name: string;
  value: string;
  className: string;
  description: string;
}

export type ActiveTab = 
  | 'overview' 
  | 'tokens' 
  | 'buttons-inputs' 
  | 'components' 
  | 'tables' 
  | 'forms' 
  | 'assignments' 
  | 'layouts' 
  | 'settings';
