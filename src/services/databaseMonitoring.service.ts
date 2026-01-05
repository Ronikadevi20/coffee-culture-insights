/**
 * Database Monitoring Service
 * Handles database health, logs, and performance API calls
 */

import api, { getErrorMessage } from '@/lib/api';
import { DATABASE_ROUTES } from '@/config/api.routes';
import {
  DatabaseLogsResponse,
  DatabasePerformanceMetrics,
  SlowQuery,
  DatabaseError,
  QueryPerformanceData,
  ConnectionData,
  DatabaseHealthStatus,
} from '@/types/databaseMonitoring.types';

// API Response wrapper
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

class DatabaseMonitoringService {
  /**
   * Get database logs with filtering
   */
  async getDatabaseLogs(
    level?: 'info' | 'warning' | 'error',
    limit: number = 100,
    offset: number = 0
  ): Promise<DatabaseLogsResponse> {
    try {
      const params: Record<string, string> = {
        limit: limit.toString(),
        offset: offset.toString(),
      };
      
      if (level) {
        params.level = level;
      }
      
      const response = await api.get<ApiResponse<DatabaseLogsResponse>>(DATABASE_ROUTES.LOGS, {
        params,
      });
      return response.data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Get database performance metrics
   */
  async getPerformanceMetrics(): Promise<DatabasePerformanceMetrics> {
    try {
      const response = await api.get<ApiResponse<DatabasePerformanceMetrics>>(DATABASE_ROUTES.PERFORMANCE);
      return response.data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Get slow queries
   */
  async getSlowQueries(limit: number = 20): Promise<SlowQuery[]> {
    try {
      const response = await api.get<ApiResponse<SlowQuery[]>>(DATABASE_ROUTES.SLOW_QUERIES, {
        params: { limit: limit.toString() },
      });
      return response.data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Get database errors
   */
  async getDatabaseErrors(limit: number = 50): Promise<DatabaseError[]> {
    try {
      const response = await api.get<ApiResponse<DatabaseError[]>>(DATABASE_ROUTES.ERRORS, {
        params: { limit: limit.toString() },
      });
      return response.data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Get query performance by table
   */
  async getQueryPerformance(): Promise<QueryPerformanceData[]> {
    try {
      const response = await api.get<ApiResponse<QueryPerformanceData[]>>(DATABASE_ROUTES.QUERY_PERFORMANCE);
      return response.data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Get connection data over time
   */
  async getConnectionData(): Promise<ConnectionData[]> {
    try {
      const response = await api.get<ApiResponse<ConnectionData[]>>(DATABASE_ROUTES.CONNECTIONS);
      return response.data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Get database health status
   */
  async getHealthStatus(): Promise<DatabaseHealthStatus> {
    try {
      const response = await api.get<ApiResponse<DatabaseHealthStatus>>(DATABASE_ROUTES.HEALTH);
      return response.data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }
}

export const databaseMonitoringService = new DatabaseMonitoringService();
export default databaseMonitoringService;