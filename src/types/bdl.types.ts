/**
 * BDL (BeReal Daily Log) Types
 * Types for BDL-related API responses and data structures
 */

// Privacy levels for BDL posts
export type BDLPrivacyLevel = 'PUBLIC' | 'FRIENDS' | 'PRIVATE';

// BDL Post response
export interface BDLPost {
  id: string;
  userId: string;
  date: string;
  isUnlocked: boolean;
  imageUrl?: string;
  caption?: string;
  location?: string;
  cafeId?: string;
  privacyLevel: BDLPrivacyLevel;
  drinkTag?: string;
  likes: number;
  createdAt: string;
  updatedAt: string;
  stampCollectedAt?: string;
  user?: {
    id: string;
    username: string;
    profileImageUrl?: string;
  };
  cafe?: {
    id: string;
    name: string;
  };
  isLiked?: boolean;
  isOwn?: boolean;
}

// BDL Calendar response (date -> post mapping)
export interface BDLCalendarResponse {
  [date: string]: BDLPost;
}

// Create BDL post DTO
export interface CreateBDLPostDTO {
  imageUrl?: string;
  caption?: string;
  location?: string;
  cafeId?: string;
  privacyLevel?: BDLPrivacyLevel;
  drinkTag?: string;
}

// Update BDL post DTO
export interface UpdateBDLPostDTO {
  imageUrl?: string;
  caption?: string;
  location?: string;
  cafeId?: string;
  privacyLevel?: BDLPrivacyLevel;
  drinkTag?: string;
}

// BDL today status
export interface BDLTodayStatus {
  canPost: boolean;
  isUnlocked: boolean;
  hasPosted: boolean;
  date: string;
}

// BDL user statistics
export interface BDLStats {
  totalPosts: number;
  totalLikes: number;
  postsThisMonth: number;
  unlockedDays: number;
}

// BDL feed paginated response
export interface BDLFeedResponse {
  data: BDLPost[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

// BDL Analytics specific types
export interface BDLHourlyData {
  hour: string;
  posts: number;
}

export interface BDLWeekdayData {
  day: string;
  posts: number;
}

export interface BDLTopCafe {
  name: string;
  posts: number;
  likes: number;
}

export interface BDLRecentPost {
  id: string;
  cafe: string;
  time: string;
  visibility: 'public' | 'friends' | 'private';
  likes: number;
  userId: string;
  username: string;
}