import { useState, useMemo } from 'react';
import { Brain, Lightbulb, TrendingUp, AlertTriangle, Sparkles, Target, RefreshCw } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ChartCard } from '@/components/dashboard/ChartCard';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useAIInsights, useChurnRiskUsers } from '@/hooks/useAIInsights';
import { AIPrediction, AnomalyDetection, AIRecommendation } from '@/types/aiInsights.types';

// Skeleton components
const PredictionCardSkeleton = () => (
  <div className="metric-card border-l-4 border-l-muted animate-pulse">
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-lg bg-muted" />
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <div className="w-32 h-5 bg-muted rounded" />
          <div className="w-20 h-5 bg-muted rounded-full" />
        </div>
        <div className="w-full h-4 bg-muted rounded mb-2" />
        <div className="w-3/4 h-4 bg-muted rounded" />
      </div>
    </div>
  </div>
);

const ChartCardSkeleton = () => (
  <div className="p-6 rounded-xl bg-card border border-border animate-pulse">
    <div className="w-48 h-6 rounded bg-muted mb-2" />
    <div className="w-64 h-4 rounded bg-muted mb-6" />
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-20 bg-muted rounded-lg" />
      ))}
    </div>
  </div>
);

// Empty state component
const EmptyState = ({ message = 'No data available' }: { message?: string }) => (
  <div className="flex flex-col items-center justify-center py-8 text-center">
    <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
      <Brain className="w-8 h-8 text-muted-foreground" />
    </div>
    <p className="text-muted-foreground">{message}</p>
  </div>
);

// Get icon component based on prediction type
const getPredictionIcon = (type: AIPrediction['type']) => {
  switch (type) {
    case 'warning':
      return AlertTriangle;
    case 'opportunity':
      return Sparkles;
    case 'recommendation':
      return Target;
    default:
      return TrendingUp;
  }
};

// Get styles based on prediction type
const getPredictionStyles = (type: AIPrediction['type']) => {
  switch (type) {
    case 'warning':
      return {
        border: 'border-l-amber-500',
        icon: 'bg-amber-500/10 text-amber-500',
      };
    case 'opportunity':
      return {
        border: 'border-l-emerald-500',
        icon: 'bg-emerald-500/10 text-emerald-500',
      };
    case 'recommendation':
      return {
        border: 'border-l-primary',
        icon: 'bg-primary/10 text-primary',
      };
    default:
      return {
        border: 'border-l-accent',
        icon: 'bg-accent/10 text-accent',
      };
  }
};

const AIInsights = () => {
  const [timeframe] = useState<{ timeframe: 'day' | 'week' | 'month' | 'year' }>({ timeframe: 'week' });

  // Fetch data from APIs
  const insights = useAIInsights(timeframe);
  const churnRisk = useChurnRiskUsers(10);

  const isLoading = insights.isLoading;
  const isError = insights.isError;

  const refetchAll = () => {
    insights.refetch();
    churnRisk.refetch();
  };

  // Transform predictions data - NO MOCK FALLBACK
  const predictions = useMemo(() => {
    if (!insights.data?.predictions || insights.data.predictions.length === 0) {
      return [];
    }
    return insights.data.predictions;
  }, [insights.data]);

  // Transform anomalies data - NO MOCK FALLBACK
  const anomalies = useMemo(() => {
    if (!insights.data?.anomalies || insights.data.anomalies.length === 0) {
      return [];
    }
    return insights.data.anomalies;
  }, [insights.data]);

  // Transform recommendations data - NO MOCK FALLBACK
  const recommendations = useMemo(() => {
    if (!insights.data?.recommendations || insights.data.recommendations.length === 0) {
      return [];
    }
    return insights.data.recommendations;
  }, [insights.data]);

  // Summary data
  const summary = insights.data?.summary;

  // Calculate metrics from data
  const metricsData = useMemo(() => {
    const churnUsers = churnRisk.data || [];
    const highRiskCount = churnUsers.filter(u => u.riskLevel === 'high').length;
    const mediumRiskCount = churnUsers.filter(u => u.riskLevel === 'medium').length;
    
    return [
      {
        title: 'Churn Risk Users',
        value: churnUsers.length > 0 ? churnUsers.length.toString() : '--',
        change: 0,
        icon: <AlertTriangle className="w-6 h-6" />,
        isLoading: churnRisk.isLoading,
      },
      {
        title: 'High Risk',
        value: churnUsers.length > 0 ? highRiskCount.toString() : '--',
        change: 0,
        changeLabel: 'Immediate action',
        icon: <AlertTriangle className="w-6 h-6 text-red-500" />,
        isLoading: churnRisk.isLoading,
      },
      {
        title: 'Medium Risk',
        value: churnUsers.length > 0 ? mediumRiskCount.toString() : '--',
        change: 0,
        changeLabel: 'Monitor closely',
        icon: <AlertTriangle className="w-6 h-6 text-amber-500" />,
        isLoading: churnRisk.isLoading,
      },
      {
        title: 'Opportunities',
        value: summary?.opportunitiesIdentified?.toString() || '--',
        change: 0,
        changeLabel: 'Identified by AI',
        icon: <Sparkles className="w-6 h-6" />,
        isLoading: insights.isLoading,
      },
    ];
  }, [churnRisk.data, churnRisk.isLoading, summary, insights.isLoading]);

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Brain className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">AI Predictions & Insights</h1>
            <p className="text-muted-foreground">Machine learning powered analytics and recommendations.</p>
          </div>
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
        <div className="mb-8 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-destructive">Failed to load AI insights. Please try again.</p>
          <Button onClick={refetchAll} variant="outline" size="sm" className="mt-2">
            Retry
          </Button>
        </div>
      )}

      {/* AI Summary Card */}
      {insights.isLoading ? (
        <div className="mb-8 p-6 rounded-xl bg-muted/30 border border-border animate-pulse">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-muted" />
            <div className="flex-1">
              <div className="w-32 h-6 bg-muted rounded mb-4" />
              <div className="space-y-2">
                <div className="w-full h-4 bg-muted rounded" />
                <div className="w-3/4 h-4 bg-muted rounded" />
              </div>
            </div>
          </div>
        </div>
      ) : summary ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-6 rounded-xl bg-gradient-to-br from-primary/5 to-accent/10 border border-primary/20"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">AI Summary</h3>
              <p className="text-muted-foreground leading-relaxed">
                Today's ecosystem health is{' '}
                <span className={`font-medium ${
                  summary.ecosystemHealth === 'excellent' ? 'text-emerald-600' :
                  summary.ecosystemHealth === 'good' ? 'text-primary' :
                  summary.ecosystemHealth === 'fair' ? 'text-amber-600' :
                  'text-red-600'
                }`}>
                  {summary.ecosystemHealth}
                </span>
                . {summary.keyInsight}
                {summary.urgentActions > 0 && (
                  <span className="text-amber-600 font-medium">
                    {' '}{summary.urgentActions} urgent action{summary.urgentActions !== 1 ? 's' : ''} recommended.
                  </span>
                )}
              </p>
            </div>
          </div>
        </motion.div>
      ) : null}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {metricsData.map((metric, index) => (
          metric.isLoading ? (
            <div key={`skeleton-${index}`} className="p-6 rounded-xl bg-card border border-border animate-pulse">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-muted" />
                <div className="w-16 h-6 rounded bg-muted" />
              </div>
              <div className="w-24 h-8 rounded bg-muted mb-2" />
              <div className="w-32 h-4 rounded bg-muted" />
            </div>
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

      {/* Predictions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {insights.isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <PredictionCardSkeleton key={`pred-skeleton-${i}`} />
          ))
        ) : predictions.length === 0 ? (
          <div className="lg:col-span-2">
            <EmptyState message="No predictions available for this timeframe" />
          </div>
        ) : (
          predictions.map((prediction, index) => {
            const Icon = getPredictionIcon(prediction.type);
            const styles = getPredictionStyles(prediction.type);

            return (
              <motion.div
                key={prediction.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`metric-card border-l-4 ${styles.border}`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${styles.icon}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-foreground">{prediction.title}</h4>
                      <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                        {prediction.confidence}% confidence
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{prediction.description}</p>
                    {prediction.impact && (
                      <p className="text-xs font-medium text-primary mt-2">{prediction.impact}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Anomalies & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {insights.isLoading ? (
          <>
            <ChartCardSkeleton />
            <ChartCardSkeleton />
          </>
        ) : (
          <>
            <ChartCard title="Anomaly Detection" subtitle="Unusual patterns detected by AI" delay={0.4}>
              {anomalies.length === 0 ? (
                <EmptyState message="No anomalies detected" />
              ) : (
                <div className="space-y-3">
                  {anomalies.map((anomaly, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className={`flex items-center justify-between p-4 rounded-lg ${
                        anomaly.severity === 'positive' ? 'bg-emerald-50 dark:bg-emerald-900/20' :
                        anomaly.severity === 'negative' ? 'bg-red-50 dark:bg-red-900/20' :
                        'bg-amber-50 dark:bg-amber-900/20'
                      }`}
                    >
                      <div>
                        <p className="font-medium text-foreground">{anomaly.metric}</p>
                        <p className="text-sm text-muted-foreground">{anomaly.location} • {anomaly.time}</p>
                      </div>
                      <span className={`text-lg font-bold ${
                        anomaly.severity === 'positive' ? 'text-emerald-600' :
                        anomaly.severity === 'negative' ? 'text-red-600' :
                        'text-amber-600'
                      }`}>
                        {anomaly.change}
                      </span>
                    </motion.div>
                  ))}
                </div>
              )}
            </ChartCard>

            <ChartCard title="AI Recommendations" subtitle="Actionable suggestions for growth" delay={0.5}>
              {recommendations.length === 0 ? (
                <EmptyState message="No recommendations available" />
              ) : (
                <div className="space-y-4">
                  {recommendations.map((rec, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="p-4 rounded-lg bg-muted/30 border border-border/50"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Lightbulb className="w-4 h-4 text-accent" />
                          <span className="font-medium text-foreground">{rec.cafe || 'Platform-wide'}</span>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          rec.priority === 'high' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                        }`}>
                          {rec.priority}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{rec.suggestion}</p>
                      <p className="text-xs font-medium text-emerald-600">{rec.impact}</p>
                    </motion.div>
                  ))}
                </div>
              )}
            </ChartCard>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AIInsights;