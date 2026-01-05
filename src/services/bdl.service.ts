import api, { getErrorMessage } from '@/lib/api';
import { BDL_ROUTES } from '@/config/api.routes';
import {
  BDLPost,
  BDLCalendarResponse,
  CreateBDLPostDTO,
  UpdateBDLPostDTO,
  BDLTodayStatus,
  BDLStats,
  BDLFeedResponse,
} from '@/types/bdl.types';

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
 * BDL Service
 * Handles all BDL-related API calls
 */
class BDLService {
  /**
   * Get public BDL feed
   */
  async getFeed(page: number = 1, limit: number = 20): Promise<BDLFeedResponse> {
    try {
      const response = await api.get<PaginatedApiResponse<BDLPost>>(BDL_ROUTES.FEED, {
        params: { page, limit },
      });
      return {
        data: response.data.data,
        pagination: response.data.pagination,
      };
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Get user's BDL calendar
   */
  async getUserCalendar(
    userId: string,
    month?: number,
    year?: number
  ): Promise<BDLCalendarResponse> {
    try {
      const params: Record<string, number> = {};
      if (month) params.month = month;
      if (year) params.year = year;

      const response = await api.get<ApiResponse<BDLCalendarResponse>>(
        BDL_ROUTES.CALENDAR(userId),
        { params }
      );
      return response.data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Get posts by date
   */
  async getPostsByDate(date: string): Promise<BDLPost[]> {
    try {
      const response = await api.get<ApiResponse<BDLPost[]>>(
        BDL_ROUTES.POSTS_BY_DATE(date)
      );
      return response.data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Get specific BDL post
   */
  async getPost(userId: string, date: string): Promise<BDLPost> {
    try {
      const response = await api.get<ApiResponse<BDLPost>>(
        BDL_ROUTES.GET_POST(userId, date)
      );
      return response.data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Create BDL post
   */
  async createPost(data: CreateBDLPostDTO): Promise<BDLPost> {
    try {
      const response = await api.post<ApiResponse<BDLPost>>(BDL_ROUTES.CREATE, data);
      return response.data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Update BDL post
   */
  async updatePost(date: string, data: UpdateBDLPostDTO): Promise<BDLPost> {
    try {
      const response = await api.put<ApiResponse<BDLPost>>(
        BDL_ROUTES.UPDATE(date),
        data
      );
      return response.data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Delete BDL post
   */
  async deletePost(date: string): Promise<void> {
    try {
      await api.delete(BDL_ROUTES.DELETE(date));
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Get my BDL calendar
   */
  async getMyCalendar(month?: number, year?: number): Promise<BDLCalendarResponse> {
    try {
      const params: Record<string, number> = {};
      if (month) params.month = month;
      if (year) params.year = year;

      const response = await api.get<ApiResponse<BDLCalendarResponse>>(
        BDL_ROUTES.MY_CALENDAR,
        { params }
      );
      return response.data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Check today's BDL status
   */
  async checkTodayStatus(): Promise<BDLTodayStatus> {
    try {
      const response = await api.get<ApiResponse<BDLTodayStatus>>(
        BDL_ROUTES.CHECK_TODAY
      );
      return response.data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Get BDL statistics
   */
  async getStats(): Promise<BDLStats> {
    try {
      const response = await api.get<ApiResponse<BDLStats>>(BDL_ROUTES.STATS);
      return response.data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Like/unlike a BDL post
   */
  async likePost(userId: string, date: string): Promise<BDLPost & { isLiked: boolean }> {
    try {
      const response = await api.post<ApiResponse<BDLPost & { isLiked: boolean }>>(
        BDL_ROUTES.LIKE(userId, date)
      );
      return response.data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }
}

// Export singleton instance
export const bdlService = new BDLService();

export default bdlService;