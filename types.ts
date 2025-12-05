export interface UserProfile {
  uid: string;
  displayName: string | null;
  photoURL: string | null;
  votesRemaining: number;
  votedSubmissionIds: string[];
}

export interface Submission {
  id: string;
  title: string;
  description: string;
  prompt: string;
  link: string;
  authorId: string;
  authorName: string;
  authorPhotoURL: string; // AI generated thumbnail image
  voteCount: number;
  voters: string[]; // Array of user IDs who voted
  createdAt: any; // Firestore Timestamp
}

export type SortOption = 'newest' | 'popular';