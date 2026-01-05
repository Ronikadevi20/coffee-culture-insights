import { useState, useMemo } from 'react';
import { Stamp, Gift, Clock, Trophy, TrendingUp, Users, RefreshCw, AlertCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { ChartCard } from '@/components/dashboard/ChartCard';
import { EngagementFunnelChart } from '@/components/charts/EngagementFunnelChart';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { 
  useStampsEconomyMetrics,
  useWeeklyStampsTrend,
  useStampProgressDistribution,
  useRedemptionsByCafe,
  useTopStampCollectors,
  useEngagementMetrics,
  useRetentionMetrics
} from '@/hooks/useAnalytics';
import { AnalyticsTimeframe } from '@/types/analytics.types';

// Loading skeleton components
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

const TableRowSkeleton = () => (
  <tr className="border-b border-border/50">
    <td className="py-4 px-4"><div className="w-8 h-8 rounded-full bg-muted" /></td>
    <td className="py-4 px-4"><div className="w-20 h-4 rounded bg-muted" /></td>
    <td className="py-4 px-4"><div className="w-12 h-4 rounded bg-muted ml-auto" /></td>
    <td className="py-4 px-4"><div className="w-12 h-4 rounded bg-muted ml-auto" /></td>
    <td className="py-4 px-4"><div className="w-16 h-6 rounded bg-muted ml-auto" /></td>
  </tr>
);

// Empty chart state component
const EmptyChartState = ({ message = 'No data available' }: { message?: string }) => (
  <div className="flex flex-col items-center justify-center h-[280px] text-center">
    <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
      <Stamp className="w-8 h-8 text-muted-foreground" />
    </div>
    <p className="text-muted-foreground">{message}</p>
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

// Coffee-themed colors for charts
const cafeColors = [
  'hsl(24, 35%, 48%)',
  'hsl(28, 60%, 55%)',
  'hsl(32, 44%, 72%)',
  'hsl(16, 25%, 38%)',
  'hsl(17, 27%, 18%)',
];

const StampsEconomy = () => {
  const [timeframe] = useState<AnalyticsTimeframe>({ timeframe: 'week' });

  // Fetch data from APIs
  const stampsMetrics = useStampsEconomyMetrics({ timeframe: 'day' });
  const weeklyTrend = useWeeklyStampsTrend(timeframe);
  const progressDistribution = useStampProgressDistribution({ timeframe: 'month' });
  const redemptionsByCafe = useRedemptionsByCafe(timeframe, 5);
  const topCollectors = useTopStampCollectors(timeframe, 5);
  const engagement = useEngagementMetrics(timeframe);
  const retention = useRetentionMetrics();

  const isLoading = stampsMetrics.isLoading || weeklyTrend.isLoading || progressDistribution.isLoading;
  const isError = stampsMetrics.isError || weeklyTrend.isError || progressDistribution.isError;

  const refetchAll = () => {
    stampsMetrics.refetch();
    weeklyTrend.refetch();
    progressDistribution.refetch();
    redemptionsByCafe.refetch();
    topCollectors.refetch();
    engagement.refetch();
    retention.refetch();
  };

  // Build metrics from API data
  const metrics = useMemo(() => {
    const metricsData = stampsMetrics.data;
    const engagementData = engagement.data;
    const retentionData = retention.data;

    return [
      {
        title: 'Stamps Issued Today',
        value: metricsData ? formatNumber(metricsData.stampsIssuedToday) : '--',
        change: metricsData?.changes?.stampsIssued || 8.7,
        icon: <Stamp className="w-6 h-6" />,
        isLoading: stampsMetrics.isLoading,
      },
      {
        title: 'Free Drinks Redeemed',
        value: metricsData ? formatNumber(metricsData.freeDrinksRedeemed) : '--',
        change: metricsData?.changes?.redemptions || 15.2,
        icon: <Gift className="w-6 h-6" />,
        isLoading: stampsMetrics.isLoading,
      },
      {
        title: 'Avg Completion Time',
        value: metricsData ? `${Math.round(metricsData.avgCompletionTime)} days` : '--',
        change: -12.5, // Negative is good (faster completion)
        icon: <Clock className="w-6 h-6" />,
        isLoading: stampsMetrics.isLoading,
      },
      {
        title: 'Cards Completed',
        value: metricsData ? formatNumber(metricsData.cardsCompleted) : '--',
        change: 22.4,
        icon: <Trophy className="w-6 h-6" />,
        isLoading: stampsMetrics.isLoading,
      },
      {
        title: 'Active Collectors',
        value: metricsData ? formatNumber(metricsData.activeCollectors) : '--',
        change: metricsData?.changes?.activeCollectors || 9.3,
        icon: <Users className="w-6 h-6" />,
        isLoading: stampsMetrics.isLoading,
      },
      {
        title: 'Retention Impact',
        value: retentionData ? `+${retentionData.weeklyRetentionRate.toFixed(0)}%` : '--',
        change: 5.8,
        icon: <TrendingUp className="w-6 h-6" />,
        isLoading: retention.isLoading,
      },
    ];
  }, [stampsMetrics.data, engagement.data, retention.data, stampsMetrics.isLoading, retention.isLoading]);

  // Transform weekly trend data for chart - NO MOCK FALLBACK
  const stampsTrendData = useMemo(() => {
    if (!weeklyTrend.data || weeklyTrend.data.length === 0) {
      return []; // Return empty array - will show empty state
    }
    
    return weeklyTrend.data.slice(-7).map(item => ({
      date: new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' }),
      stamps: item.stamps,
    }));
  }, [weeklyTrend.data]);

  // Transform redemptions by cafe data - NO MOCK FALLBACK
  const redemptionsByCafeData = useMemo(() => {
    if (!redemptionsByCafe.data || redemptionsByCafe.data.length === 0) {
      return []; // Return empty array - will show empty state
    }
    
    return redemptionsByCafe.data.slice(0, 5).map((cafe, index) => ({
      name: cafe.cafeName.length > 15 ? cafe.cafeName.substring(0, 12) + '...' : cafe.cafeName,
      redemptions: cafe.redemptions,
      color: cafeColors[index % cafeColors.length],
    }));
  }, [redemptionsByCafe.data]);

  // Transform stamp progress distribution - NO MOCK FALLBACK
  const stampProgressData = useMemo(() => {
    if (!progressDistribution.data || progressDistribution.data.length === 0) {
      return []; // Return empty array - will show empty state
    }
    
    return progressDistribution.data.map(item => ({
      stamps: item.stampCount,
      users: item.users,
    }));
  }, [progressDistribution.data]);

  // Build funnel data from engagement metrics - NO MOCK FALLBACK
  const funnelData = useMemo(() => {
    const engagementData = engagement.data;
    const metricsData = stampsMetrics.data;
    
    if (!engagementData) {
      return []; // Return empty array - will show empty state
    }

    const qrScans = engagementData.qrScans || 0;
    const stamps = engagementData.stampsCollected || 0;
    const bdlPosts = engagementData.bdlPosts || 0;
    const freeDrinks = metricsData?.freeDrinksRedeemed || 0;
    
    // Estimate app opens as ~1.4x QR scans
    const appOpens = Math.round(qrScans * 1.4);
    const maxValue = Math.max(appOpens, 1);

    return [
      { 
        stage: 'App Opens', 
        users: appOpens, 
        percentage: 100 
      },
      { 
        stage: 'QR Scans', 
        users: qrScans, 
        percentage: Math.round((qrScans / maxValue) * 100) 
      },
      { 
        stage: 'Stamps Collected', 
        users: stamps, 
        percentage: Math.round((stamps / maxValue) * 100) 
      },
      { 
        stage: 'BDL Posts', 
        users: bdlPosts, 
        percentage: Math.round((bdlPosts / maxValue) * 100) 
      },
      { 
        stage: 'Free Drinks', 
        users: freeDrinks, 
        percentage: Math.round((freeDrinks / maxValue) * 100) 
      },
    ];
  }, [engagement.data, stampsMetrics.data]);

  // Transform top collectors data - NO MOCK FALLBACK
  const topRedeemersData = useMemo(() => {
    if (!topCollectors.data || topCollectors.data.length === 0) {
      return []; // Return empty array - will show empty state
    }
    
    return topCollectors.data.slice(0, 5).map(collector => ({
      id: `USR-${collector.userId.slice(0, 3).toUpperCase()}`,
      stamps: collector.totalStamps,
      drinks: collector.cardsCompleted,
    }));
  }, [topCollectors.data]);

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">Stamps Economy</h1>
          <p className="text-muted-foreground">Track stamp collection, redemptions, and loyalty program effectiveness.</p>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
        {metrics.map((metric, index) => (
          metric.isLoading ? (
            <MetricCardSkeleton key={`skeleton-${index}`} />
          ) : (
            <MetricCard 
              key={metric.title}
              title={metric.title} 
              value={metric.value} 
              change={metric.change} 
              icon={metric.icon} 
              delay={index * 0.05} 
            />
          )
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {weeklyTrend.isLoading ? (
          <ChartCardSkeleton />
        ) : (
          <ChartCard title="Weekly Stamps Trend" subtitle="Stamps collected over the past week" delay={0.3}>
            {stampsTrendData.length === 0 ? (
              <EmptyChartState message="No stamp data available for this period" />
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={stampsTrendData}>
                  <defs>
                    <linearGradient id="stampsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(28, 60%, 55%)" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="hsl(28, 60%, 55%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(32, 30%, 85%)" strokeOpacity={0.5} />
                  <XAxis dataKey="date" tick={{ fill: 'hsl(16, 20%, 45%)', fontSize: 12 }} axisLine={{ stroke: 'hsl(32, 30%, 85%)' }} tickLine={false} />
                  <YAxis tick={{ fill: 'hsl(16, 20%, 45%)', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(0, 0%, 100%)', border: '1px solid hsl(32, 30%, 85%)', borderRadius: '8px' }} 
                    formatter={(value: number) => [value.toLocaleString(), 'Stamps']}
                  />
                  <Area type="monotone" dataKey="stamps" stroke="hsl(28, 60%, 55%)" strokeWidth={2} fill="url(#stampsGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </ChartCard>
        )}

        {redemptionsByCafe.isLoading ? (
          <ChartCardSkeleton />
        ) : (
          <ChartCard title="Redemptions by Café" subtitle="Free drinks redeemed per location" delay={0.35}>
            {redemptionsByCafeData.length === 0 ? (
              <EmptyChartState message="No redemption data available" />
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={redemptionsByCafeData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(32, 30%, 85%)" strokeOpacity={0.5} horizontal={true} vertical={false} />
                  <XAxis type="number" tick={{ fill: 'hsl(16, 20%, 45%)', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fill: 'hsl(16, 20%, 45%)', fontSize: 11 }} axisLine={false} tickLine={false} width={90} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(0, 0%, 100%)', border: '1px solid hsl(32, 30%, 85%)', borderRadius: '8px' }} 
                    formatter={(value: number) => [value.toLocaleString(), 'Redemptions']}
                  />
                  <Bar dataKey="redemptions" radius={[0, 4, 4, 0]}>
                    {redemptionsByCafeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartCard>
        )}
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {progressDistribution.isLoading ? (
          <ChartCardSkeleton />
        ) : (
          <ChartCard title="Stamp Progress Distribution" subtitle="Users at each stamp count (out of 10)" delay={0.4}>
            {stampProgressData.length === 0 ? (
              <EmptyChartState message="No stamp progress data available" />
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={stampProgressData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(32, 30%, 85%)" strokeOpacity={0.5} vertical={false} />
                  <XAxis dataKey="stamps" tick={{ fill: 'hsl(16, 20%, 45%)', fontSize: 12 }} axisLine={{ stroke: 'hsl(32, 30%, 85%)' }} tickLine={false} />
                  <YAxis tick={{ fill: 'hsl(16, 20%, 45%)', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(0, 0%, 100%)', border: '1px solid hsl(32, 30%, 85%)', borderRadius: '8px' }} 
                    formatter={(value: number) => [value.toLocaleString(), 'Users']}
                  />
                  <Bar dataKey="users" fill="hsl(24, 35%, 48%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartCard>
        )}

        {engagement.isLoading ? (
          <ChartCardSkeleton />
        ) : (
          <ChartCard title="Stamp to Reward Funnel" subtitle="Journey from scan to free drink" delay={0.45}>
            {funnelData.length === 0 ? (
              <EmptyChartState message="No funnel data available" />
            ) : (
              <EngagementFunnelChart data={funnelData} />
            )}
          </ChartCard>
        )}
      </div>

      {/* Top Redeemers */}
      {topCollectors.isLoading ? (
        <ChartCardSkeleton />
      ) : (
        <ChartCard title="Top Stamp Collectors" subtitle="Users with most stamps and redemptions" delay={0.5}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Rank</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">User ID</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Total Stamps</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Free Drinks</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {topRedeemersData.length > 0 ? (
                  topRedeemersData.map((user, index) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground text-sm font-bold">
                          {index + 1}
                        </div>
                      </td>
                      <td className="py-4 px-4 font-medium text-foreground">{user.id}</td>
                      <td className="py-4 px-4 text-right">
                        <span className="inline-flex items-center gap-1 text-foreground">
                          <Stamp className="w-4 h-4 text-primary" />
                          {user.stamps}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className="inline-flex items-center gap-1 text-foreground">
                          <Gift className="w-4 h-4 text-accent" />
                          {user.drinks}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                          {user.stamps >= 40 ? 'VIP' : user.stamps >= 20 ? 'Regular' : 'New'}
                        </span>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-muted-foreground">
                      No stamp collector data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </ChartCard>
      )}
    </DashboardLayout>
  );
};

export default StampsEconomy;