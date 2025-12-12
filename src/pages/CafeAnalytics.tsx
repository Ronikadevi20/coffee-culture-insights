import { useState } from 'react';
import { motion } from 'framer-motion';
import { Store, TrendingUp, Users, QrCode, Camera, Search, ChevronRight, MapPin, Star } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { ChartCard } from '@/components/dashboard/ChartCard';

const cafes = [
  { id: 1, name: 'The Roastery', location: 'Clifton', scans: 1420, bdl: 342, stamps: 890, visits: 2100, rating: 4.8, change: 12 },
  { id: 2, name: 'Café Brew', location: 'DHA Phase 6', scans: 1180, bdl: 289, stamps: 720, visits: 1850, rating: 4.7, change: 8 },
  { id: 3, name: 'Bean Scene', location: 'Zamzama', scans: 980, bdl: 234, stamps: 540, visits: 1520, rating: 4.6, change: -3 },
  { id: 4, name: 'Mocha House', location: 'Bahadurabad', scans: 850, bdl: 198, stamps: 480, visits: 1340, rating: 4.5, change: 15 },
  { id: 5, name: 'Latte Art', location: 'Gulshan', scans: 720, bdl: 167, stamps: 390, visits: 1120, rating: 4.4, change: 5 },
  { id: 6, name: 'Espresso Lab', location: 'Defence', scans: 640, bdl: 145, stamps: 320, visits: 980, rating: 4.3, change: 22 },
  { id: 7, name: 'The Coffee Pod', location: 'North Nazimabad', scans: 580, bdl: 132, stamps: 290, visits: 890, rating: 4.2, change: -1 },
  { id: 8, name: 'Brew Masters', location: 'Tariq Road', scans: 520, bdl: 118, stamps: 260, visits: 810, rating: 4.1, change: 7 },
];

const trendData = [
  { date: 'Mon', scans: 4200, visits: 5800 },
  { date: 'Tue', scans: 3800, visits: 5200 },
  { date: 'Wed', scans: 4500, visits: 6100 },
  { date: 'Thu', scans: 5200, visits: 7000 },
  { date: 'Fri', scans: 6800, visits: 8500 },
  { date: 'Sat', scans: 8200, visits: 10200 },
  { date: 'Sun', scans: 7400, visits: 9100 },
];

const CafeAnalytics = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCafe, setSelectedCafe] = useState<typeof cafes[0] | null>(null);

  const filteredCafes = cafes.filter(cafe =>
    cafe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cafe.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">Café Analytics</h1>
        <p className="text-muted-foreground">Performance metrics and insights for all partner cafés.</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard title="Total Cafés" value="142" change={3.2} icon={<Store className="w-6 h-6" />} delay={0} />
        <MetricCard title="Total Visits Today" value="12,847" change={18.5} icon={<Users className="w-6 h-6" />} delay={0.05} />
        <MetricCard title="Total Scans" value="8,247" change={14.2} icon={<QrCode className="w-6 h-6" />} delay={0.1} />
        <MetricCard title="BDL Posts" value="1,892" change={9.8} icon={<Camera className="w-6 h-6" />} delay={0.15} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartCard title="Weekly Visits & Scans Trend" subtitle="Across all partner cafés" delay={0.2}>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="visitsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(24, 35%, 48%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(24, 35%, 48%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="scansGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(28, 60%, 55%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(28, 60%, 55%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(32, 30%, 85%)" strokeOpacity={0.5} />
              <XAxis dataKey="date" tick={{ fill: 'hsl(16, 20%, 45%)', fontSize: 12 }} axisLine={{ stroke: 'hsl(32, 30%, 85%)' }} tickLine={false} />
              <YAxis tick={{ fill: 'hsl(16, 20%, 45%)', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(0, 0%, 100%)', border: '1px solid hsl(32, 30%, 85%)', borderRadius: '8px' }} />
              <Area type="monotone" dataKey="visits" stroke="hsl(24, 35%, 48%)" strokeWidth={2} fill="url(#visitsGrad)" />
              <Area type="monotone" dataKey="scans" stroke="hsl(28, 60%, 55%)" strokeWidth={2} fill="url(#scansGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Top Cafés by Engagement" subtitle="Scans + BDL + Stamps score" delay={0.25}>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={cafes.slice(0, 6)} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(32, 30%, 85%)" strokeOpacity={0.5} horizontal={true} vertical={false} />
              <XAxis type="number" tick={{ fill: 'hsl(16, 20%, 45%)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fill: 'hsl(16, 20%, 45%)', fontSize: 11 }} axisLine={false} tickLine={false} width={90} />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(0, 0%, 100%)', border: '1px solid hsl(32, 30%, 85%)', borderRadius: '8px' }} />
              <Bar dataKey="scans" fill="hsl(24, 35%, 48%)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Café Directory */}
      <ChartCard title="Café Directory" subtitle="Click on a café to view detailed analytics" delay={0.3}>
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search cafés by name or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-md pl-10 pr-4 py-2 bg-muted/50 border border-border/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Café</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Scans</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">BDL Posts</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Stamps</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Visits</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Rating</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Change</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground"></th>
              </tr>
            </thead>
            <tbody>
              {filteredCafes.map((cafe, index) => (
                <motion.tr
                  key={cafe.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="border-b border-border/50 hover:bg-muted/30 transition-colors cursor-pointer"
                  onClick={() => setSelectedCafe(cafe)}
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                        <Store className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{cafe.name}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {cafe.location}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right font-medium text-foreground">{cafe.scans.toLocaleString()}</td>
                  <td className="py-4 px-4 text-right text-foreground">{cafe.bdl}</td>
                  <td className="py-4 px-4 text-right text-foreground">{cafe.stamps}</td>
                  <td className="py-4 px-4 text-right text-foreground">{cafe.visits.toLocaleString()}</td>
                  <td className="py-4 px-4 text-right">
                    <span className="inline-flex items-center gap-1 text-foreground">
                      <Star className="w-3 h-3 text-accent fill-accent" />
                      {cafe.rating}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className={`text-sm font-medium ${cafe.change > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                      {cafe.change > 0 ? '+' : ''}{cafe.change}%
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
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

export default CafeAnalytics;
