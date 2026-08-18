export interface CurrentUser {
  id: string;
  name: string;
  role: string;
  badges?: string[];
}

export interface PostReaction {
  userId: string;
  userName?: string; 
  type: 'like' | 'love' | 'haha' | 'wow' | 'sad' | 'angry';
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  content: string;
  courseRoomId: string;
  isApproved: boolean;
  isDraft?: boolean;       // NEW: Keeps TypeScript happy
  isEdited?: boolean;      // NEW: Fixes your Vercel error!
  editedAt?: any;          // NEW: Keeps TypeScript happy
  isPinned?: boolean;
  scheduledFor?: number;
  imageUrl?: string;
  videoUrl?: string;
  audioUrl?: string;
  isRepost?: boolean;
  originalAuthor?: string;
  createdAt: any;
  reactions?: PostReaction[];
  comments?: number;
}