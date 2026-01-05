// User roles enum
export enum UserRole {
  USER = 'USER',
  CAFE_ADMIN = 'CAFE_ADMIN',
  PLATFORM_ADMIN = 'PLATFORM_ADMIN',
}

// Membership types enum
export enum MembershipType {
  FREE = 'FREE',
  PREMIUM = 'PREMIUM',
  ENTERPRISE = 'ENTERPRISE',
}

// User interface
export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  membershipType: MembershipType;
  profileImageUrl?: string;
  isActive?: boolean;
  isEmailVerified?: boolean;
  hasCompletedOnboarding?: boolean;
  createdAt?: string;
}

// Auth tokens interface
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

// Login request DTO
export interface LoginDTO {
  email: string;
  password: string;
}

// Login response
export interface LoginResponse {
  success: boolean;
  data: {
    user: User;
    tokens: AuthTokens;
  };
  message: string;
}

// Current user response
export interface CurrentUserResponse {
  success: boolean;
  data: User;
  message: string;
}

// Logout response
export interface LogoutResponse {
  success: boolean;
  data: null;
  message: string;
}

// Generic API response
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}