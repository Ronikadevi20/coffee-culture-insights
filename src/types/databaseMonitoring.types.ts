/**
 * Database Monitoring Types
 * Types for database health, logs, and performance metrics
 */

// Database Log Entry
export interface DatabaseLog {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error';
  message: string;
  source: string;
  query?: string;
  executionTime?: number;
  rowsAffected?: number;
  metadata?: Record<string, unknown>;
}

// Database Logs Response
export interface DatabaseLogsResponse {
  logs: DatabaseLog[];
  total: number;
}

// Connection Pool Stats
export interface ConnectionPoolStats {
  active: number;
  idle: number;
  waiting: number;
  max: number;
}

// Query Statistics
export interface QueryStats {
  avgExecutionTime: number;
  slowQueries: number;
  totalQueries: number;
  queriesPerSecond: number;
}

// Table Statistics
export interface TableStats {
  tableName: string;
  rowCount: number;
  size: string;
  indexes: number;
  lastUpdate: string;
}

// System Health Metrics
export interface SystemHealthMetrics {
  uptime: number;
  memoryUsage: number;
  cacheHitRate: number;
}

// Database Performance Metrics
export interface DatabasePerformanceMetrics {
  connectionPool: ConnectionPoolStats;
  queryStats: QueryStats;
  tableStats: TableStats[];
  systemHealth: SystemHealthMetrics;
}

// Slow Query
export interface SlowQuery {
  query: string;
  executionTime: number;
  timestamp: string;
  tableName?: string;
  affectedRows?: number;
  optimization?: string;
}

// Database Error
export interface DatabaseError {
  id: string;
  timestamp: string;
  errorType: string;
  message: string;
  query?: string;
  stackTrace?: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
}

// Query Performance Data
export interface QueryPerformanceData {
  table: string;
  queries: number;
  avgTime: number;
  slowestQuery?: number;
  fastestQuery?: number;
}

// Connection Data (time series)
export interface ConnectionData {
  time: string;
  connections: number;
  activeQueries: number;
}

// Database Health Status
export interface DatabaseHealthStatus {
  status: 'healthy' | 'degraded' | 'critical';
  databaseSize: string;
  storageUsed: number;
  avgQueryTime: number;
  totalQueries: number;
  errors24h: number;
  warnings24h: number;
  lastBackup?: string;
  replicationStatus?: 'synced' | 'lagging' | 'stopped';
}