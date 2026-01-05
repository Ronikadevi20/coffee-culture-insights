/**
 * Users Service
 * Handles user profile, preferences, and stats API calls
 */

import api, { getErrorMessage } from '@/lib/api';
import { USERS_ROUTES } from '@/config/api.routes';
import {
  UserProfileResponse,
  UserStatsResponse,
  UserPreferences,
  UpdateUserDTO,
  UpdatePreferencesDTO,
  SavedCafe,
  CafeCard,
  StampHistoryEntry,
} from '@/types/users.types';

// API Response wrapper
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Paginated response
interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

class UsersService {
  /**
   * Get user profile
   */
  async getProfile(): Promise<UserProfileResponse> {
    try {
      const response = await api.get<ApiResponse<UserProfileResponse>>(USERS_ROUTES.PROFILE);
      return response.data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(data: UpdateUserDTO): Promise<UserProfileResponse> {
    try {
      const response = await api.put<ApiResponse<UserProfileResponse>>(USERS_ROUTES.PROFILE, data);
      return response.data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Get user statistics
   */
  async getStats(): Promise<UserStatsResponse> {
    try {
      const response = await api.get<ApiResponse<UserStatsResponse>>(USERS_ROUTES.STATS);
      return response.data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Get user preferences
   */
  async getPreferences(): Promise<UserPreferences> {
    try {
      const response = await api.get<ApiResponse<UserPreferences>>(USERS_ROUTES.PREFERENCES);
      return response.data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Update user preferences
   */
  async updatePreferences(data: UpdatePreferencesDTO): Promise<UserPreferences> {
    try {
      const response = await api.put<ApiResponse<UserPreferences>>(USERS_ROUTES.PREFERENCES, data);
      return response.data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Get saved cafes
   */
  async getSavedCafes(page: number = 1, limit: number = 20): Promise<PaginatedResponse<SavedCafe>> {
    try {
      const response = await api.get<ApiResponse<PaginatedResponse<SavedCafe>>>(USERS_ROUTES.SAVED_CAFES, {
        params: { page: page.toString(), limit: limit.toString() },
      });
      return response.data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Save a cafe
   */
  async saveCafe(cafeId: string): Promise<SavedCafe> {
    try {
      const response = await api.post<ApiResponse<SavedCafe>>(USERS_ROUTES.SAVE_CAFE(cafeId));
      return response.data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Unsave a cafe
   */
  async unsaveCafe(cafeId: string): Promise<void> {
    try {
      await api.delete(USERS_ROUTES.UNSAVE_CAFE(cafeId));
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Get user's cafe cards
   */
  async getCafeCards(): Promise<CafeCard[]> {
    try {
      const response = await api.get<ApiResponse<CafeCard[]>>(USERS_ROUTES.CAFE_CARDS);
      return response.data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Get stamp history
   */
  async getStampHistory(page: number = 1, limit: number = 20): Promise<PaginatedResponse<StampHistoryEntry>> {
    try {
      const response = await api.get<ApiResponse<PaginatedResponse<StampHistoryEntry>>>(USERS_ROUTES.STAMP_HISTORY, {
        params: { page: page.toString(), limit: limit.toString() },
      });
      return response.data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Search user by email
   */
  async searchUserByEmail(email: string): Promise<{ id: string; username: string; email: string; profileImageUrl?: string }> {
    try {
      const response = await api.get<ApiResponse<{ id: string; username: string; email: string; profileImageUrl?: string }>>(USERS_ROUTES.SEARCH, {
        params: { email },
      });
      return response.data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Delete user account
   */
  async deleteAccount(): Promise<void> {
    try {
      await api.delete(USERS_ROUTES.DELETE_ACCOUNT);
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }
}

export const usersService = new UsersService();
export default usersService;