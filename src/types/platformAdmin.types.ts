/**
 * Platform Admin Types
 * Types for platform admin API responses and data structures
 */

// Platform dashboard statistics
export interface PlatformDashboardStats {
  users: {
    total: number;
    active: number;
    new: number;
    premium: number;
  };
  cafes: {
    total: number;
    active: number;
    new: number;
  };
  engagement: {
    totalStamps: number;
    totalRedemptions: number;
    totalReviews: number;
    totalBDLPosts: number;
  };
  revenue: {
    estimatedTotal: number;
    averagePerUser: number;
  };
}

// System health status
export type HealthStatus = 'healthy' | 'degraded' | 'down';

export interface SystemHealth {
  database: HealthStatus;
  api: HealthStatus;
  cache: HealthStatus;
  uptime: number;
  version: string;
  timestamp: string;
}

// Platform statistics
export interface PlatformStats {
  totalUsers: number;
  totalCafes: number;
  totalStamps: number;
  totalReviews: number;
  averageRating: number;
}

// User data from platform admin
export interface PlatformUser {
  id: string;
  username: string;
  email: string;
  role: 'USER' | 'CAFE_ADMIN' | 'PLATFORM_ADMIN';
  membershipType: string;
  isActive: boolean;
  isEmailVerified: boolean;
  lastLogin: string | null;
  createdAt: string;
  _count: {
    stamps: number;
    cafeCards: number;
  };
}

// Cafe admin assignment
export interface CafeAdmin {
  id: string;
  userId: string;
  cafeId: string;
  canManageStaff: boolean;
  canViewAnalytics: boolean;
  canManagePromotions: boolean;
  createdAt: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
  cafe: {
    id: string;
    name: string;
    address?: string;
  };
}

// Activity log entry
export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

// DTOs for API calls
export interface AssignCafeAdminDTO {
  userId: string;
  cafeId: string;
  canManageStaff?: boolean;
  canViewAnalytics?: boolean;
  canManagePromotions?: boolean;
}

export interface UpdateUserRoleDTO {
  role: 'USER' | 'CAFE_ADMIN' | 'PLATFORM_ADMIN';
}

// Pagination response
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

// Filter options for users
export interface UserFilters {
  role?: 'USER' | 'CAFE_ADMIN' | 'PLATFORM_ADMIN';
  membershipType?: string;
  isActive?: boolean;
  search?: string;
}