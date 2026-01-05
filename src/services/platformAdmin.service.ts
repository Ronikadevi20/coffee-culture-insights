import api, { getErrorMessage } from '@/lib/api';
import { PLATFORM_ADMIN_ROUTES } from '@/config/api.routes';
import {
  PlatformDashboardStats,
  SystemHealth,
  PlatformStats,
  PlatformUser,
  CafeAdmin,
  ActivityLog,
  AssignCafeAdminDTO,
  UpdateUserRoleDTO,
  PaginatedResponse,
  UserFilters,
} from '@/types/platformAdmin.types';

// Generic API response type
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

// Paginated API response type
interface PaginatedApiResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
  message: string;
}

/**
 * Platform Admin Service
 * Handles all platform admin API calls
 */
class PlatformAdminService {
  /**
   * Get platform dashboard statistics
   */
  async getDashboard(): Promise<PlatformDashboardStats> {
    try {
      const response = await api.get<ApiResponse<PlatformDashboardStats>>(
        PLATFORM_ADMIN_ROUTES.DASHBOARD
      );
      return response.data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Get platform statistics summary
   */
  async getStats(): Promise<PlatformStats> {
    try {
      const response = await api.get<ApiResponse<PlatformStats>>(
        PLATFORM_ADMIN_ROUTES.STATS
      );
      return response.data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Get system health status
   */
  async getSystemHealth(): Promise<SystemHealth> {
    try {
      const response = await api.get<ApiResponse<SystemHealth>>(
        PLATFORM_ADMIN_ROUTES.HEALTH
      );
      return response.data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Get detailed system health with metrics
   */
  async getDetailedSystemHealth(): Promise<any> {
    try {
      const response = await api.get<ApiResponse<any>>(
        PLATFORM_ADMIN_ROUTES.HEALTH_DETAILED
      );
      return response.data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Get recent activity logs
   */
  async getRecentActivity(limit: number = 50): Promise<ActivityLog[]> {
    try {
      const response = await api.get<ApiResponse<ActivityLog[]>>(
        PLATFORM_ADMIN_ROUTES.ACTIVITY,
        { params: { limit } }
      );
      return response.data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Get all users with pagination and filters
   */
  async getUsers(
    page: number = 1,
    limit: number = 20,
    filters?: UserFilters
  ): Promise<PaginatedResponse<PlatformUser>> {
    try {
      const params: Record<string, string | number | boolean> = { page, limit };
      
      if (filters?.role) params.role = filters.role;
      if (filters?.membershipType) params.membershipType = filters.membershipType;
      if (filters?.isActive !== undefined) params.isActive = filters.isActive;
      if (filters?.search) params.search = filters.search;

      const response = await api.get<PaginatedApiResponse<PlatformUser>>(
        PLATFORM_ADMIN_ROUTES.USERS,
        { params }
      );
      
      return {
        data: response.data.data,
        pagination: response.data.pagination,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Update user role
   */
  async updateUserRole(userId: string, data: UpdateUserRoleDTO): Promise<PlatformUser> {
    try {
      const response = await api.put<ApiResponse<PlatformUser>>(
        PLATFORM_ADMIN_ROUTES.USER_ROLE(userId),
        data
      );
      return response.data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Deactivate user
   */
  async deactivateUser(userId: string): Promise<PlatformUser> {
    try {
      const response = await api.post<ApiResponse<PlatformUser>>(
        PLATFORM_ADMIN_ROUTES.USER_DEACTIVATE(userId)
      );
      return response.data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Activate user
   */
  async activateUser(userId: string): Promise<PlatformUser> {
    try {
      const response = await api.post<ApiResponse<PlatformUser>>(
        PLATFORM_ADMIN_ROUTES.USER_ACTIVATE(userId)
      );
      return response.data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Get cafe admins list
   */
  async getCafeAdmins(
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<CafeAdmin>> {
    try {
      const response = await api.get<PaginatedApiResponse<CafeAdmin>>(
        PLATFORM_ADMIN_ROUTES.CAFE_ADMINS,
        { params: { page, limit } }
      );
      
      return {
        data: response.data.data,
        pagination: response.data.pagination,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Assign cafe admin
   */
  async assignCafeAdmin(data: AssignCafeAdminDTO): Promise<CafeAdmin> {
    try {
      const response = await api.post<ApiResponse<CafeAdmin>>(
        PLATFORM_ADMIN_ROUTES.CAFE_ADMINS,
        data
      );
      return response.data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Remove cafe admin
   */
  async removeCafeAdmin(userId: string, cafeId: string): Promise<void> {
    try {
      await api.delete(PLATFORM_ADMIN_ROUTES.REMOVE_CAFE_ADMIN(userId, cafeId));
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }
}

// Export singleton instance
export const platformAdminService = new PlatformAdminService();

export default platformAdminService;