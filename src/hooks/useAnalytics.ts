import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { analyticsService } from '@/services/analytics.service';
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

// Query keys for caching
export const analyticsKeys = {
  all: ['analytics'] as const,
  overview: (timeframe: string) => [...analyticsKeys.all, 'overview', timeframe] as const,
  userGrowth: (timeframe: string) => [...analyticsKeys.all, 'userGrowth', timeframe] as const,
  cafePerformance: (timeframe: string, limit: number) => 
    [...analyticsKeys.all, 'cafePerformance', timeframe, limit] as const,
  popularTimes: (cafeId?: string) => [...analyticsKeys.all, 'popularTimes', cafeId] as const,
  engagement: (timeframe: string) => [...analyticsKeys.all, 'engagement', timeframe] as const,
  retention: () => [...analyticsKeys.all, 'retention'] as const,
  revenue: (timeframe: string) => [...analyticsKeys.all, 'revenue', timeframe] as const,
  bdlDistribution: (timeframe: string) => [...analyticsKeys.all, 'bdlDistribution', timeframe] as const,
  // User analytics keys
  userRetentionCurve: (timeframe: string) => [...analyticsKeys.all, 'userRetentionCurve', timeframe] as const,
  scanFrequency: (timeframe: string) => [...analyticsKeys.all, 'scanFrequency', timeframe] as const,
  deviceDistribution: (timeframe: string) => [...analyticsKeys.all, 'deviceDistribution', timeframe] as const,
  hourlyActivity: (timeframe: string) => [...analyticsKeys.all, 'hourlyActivity', timeframe] as const,
  topUsers: (timeframe: string, limit: number) => [...analyticsKeys.all, 'topUsers', timeframe, limit] as const,
  // Stamps economy keys
  stampsEconomyMetrics: (timeframe: string) => [...analyticsKeys.all, 'stampsEconomyMetrics', timeframe] as const,
  weeklyStampsTrend: (timeframe: string) => [...analyticsKeys.all, 'weeklyStampsTrend', timeframe] as const,
  stampProgressDistribution: (timeframe: string) => [...analyticsKeys.all, 'stampProgressDistribution', timeframe] as const,
  redemptionsByCafe: (timeframe: string, limit: number) => [...analyticsKeys.all, 'redemptionsByCafe', timeframe, limit] as const,
  topStampCollectors: (timeframe: string, limit: number) => [...analyticsKeys.all, 'topStampCollectors', timeframe, limit] as const,
  // Engagement funnel keys
  engagementFunnelMetrics: (timeframe: string) => [...analyticsKeys.all, 'engagementFunnelMetrics', timeframe] as const,
  primaryFunnel: (timeframe: string) => [...analyticsKeys.all, 'primaryFunnel', timeframe] as const,
  onboardingFunnel: (timeframe: string) => [...analyticsKeys.all, 'onboardingFunnel', timeframe] as const,
};

/**
 * Hook to fetch overview statistics
 */
export const useOverviewStats = (
  timeframe: AnalyticsTimeframe = { timeframe: 'week' },
  options?: Omit<UseQueryOptions<OverviewStats, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: analyticsKeys.overview(timeframe.timeframe),
    queryFn: () => analyticsService.getOverviewStats(timeframe),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

/**
 * Hook to fetch user growth data
 */
export const useUserGrowth = (
  timeframe: AnalyticsTimeframe = { timeframe: 'month' },
  options?: Omit<UseQueryOptions<UserGrowthData[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: analyticsKeys.userGrowth(timeframe.timeframe),
    queryFn: () => analyticsService.getUserGrowth(timeframe),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

/**
 * Hook to fetch cafe performance rankings
 */
export const useCafePerformance = (
  timeframe: AnalyticsTimeframe = { timeframe: 'week' },
  limit: number = 10,
  options?: Omit<UseQueryOptions<CafePerformance[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: analyticsKeys.cafePerformance(timeframe.timeframe, limit),
    queryFn: () => analyticsService.getCafePerformance(timeframe, limit),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

/**
 * Hook to fetch popular times
 */
export const usePopularTimes = (
  cafeId?: string,
  options?: Omit<UseQueryOptions<PopularTimesData[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: analyticsKeys.popularTimes(cafeId),
    queryFn: () => analyticsService.getPopularTimes(cafeId),
    staleTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });
};

/**
 * Hook to fetch engagement metrics
 */
export const useEngagementMetrics = (
  timeframe: AnalyticsTimeframe = { timeframe: 'week' },
  options?: Omit<UseQueryOptions<EngagementMetrics, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: analyticsKeys.engagement(timeframe.timeframe),
    queryFn: () => analyticsService.getEngagementMetrics(timeframe),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

/**
 * Hook to fetch retention metrics
 */
export const useRetentionMetrics = (
  options?: Omit<UseQueryOptions<RetentionMetrics, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: analyticsKeys.retention(),
    queryFn: () => analyticsService.getRetentionMetrics(),
    staleTime: 10 * 60 * 1000,
    ...options,
  });
};

/**
 * Hook to fetch revenue insights
 */
export const useRevenueInsights = (
  timeframe: AnalyticsTimeframe = { timeframe: 'month' },
  avgDrinkPrice?: number,
  options?: Omit<UseQueryOptions<RevenueInsights, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: analyticsKeys.revenue(timeframe.timeframe),
    queryFn: () => analyticsService.getRevenueInsights(timeframe, avgDrinkPrice),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

/**
 * Hook to fetch BDL distribution
 */
export const useBDLDistribution = (
  timeframe: AnalyticsTimeframe = { timeframe: 'week' },
  options?: Omit<UseQueryOptions<BDLVisibilityData, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: analyticsKeys.bdlDistribution(timeframe.timeframe),
    queryFn: () => analyticsService.getBDLDistribution(timeframe),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

// ==========================================
// User Analytics Hooks
// ==========================================

/**
 * Hook to fetch user retention curve
 */
export const useUserRetentionCurve = (
  timeframe: AnalyticsTimeframe = { timeframe: 'month' },
  options?: Omit<UseQueryOptions<UserRetentionCurveData[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: analyticsKeys.userRetentionCurve(timeframe.timeframe),
    queryFn: () => analyticsService.getUserRetentionCurve(timeframe),
    staleTime: 10 * 60 * 1000,
    ...options,
  });
};

/**
 * Hook to fetch scan frequency distribution
 */
export const useScanFrequency = (
  timeframe: AnalyticsTimeframe = { timeframe: 'week' },
  options?: Omit<UseQueryOptions<ScanFrequencyData[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: analyticsKeys.scanFrequency(timeframe.timeframe),
    queryFn: () => analyticsService.getScanFrequency(timeframe),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

/**
 * Hook to fetch device distribution
 */
export const useDeviceDistribution = (
  timeframe: AnalyticsTimeframe = { timeframe: 'week' },
  options?: Omit<UseQueryOptions<DeviceDistributionData[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: analyticsKeys.deviceDistribution(timeframe.timeframe),
    queryFn: () => analyticsService.getDeviceDistribution(timeframe),
    staleTime: 10 * 60 * 1000,
    ...options,
  });
};

/**
 * Hook to fetch hourly activity
 */
export const useHourlyActivity = (
  timeframe: AnalyticsTimeframe = { timeframe: 'week' },
  options?: Omit<UseQueryOptions<HourlyActivityData[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: analyticsKeys.hourlyActivity(timeframe.timeframe),
    queryFn: () => analyticsService.getHourlyActivity(timeframe),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

/**
 * Hook to fetch top users
 */
export const useTopUsers = (
  timeframe: AnalyticsTimeframe = { timeframe: 'week' },
  limit: number = 5,
  options?: Omit<UseQueryOptions<TopUserData[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: analyticsKeys.topUsers(timeframe.timeframe, limit),
    queryFn: () => analyticsService.getTopUsers(timeframe, limit),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

/**
 * Combined hook to fetch all dashboard data
 */
export const useDashboardData = (timeframe: AnalyticsTimeframe = { timeframe: 'week' }) => {
  const overview = useOverviewStats(timeframe);
  const userGrowth = useUserGrowth(timeframe);
  const cafePerformance = useCafePerformance(timeframe, 5);
  const engagement = useEngagementMetrics(timeframe);
  const retention = useRetentionMetrics();
  const bdlDistribution = useBDLDistribution(timeframe);
  const popularTimes = usePopularTimes();

  const isLoading = 
    overview.isLoading ||
    userGrowth.isLoading ||
    cafePerformance.isLoading ||
    engagement.isLoading ||
    retention.isLoading ||
    bdlDistribution.isLoading ||
    popularTimes.isLoading;

  const isError =
    overview.isError ||
    userGrowth.isError ||
    cafePerformance.isError ||
    engagement.isError ||
    retention.isError ||
    bdlDistribution.isError ||
    popularTimes.isError;

  const refetchAll = () => {
    overview.refetch();
    userGrowth.refetch();
    cafePerformance.refetch();
    engagement.refetch();
    retention.refetch();
    bdlDistribution.refetch();
    popularTimes.refetch();
  };

  return {
    overview,
    userGrowth,
    cafePerformance,
    engagement,
    retention,
    bdlDistribution,
    popularTimes,
    isLoading,
    isError,
    refetchAll,
  };
};

/**
 * Combined hook to fetch all user analytics data
 */
export const useUserAnalyticsData = (timeframe: AnalyticsTimeframe = { timeframe: 'week' }) => {
  const overview = useOverviewStats(timeframe);
  const retention = useRetentionMetrics();
  const engagement = useEngagementMetrics(timeframe);
  const userRetentionCurve = useUserRetentionCurve(timeframe);
  const scanFrequency = useScanFrequency(timeframe);
  const deviceDistribution = useDeviceDistribution(timeframe);
  const hourlyActivity = useHourlyActivity(timeframe);
  const topUsers = useTopUsers(timeframe, 5);

  const isLoading = 
    overview.isLoading ||
    retention.isLoading ||
    engagement.isLoading ||
    userRetentionCurve.isLoading ||
    scanFrequency.isLoading ||
    deviceDistribution.isLoading ||
    hourlyActivity.isLoading ||
    topUsers.isLoading;

  const isError =
    overview.isError ||
    retention.isError ||
    engagement.isError ||
    userRetentionCurve.isError ||
    scanFrequency.isError ||
    deviceDistribution.isError ||
    hourlyActivity.isError ||
    topUsers.isError;

  const refetchAll = () => {
    overview.refetch();
    retention.refetch();
    engagement.refetch();
    userRetentionCurve.refetch();
    scanFrequency.refetch();
    deviceDistribution.refetch();
    hourlyActivity.refetch();
    topUsers.refetch();
  };

  return {
    overview,
    retention,
    engagement,
    userRetentionCurve,
    scanFrequency,
    deviceDistribution,
    hourlyActivity,
    topUsers,
    isLoading,
    isError,
    refetchAll,
  };
};

// ==========================================
// Stamps Economy Hooks
// ==========================================

/**
 * Hook to fetch stamps economy metrics
 */
export const useStampsEconomyMetrics = (
  timeframe: AnalyticsTimeframe = { timeframe: 'day' },
  options?: Omit<UseQueryOptions<StampsEconomyMetrics, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: analyticsKeys.stampsEconomyMetrics(timeframe.timeframe),
    queryFn: () => analyticsService.getStampsEconomyMetrics(timeframe),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

/**
 * Hook to fetch weekly stamps trend
 */
export const useWeeklyStampsTrend = (
  timeframe: AnalyticsTimeframe = { timeframe: 'week' },
  options?: Omit<UseQueryOptions<WeeklyStampsTrendData[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: analyticsKeys.weeklyStampsTrend(timeframe.timeframe),
    queryFn: () => analyticsService.getWeeklyStampsTrend(timeframe),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

/**
 * Hook to fetch stamp progress distribution
 */
export const useStampProgressDistribution = (
  timeframe: AnalyticsTimeframe = { timeframe: 'month' },
  options?: Omit<UseQueryOptions<StampProgressData[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: analyticsKeys.stampProgressDistribution(timeframe.timeframe),
    queryFn: () => analyticsService.getStampProgressDistribution(timeframe),
    staleTime: 10 * 60 * 1000,
    ...options,
  });
};

/**
 * Hook to fetch redemptions by cafe
 */
export const useRedemptionsByCafe = (
  timeframe: AnalyticsTimeframe = { timeframe: 'month' },
  limit: number = 10,
  options?: Omit<UseQueryOptions<RedemptionsByCafeData[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: analyticsKeys.redemptionsByCafe(timeframe.timeframe, limit),
    queryFn: () => analyticsService.getRedemptionsByCafe(timeframe, limit),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

/**
 * Hook to fetch top stamp collectors
 */
export const useTopStampCollectors = (
  timeframe: AnalyticsTimeframe = { timeframe: 'month' },
  limit: number = 10,
  options?: Omit<UseQueryOptions<TopCollectorData[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: analyticsKeys.topStampCollectors(timeframe.timeframe, limit),
    queryFn: () => analyticsService.getTopStampCollectors(timeframe, limit),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

/**
 * Combined hook to fetch all stamps economy data
 */
export const useStampsEconomyData = (timeframe: AnalyticsTimeframe = { timeframe: 'week' }) => {
  const metrics = useStampsEconomyMetrics({ timeframe: 'day' });
  const weeklyTrend = useWeeklyStampsTrend(timeframe);
  const progressDistribution = useStampProgressDistribution({ timeframe: 'month' });
  const redemptionsByCafe = useRedemptionsByCafe(timeframe, 5);
  const topCollectors = useTopStampCollectors(timeframe, 5);

  const isLoading = 
    metrics.isLoading ||
    weeklyTrend.isLoading ||
    progressDistribution.isLoading ||
    redemptionsByCafe.isLoading ||
    topCollectors.isLoading;

  const isError =
    metrics.isError ||
    weeklyTrend.isError ||
    progressDistribution.isError ||
    redemptionsByCafe.isError ||
    topCollectors.isError;

  const refetchAll = () => {
    metrics.refetch();
    weeklyTrend.refetch();
    progressDistribution.refetch();
    redemptionsByCafe.refetch();
    topCollectors.refetch();
  };

  return {
    metrics,
    weeklyTrend,
    progressDistribution,
    redemptionsByCafe,
    topCollectors,
    isLoading,
    isError,
    refetchAll,
  };
};

// ==========================================
// Engagement Funnel Hooks
// ==========================================

/**
 * Hook to fetch engagement funnel metrics
 */
export const useEngagementFunnelMetrics = (
  timeframe: AnalyticsTimeframe = { timeframe: 'week' },
  options?: Omit<UseQueryOptions<EngagementFunnelMetrics, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: analyticsKeys.engagementFunnelMetrics(timeframe.timeframe),
    queryFn: () => analyticsService.getEngagementFunnelMetrics(timeframe),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

/**
 * Hook to fetch primary funnel data
 */
export const usePrimaryFunnel = (
  timeframe: AnalyticsTimeframe = { timeframe: 'week' },
  options?: Omit<UseQueryOptions<PrimaryFunnelData, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: analyticsKeys.primaryFunnel(timeframe.timeframe),
    queryFn: () => analyticsService.getPrimaryFunnel(timeframe),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

/**
 * Hook to fetch onboarding funnel data
 */
export const useOnboardingFunnel = (
  timeframe: AnalyticsTimeframe = { timeframe: 'month' },
  options?: Omit<UseQueryOptions<FunnelStageData[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: analyticsKeys.onboardingFunnel(timeframe.timeframe),
    queryFn: () => analyticsService.getOnboardingFunnel(timeframe),
    staleTime: 10 * 60 * 1000,
    ...options,
  });
};

/**
 * Combined hook to fetch all engagement funnel data
 */
export const useEngagementFunnelData = (timeframe: AnalyticsTimeframe = { timeframe: 'week' }) => {
  const metrics = useEngagementFunnelMetrics(timeframe);
  const primaryFunnel = usePrimaryFunnel(timeframe);
  const onboardingFunnel = useOnboardingFunnel({ timeframe: 'month' });
  const stampProgress = useStampProgressDistribution({ timeframe: 'month' });

  const isLoading = 
    metrics.isLoading ||
    primaryFunnel.isLoading ||
    onboardingFunnel.isLoading ||
    stampProgress.isLoading;

  const isError =
    metrics.isError ||
    primaryFunnel.isError ||
    onboardingFunnel.isError ||
    stampProgress.isError;

  const refetchAll = () => {
    metrics.refetch();
    primaryFunnel.refetch();
    onboardingFunnel.refetch();
    stampProgress.refetch();
  };

  return {
    metrics,
    primaryFunnel,
    onboardingFunnel,
    stampProgress,
    isLoading,
    isError,
    refetchAll,
  };
};