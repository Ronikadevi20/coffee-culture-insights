/**
 * Users Types
 * Types for user profile, preferences, and stats
 */

// User Role enum
export type UserRole = 'USER' | 'CAFE_ADMIN' | 'PLATFORM_ADMIN';

// Membership Type enum
export type MembershipType = 'FREE' | 'PREMIUM' | 'VIP';

// Update User DTO
export interface UpdateUserDTO {
  username?: string;
  profileImageUrl?: string;
}

// Update Preferences DTO
export interface UpdatePreferencesDTO {
  notificationEnabled?: boolean;
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  smsNotifications?: boolean;
  language?: string;
  theme?: string;
  currency?: string;
  distanceUnit?: string;
}

// User Profile Response
export interface UserProfileResponse {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  membershipType: MembershipType;
  profileImageUrl?: string;
  isActive: boolean;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  stats?: {
    totalStamps: number;
    completedCards: number;
    visitedCafes: number;
    bdlPosts: number;
  };
}

// User Stats Response
export interface UserStatsResponse {
  totalStamps: number;
  completedCards: number;
  visitedCafes: number;
  bdlPosts: number;
  totalReviews: number;
  savedCafes: number;
  currentMonthVisits: number;
}

// User Preferences
export interface UserPreferences {
  id: string;
  userId: string;
  notificationEnabled: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  language: string;
  theme: 'light' | 'dark' | 'auto';
  currency: string;
  distanceUnit: 'km' | 'mi';
  createdAt: string;
  updatedAt: string;
}

// Saved Cafe
export interface SavedCafe {
  id: string;
  savedAt: string;
  cafe: {
    id: string;
    name: string;
    address: string;
    city: string;
    latitude?: number;
    longitude?: number;
    imageUrl?: string;
    isActive: boolean;
    _count: {
      reviews: number;
    };
  };
}

// Cafe Card
export interface CafeCard {
  id: string;
  userId: string;
  cafeId: string;
  totalStamps: number;
  isCompleted: boolean;
  completedAt?: string;
  redeemedAt?: string;
  createdAt: string;
  updatedAt: string;
  cafe: {
    id: string;
    name: string;
    imageUrl?: string;
    address: string;
    city: string;
  };
}

// Stamp History Entry
export interface StampHistoryEntry {
  id: string;
  userId: string;
  cafeId: string;
  collectedAt: string;
  metadata?: Record<string, unknown>;
  cafe: {
    id: string;
    name: string;
    imageUrl?: string;
    address: string;
    city: string;
  };
}