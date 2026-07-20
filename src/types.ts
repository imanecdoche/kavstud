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

export interface AssignmentSettings {
  allowResubmission: boolean;
  shuffleQuestions: boolean;
  shuffleChoices: boolean;
  requireAll: boolean;
  showScore: boolean;
  autoGradeMC: boolean;
  manualReviewEssay: boolean;
}

export interface Question {
  id: string;
  assignmentId: string;
  order: number;
  type: string; // 'multiple_choice' | 'essay' | 'true_false' | 'matching' | 'fill_blank' | 'listening' | 'speaking' | 'file_upload'
  question: string;
  choices?: string[]; // list of MC choices or matching right list, etc.
  correctAnswer?: string; // correct option (e.g., '0' for A, '1' for B or text)
  answerGuide?: string;
  points: number;
  
  // Dynamic fields for extra types (scalable)
  trueFalseCorrect?: 'true' | 'false';
  matchingPairs?: { left: string; right: string }[];
  fillBlankAnswers?: string[];
  audioUrl?: string;
  speakingPrompt?: string;
  allowedFileTypes?: string[];
}

export interface Assignment {
  id: string;
  title: string;
  question: string; // fallback instructions / old simple assignment question
  studentId?: string; // Optional if assigned to Circle
  studentName?: string; // Optional if assigned to Circle
  teacherId: string;
  teacherName: string;
  createdAt: any; // Firestore Timestamp
  assignmentType?: 'short_answer' | 'multiple_choice' | 'multi_short_answer' | 'lms_composite';
  deadline?: string; // YYYY-MM-DD
  status?: 'sent' | 'review' | 'completed' | 'remedial' | 'expired' | 'draft' | 'published' | 'scheduled';
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
  
  // New Assignment Builder Fields
  description?: string;
  targetType?: 'INDIVIDUAL' | 'CIRCLE';
  settings?: AssignmentSettings;
  totalQuestions?: number;
  totalPoints?: number;
  estimatedDuration?: number; // in minutes
  difficulty?: 'Mudah' | 'Sedang' | 'Sulit';
  updatedAt?: any; // Firestore Timestamp
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
  
  // New Assignment Builder Fields
  answersMap?: {
    [questionId: string]: {
      answer: string; // user's answer text, choice index, or other
      pointsEarned?: number;
      status?: 'correct' | 'incorrect' | 'pending';
      feedback?: string;
    }
  };
  totalPointsEarned?: number;
  totalPossiblePoints?: number;
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
