import { Stamp, Gift, Clock, Trophy, TrendingUp, Users } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { ChartCard } from '@/components/dashboard/ChartCard';
import { EngagementFunnelChart } from '@/components/charts/EngagementFunnelChart';
import { motion } from 'framer-motion';

const stampsTrend = [
  { date: 'Mon', stamps: 720 },
  { date: 'Tue', stamps: 680 },
  { date: 'Wed', stamps: 890 },
  { date: 'Thu', stamps: 1020 },
  { date: 'Fri', stamps: 1340 },
  { date: 'Sat', stamps: 1680 },
  { date: 'Sun', stamps: 1420 },
];

const redemptionsByCafe = [
  { name: 'The Roastery', redemptions: 89, color: 'hsl(24, 35%, 48%)' },
  { name: 'Café Brew', redemptions: 72, color: 'hsl(28, 60%, 55%)' },
  { name: 'Bean Scene', redemptions: 54, color: 'hsl(32, 44%, 72%)' },
  { name: 'Mocha House', redemptions: 48, color: 'hsl(16, 25%, 38%)' },
  { name: 'Latte Art', redemptions: 39, color: 'hsl(17, 27%, 18%)' },
];

const stampProgress = [
  { stamps: 1, users: 2840 },
  { stamps: 2, users: 2456 },
  { stamps: 3, users: 2120 },
  { stamps: 4, users: 1780 },
  { stamps: 5, users: 1420 },
  { stamps: 6, users: 1180 },
  { stamps: 7, users: 890 },
  { stamps: 8, users: 620 },
  { stamps: 9, users: 380 },
  { stamps: 10, users: 245 },
];

const topRedeemers = [
  { id: 'USR-042', stamps: 47, drinks: 4 },
  { id: 'USR-128', stamps: 42, drinks: 4 },
  { id: 'USR-089', stamps: 38, drinks: 3 },
  { id: 'USR-215', stamps: 35, drinks: 3 },
  { id: 'USR-067', stamps: 31, drinks: 3 },
];

const StampsEconomy = () => {
  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">Stamps Economy</h1>
        <p className="text-muted-foreground">Track stamp collection, redemptions, and loyalty program effectiveness.</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
        <MetricCard title="Stamps Issued Today" value="5,621" change={8.7} icon={<Stamp className="w-6 h-6" />} delay={0} />
        <MetricCard title="Free Drinks Redeemed" value="342" change={15.2} icon={<Gift className="w-6 h-6" />} delay={0.05} />
        <MetricCard title="Avg Completion Time" value="18 days" change={-12.5} icon={<Clock className="w-6 h-6" />} delay={0.1} />
        <MetricCard title="Cards Completed" value="1,247" change={22.4} icon={<Trophy className="w-6 h-6" />} delay={0.15} />
        <MetricCard title="Active Collectors" value="8,942" change={9.3} icon={<Users className="w-6 h-6" />} delay={0.2} />
        <MetricCard title="Retention Impact" value="+34%" change={5.8} icon={<TrendingUp className="w-6 h-6" />} delay={0.25} />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartCard title="Weekly Stamps Trend" subtitle="Stamps collected over the past week" delay={0.3}>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={stampsTrend}>
              <defs>
                <linearGradient id="stampsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(28, 60%, 55%)" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="hsl(28, 60%, 55%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(32, 30%, 85%)" strokeOpacity={0.5} />
              <XAxis dataKey="date" tick={{ fill: 'hsl(16, 20%, 45%)', fontSize: 12 }} axisLine={{ stroke: 'hsl(32, 30%, 85%)' }} tickLine={false} />
              <YAxis tick={{ fill: 'hsl(16, 20%, 45%)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(0, 0%, 100%)', border: '1px solid hsl(32, 30%, 85%)', borderRadius: '8px' }} />
              <Area type="monotone" dataKey="stamps" stroke="hsl(28, 60%, 55%)" strokeWidth={2} fill="url(#stampsGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Redemptions by Café" subtitle="Free drinks redeemed per location" delay={0.35}>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={redemptionsByCafe} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(32, 30%, 85%)" strokeOpacity={0.5} horizontal={true} vertical={false} />
              <XAxis type="number" tick={{ fill: 'hsl(16, 20%, 45%)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fill: 'hsl(16, 20%, 45%)', fontSize: 11 }} axisLine={false} tickLine={false} width={90} />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(0, 0%, 100%)', border: '1px solid hsl(32, 30%, 85%)', borderRadius: '8px' }} />
              <Bar dataKey="redemptions" radius={[0, 4, 4, 0]}>
                {redemptionsByCafe.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartCard title="Stamp Progress Distribution" subtitle="Users at each stamp count (out of 10)" delay={0.4}>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={stampProgress}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(32, 30%, 85%)" strokeOpacity={0.5} vertical={false} />
              <XAxis dataKey="stamps" tick={{ fill: 'hsl(16, 20%, 45%)', fontSize: 12 }} axisLine={{ stroke: 'hsl(32, 30%, 85%)' }} tickLine={false} />
              <YAxis tick={{ fill: 'hsl(16, 20%, 45%)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(0, 0%, 100%)', border: '1px solid hsl(32, 30%, 85%)', borderRadius: '8px' }} />
              <Bar dataKey="users" fill="hsl(24, 35%, 48%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Stamp to Reward Funnel" subtitle="Journey from scan to free drink" delay={0.45}>
          <EngagementFunnelChart />
        </ChartCard>
      </div>

      {/* Top Redeemers */}
      <ChartCard title="Top Stamp Collectors" subtitle="Users with most stamps and redemptions" delay={0.5}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Rank</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">User ID</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Total Stamps</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Free Drinks</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {topRedeemers.map((user, index) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                >
                  <td className="py-4 px-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground text-sm font-bold">
                      {index + 1}
                    </div>
                  </td>
                  <td className="py-4 px-4 font-medium text-foreground">{user.id}</td>
                  <td className="py-4 px-4 text-right">
                    <span className="inline-flex items-center gap-1 text-foreground">
                      <Stamp className="w-4 h-4 text-primary" />
                      {user.stamps}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="inline-flex items-center gap-1 text-foreground">
                      <Gift className="w-4 h-4 text-accent" />
                      {user.drinks}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                      {user.stamps >= 40 ? 'VIP' : user.stamps >= 20 ? 'Regular' : 'New'}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartCard>
    </DashboardLayout>
  );
};

export default StampsEconomy;
