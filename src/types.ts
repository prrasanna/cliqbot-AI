
export interface Message {
  sender: string;
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
}

export interface LeadInfo {
  name: string;
  company: string;
  email: string;
  phone: string;
  score: number; // 0-100
  status: 'New' | 'Qualified' | 'Negotiation' | 'Closed';
  summary: string;
}

export interface Note {
  id: string;
  content: string;
  createdAt: Date;
}

export interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  participants: string[];
}

export interface Suggestion {
  label: string;
  action: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  jobTitle: string;
  avatarInitials: string;
  status: 'Available' | 'Busy' | 'Away' | 'Do Not Disturb';
  bio: string;
  notifications: {
    email: boolean;
    push: boolean;
  };
  theme: 'light' | 'dark' | 'system';
}

export type WidgetTab = 'lead' | 'notes' | 'schedule';
