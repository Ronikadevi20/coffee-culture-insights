import api, { getErrorMessage } from '@/lib/api';
import { ANALYTICS_ROUTES } from '@/config/api.routes';
import {
  OverviewStats,
  UserGrowthData,
  CafePerformance,
  PopularTimesData,
  EngagementMetrics,
  RetentionMetrics,
  RevenueInsights,
  BDLVisibilityData,
  AnalyticsTimeframe,
  UserRetentionCurveData,
  ScanFrequencyData,
  DeviceDistributionData,
  HourlyActivityData,
  TopUserData,
  StampsEconomyMetrics,
  WeeklyStampsTrendData,
  StampProgressData,
  RedemptionsByCafeData,
  TopCollectorData,
  EngagementFunnelMetrics,
  PrimaryFunnelData,
  FunnelStageData,
} from '@/types/analytics.types';

// Generic API response type
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

/**
 * Convert timeframe to query params
 */
const timeframeToParams = (timeframe: AnalyticsTimeframe): Record<string, string> => {
  const params: Record<string, string> = {
    timeframe: timeframe.timeframe,
  };
  
  if (timeframe.startDate) {
    params.startDate = timeframe.startDate.toISOString();
  }
  if (timeframe.endDate) {
    params.endDate = timeframe.endDate.toISOString();
  }
  
  return params;
};

/**
 * Analytics Service
 * Handles all analytics-related API calls
 */
class AnalyticsService {
  /**
   * Get overview statistics
   */
  async getOverviewStats(timeframe: AnalyticsTimeframe = { timeframe: 'week' }): Promise<OverviewStats> {
    try {
      const response = await api.get<ApiResponse<OverviewStats>>(ANALYTICS_ROUTES.OVERVIEW, {
        params: timeframeToParams(timeframe),
      });
      return response.data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Get user growth data
   */
  async getUserGrowth(timeframe: AnalyticsTimeframe = { timeframe: 'month' }): Promise<UserGrowthData[]> {
    try {
      const response = await api.get<ApiResponse<UserGrowthData[]>>(ANALYTICS_ROUTES.USER_GROWTH, {
        params: timeframeToParams(timeframe),
      });
      return response.data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Get cafe performance rankings
   */
  async getCafePerformance(
    timeframe: AnalyticsTimeframe = { timeframe: 'week' },
    limit: number = 10
  ): Promise<CafePerformance[]> {
    try {
      const response = await api.get<ApiResponse<CafePerformance[]>>(ANALYTICS_ROUTES.CAFE_PERFORMANCE, {
        params: {
          ...timeframeToParams(timeframe),
          limit: limit.toString(),
        },
      });
      return response.data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Get popular times data
   */
  async getPopularTimes(cafeId?: string): Promise<PopularTimesData[]> {
    try {
      const response = await api.get<ApiResponse<PopularTimesData[]>>(ANALYTICS_ROUTES.POPULAR_TIMES, {
        params: cafeId ? { cafeId } : {},
      });
      return response.data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Get engagement metrics
   */
  async getEngagementMetrics(timeframe: AnalyticsTimeframe = { timeframe: 'week' }): Promise<EngagementMetrics> {
    try {
      const response = await api.get<ApiResponse<EngagementMetrics>>(ANALYTICS_ROUTES.ENGAGEMENT, {
        params: timeframeToParams(timeframe),
      });
      return response.data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Get retention metrics
   */
  async getRetentionMetrics(): Promise<RetentionMetrics> {
    try {
      const response = await api.get<ApiResponse<RetentionMetrics>>(ANALYTICS_ROUTES.RETENTION);
      return response.data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Get revenue insights
   */
  async getRevenueInsights(
    timeframe: AnalyticsTimeframe = { timeframe: 'month' },
    avgDrinkPrice?: number
  ): Promise<RevenueInsights> {
    try {
      const params: Record<string, string> = timeframeToParams(timeframe);
      if (avgDrinkPrice) {
        params.avgDrinkPrice = avgDrinkPrice.toString();
      }
      
      const response = await api.get<ApiResponse<RevenueInsights>>(ANALYTICS_ROUTES.REVENUE, {
        params,
      });
      return response.data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Get platform-wide BDL distribution
   */
  async getBDLDistribution(timeframe: AnalyticsTimeframe = { timeframe: 'week' }): Promise<BDLVisibilityData> {
    try {
      const response = await api.get<ApiResponse<BDLVisibilityData>>(ANALYTICS_ROUTES.BDL_DISTRIBUTION, {
        params: timeframeToParams(timeframe),
      });
      return response.data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  // ==========================================
  // User Analytics Methods
  // ==========================================

  /**
   * Get user retention curve data
   */
  async getUserRetentionCurve(timeframe: AnalyticsTimeframe = { timeframe: 'month' }): Promise<UserRetentionCurveData[]> {
    try {
      const response = await api.get<ApiResponse<UserRetentionCurveData[]>>(ANALYTICS_ROUTES.USER_RETENTION_CURVE, {
        params: timeframeToParams(timeframe),
      });
      return response.data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Get scan frequency distribution
   */
  async getScanFrequency(timeframe: AnalyticsTimeframe = { timeframe: 'week' }): Promise<ScanFrequencyData[]> {
    try {
      const response = await api.get<ApiResponse<ScanFrequencyData[]>>(ANALYTICS_ROUTES.SCAN_FREQUENCY, {
        params: timeframeToParams(timeframe),
      });
      return response.data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Get device distribution (iOS vs Android)
   */
  async getDeviceDistribution(timeframe: AnalyticsTimeframe = { timeframe: 'week' }): Promise<DeviceDistributionData[]> {
    try {
      const response = await api.get<ApiResponse<DeviceDistributionData[]>>(ANALYTICS_ROUTES.DEVICE_DISTRIBUTION, {
        params: timeframeToParams(timeframe),
      });
      return response.data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Get hourly activity data
   */
  async getHourlyActivity(timeframe: AnalyticsTimeframe = { timeframe: 'week' }): Promise<HourlyActivityData[]> {
    try {
      const response = await api.get<ApiResponse<HourlyActivityData[]>>(ANALYTICS_ROUTES.HOURLY_ACTIVITY, {
        params: timeframeToParams(timeframe),
      });
      return response.data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Get top users by engagement
   */
  async getTopUsers(timeframe: AnalyticsTimeframe = { timeframe: 'week' }, limit: number = 5): Promise<TopUserData[]> {
    try {
      const response = await api.get<ApiResponse<TopUserData[]>>(ANALYTICS_ROUTES.TOP_USERS, {
        params: {
          ...timeframeToParams(timeframe),
          limit: limit.toString(),
        },
      });
      return response.data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  // ==========================================
  // Stamps Economy Methods
  // ==========================================

  /**
   * Get stamps economy metrics
   */
  async getStampsEconomyMetrics(timeframe: AnalyticsTimeframe = { timeframe: 'day' }): Promise<StampsEconomyMetrics> {
    try {
      const response = await api.get<ApiResponse<StampsEconomyMetrics>>(ANALYTICS_ROUTES.STAMPS_ECONOMY_METRICS, {
        params: timeframeToParams(timeframe),
      });
      return response.data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Get weekly stamps trend
   */
  async getWeeklyStampsTrend(timeframe: AnalyticsTimeframe = { timeframe: 'week' }): Promise<WeeklyStampsTrendData[]> {
    try {
      const response = await api.get<ApiResponse<WeeklyStampsTrendData[]>>(ANALYTICS_ROUTES.WEEKLY_STAMPS_TREND, {
        params: timeframeToParams(timeframe),
      });
      return response.data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Get stamp progress distribution
   */
  async getStampProgressDistribution(timeframe: AnalyticsTimeframe = { timeframe: 'month' }): Promise<StampProgressData[]> {
    try {
      const response = await api.get<ApiResponse<StampProgressData[]>>(ANALYTICS_ROUTES.STAMP_PROGRESS_DISTRIBUTION, {
        params: timeframeToParams(timeframe),
      });
      return response.data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Get redemptions by cafe
   */
  async getRedemptionsByCafe(
    timeframe: AnalyticsTimeframe = { timeframe: 'month' },
    limit: number = 10
  ): Promise<RedemptionsByCafeData[]> {
    try {
      const response = await api.get<ApiResponse<RedemptionsByCafeData[]>>(ANALYTICS_ROUTES.REDEMPTIONS_BY_CAFE, {
        params: {
          ...timeframeToParams(timeframe),
          limit: limit.toString(),
        },
      });
      return response.data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Get top stamp collectors
   */
  async getTopStampCollectors(
    timeframe: AnalyticsTimeframe = { timeframe: 'month' },
    limit: number = 10
  ): Promise<TopCollectorData[]> {
    try {
      const response = await api.get<ApiResponse<TopCollectorData[]>>(ANALYTICS_ROUTES.TOP_STAMP_COLLECTORS, {
        params: {
          ...timeframeToParams(timeframe),
          limit: limit.toString(),
        },
      });
      return response.data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  // ==========================================
  // Engagement Funnel Methods
  // ==========================================

  /**
   * Get engagement funnel metrics
   */
  async getEngagementFunnelMetrics(timeframe: AnalyticsTimeframe = { timeframe: 'week' }): Promise<EngagementFunnelMetrics> {
    try {
      const response = await api.get<ApiResponse<EngagementFunnelMetrics>>(ANALYTICS_ROUTES.ENGAGEMENT_FUNNEL_METRICS, {
        params: timeframeToParams(timeframe),
      });
      return response.data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Get primary funnel data
   */
  async getPrimaryFunnel(timeframe: AnalyticsTimeframe = { timeframe: 'week' }): Promise<PrimaryFunnelData> {
    try {
      const response = await api.get<ApiResponse<PrimaryFunnelData>>(ANALYTICS_ROUTES.PRIMARY_FUNNEL, {
        params: timeframeToParams(timeframe),
      });
      return response.data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Get onboarding funnel data
   */
  async getOnboardingFunnel(timeframe: AnalyticsTimeframe = { timeframe: 'month' }): Promise<FunnelStageData[]> {
    try {
      const response = await api.get<ApiResponse<FunnelStageData[]>>(ANALYTICS_ROUTES.ONBOARDING_FUNNEL, {
        params: timeframeToParams(timeframe),
      });
      return response.data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }
}

// Export singleton instance
export const analyticsService = new AnalyticsService();

export default analyticsService;