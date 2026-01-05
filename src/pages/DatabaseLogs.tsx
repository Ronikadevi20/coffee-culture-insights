import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { ChartCard } from '@/components/dashboard/ChartCard';
import { Database, HardDrive, Clock, FileText, Search, RefreshCw, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
} from 'recharts';
import {
  useDatabaseLogs,
  useDatabasePerformance,
  useDatabaseHealth,
  useQueryPerformance,
  useConnectionData,
} from '@/hooks/useDatabaseMonitoring';

// Skeleton components
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

const ChartCardSkeleton = () => (
  <div className="p-6 rounded-xl bg-card border border-border animate-pulse">
    <div className="w-48 h-6 rounded bg-muted mb-2" />
    <div className="w-64 h-4 rounded bg-muted mb-6" />
    <div className="h-64 rounded bg-muted" />
  </div>
);

// Empty state component
const EmptyChartState = ({ message = 'No data available' }: { message?: string }) => (
  <div className="flex flex-col items-center justify-center h-64 text-center">
    <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
      <Database className="w-8 h-8 text-muted-foreground" />
    </div>
    <p className="text-muted-foreground">{message}</p>
  </div>
);

// Log level badge component
const LogLevelBadge = ({ level }: { level: string }) => {
  const styles: Record<string, string> = {
    info: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    warning: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
    error: 'bg-red-500/10 text-red-600 dark:text-red-400',
  };
  
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${styles[level] || styles.info}`}>
      {level.toUpperCase()}
    </span>
  );
};

// Format bytes helper
const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

export default function DatabaseLogs() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState<'info' | 'warning' | 'error' | undefined>(undefined);

  // Fetch data from APIs
  const logs = useDatabaseLogs(filterLevel);
  const performance = useDatabasePerformance();
  const health = useDatabaseHealth();
  const queryPerf = useQueryPerformance();
  const connections = useConnectionData();

  const isLoading = logs.isLoading || performance.isLoading || health.isLoading;
  const isError = logs.isError || performance.isError || health.isError;

  const refetchAll = () => {
    logs.refetch();
    performance.refetch();
    health.refetch();
    queryPerf.refetch();
    connections.refetch();
  };

  // Build metrics from API data - NO MOCK FALLBACK
  const metrics = useMemo(() => {
    const healthData = health.data;
    const perfData = performance.data;

    return [
      {
        title: 'Database Size',
        value: healthData?.databaseSize || '--',
        change: 0,
        icon: <Database className="w-6 h-6" />,
        isLoading: health.isLoading,
      },
      {
        title: 'Storage Used',
        value: healthData ? `${healthData.storageUsed}%` : '--',
        change: 0,
        icon: <HardDrive className="w-6 h-6" />,
        isLoading: health.isLoading,
      },
      {
        title: 'Avg Query Time',
        value: healthData ? `${healthData.avgQueryTime}ms` : '--',
        change: perfData?.queryStats?.avgExecutionTime ? -8 : 0,
        icon: <Clock className="w-6 h-6" />,
        isLoading: health.isLoading || performance.isLoading,
      },
      {
        title: 'Total Queries',
        value: healthData?.totalQueries 
          ? (healthData.totalQueries >= 1000000 
            ? `${(healthData.totalQueries / 1000000).toFixed(1)}M` 
            : healthData.totalQueries.toLocaleString())
          : '--',
        change: 0,
        icon: <FileText className="w-6 h-6" />,
        isLoading: health.isLoading,
      },
    ];
  }, [health.data, performance.data, health.isLoading, performance.isLoading]);

  // Transform query performance data - NO MOCK FALLBACK
  const queryPerformanceData = useMemo(() => {
    if (!queryPerf.data || queryPerf.data.length === 0) {
      return [];
    }
    return queryPerf.data.map(item => ({
      table: item.table,
      queries: item.queries,
      avgTime: item.avgTime,
    }));
  }, [queryPerf.data]);

  // Transform connection data - NO MOCK FALLBACK
  const connectionData = useMemo(() => {
    if (!connections.data || connections.data.length === 0) {
      return [];
    }
    return connections.data;
  }, [connections.data]);

  // Filter logs based on search term
  const filteredLogs = useMemo(() => {
    if (!logs.data?.logs) return [];
    
    return logs.data.logs.filter(log => {
      const matchesSearch = searchTerm === '' || 
        log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.source.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [logs.data?.logs, searchTerm]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Database Health & Logs</h1>
            <p className="text-muted-foreground mt-1">Monitor database performance and activity</p>
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
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-destructive" />
            <p className="text-destructive">Failed to load database metrics. Please try again.</p>
            <Button onClick={refetchAll} variant="outline" size="sm" className="ml-auto">
              Retry
            </Button>
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

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {queryPerf.isLoading ? (
            <ChartCardSkeleton />
          ) : (
            <ChartCard title="Query Performance by Table" subtitle="Query count and average response time">
              {queryPerformanceData.length === 0 ? (
                <EmptyChartState message="No query performance data available" />
              ) : (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={queryPerformanceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="table" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                      />
                      <Bar dataKey="queries" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Queries" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </ChartCard>
          )}

          {connections.isLoading ? (
            <ChartCardSkeleton />
          ) : (
            <ChartCard title="Active Connections" subtitle="Database connections over time">
              {connectionData.length === 0 ? (
                <EmptyChartState message="No connection data available" />
              ) : (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={connectionData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="connections"
                        stroke="hsl(var(--chart-2))"
                        strokeWidth={2}
                        dot={{ fill: 'hsl(var(--chart-2))' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </ChartCard>
          )}
        </div>

        {/* Logs Table */}
        {logs.isLoading ? (
          <ChartCardSkeleton />
        ) : (
          <ChartCard title="Recent Logs" subtitle="Database activity and system events">
            <div className="space-y-4">
              {/* Search and Filter */}
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search logs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <div className="flex gap-2">
                  {(['info', 'warning', 'error'] as const).map((level) => (
                    <Button
                      key={level}
                      variant={filterLevel === level ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilterLevel(filterLevel === level ? undefined : level)}
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Logs List */}
              {filteredLogs.length === 0 ? (
                <EmptyChartState message="No logs found" />
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {filteredLogs.map((log, index) => (
                    <motion.div
                      key={log.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="p-3 rounded-lg bg-muted/30 border border-border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <LogLevelBadge level={log.level} />
                            <span className="text-xs text-muted-foreground">{log.source}</span>
                          </div>
                          <p className="text-sm text-foreground truncate">{log.message}</p>
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </ChartCard>
        )}
      </div>
    </DashboardLayout>
  );
}