import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { ChartCard } from '@/components/dashboard/ChartCard';
import { Activity, Zap, AlertTriangle, Smartphone, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const latencyData = [
  { time: '00:00', latency: 45 },
  { time: '04:00', latency: 38 },
  { time: '08:00', latency: 62 },
  { time: '12:00', latency: 85 },
  { time: '16:00', latency: 72 },
  { time: '20:00', latency: 58 },
  { time: '24:00', latency: 42 },
];

const errorData = [
  { date: 'Mon', errors: 12, warnings: 24 },
  { date: 'Tue', errors: 8, warnings: 18 },
  { date: 'Wed', errors: 15, warnings: 32 },
  { date: 'Thu', errors: 6, warnings: 14 },
  { date: 'Fri', errors: 9, warnings: 21 },
  { date: 'Sat', errors: 4, warnings: 12 },
  { date: 'Sun', errors: 3, warnings: 8 },
];

const versionData = [
  { name: 'iOS 3.2.1', value: 45, color: 'hsl(var(--chart-1))' },
  { name: 'iOS 3.2.0', value: 25, color: 'hsl(var(--chart-2))' },
  { name: 'Android 3.2.1', value: 20, color: 'hsl(var(--chart-3))' },
  { name: 'Android 3.2.0', value: 10, color: 'hsl(var(--chart-4))' },
];

const services = [
  { name: 'API Gateway', status: 'operational', uptime: '99.98%' },
  { name: 'Authentication', status: 'operational', uptime: '99.99%' },
  { name: 'Database', status: 'operational', uptime: '99.95%' },
  { name: 'Storage', status: 'operational', uptime: '99.97%' },
  { name: 'Push Notifications', status: 'degraded', uptime: '98.50%' },
  { name: 'Analytics', status: 'operational', uptime: '99.92%' },
];

const StatusBadge = ({ status }: { status: string }) => {
  const isOperational = status === 'operational';
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
      isOperational 
        ? 'bg-green-500/10 text-green-600 dark:text-green-400' 
        : 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'
    }`}>
      {isOperational ? <CheckCircle className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default function PlatformHealth() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Platform Health</h1>
          <p className="text-muted-foreground mt-1">Monitor system performance and status</p>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="System Uptime"
            value="99.97%"
            change={0.02}
            icon={<Activity className="w-6 h-6" />}
          />
          <MetricCard
            title="Avg Latency"
            value="58ms"
            change={-12}
            icon={<Zap className="w-6 h-6" />}
          />
          <MetricCard
            title="Error Rate"
            value="0.12%"
            change={-0.05}
            icon={<AlertTriangle className="w-6 h-6" />}
          />
          <MetricCard
            title="Active Users"
            value="3,847"
            change={8.3}
            icon={<Smartphone className="w-6 h-6" />}
          />
        </div>

        {/* Service Status */}
        <ChartCard title="Service Status" subtitle="Real-time infrastructure health">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service, index) => (
              <motion.div
                key={service.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 rounded-lg bg-muted/30 border border-border"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-foreground">{service.name}</span>
                  <StatusBadge status={service.status} />
                </div>
                <p className="text-sm text-muted-foreground">Uptime: {service.uptime}</p>
              </motion.div>
            ))}
          </div>
        </ChartCard>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="API Latency" subtitle="Response time in milliseconds">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={latencyData}>
                  <defs>
                    <linearGradient id="latencyGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    formatter={(value: number) => [`${value}ms`, 'Latency']}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="latency"
                    stroke="hsl(var(--primary))"
                    fill="url(#latencyGradient)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard title="App Version Distribution" subtitle="Active installs by version">
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={versionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    labelLine={false}
                  >
                    {versionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        {/* Error Tracking */}
        <ChartCard title="Error & Warning Trends" subtitle="Issues tracked over the past week">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={errorData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
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
                  dataKey="errors"
                  stroke="hsl(var(--destructive))"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--destructive))' }}
                  name="Errors"
                />
                <Line
                  type="monotone"
                  dataKey="warnings"
                  stroke="hsl(var(--chart-4))"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--chart-4))' }}
                  name="Warnings"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>
    </DashboardLayout>
  );
}
