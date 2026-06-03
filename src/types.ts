export interface Notice {
  id: string;
  title: string;
  content: string;
  date: string;
  category: 'water' | 'gas' | 'rent' | 'client' | 'general';
  priority: 'low' | 'medium' | 'high';
}

export interface Meter {
  id: string;
  slNo: string;
  name: string;
  customerNo: string;
  meterNo: string;
  location: string;
}

export interface Post {
  id: string;
  content: string;
  date: string;
  likes: number;
}

export interface FamilyProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  floor: string;
  bio: string;
  joinedDate: string;
  status: 'pending' | 'approved' | 'rejected';
  twitterHandle?: string;
  fbLink?: string;
  photoSeed: number; // For rendering high-quality stylized avatars
  posts: Post[];
}

export interface UserMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  date: string;
  read: boolean;
}

export interface EmailLog {
  id: string;
  toEmail: string;
  subject: string;
  body: string;
  date: string;
  status: 'success' | 'failed';
}

export interface AdminStats {
  pendingApprovals: number;
  totalMembers: number;
  totalNotices: number;
  unreadMessages: number;
}
