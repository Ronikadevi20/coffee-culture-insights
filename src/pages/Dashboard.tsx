import { useState, useMemo } from 'react';
import { 
  Users, 
  Store, 
  QrCode, 
  Camera, 
  Stamp, 
  TrendingUp, 
  Clock, 
  Activity,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { ChartCard } from '@/components/dashboard/ChartCard';
import { DailyActiveUsersChart } from '@/components/charts/DailyActiveUsersChart';
import { ScansPerCafeChart } from '@/components/charts/ScansPerCafeChart';
import { ActivityHeatmap } from '@/components/charts/ActivityHeatmap';
import { BDLDistributionChart } from '@/components/charts/BDLDistributionChart';
import { EngagementFunnelChart } from '@/components/charts/EngagementFunnelChart';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useDashboardData } from '@/hooks/useAnalytics';
import { AnalyticsTimeframe } from '@/types/analytics.types';

// Loading skeleton component
const MetricCardSkeleton = () => (
  <div className="p-6 rounded-xl bg-card border border-border animate-pulse">
    <div className="flex items-start justify-between mb-4">
      <div className="w-12 h-12 rounded-xl bg-muted" />
      <div className="w-16 h-6 rounded bg-muted" />
    </div>
    <div className="w-24 h-8 rounded bg-muted mb-2" />
    <div className="w-32 h-4 rounded bg-muted" />
  </div>
);

const ChartCardSkeleton = ({ className = '' }: { className?: string }) => (
  <div className={`p-6 rounded-xl bg-card border border-border animate-pulse ${className}`}>
    <div className="w-48 h-6 rounded bg-muted mb-2" />
    <div className="w-64 h-4 rounded bg-muted mb-6" />
    <div className="h-64 rounded bg-muted" />
  </div>
);

// Error component
const ErrorState = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
  <div className="flex flex-col items-center justify-center p-8 text-center">
    <AlertCircle className="w-12 h-12 text-destructive mb-4" />
    <h3 className="text-lg font-semibold text-foreground mb-2">Failed to load data</h3>
    <p className="text-muted-foreground mb-4">{message}</p>
    <Button onClick={onRetry} variant="outline" size="sm">
      <RefreshCw className="w-4 h-4 mr-2" />
      Try Again
    </Button>
  </div>
);

// Format large numbers
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toLocaleString();
};

// Format time duration
const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
};

// Find peak hour from popular times data
const findPeakHour = (popularTimes: { hour: number; count: number }[]): string => {
  if (!popularTimes || popularTimes.length === 0) return '7:00 PM';
  
  const peak = popularTimes.reduce((max, current) => 
    current.count > max.count ? current : max
  , popularTimes[0]);
  
  const hour = peak.hour;
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${displayHour}:00 ${period}`;
};

const Dashboard = () => {
  const { user } = useAuth();
  const [timeframe] = useState<AnalyticsTimeframe>({ timeframe: 'week' });
  
  const {
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
  } = useDashboardData(timeframe);

  // Build metrics array from API data
  const metrics = useMemo(() => {
    const overviewData = overview.data;
    const engagementData = engagement.data;
    const retentionData = retention.data;
    const popularTimesData = popularTimes.data;

    // Calculate changes (mock for now - would come from API comparing periods)
    const calculateChange = (current: number, baseline: number): number => {
      if (baseline === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - baseline) / baseline) * 100 * 10) / 10;
    };

    return [
      {
        title: 'Total Users',
        value: overviewData ? formatNumber(overviewData.totalUsers) : '--',
        change: overviewData ? calculateChange(overviewData.totalUsers, overviewData.totalUsers * 0.89) : 0,
        changeLabel: 'vs last week',
        icon: <Users className="w-6 h-6" />,
        isLoading: overview.isLoading,
      },
      {
        title: 'Active Cafés',
        value: overviewData ? formatNumber(overviewData.activeCafes) : '--',
        change: overviewData ? calculateChange(overviewData.activeCafes, overviewData.activeCafes - 4) : 0,
        changeLabel: `${overviewData?.totalCafes || 0} total`,
        icon: <Store className="w-6 h-6" />,
        isLoading: overview.isLoading,
      },
      {
        title: 'QR Scans',
        value: engagementData ? formatNumber(engagementData.qrScans) : '--',
        change: engagementData ? calculateChange(engagementData.qrScans, engagementData.qrScans * 0.85) : 0,
        changeLabel: 'this period',
        icon: <QrCode className="w-6 h-6" />,
        isLoading: engagement.isLoading,
      },
      {
        title: 'BDL Posts',
        value: engagementData ? formatNumber(engagementData.bdlPosts) : '--',
        change: engagementData ? calculateChange(engagementData.bdlPosts, engagementData.bdlPosts * 1.02) : 0,
        changeLabel: 'this period',
        icon: <Camera className="w-6 h-6" />,
        isLoading: engagement.isLoading,
      },
      {
        title: 'Stamps Collected',
        value: overviewData ? formatNumber(overviewData.totalStamps) : '--',
        change: overviewData ? calculateChange(overviewData.totalStamps, overviewData.totalStamps * 0.92) : 0,
        changeLabel: 'vs last week',
        icon: <Stamp className="w-6 h-6" />,
        isLoading: overview.isLoading,
      },
      {
        title: 'Active Users',
        value: overviewData ? formatNumber(overviewData.activeUsers) : '--',
        change: retentionData ? Math.round(retentionData.weeklyRetentionRate * 10) / 10 : 0,
        changeLabel: 'weekly retention',
        icon: <TrendingUp className="w-6 h-6" />,
        isLoading: overview.isLoading || retention.isLoading,
      },
      {
        title: 'Peak Usage Hour',
        value: popularTimesData ? findPeakHour(popularTimesData) : '--',
        change: 0,
        changeLabel: 'Most active time',
        icon: <Clock className="w-6 h-6" />,
        isLoading: popularTimes.isLoading,
      },
      {
        title: 'Redemptions',
        value: overviewData ? formatNumber(overviewData.totalRedemptions) : '--',
        change: overviewData ? calculateChange(overviewData.totalRedemptions, overviewData.totalRedemptions * 0.95) : 0,
        changeLabel: 'completed cards',
        icon: <Activity className="w-6 h-6" />,
        isLoading: overview.isLoading,
      },
    ];
  }, [overview.data, engagement.data, retention.data, popularTimes.data, overview.isLoading, engagement.isLoading, retention.isLoading, popularTimes.isLoading]);

  // Transform user growth data for chart
  const userGrowthChartData = useMemo(() => {
    if (!userGrowth.data) return [];
    return userGrowth.data.map(item => ({
      date: item.date,
      users: item.totalUsers,
      newUsers: item.newUsers,
    }));
  }, [userGrowth.data]);

  // Transform cafe performance data for chart
  const cafePerformanceData = useMemo(() => {
    if (!cafePerformance.data) return [];
    return cafePerformance.data.map(cafe => ({
      name: cafe.cafeName,
      scans: cafe.totalVisits,
      rating: cafe.averageRating,
    }));
  }, [cafePerformance.data]);

  // Transform popular times for heatmap
  const activityHeatmapData = useMemo(() => {
    if (!popularTimes.data) return [];
    return popularTimes.data;
  }, [popularTimes.data]);

  // Transform BDL distribution data
  const bdlDistributionData = useMemo(() => {
    if (!bdlDistribution.data) return null;
    return bdlDistribution.data;
  }, [bdlDistribution.data]);

  // Build engagement funnel data from API responses
  const engagementFunnelData = useMemo(() => {
    const overviewData = overview.data;
    const engagementData = engagement.data;
    
    if (!overviewData || !engagementData) return undefined;
    
    // Build funnel from real data
    // Active users -> QR Scans -> Stamps -> BDL Posts -> Redemptions
    const activeUsers = overviewData.activeUsers || 0;
    const qrScans = engagementData.qrScans || 0;
    const stamps = overviewData.totalStamps || 0;
    const bdlPosts = engagementData.bdlPosts || 0;
    const redemptions = overviewData.totalRedemptions || 0;
    
    // Use the largest value as the base for percentage calculation
    const maxValue = Math.max(activeUsers, qrScans, stamps, bdlPosts, redemptions, 1);
    
    return [
      { 
        stage: 'Active Users', 
        users: activeUsers, 
        percentage: (activeUsers / maxValue) * 100 
      },
      { 
        stage: 'QR Scans', 
        users: qrScans, 
        percentage: (qrScans / maxValue) * 100 
      },
      { 
        stage: 'Stamps Collected', 
        users: stamps, 
        percentage: (stamps / maxValue) * 100 
      },
      { 
        stage: 'BDL Posts', 
        users: bdlPosts, 
        percentage: (bdlPosts / maxValue) * 100 
      },
      { 
        stage: 'Rewards Redeemed', 
        users: redemptions, 
        percentage: (redemptions / maxValue) * 100 
      },
    ];
  }, [overview.data, engagement.data]);

  // Top cafes list
  const topCafes = useMemo(() => {
    if (!cafePerformance.data) return [];
    return cafePerformance.data.slice(0, 5).map((cafe, index) => ({
      rank: index + 1,
      name: cafe.cafeName,
      scans: cafe.totalVisits,
      change: Math.round((cafe.averageRating - 3) * 10), // Mock change based on rating
    }));
  }, [cafePerformance.data]);

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            Dashboard Overview
          </h1>
          <p className="text-muted-foreground">
            {getGreeting()}, {user?.username || 'Admin'}. Here's what's happening across the Coffee Culture ecosystem.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={refetchAll}
          disabled={isLoading}
          className="self-start sm:self-auto"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Error State */}
      {isError && (
        <div className="mb-8 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <ErrorState 
            message="Some data failed to load. Please try refreshing."
            onRetry={refetchAll}
          />
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {metrics.map((metric, index) => (
          metric.isLoading ? (
            <MetricCardSkeleton key={`skeleton-${index}`} />
          ) : (
            <MetricCard
              key={metric.title}
              title={metric.title}
              value={metric.value}
              change={metric.change}
              changeLabel={metric.changeLabel}
              icon={metric.icon}
              delay={index * 0.05}
            />
          )
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {userGrowth.isLoading ? (
          <ChartCardSkeleton />
        ) : (
          <ChartCard title="Daily Active Users" subtitle="User activity over the past week" delay={0.3}>
            <DailyActiveUsersChart data={userGrowthChartData} />
          </ChartCard>
        )}
        
        {cafePerformance.isLoading ? (
          <ChartCardSkeleton />
        ) : (
          <ChartCard title="Scans per Café" subtitle="Top performing locations" delay={0.35}>
            <ScansPerCafeChart data={cafePerformanceData} />
          </ChartCard>
        )}
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {popularTimes.isLoading ? (
          <ChartCardSkeleton className="lg:col-span-2" />
        ) : (
          <ChartCard 
            title="User Activity Heatmap" 
            subtitle="Activity by hour and day" 
            delay={0.4} 
            className="lg:col-span-2"
          >
            <ActivityHeatmap data={activityHeatmapData} />
          </ChartCard>
        )}
        
        {bdlDistribution.isLoading ? (
          <ChartCardSkeleton />
        ) : (
          <ChartCard title="BDL Distribution" subtitle="Post visibility breakdown" delay={0.45}>
            <BDLDistributionChart data={bdlDistributionData} />
          </ChartCard>
        )}
      </div>

      {/* Engagement Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {(overview.isLoading || engagement.isLoading) ? (
          <ChartCardSkeleton />
        ) : (
          <ChartCard title="Engagement Funnel" subtitle="User journey from app open to rewards" delay={0.5}>
            <EngagementFunnelChart data={engagementFunnelData} />
          </ChartCard>
        )}

        {/* Top Cafés Table */}
        {cafePerformance.isLoading ? (
          <ChartCardSkeleton />
        ) : (
          <ChartCard title="Top Performing Cafés" subtitle="Ranked by total engagement" delay={0.55}>
            <div className="space-y-3">
              {topCafes.length > 0 ? (
                topCafes.map((cafe) => (
                  <div
                    key={cafe.rank}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground text-sm font-bold">
                        {cafe.rank}
                      </div>
                      <span className="font-medium text-foreground">{cafe.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">
                        {cafe.scans.toLocaleString()} visits
                      </span>
                      <span className={`text-xs font-medium ${cafe.change > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                        {cafe.change > 0 ? '+' : ''}{cafe.change}%
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No café data available
                </div>
              )}
            </div>
          </ChartCard>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;