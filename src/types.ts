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
  classType?: 'PRIVATE' | 'CIRCLE';
  circleId?: string | null;
}

export interface Assignment {
  id: string;
  title: string;
  question: string;
  studentId?: string; // Optional if assigned to Circle
  studentName?: string; // Optional if assigned to Circle
  teacherId: string;
  teacherName: string;
  createdAt: any; // Firestore Timestamp
  assignmentType?: 'short_answer' | 'multiple_choice' | 'multi_short_answer';
  deadline?: string; // YYYY-MM-DD
  status?: 'sent' | 'review' | 'completed' | 'remedial' | 'expired';
  choices?: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctChoice?: 'A' | 'B' | 'C' | 'D';
  subQuestions?: string[];
  assignmentTarget?: 'INDIVIDUAL' | 'CIRCLE';
  targetId?: string; // studentId or circleId
}

export interface Circle {
  id: string; // circleId
  teacherId: string;
  name: string;
  description?: string;
  capacity: number; // default: 5
  createdAt: any; // Firestore Timestamp
  updatedAt?: any; // Firestore Timestamp
  isArchived?: boolean; // default: false
}

export interface Submission {
  id: string;
  assignmentId: string;
  assignmentTitle: string;
  studentId: string;
  studentName: string;
  answer: string;
  answers?: string[];
  selectedChoice?: 'A' | 'B' | 'C' | 'D';
  status: 'submitted' | 'graded' | 'remedial';
  reviewStatus?: 'correct' | 'incorrect' | 'remedial';
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
