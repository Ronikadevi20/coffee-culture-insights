/**
 * AI Insights Service
 * Handles AI predictions, anomalies, and recommendations API calls
 */

import api, { getErrorMessage } from '@/lib/api';
import { AI_INSIGHTS_ROUTES } from '@/config/api.routes';
import {
  AIInsightsResponse,
  DetailedPredictionsResponse,
  ChurnRiskUser,
  AIAnalyticsTimeframe,
} from '@/types/aiInsights.types';

// API Response wrapper
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

/**
 * Convert timeframe to query params
 */
const timeframeToParams = (timeframe: AIAnalyticsTimeframe): Record<string, string> => {
  const params: Record<string, string> = {
    timeframe: timeframe.timeframe,
  };
  
  if (timeframe.startDate) {
    params.startDate = timeframe.startDate;
  }
  if (timeframe.endDate) {
    params.endDate = timeframe.endDate;
  }
  
  return params;
};

class AIInsightsService {
  /**
   * Get comprehensive AI insights
   */
  async getAIInsights(timeframe: AIAnalyticsTimeframe = { timeframe: 'week' }): Promise<AIInsightsResponse> {
    try {
      const response = await api.get<ApiResponse<AIInsightsResponse>>(AI_INSIGHTS_ROUTES.INSIGHTS, {
        params: timeframeToParams(timeframe),
      });
      return response.data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Get detailed predictions
   */
  async getDetailedPredictions(timeframe: AIAnalyticsTimeframe = { timeframe: 'month' }): Promise<DetailedPredictionsResponse> {
    try {
      const response = await api.get<ApiResponse<DetailedPredictionsResponse>>(AI_INSIGHTS_ROUTES.PREDICTIONS, {
        params: timeframeToParams(timeframe),
      });
      return response.data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }

  /**
   * Get users at risk of churning
   */
  async getChurnRiskUsers(limit: number = 50): Promise<ChurnRiskUser[]> {
    try {
      const response = await api.get<ApiResponse<ChurnRiskUser[]>>(AI_INSIGHTS_ROUTES.CHURN_RISK, {
        params: { limit: limit.toString() },
      });
      return response.data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }
}

export const aiInsightsService = new AIInsightsService();
export default aiInsightsService;