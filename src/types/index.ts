export interface User {
  id: string;
  name: string;
  email: string;
  profilePicture?: string;
}

export interface Application {
  id: string;
  userId: string;
  collegeName: string;
  program: string;
  status: 'draft' | 'submitted' | 'under-review' | 'accepted' | 'rejected';
  submittedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  personalInfo: PersonalInfo;
  academicInfo: AcademicInfo;
  documents: Document[];
  essays: Essay[];
  completionPercentage: number;
}

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: Address;
  citizenship: string;
  emergencyContact: EmergencyContact;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface AcademicInfo {
  currentSchool: string;
  gpa: number;
  expectedGraduation: string;
  coursework: string[];
  honors: string[];
  extracurriculars: string[];
}

export interface Document {
  id: string;
  name: string;
  type: 'transcript' | 'recommendation' | 'certificate' | 'essay' | 'other';
  fileName: string;
  fileSize: number;
  uploadedAt: Date;
  url: string;
}

export interface Essay {
  id: string;
  prompt: string;
  content: string;
  wordCount: number;
  maxWords: number;
}

export interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  isTyping?: boolean;
}

export interface VideoProgress {
  videoId: string;
  currentTime: number;
  duration: number;
  completed: boolean;
  watchedPercentage: number;
}

export interface VideoNote {
  id: string;
  videoId: string;
  timestamp: number;
  content: string;
  createdAt: Date;
}

export interface SearchResult {
  id: string;
  type: 'application' | 'video' | 'document';
  title: string;
  description: string;
  url: string;
  relevanceScore: number;
}