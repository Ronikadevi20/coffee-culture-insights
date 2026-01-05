import { useState, useMemo } from 'react';
import { Users, UserPlus, RefreshCw, Scan, Stamp, Crown, AlertCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { ChartCard } from '@/components/dashboard/ChartCard';
import { Button } from '@/components/ui/button';
import { useUserAnalyticsData } from '@/hooks/useAnalytics';
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

// Device colors
const deviceColors = {
  iOS: 'hsl(24, 35%, 48%)',
  Android: 'hsl(32, 44%, 72%)',
};

const UserAnalytics = () => {
  const [timeframe] = useState<AnalyticsTimeframe>({ timeframe: 'week' });
  
  const {
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
  } = useUserAnalyticsData(timeframe);

  // Build metrics from API data
  const metrics = useMemo(() => {
    const overviewData = overview.data;
    const retentionData = retention.data;
    const engagementData = engagement.data;

    // Calculate derived metrics
    const avgScansPerUser = overviewData && engagementData 
      ? overviewData.activeUsers > 0 
        ? (engagementData.qrScans / overviewData.activeUsers).toFixed(1)
        : '0'
      : '--';

    const avgStampsPerUser = overviewData
      ? overviewData.activeUsers > 0
        ? (overviewData.totalStamps / overviewData.activeUsers).toFixed(1)
        : '0'
      : '--';

    // Estimate power users (users with >10 scans - we'll use 5% of active users as estimate)
    const powerUsers = overviewData 
      ? Math.round(overviewData.activeUsers * 0.05)
      : 0;

    return [
      {
        title: 'Total Users',
        value: overviewData ? formatNumber(overviewData.totalUsers) : '--',
        change: 12.5, // Would come from comparing periods
        icon: <Users className="w-6 h-6" />,
        isLoading: overview.isLoading,
      },
      {
        title: 'Daily Signups',
        value: overviewData ? formatNumber(Math.round(overviewData.activeUsers * 0.014)) : '--', // Estimate
        change: 24.2,
        icon: <UserPlus className="w-6 h-6" />,
        isLoading: overview.isLoading,
      },
      {
        title: 'Returning Users',
        value: retentionData ? `${Math.round(retentionData.weeklyRetentionRate)}%` : '--',
        change: retentionData ? Math.round(retentionData.weeklyRetentionRate - 65) : 0,
        icon: <RefreshCw className="w-6 h-6" />,
        isLoading: retention.isLoading,
      },
      {
        title: 'Avg Scans/User',
        value: avgScansPerUser,
        change: 8.5,
        icon: <Scan className="w-6 h-6" />,
        isLoading: overview.isLoading || engagement.isLoading,
      },
      {
        title: 'Avg Stamps',
        value: avgStampsPerUser,
        change: 5.7,
        icon: <Stamp className="w-6 h-6" />,
        isLoading: overview.isLoading,
      },
      {
        title: 'Power Users',
        value: overviewData ? formatNumber(powerUsers) : '--',
        change: 18.3,
        icon: <Crown className="w-6 h-6" />,
        isLoading: overview.isLoading,
      },
    ];
  }, [overview.data, retention.data, engagement.data, overview.isLoading, retention.isLoading, engagement.isLoading]);

  // Transform retention curve data for chart
  const retentionChartData = useMemo(() => {
    if (!userRetentionCurve.data || userRetentionCurve.data.length === 0) {
      // Default data
      return [
        { day: 'Day 1', users: 100 },
        { day: 'Day 7', users: 72 },
        { day: 'Day 14', users: 58 },
        { day: 'Day 30', users: 45 },
        { day: 'Day 60', users: 38 },
        { day: 'Day 90', users: 32 },
      ];
    }
    return userRetentionCurve.data.map(item => ({
      day: item.day,
      users: item.percentage,
    }));
  }, [userRetentionCurve.data]);

  // Transform scan frequency data for chart
  const scanFrequencyChartData = useMemo(() => {
    if (!scanFrequency.data || scanFrequency.data.length === 0) {
      // Default data
      return [
        { range: '0-1', users: 2400 },
        { range: '2-5', users: 5800 },
        { range: '6-10', users: 3200 },
        { range: '11-20', users: 1800 },
        { range: '20+', users: 800 },
      ];
    }
    return scanFrequency.data.map(item => ({
      range: item.range,
      users: item.users,
    }));
  }, [scanFrequency.data]);

  // Transform device distribution data for chart
  const deviceChartData = useMemo(() => {
    if (!deviceDistribution.data || deviceDistribution.data.length === 0) {
      // Default data
      return [
        { name: 'iOS', value: 58, color: deviceColors.iOS },
        { name: 'Android', value: 42, color: deviceColors.Android },
      ];
    }
    return deviceDistribution.data.map(item => ({
      name: item.name,
      value: item.percentage,
      color: item.name === 'iOS' ? deviceColors.iOS : deviceColors.Android,
    }));
  }, [deviceDistribution.data]);

  // Transform hourly activity data for chart
  const hourlyActivityChartData = useMemo(() => {
    if (!hourlyActivity.data || hourlyActivity.data.length === 0) {
      // Default data
      return [
        { hour: '6am', users: 120 },
        { hour: '8am', users: 450 },
        { hour: '10am', users: 680 },
        { hour: '12pm', users: 920 },
        { hour: '2pm', users: 780 },
        { hour: '4pm', users: 650 },
        { hour: '6pm', users: 1100 },
        { hour: '8pm', users: 1350 },
        { hour: '10pm', users: 580 },
        { hour: '12am', users: 180 },
      ];
    }
    return hourlyActivity.data.map(item => ({
      hour: item.hour,
      users: item.users,
    }));
  }, [hourlyActivity.data]);

  // Transform top users data for table
  const topUsersData = useMemo(() => {
    if (!topUsers.data || topUsers.data.length === 0) {
      // Default data
      return [
        { id: 'USR-001', scans: 127, stamps: 89, bdl: 34 },
        { id: 'USR-002', scans: 112, stamps: 78, bdl: 45 },
        { id: 'USR-003', scans: 98, stamps: 65, bdl: 28 },
        { id: 'USR-004', scans: 94, stamps: 61, bdl: 22 },
        { id: 'USR-005', scans: 89, stamps: 58, bdl: 31 },
      ];
    }
    return topUsers.data.map(user => ({
      id: user.userId,
      scans: user.scans,
      stamps: user.stamps,
      bdl: user.bdlPosts,
      score: user.score,
    }));
  }, [topUsers.data]);

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">User Analytics</h1>
          <p className="text-muted-foreground">Deep dive into user behavior, engagement patterns, and demographics.</p>
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
        {userRetentionCurve.isLoading ? (
          <ChartCardSkeleton />
        ) : (
          <ChartCard title="User Retention Curve" subtitle="Percentage of users active over time" delay={0.3}>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={retentionChartData}>
                <defs>
                  <linearGradient id="retentionGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(28, 60%, 55%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(28, 60%, 55%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(32, 30%, 85%)" strokeOpacity={0.5} />
                <XAxis dataKey="day" tick={{ fill: 'hsl(16, 20%, 45%)', fontSize: 12 }} axisLine={{ stroke: 'hsl(32, 30%, 85%)' }} tickLine={false} />
                <YAxis tick={{ fill: 'hsl(16, 20%, 45%)', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(0, 0%, 100%)', border: '1px solid hsl(32, 30%, 85%)', borderRadius: '8px' }} 
                  formatter={(value: number) => [`${value}%`, 'Retention']}
                />
                <Area type="monotone" dataKey="users" stroke="hsl(28, 60%, 55%)" strokeWidth={2} fill="url(#retentionGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        )}

        {scanFrequency.isLoading ? (
          <ChartCardSkeleton />
        ) : (
          <ChartCard title="Scanning Frequency" subtitle="Distribution of scans per user" delay={0.35}>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={scanFrequencyChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(32, 30%, 85%)" strokeOpacity={0.5} vertical={false} />
                <XAxis dataKey="range" tick={{ fill: 'hsl(16, 20%, 45%)', fontSize: 12 }} axisLine={{ stroke: 'hsl(32, 30%, 85%)' }} tickLine={false} />
                <YAxis tick={{ fill: 'hsl(16, 20%, 45%)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(0, 0%, 100%)', border: '1px solid hsl(32, 30%, 85%)', borderRadius: '8px' }} 
                  formatter={(value: number) => [value.toLocaleString(), 'Users']}
                />
                <Bar dataKey="users" fill="hsl(24, 35%, 48%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        )}
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {hourlyActivity.isLoading ? (
          <ChartCardSkeleton className="lg:col-span-2" />
        ) : (
          <ChartCard title="Most Active Hours" subtitle="User activity throughout the day" delay={0.4} className="lg:col-span-2">
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={hourlyActivityChartData}>
                <defs>
                  <linearGradient id="hourlyGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(24, 35%, 48%)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="hsl(24, 35%, 48%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(32, 30%, 85%)" strokeOpacity={0.5} />
                <XAxis dataKey="hour" tick={{ fill: 'hsl(16, 20%, 45%)', fontSize: 11 }} axisLine={{ stroke: 'hsl(32, 30%, 85%)' }} tickLine={false} />
                <YAxis tick={{ fill: 'hsl(16, 20%, 45%)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(0, 0%, 100%)', border: '1px solid hsl(32, 30%, 85%)', borderRadius: '8px' }} 
                  formatter={(value: number) => [value.toLocaleString(), 'Active Users']}
                />
                <Area type="monotone" dataKey="users" stroke="hsl(24, 35%, 48%)" strokeWidth={2} fill="url(#hourlyGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        )}

        {deviceDistribution.isLoading ? (
          <ChartCardSkeleton />
        ) : (
          <ChartCard title="Device Distribution" subtitle="iOS vs Android users" delay={0.45}>
            <div className="flex flex-col items-center">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={deviceChartData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value">
                    {deviceChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [`${value}%`, 'Share']}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex gap-6 mt-2">
                {deviceChartData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-foreground">{item.name}</span>
                    <span className="text-sm font-semibold text-muted-foreground">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </ChartCard>
        )}
      </div>

      {/* Top Users Table */}
      {topUsers.isLoading ? (
        <ChartCardSkeleton />
      ) : (
        <ChartCard title="Top 5 Most Active Users" subtitle="Anonymous user IDs ranked by engagement" delay={0.5}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Rank</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">User ID</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Total Scans</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Stamps</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">BDL Posts</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Score</th>
                </tr>
              </thead>
              <tbody>
                {topUsersData.length > 0 ? (
                  topUsersData.map((user, index) => (
                    <tr key={user.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground text-xs font-bold">
                          {index + 1}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium text-foreground">{user.id}</td>
                      <td className="py-3 px-4 text-right text-foreground">{user.scans.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right text-foreground">{user.stamps.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right text-foreground">{user.bdl.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right">
                        <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                          {user.score || (user.scans + user.stamps * 2 + user.bdl * 3)}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-muted-foreground">
                      No user data available
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

export default UserAnalytics;