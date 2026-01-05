/**
 * Database Monitoring Hooks
 * React Query hooks for database health, logs, and performance
 */

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { databaseMonitoringService } from '@/services/databaseMonitoring.service';
import {
  DatabaseLogsResponse,
  DatabasePerformanceMetrics,
  SlowQuery,
  DatabaseError,
  QueryPerformanceData,
  ConnectionData,
  DatabaseHealthStatus,
} from '@/types/databaseMonitoring.types';

// Query keys
export const databaseKeys = {
  all: ['database'] as const,
  logs: (level?: string, limit?: number, offset?: number) => 
    [...databaseKeys.all, 'logs', level, limit, offset] as const,
  performance: () => [...databaseKeys.all, 'performance'] as const,
  slowQueries: (limit: number) => [...databaseKeys.all, 'slowQueries', limit] as const,
  errors: (limit: number) => [...databaseKeys.all, 'errors', limit] as const,
  queryPerformance: () => [...databaseKeys.all, 'queryPerformance'] as const,
  connections: () => [...databaseKeys.all, 'connections'] as const,
  health: () => [...databaseKeys.all, 'health'] as const,
};

/**
 * Hook to fetch database logs
 */
export const useDatabaseLogs = (
  level?: 'info' | 'warning' | 'error',
  limit: number = 100,
  offset: number = 0,
  options?: Omit<UseQueryOptions<DatabaseLogsResponse, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: databaseKeys.logs(level, limit, offset),
    queryFn: () => databaseMonitoringService.getDatabaseLogs(level, limit, offset),
    staleTime: 30 * 1000, // 30 seconds (logs update frequently)
    ...options,
  });
};

/**
 * Hook to fetch database performance metrics
 */
export const useDatabasePerformance = (
  options?: Omit<UseQueryOptions<DatabasePerformanceMetrics, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: databaseKeys.performance(),
    queryFn: () => databaseMonitoringService.getPerformanceMetrics(),
    staleTime: 60 * 1000, // 1 minute
    refetchInterval: 60 * 1000, // Auto-refresh every minute
    ...options,
  });
};

/**
 * Hook to fetch slow queries
 */
export const useSlowQueries = (
  limit: number = 20,
  options?: Omit<UseQueryOptions<SlowQuery[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: databaseKeys.slowQueries(limit),
    queryFn: () => databaseMonitoringService.getSlowQueries(limit),
    staleTime: 2 * 60 * 1000, // 2 minutes
    ...options,
  });
};

/**
 * Hook to fetch database errors
 */
export const useDatabaseErrors = (
  limit: number = 50,
  options?: Omit<UseQueryOptions<DatabaseError[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: databaseKeys.errors(limit),
    queryFn: () => databaseMonitoringService.getDatabaseErrors(limit),
    staleTime: 30 * 1000, // 30 seconds
    ...options,
  });
};

/**
 * Hook to fetch query performance by table
 */
export const useQueryPerformance = (
  options?: Omit<UseQueryOptions<QueryPerformanceData[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: databaseKeys.queryPerformance(),
    queryFn: () => databaseMonitoringService.getQueryPerformance(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    ...options,
  });
};

/**
 * Hook to fetch connection data
 */
export const useConnectionData = (
  options?: Omit<UseQueryOptions<ConnectionData[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: databaseKeys.connections(),
    queryFn: () => databaseMonitoringService.getConnectionData(),
    staleTime: 60 * 1000, // 1 minute
    refetchInterval: 60 * 1000, // Auto-refresh
    ...options,
  });
};

/**
 * Hook to fetch database health status
 */
export const useDatabaseHealth = (
  options?: Omit<UseQueryOptions<DatabaseHealthStatus, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: databaseKeys.health(),
    queryFn: () => databaseMonitoringService.getHealthStatus(),
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 30 * 1000, // Auto-refresh every 30 seconds
    ...options,
  });
};

/**
 * Combined hook for database monitoring dashboard
 */
export const useDatabaseMonitoring = () => {
  const logs = useDatabaseLogs();
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

  return {
    logs,
    performance,
    health,
    queryPerf,
    connections,
    isLoading,
    isError,
    refetchAll,
  };
};