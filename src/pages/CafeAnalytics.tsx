import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Store, Users, QrCode, Camera, Search, ChevronRight, MapPin, Star, RefreshCw, AlertCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { ChartCard } from '@/components/dashboard/ChartCard';
import { Button } from '@/components/ui/button';
import { usePlatformDashboard } from '@/hooks/usePlatformAdmin';
import { useCafePerformance, useEngagementMetrics, useUserGrowth } from '@/hooks/useAnalytics';
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
    <td className="py-4 px-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-muted" />
        <div>
          <div className="w-24 h-4 rounded bg-muted mb-1" />
          <div className="w-16 h-3 rounded bg-muted" />
        </div>
      </div>
    </td>
    <td className="py-4 px-4"><div className="w-12 h-4 rounded bg-muted ml-auto" /></td>
    <td className="py-4 px-4"><div className="w-12 h-4 rounded bg-muted ml-auto" /></td>
    <td className="py-4 px-4"><div className="w-12 h-4 rounded bg-muted ml-auto" /></td>
    <td className="py-4 px-4"><div className="w-12 h-4 rounded bg-muted ml-auto" /></td>
    <td className="py-4 px-4"><div className="w-12 h-4 rounded bg-muted ml-auto" /></td>
    <td className="py-4 px-4"><div className="w-12 h-4 rounded bg-muted ml-auto" /></td>
    <td className="py-4 px-4"><div className="w-4 h-4 rounded bg-muted ml-auto" /></td>
  </tr>
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

const CafeAnalytics = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [timeframe] = useState<AnalyticsTimeframe>({ timeframe: 'week' });

  // Fetch data from APIs
  const dashboard = usePlatformDashboard();
  const cafePerformance = useCafePerformance(timeframe, 20);
  const engagement = useEngagementMetrics(timeframe);
  const userGrowth = useUserGrowth(timeframe);

  const isLoading = dashboard.isLoading || cafePerformance.isLoading || engagement.isLoading;
  const isError = dashboard.isError || cafePerformance.isError || engagement.isError;

  const refetchAll = () => {
    dashboard.refetch();
    cafePerformance.refetch();
    engagement.refetch();
    userGrowth.refetch();
  };

  // Build metrics from API data
  const metrics = useMemo(() => {
    const dashboardData = dashboard.data;
    const engagementData = engagement.data;

    return [
      {
        title: 'Total Cafés',
        value: dashboardData ? formatNumber(dashboardData.cafes.total) : '--',
        change: dashboardData ? Math.round((dashboardData.cafes.new / Math.max(dashboardData.cafes.total, 1)) * 100) : 0,
        icon: <Store className="w-6 h-6" />,
        isLoading: dashboard.isLoading,
      },
      {
        title: 'Total Visits Today',
        value: engagementData ? formatNumber(engagementData.stampsCollected) : '--',
        change: 18.5,
        icon: <Users className="w-6 h-6" />,
        isLoading: engagement.isLoading,
      },
      {
        title: 'Total Scans',
        value: engagementData ? formatNumber(engagementData.qrScans) : '--',
        change: 14.2,
        icon: <QrCode className="w-6 h-6" />,
        isLoading: engagement.isLoading,
      },
      {
        title: 'BDL Posts',
        value: engagementData ? formatNumber(engagementData.bdlPosts) : '--',
        change: 9.8,
        icon: <Camera className="w-6 h-6" />,
        isLoading: engagement.isLoading,
      },
    ];
  }, [dashboard.data, engagement.data, dashboard.isLoading, engagement.isLoading]);

  // Transform cafe performance data for table
  const cafes = useMemo(() => {
    if (!cafePerformance.data || cafePerformance.data.length === 0) {
      return [];
    }
    
    return cafePerformance.data.map((cafe, index) => ({
      id: cafe.cafeId,
      name: cafe.cafeName,
      location: 'Karachi', // Would come from cafe details API
      scans: cafe.totalVisits,
      bdl: Math.round(cafe.totalVisits * 0.24), // Estimate BDL posts
      stamps: cafe.totalVisits,
      visits: cafe.uniqueVisitors,
      rating: cafe.averageRating,
      change: Math.round((cafe.averageRating - 3.5) * 10), // Mock change based on rating
    }));
  }, [cafePerformance.data]);

  // Filter cafes by search
  const filteredCafes = cafes.filter(cafe =>
    cafe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cafe.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Transform user growth data for trend chart
  const trendData = useMemo(() => {
    if (!userGrowth.data || userGrowth.data.length === 0) {
      // Default mock data
      return [
        { date: 'Mon', scans: 4200, visits: 5800 },
        { date: 'Tue', scans: 3800, visits: 5200 },
        { date: 'Wed', scans: 4500, visits: 6100 },
        { date: 'Thu', scans: 5200, visits: 7000 },
        { date: 'Fri', scans: 6800, visits: 8500 },
        { date: 'Sat', scans: 8200, visits: 10200 },
        { date: 'Sun', scans: 7400, visits: 9100 },
      ];
    }
    
    return userGrowth.data.slice(-7).map(item => ({
      date: new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' }),
      scans: item.newUsers * 3, // Estimate scans
      visits: item.newUsers * 4, // Estimate visits
    }));
  }, [userGrowth.data]);

  // Transform cafe data for bar chart
  const topCafesChartData = useMemo(() => {
    return cafes.slice(0, 6).map(cafe => ({
      name: cafe.name.length > 12 ? cafe.name.substring(0, 10) + '...' : cafe.name,
      scans: cafe.scans,
    }));
  }, [cafes]);

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">Café Analytics</h1>
          <p className="text-muted-foreground">Performance metrics and insights for all partner cafés.</p>
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
              icon={metric.icon} 
              delay={index * 0.05} 
            />
          )
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {userGrowth.isLoading ? (
          <ChartCardSkeleton />
        ) : (
          <ChartCard title="Weekly Visits & Scans Trend" subtitle="Across all partner cafés" delay={0.2}>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="visitsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(24, 35%, 48%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(24, 35%, 48%)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="scansGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(28, 60%, 55%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(28, 60%, 55%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(32, 30%, 85%)" strokeOpacity={0.5} />
                <XAxis dataKey="date" tick={{ fill: 'hsl(16, 20%, 45%)', fontSize: 12 }} axisLine={{ stroke: 'hsl(32, 30%, 85%)' }} tickLine={false} />
                <YAxis tick={{ fill: 'hsl(16, 20%, 45%)', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(0, 0%, 100%)', border: '1px solid hsl(32, 30%, 85%)', borderRadius: '8px' }} 
                  formatter={(value: number, name: string) => [value.toLocaleString(), name === 'visits' ? 'Visits' : 'Scans']}
                />
                <Area type="monotone" dataKey="visits" stroke="hsl(24, 35%, 48%)" strokeWidth={2} fill="url(#visitsGrad)" name="visits" />
                <Area type="monotone" dataKey="scans" stroke="hsl(28, 60%, 55%)" strokeWidth={2} fill="url(#scansGrad)" name="scans" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        )}

        {cafePerformance.isLoading ? (
          <ChartCardSkeleton />
        ) : (
          <ChartCard title="Top Cafés by Engagement" subtitle="Scans + BDL + Stamps score" delay={0.25}>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={topCafesChartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(32, 30%, 85%)" strokeOpacity={0.5} horizontal={true} vertical={false} />
                <XAxis type="number" tick={{ fill: 'hsl(16, 20%, 45%)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fill: 'hsl(16, 20%, 45%)', fontSize: 11 }} axisLine={false} tickLine={false} width={90} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(0, 0%, 100%)', border: '1px solid hsl(32, 30%, 85%)', borderRadius: '8px' }} 
                  formatter={(value: number) => [value.toLocaleString(), 'Scans']}
                />
                <Bar dataKey="scans" fill="hsl(24, 35%, 48%)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        )}
      </div>

      {/* Café Directory */}
      <ChartCard title="Café Directory" subtitle="Click on a café to view detailed analytics" delay={0.3}>
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search cafés by name or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-md pl-10 pr-4 py-2 bg-muted/50 border border-border/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Café</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Scans</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">BDL Posts</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Stamps</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Visitors</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Rating</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Change</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground"></th>
              </tr>
            </thead>
            <tbody>
              {cafePerformance.isLoading ? (
                // Loading skeletons
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRowSkeleton key={`skeleton-${index}`} />
                ))
              ) : filteredCafes.length > 0 ? (
                filteredCafes.map((cafe, index) => (
                  <motion.tr
                    key={cafe.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="border-b border-border/50 hover:bg-muted/30 transition-colors cursor-pointer"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                          <Store className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{cafe.name}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {cafe.location}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right font-medium text-foreground">{cafe.scans.toLocaleString()}</td>
                    <td className="py-4 px-4 text-right text-foreground">{cafe.bdl.toLocaleString()}</td>
                    <td className="py-4 px-4 text-right text-foreground">{cafe.stamps.toLocaleString()}</td>
                    <td className="py-4 px-4 text-right text-foreground">{cafe.visits.toLocaleString()}</td>
                    <td className="py-4 px-4 text-right">
                      <span className="inline-flex items-center gap-1 text-foreground">
                        <Star className="w-3 h-3 text-accent fill-accent" />
                        {cafe.rating.toFixed(1)}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className={`text-sm font-medium ${cafe.change > 0 ? 'text-emerald-600' : cafe.change < 0 ? 'text-red-500' : 'text-muted-foreground'}`}>
                        {cafe.change > 0 ? '+' : ''}{cafe.change}%
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-muted-foreground">
                    {searchQuery ? 'No cafés found matching your search' : 'No café data available'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </ChartCard>
    </DashboardLayout>
  );
};

export default CafeAnalytics;