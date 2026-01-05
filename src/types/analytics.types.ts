/**
 * Analytics Types
 * Types for analytics API responses and data structures
 */

// Timeframe for analytics queries
export interface AnalyticsTimeframe {
  timeframe: 'day' | 'week' | 'month' | 'year' | 'custom';
  startDate?: Date;
  endDate?: Date;
}

// Overview statistics
export interface OverviewStats {
  totalUsers: number;
  activeUsers: number;
  totalCafes: number;
  activeCafes: number;
  totalStamps: number;
  totalRedemptions: number;
  periodStart: string;
  periodEnd: string;
}

// User growth data point
export interface UserGrowthData {
  date: string;
  newUsers: number;
  totalUsers: number;
}

// Cafe performance data
export interface CafePerformance {
  cafeId: string;
  cafeName: string;
  totalVisits: number;
  uniqueVisitors: number;
  averageRating: number;
  totalReviews: number;
  completedCards: number;
}

// Popular times data
export interface PopularTimesData {
  hour: number;
  count: number;
  day?: string;
}

// Engagement metrics
export interface EngagementMetrics {
  qrScans: number;
  stampsCollected: number;
  bdlPosts: number;
  reviews: number;
  eventsRegistered: number;
  periodStart: string;
  periodEnd: string;
}

// Retention metrics
export interface RetentionMetrics {
  activeLastWeek: number;
  activeLastMonth: number;
  totalUsers: number;
  weeklyRetentionRate: number;
  monthlyRetentionRate: number;
}

// Revenue insights
export interface RevenueInsights {
  totalStamps: number;
  totalRedemptions: number;
  estimatedRevenue: number;
  redemptionRate: number;
  avgDrinkPrice: number;
  periodStart: string;
  periodEnd: string;
}

// Dashboard period type
export type DashboardPeriod = 'today' | 'week' | 'month';

// Dashboard metrics
export interface DashboardMetrics {
  visits: number;
  stamps: number;
  bdlPosts: number;
  newUsers: number;
  peakHour: string;
  avgFrequency: number;
  redemptions: number;
  avgStampsPerUser: number;
  uniqueVisitors: number;
  changes: {
    visits: number;
    stamps: number;
    bdlPosts: number;
    newUsers: number;
    avgFrequency: number;
    redemptions: number;
    avgStampsPerUser: number;
  };
}

// Chart data structures
export interface ChartDataPoint {
  label: string;
  value: number;
}

export interface VisitsChartData {
  labels: string[];
  data: number[];
}

// BDL visibility data
export interface BDLVisibilityData {
  public: number;
  private: number;
  friends: number;
}

// Peak hours heatmap data
export interface PeakHoursHeatmapData {
  hours: string[];
  days: string[];
  data: number[][];
}

// BDL timeline data
export interface BDLTimelineData {
  date: string;
  posts: number;
  public: number;
  friends: number;
  private: number;
}

// BDL engagement data
export interface BDLEngagementData {
  day: string;
  postsAfterStamp: number;
  repeatPosters: number;
}

// BDL peak times data
export interface BDLPeakTimesData {
  peakTime: string;
  peakDays: string[];
  weekdayAvg: number;
  weekendAvg: number;
}

// Drink popularity data
export interface DrinkPopularityData {
  drinkName: string;
  count: number;
  percentage: number;
}

// Stamp card funnel data
export interface StampCardFunnelData {
  stage: string;
  users: number;
  percentage: number;
}

// Customer type data
export interface CustomerTypeData {
  returning: number;
  new: number;
  returningPercentage: number;
  newPercentage: number;
}

// Daily statistics
export interface DailyStatistics {
  date: string;
  visits: number;
  stamps: number;
  redemptions: number;
  uniqueUsers: number;
  peakHour: string;
}

// Stamps by drink data
export interface StampsByDrinkData {
  name: string;
  value: number;
  percentage: number;
}

// Cafe analytics response
export interface CafeAnalytics {
  cafeId: string;
  cafeName: string;
  totalStamps: number;
  uniqueVisitors: number;
  completedCards: number;
  averageRating: number;
  totalReviews: number;
  popularTimes: PopularTimesData[];
  periodStart: string;
  periodEnd: string;
}

// ==========================================
// User Analytics Types
// ==========================================

// User retention curve data
export interface UserRetentionCurveData {
  day: string;
  users: number;
  percentage: number;
}

// Scan frequency distribution data
export interface ScanFrequencyData {
  range: string;
  users: number;
  percentage: number;
}

// Device distribution data
export interface DeviceDistributionData {
  name: string;
  value: number;
  percentage: number;
}

// Hourly activity data
export interface HourlyActivityData {
  hour: string;
  users: number;
  scans: number;
}

// Top user data
export interface TopUserData {
  userId: string;
  scans: number;
  stamps: number;
  bdlPosts: number;
  score: number;
}

// ==========================================
// Stamps Economy Analytics Types
// ==========================================

// Stamps economy metrics
export interface StampsEconomyMetrics {
  stampsIssuedToday: number;
  freeDrinksRedeemed: number;
  avgCompletionTime: number;
  cardsCompleted: number;
  activeCollectors: number;
  retentionImpact: number;
  changes: {
    stampsIssued: number;
    redemptions: number;
    activeCollectors: number;
  };
}

// Weekly stamps trend data
export interface WeeklyStampsTrendData {
  date: string;
  stamps: number;
  redemptions: number;
}

// Stamp progress distribution data
export interface StampProgressData {
  stampCount: number;
  users: number;
  percentage: number;
}

// Redemptions by cafe data
export interface RedemptionsByCafeData {
  cafeId: string;
  cafeName: string;
  redemptions: number;
  percentage: number;
}

// Top stamp collector data
export interface TopCollectorData {
  userId: string;
  username: string;
  email: string;
  totalStamps: number;
  cardsCompleted: number;
  activeCafes: number;
  lastStampDate: string;
}

// ==========================================
// Engagement Funnel Analytics Types
// ==========================================

// Funnel stage data
export interface FunnelStageData {
  name: string;
  value: number;
  fill: string;
}

// Conversion rate data
export interface ConversionRateData {
  stage: string;
  rate: number;
}

// Engagement funnel metrics
export interface EngagementFunnelMetrics {
  overallConversion: number;
  scanRate: number;
  stampCompletion: number;
  bdlEngagement: number;
  changes: {
    overallConversion: number;
    scanRate: number;
    stampCompletion: number;
    bdlEngagement: number;
  };
}

// Primary funnel data
export interface PrimaryFunnelData {
  stages: FunnelStageData[];
  conversions: ConversionRateData[];
  totalUsers: number;
}