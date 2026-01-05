/**
 * AI Insights Hooks
 * React Query hooks for AI predictions, anomalies, and recommendations
 */

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { aiInsightsService } from '@/services/aiInsights.service';
import {
  AIInsightsResponse,
  DetailedPredictionsResponse,
  ChurnRiskUser,
  AIAnalyticsTimeframe,
} from '@/types/aiInsights.types';

// Query keys
export const aiInsightsKeys = {
  all: ['aiInsights'] as const,
  insights: (timeframe: string) => [...aiInsightsKeys.all, 'insights', timeframe] as const,
  predictions: (timeframe: string) => [...aiInsightsKeys.all, 'predictions', timeframe] as const,
  churnRisk: (limit: number) => [...aiInsightsKeys.all, 'churnRisk', limit] as const,
};

/**
 * Hook to fetch comprehensive AI insights
 */
export const useAIInsights = (
  timeframe: AIAnalyticsTimeframe = { timeframe: 'week' },
  options?: Omit<UseQueryOptions<AIInsightsResponse, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: aiInsightsKeys.insights(timeframe.timeframe),
    queryFn: () => aiInsightsService.getAIInsights(timeframe),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

/**
 * Hook to fetch detailed predictions
 */
export const useDetailedPredictions = (
  timeframe: AIAnalyticsTimeframe = { timeframe: 'month' },
  options?: Omit<UseQueryOptions<DetailedPredictionsResponse, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: aiInsightsKeys.predictions(timeframe.timeframe),
    queryFn: () => aiInsightsService.getDetailedPredictions(timeframe),
    staleTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });
};

/**
 * Hook to fetch churn risk users
 */
export const useChurnRiskUsers = (
  limit: number = 50,
  options?: Omit<UseQueryOptions<ChurnRiskUser[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: aiInsightsKeys.churnRisk(limit),
    queryFn: () => aiInsightsService.getChurnRiskUsers(limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

/**
 * Combined hook for all AI insights data
 */
export const useAllAIInsights = (timeframe: AIAnalyticsTimeframe = { timeframe: 'week' }) => {
  const insights = useAIInsights(timeframe);
  const predictions = useDetailedPredictions({ timeframe: 'month' });
  const churnRisk = useChurnRiskUsers(10);

  const isLoading = insights.isLoading || predictions.isLoading || churnRisk.isLoading;
  const isError = insights.isError || predictions.isError || churnRisk.isError;

  const refetchAll = () => {
    insights.refetch();
    predictions.refetch();
    churnRisk.refetch();
  };

  return {
    insights,
    predictions,
    churnRisk,
    isLoading,
    isError,
    refetchAll,
  };
};