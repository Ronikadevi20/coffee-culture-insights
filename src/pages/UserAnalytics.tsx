import { Users, UserPlus, RefreshCw, Scan, Stamp, Crown, Smartphone } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { ChartCard } from '@/components/dashboard/ChartCard';

const retentionData = [
  { day: 'Day 1', users: 100 },
  { day: 'Day 7', users: 72 },
  { day: 'Day 14', users: 58 },
  { day: 'Day 30', users: 45 },
  { day: 'Day 60', users: 38 },
  { day: 'Day 90', users: 32 },
];

const scanFrequencyData = [
  { range: '0-1', users: 2400 },
  { range: '2-5', users: 5800 },
  { range: '6-10', users: 3200 },
  { range: '11-20', users: 1800 },
  { range: '20+', users: 800 },
];

const deviceData = [
  { name: 'iOS', value: 58, color: 'hsl(24, 35%, 48%)' },
  { name: 'Android', value: 42, color: 'hsl(32, 44%, 72%)' },
];

const hourlyActivity = [
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

const topUsers = [
  { id: 'USR-001', scans: 127, stamps: 89, bdl: 34 },
  { id: 'USR-002', scans: 112, stamps: 78, bdl: 45 },
  { id: 'USR-003', scans: 98, stamps: 65, bdl: 28 },
  { id: 'USR-004', scans: 94, stamps: 61, bdl: 22 },
  { id: 'USR-005', scans: 89, stamps: 58, bdl: 31 },
];

const UserAnalytics = () => {
  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">User Analytics</h1>
        <p className="text-muted-foreground">Deep dive into user behavior, engagement patterns, and demographics.</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
        <MetricCard title="Total Users" value="24,582" change={12.5} icon={<Users className="w-6 h-6" />} delay={0} />
        <MetricCard title="Daily Signups" value="347" change={24.2} icon={<UserPlus className="w-6 h-6" />} delay={0.05} />
        <MetricCard title="Returning Users" value="68%" change={3.1} icon={<RefreshCw className="w-6 h-6" />} delay={0.1} />
        <MetricCard title="Avg Scans/User" value="4.2" change={8.5} icon={<Scan className="w-6 h-6" />} delay={0.15} />
        <MetricCard title="Avg Stamps" value="2.8" change={5.7} icon={<Stamp className="w-6 h-6" />} delay={0.2} />
        <MetricCard title="Power Users" value="1,247" change={18.3} icon={<Crown className="w-6 h-6" />} delay={0.25} />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartCard title="User Retention Curve" subtitle="Percentage of users active over time" delay={0.3}>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={retentionData}>
              <defs>
                <linearGradient id="retentionGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(28, 60%, 55%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(28, 60%, 55%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(32, 30%, 85%)" strokeOpacity={0.5} />
              <XAxis dataKey="day" tick={{ fill: 'hsl(16, 20%, 45%)', fontSize: 12 }} axisLine={{ stroke: 'hsl(32, 30%, 85%)' }} tickLine={false} />
              <YAxis tick={{ fill: 'hsl(16, 20%, 45%)', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(0, 0%, 100%)', border: '1px solid hsl(32, 30%, 85%)', borderRadius: '8px' }} />
              <Area type="monotone" dataKey="users" stroke="hsl(28, 60%, 55%)" strokeWidth={2} fill="url(#retentionGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Scanning Frequency" subtitle="Distribution of scans per user" delay={0.35}>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={scanFrequencyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(32, 30%, 85%)" strokeOpacity={0.5} vertical={false} />
              <XAxis dataKey="range" tick={{ fill: 'hsl(16, 20%, 45%)', fontSize: 12 }} axisLine={{ stroke: 'hsl(32, 30%, 85%)' }} tickLine={false} />
              <YAxis tick={{ fill: 'hsl(16, 20%, 45%)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(0, 0%, 100%)', border: '1px solid hsl(32, 30%, 85%)', borderRadius: '8px' }} />
              <Bar dataKey="users" fill="hsl(24, 35%, 48%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <ChartCard title="Most Active Hours" subtitle="User activity throughout the day" delay={0.4} className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={hourlyActivity}>
              <defs>
                <linearGradient id="hourlyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(24, 35%, 48%)" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="hsl(24, 35%, 48%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(32, 30%, 85%)" strokeOpacity={0.5} />
              <XAxis dataKey="hour" tick={{ fill: 'hsl(16, 20%, 45%)', fontSize: 11 }} axisLine={{ stroke: 'hsl(32, 30%, 85%)' }} tickLine={false} />
              <YAxis tick={{ fill: 'hsl(16, 20%, 45%)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(0, 0%, 100%)', border: '1px solid hsl(32, 30%, 85%)', borderRadius: '8px' }} />
              <Area type="monotone" dataKey="users" stroke="hsl(24, 35%, 48%)" strokeWidth={2} fill="url(#hourlyGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Device Distribution" subtitle="iOS vs Android users" delay={0.45}>
          <div className="flex flex-col items-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={deviceData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value">
                  {deviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex gap-6 mt-2">
              {deviceData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-foreground">{item.name}</span>
                  <span className="text-sm font-semibold text-muted-foreground">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>
      </div>

      {/* Top Users Table */}
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
              {topUsers.map((user, index) => (
                <tr key={user.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-4">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground text-xs font-bold">
                      {index + 1}
                    </div>
                  </td>
                  <td className="py-3 px-4 font-medium text-foreground">{user.id}</td>
                  <td className="py-3 px-4 text-right text-foreground">{user.scans}</td>
                  <td className="py-3 px-4 text-right text-foreground">{user.stamps}</td>
                  <td className="py-3 px-4 text-right text-foreground">{user.bdl}</td>
                  <td className="py-3 px-4 text-right">
                    <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                      {user.scans + user.stamps * 2 + user.bdl * 3}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartCard>
    </DashboardLayout>
  );
};

export default UserAnalytics;
