import { Users, Store, QrCode, Camera, Stamp, TrendingUp, Clock, Activity } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { ChartCard } from '@/components/dashboard/ChartCard';
import { DailyActiveUsersChart } from '@/components/charts/DailyActiveUsersChart';
import { ScansPerCafeChart } from '@/components/charts/ScansPerCafeChart';
import { ActivityHeatmap } from '@/components/charts/ActivityHeatmap';
import { BDLDistributionChart } from '@/components/charts/BDLDistributionChart';
import { EngagementFunnelChart } from '@/components/charts/EngagementFunnelChart';

const metrics = [
  { title: 'Total Users', value: '24,582', change: 12.5, changeLabel: 'vs last week', icon: <Users className="w-6 h-6" /> },
  { title: 'Active Cafés', value: '142', change: 3.2, changeLabel: '4 new this month', icon: <Store className="w-6 h-6" /> },
  { title: 'Total Scans Today', value: '8,247', change: 18.3, changeLabel: 'vs yesterday', icon: <QrCode className="w-6 h-6" /> },
  { title: 'BDL Posts Today', value: '1,892', change: -2.1, changeLabel: 'vs yesterday', icon: <Camera className="w-6 h-6" /> },
  { title: 'Stamps Collected', value: '5,621', change: 8.7, changeLabel: 'vs last week', icon: <Stamp className="w-6 h-6" /> },
  { title: 'New Users Today', value: '347', change: 24.2, changeLabel: 'vs yesterday', icon: <TrendingUp className="w-6 h-6" /> },
  { title: 'Peak Usage Hour', value: '7:00 PM', change: 0, changeLabel: 'Evening rush', icon: <Clock className="w-6 h-6" /> },
  { title: 'Avg Session', value: '4m 32s', change: 5.4, changeLabel: 'vs last week', icon: <Activity className="w-6 h-6" /> },
];

const Dashboard = () => {
  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">Dashboard Overview</h1>
        <p className="text-muted-foreground">Welcome back. Here's what's happening across the Coffee Culture ecosystem.</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {metrics.map((metric, index) => (
          <MetricCard
            key={metric.title}
            {...metric}
            delay={index * 0.05}
          />
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartCard title="Daily Active Users" subtitle="User activity over the past week" delay={0.3}>
          <DailyActiveUsersChart />
        </ChartCard>
        <ChartCard title="Scans per Café" subtitle="Top performing locations" delay={0.35}>
          <ScansPerCafeChart />
        </ChartCard>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <ChartCard title="User Activity Heatmap" subtitle="Activity by hour and day" delay={0.4} className="lg:col-span-2">
          <ActivityHeatmap />
        </ChartCard>
        <ChartCard title="BDL Distribution" subtitle="Post visibility breakdown" delay={0.45}>
          <BDLDistributionChart />
        </ChartCard>
      </div>

      {/* Engagement Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Engagement Funnel" subtitle="User journey from app open to rewards" delay={0.5}>
          <EngagementFunnelChart />
        </ChartCard>

        {/* Top Cafés Table */}
        <ChartCard title="Top Performing Cafés" subtitle="Ranked by total engagement" delay={0.55}>
          <div className="space-y-3">
            {[
              { rank: 1, name: 'The Roastery', scans: 1420, change: 12 },
              { rank: 2, name: 'Café Brew', scans: 1180, change: 8 },
              { rank: 3, name: 'Bean Scene', scans: 980, change: -3 },
              { rank: 4, name: 'Mocha House', scans: 850, change: 15 },
              { rank: 5, name: 'Latte Art', scans: 720, change: 5 },
            ].map((cafe) => (
              <div
                key={cafe.rank}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground text-sm font-bold">
                    {cafe.rank}
                  </div>
                  <span className="font-medium text-foreground">{cafe.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">{cafe.scans.toLocaleString()} scans</span>
                  <span className={`text-xs font-medium ${cafe.change > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                    {cafe.change > 0 ? '+' : ''}{cafe.change}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
