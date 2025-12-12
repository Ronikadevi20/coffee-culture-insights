import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { ChartCard } from '@/components/dashboard/ChartCard';
import { Database, HardDrive, Clock, FileText, Search, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
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

const queryPerformanceData = [
  { table: 'users', queries: 4500, avgTime: 12 },
  { table: 'scans', queries: 8200, avgTime: 8 },
  { table: 'stamps', queries: 3800, avgTime: 15 },
  { table: 'bdl_posts', queries: 2400, avgTime: 22 },
  { table: 'cafes', queries: 1200, avgTime: 6 },
];

const connectionData = [
  { time: '00:00', connections: 45 },
  { time: '04:00', connections: 28 },
  { time: '08:00', connections: 82 },
  { time: '12:00', connections: 156 },
  { time: '16:00', connections: 134 },
  { time: '20:00', connections: 98 },
  { time: '24:00', connections: 52 },
];

const logs = [
  { id: 1, timestamp: '2024-01-15 14:32:15', level: 'info', message: 'Database backup completed successfully', source: 'backup_service' },
  { id: 2, timestamp: '2024-01-15 14:28:42', level: 'warning', message: 'Slow query detected on scans table (>500ms)', source: 'query_monitor' },
  { id: 3, timestamp: '2024-01-15 14:25:18', level: 'info', message: 'Index optimization completed for users table', source: 'maintenance' },
  { id: 4, timestamp: '2024-01-15 14:20:55', level: 'error', message: 'Connection pool exhausted temporarily', source: 'connection_manager' },
  { id: 5, timestamp: '2024-01-15 14:15:33', level: 'info', message: 'Replication lag within acceptable range (15ms)', source: 'replication' },
  { id: 6, timestamp: '2024-01-15 14:10:21', level: 'info', message: 'Vacuum process completed on stamps table', source: 'maintenance' },
  { id: 7, timestamp: '2024-01-15 14:05:08', level: 'warning', message: 'High memory usage detected (78%)', source: 'resource_monitor' },
  { id: 8, timestamp: '2024-01-15 14:00:00', level: 'info', message: 'Scheduled health check passed', source: 'health_check' },
];

const LogLevelBadge = ({ level }: { level: string }) => {
  const styles = {
    info: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    warning: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
    error: 'bg-red-500/10 text-red-600 dark:text-red-400',
  };
  
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${styles[level as keyof typeof styles]}`}>
      {level.toUpperCase()}
    </span>
  );
};

export default function DatabaseLogs() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState<string | null>(null);

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.source.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = !filterLevel || log.level === filterLevel;
    return matchesSearch && matchesFilter;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Database Health & Logs</h1>
          <p className="text-muted-foreground mt-1">Monitor database performance and activity</p>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Database Size"
            value="2.4 GB"
            change={5.2}
            icon={<Database className="w-6 h-6" />}
          />
          <MetricCard
            title="Storage Used"
            value="68%"
            change={2.1}
            icon={<HardDrive className="w-6 h-6" />}
          />
          <MetricCard
            title="Avg Query Time"
            value="12ms"
            change={-8}
            icon={<Clock className="w-6 h-6" />}
          />
          <MetricCard
            title="Total Queries"
            value="1.2M"
            change={15.3}
            icon={<FileText className="w-6 h-6" />}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="Query Performance by Table" subtitle="Query count and average response time">
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
          </ChartCard>

          <ChartCard title="Active Connections" subtitle="Database connections over time">
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
          </ChartCard>
        </div>

        {/* Logs Table */}
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
                {['info', 'warning', 'error'].map((level) => (
                  <Button
                    key={level}
                    variant={filterLevel === level ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterLevel(filterLevel === level ? null : level)}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            {/* Logs List */}
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
                      {log.timestamp}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </ChartCard>
      </div>
    </DashboardLayout>
  );
}
