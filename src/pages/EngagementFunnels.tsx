import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { ChartCard } from '@/components/dashboard/ChartCard';
import { Button } from '@/components/ui/button';
import { TrendingUp, Users, Target, ArrowRight, Zap, RefreshCw, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  FunnelChart,
  Funnel,
  LabelList,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import {
  useEngagementFunnelMetrics,
  usePrimaryFunnel,
  useOnboardingFunnel,
  useStampProgressDistribution,
} from '@/hooks/useAnalytics';
import { AnalyticsTimeframe, FunnelStageData } from '@/types/analytics.types';

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

// Empty chart state component
const EmptyChartState = ({ message = 'No data available' }: { message?: string }) => (
  <div className="flex flex-col items-center justify-center h-64 text-center">
    <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
      <TrendingUp className="w-8 h-8 text-muted-foreground" />
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

// Funnel step component
const FunnelStep = ({ step, value, percentage, index, totalSteps }: { 
  step: string; 
  value: string; 
  percentage: number; 
  index: number;
  totalSteps: number;
}) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.1 }}
    className="flex items-center gap-4"
  >
    <div className="flex-1">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-foreground">{step}</span>
        <span className="text-sm text-muted-foreground">{value}</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
          className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full"
        />
      </div>
    </div>
    {index < totalSteps - 1 && <ArrowRight className="w-4 h-4 text-muted-foreground" />}
  </motion.div>
);

export default function EngagementFunnels() {
  const [timeframe] = useState<AnalyticsTimeframe>({ timeframe: 'week' });

  // Fetch data from APIs
  const funnelMetrics = useEngagementFunnelMetrics(timeframe);
  const primaryFunnel = usePrimaryFunnel(timeframe);
  const onboardingFunnel = useOnboardingFunnel({ timeframe: 'month' });
  const stampProgress = useStampProgressDistribution({ timeframe: 'month' });

  const isLoading = funnelMetrics.isLoading || primaryFunnel.isLoading;
  const isError = funnelMetrics.isError || primaryFunnel.isError;

  const refetchAll = () => {
    funnelMetrics.refetch();
    primaryFunnel.refetch();
    onboardingFunnel.refetch();
    stampProgress.refetch();
  };

  // Build metrics from API data
  const metrics = useMemo(() => {
    const metricsData = funnelMetrics.data;

    return [
      {
        title: 'Overall Conversion',
        value: metricsData ? `${metricsData.overallConversion}%` : '--',
        change: metricsData?.changes?.overallConversion || 0,
        icon: <TrendingUp className="w-6 h-6" />,
        isLoading: funnelMetrics.isLoading,
      },
      {
        title: 'Scan Rate',
        value: metricsData ? `${metricsData.scanRate}%` : '--',
        change: metricsData?.changes?.scanRate || 0,
        icon: <Target className="w-6 h-6" />,
        isLoading: funnelMetrics.isLoading,
      },
      {
        title: 'Stamp Completion',
        value: metricsData ? `${metricsData.stampCompletion}%` : '--',
        change: metricsData?.changes?.stampCompletion || 0,
        icon: <Zap className="w-6 h-6" />,
        isLoading: funnelMetrics.isLoading,
      },
      {
        title: 'BDL Engagement',
        value: metricsData ? `${metricsData.bdlEngagement}%` : '--',
        change: metricsData?.changes?.bdlEngagement || 0,
        icon: <Users className="w-6 h-6" />,
        isLoading: funnelMetrics.isLoading,
      },
    ];
  }, [funnelMetrics.data, funnelMetrics.isLoading]);

  // Transform primary funnel data - NO MOCK FALLBACK
  const mainFunnelData = useMemo(() => {
    if (!primaryFunnel.data?.stages || primaryFunnel.data.stages.length === 0) {
      return [];
    }
    return primaryFunnel.data.stages;
  }, [primaryFunnel.data]);

  // Transform primary funnel for step visualization - NO MOCK FALLBACK
  const funnelSteps = useMemo(() => {
    if (!primaryFunnel.data?.stages || primaryFunnel.data.stages.length === 0) {
      return [];
    }

    const stages = primaryFunnel.data.stages;
    const maxValue = Math.max(...stages.map(s => s.value), 1);

    return stages.map(stage => ({
      step: stage.name,
      value: formatNumber(stage.value),
      percentage: (stage.value / maxValue) * 100,
    }));
  }, [primaryFunnel.data]);

  // Transform onboarding funnel data - NO MOCK FALLBACK
  const onboardingFunnelData = useMemo(() => {
    if (!onboardingFunnel.data || onboardingFunnel.data.length === 0) {
      return [];
    }
    return onboardingFunnel.data;
  }, [onboardingFunnel.data]);

  // Build stamp card funnel from stamp progress - NO MOCK FALLBACK
  const stampCardFunnelData = useMemo(() => {
    if (!stampProgress.data || stampProgress.data.length === 0) {
      return [];
    }

    // Transform stamp progress into funnel stages
    const stages = [
      { name: 'Started Card (1+)', threshold: 1 },
      { name: '3+ Stamps', threshold: 3 },
      { name: '6+ Stamps', threshold: 6 },
      { name: 'Completed (10)', threshold: 10 },
    ];

    const totalUsers = stampProgress.data.reduce((sum, item) => sum + item.users, 0);

    return stages.map((stage, index) => {
      // Count users at or above this threshold
      const usersAtStage = stampProgress.data
        .filter(item => item.stampCount >= stage.threshold)
        .reduce((sum, item) => sum + item.users, 0);

      return {
        name: stage.name,
        value: usersAtStage,
        fill: `hsl(var(--chart-${index + 1}))`,
      };
    });
  }, [stampProgress.data]);

  // Transform conversion rates for bar chart - NO MOCK FALLBACK
  const conversionData = useMemo(() => {
    if (!primaryFunnel.data?.conversions || primaryFunnel.data.conversions.length === 0) {
      return [];
    }
    return primaryFunnel.data.conversions;
  }, [primaryFunnel.data]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Engagement Funnels</h1>
            <p className="text-muted-foreground mt-1">Track user journey conversion rates</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={refetchAll}
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Error State */}
        {isError && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <ErrorState 
              message="Some data failed to load. Please try refreshing."
              onRetry={refetchAll}
            />
          </div>
        )}

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

        {/* Main Funnel */}
        {primaryFunnel.isLoading ? (
          <ChartCardSkeleton />
        ) : (
          <ChartCard title="Primary User Journey" subtitle="Active Users → Scan QR → Receive Stamp → Post BDL">
            {mainFunnelData.length === 0 ? (
              <EmptyChartState message="No funnel data available" />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <FunnelChart>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                        formatter={(value: number) => [formatNumber(value), 'Users']}
                      />
                      <Funnel dataKey="value" data={mainFunnelData} isAnimationActive>
                        <LabelList position="right" fill="hsl(var(--foreground))" stroke="none" dataKey="name" />
                      </Funnel>
                    </FunnelChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-6 py-4">
                  {funnelSteps.map((step, index) => (
                    <FunnelStep
                      key={step.step}
                      step={step.step}
                      value={step.value}
                      percentage={step.percentage}
                      index={index}
                      totalSteps={funnelSteps.length}
                    />
                  ))}
                </div>
              </div>
            )}
          </ChartCard>
        )}

        {/* Secondary Funnels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {onboardingFunnel.isLoading ? (
            <ChartCardSkeleton />
          ) : (
            <ChartCard title="Onboarding Funnel" subtitle="New user journey">
              {onboardingFunnelData.length === 0 ? (
                <EmptyChartState message="No onboarding data available" />
              ) : (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <FunnelChart>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                        formatter={(value: number) => [formatNumber(value), 'Users']}
                      />
                      <Funnel dataKey="value" data={onboardingFunnelData} isAnimationActive>
                        <LabelList position="right" fill="hsl(var(--foreground))" stroke="none" dataKey="name" />
                      </Funnel>
                    </FunnelChart>
                  </ResponsiveContainer>
                </div>
              )}
            </ChartCard>
          )}

          {stampProgress.isLoading ? (
            <ChartCardSkeleton />
          ) : (
            <ChartCard title="Stamp Card Funnel" subtitle="Card completion journey">
              {stampCardFunnelData.length === 0 ? (
                <EmptyChartState message="No stamp card data available" />
              ) : (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <FunnelChart>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                        formatter={(value: number) => [formatNumber(value), 'Users']}
                      />
                      <Funnel dataKey="value" data={stampCardFunnelData} isAnimationActive>
                        <LabelList position="right" fill="hsl(var(--foreground))" stroke="none" dataKey="name" />
                      </Funnel>
                    </FunnelChart>
                  </ResponsiveContainer>
                </div>
              )}
            </ChartCard>
          )}
        </div>

        {/* Conversion Rates */}
        {primaryFunnel.isLoading ? (
          <ChartCardSkeleton />
        ) : (
          <ChartCard title="Stage Conversion Rates" subtitle="Percentage conversion at each step">
            {conversionData.length === 0 ? (
              <EmptyChartState message="No conversion data available" />
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={conversionData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      type="number" 
                      domain={[0, 100]} 
                      tickFormatter={(v) => `${v}%`} 
                      stroke="hsl(var(--muted-foreground))" 
                    />
                    <YAxis 
                      dataKey="stage" 
                      type="category" 
                      width={100} 
                      stroke="hsl(var(--muted-foreground))" 
                    />
                    <Tooltip
                      formatter={(value: number) => [`${value}%`, 'Conversion Rate']}
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="rate" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </ChartCard>
        )}
      </div>
    </DashboardLayout>
  );
}