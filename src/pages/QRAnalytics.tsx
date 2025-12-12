import { QrCode, Users, Clock, AlertTriangle, Smartphone, CheckCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { ChartCard } from '@/components/dashboard/ChartCard';
import { ActivityHeatmap } from '@/components/charts/ActivityHeatmap';

const hourlyScans = [
  { hour: '6am', scans: 45 },
  { hour: '7am', scans: 120 },
  { hour: '8am', scans: 380 },
  { hour: '9am', scans: 520 },
  { hour: '10am', scans: 680 },
  { hour: '11am', scans: 720 },
  { hour: '12pm', scans: 890 },
  { hour: '1pm', scans: 780 },
  { hour: '2pm', scans: 650 },
  { hour: '3pm', scans: 580 },
  { hour: '4pm', scans: 620 },
  { hour: '5pm', scans: 750 },
  { hour: '6pm', scans: 980 },
  { hour: '7pm', scans: 1120 },
  { hour: '8pm', scans: 1050 },
  { hour: '9pm', scans: 680 },
  { hour: '10pm', scans: 340 },
];

const deviceSuccess = [
  { name: 'iOS Success', value: 94, color: 'hsl(24, 35%, 48%)' },
  { name: 'iOS Failed', value: 6, color: 'hsl(0, 72%, 51%)' },
];

const androidSuccess = [
  { name: 'Android Success', value: 89, color: 'hsl(28, 60%, 55%)' },
  { name: 'Android Failed', value: 11, color: 'hsl(0, 72%, 51%)' },
];

const funnelData = [
  { stage: 'QR Scanned', value: 8247, percentage: 100 },
  { stage: 'Scan Validated', value: 7835, percentage: 95 },
  { stage: 'Stamp Issued', value: 5621, percentage: 68 },
  { stage: 'BDL Posted', value: 1892, percentage: 23 },
];

const topLocations = [
  { name: 'The Roastery', scans: 1420 },
  { name: 'Café Brew', scans: 1180 },
  { name: 'Bean Scene', scans: 980 },
  { name: 'Mocha House', scans: 850 },
  { name: 'Latte Art', scans: 720 },
];

const QRAnalytics = () => {
  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">QR & Scan Analytics</h1>
        <p className="text-muted-foreground">Comprehensive analysis of QR code usage and scanning patterns.</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
        <MetricCard title="Total Scans Today" value="8,247" change={18.3} icon={<QrCode className="w-6 h-6" />} delay={0} />
        <MetricCard title="Unique Scanners" value="5,892" change={12.1} icon={<Users className="w-6 h-6" />} delay={0.05} />
        <MetricCard title="Peak Time" value="7:00 PM" change={0} icon={<Clock className="w-6 h-6" />} delay={0.1} />
        <MetricCard title="Success Rate" value="95.0%" change={1.2} icon={<CheckCircle className="w-6 h-6" />} delay={0.15} />
        <MetricCard title="Failed Scans" value="412" change={-8.5} icon={<AlertTriangle className="w-6 h-6" />} delay={0.2} />
        <MetricCard title="Avg Scan Time" value="1.2s" change={-15.0} icon={<Smartphone className="w-6 h-6" />} delay={0.25} />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartCard title="Scans Per Hour" subtitle="Today's scanning activity timeline" delay={0.3}>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={hourlyScans}>
              <defs>
                <linearGradient id="scansGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(28, 60%, 55%)" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="hsl(28, 60%, 55%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(32, 30%, 85%)" strokeOpacity={0.5} />
              <XAxis dataKey="hour" tick={{ fill: 'hsl(16, 20%, 45%)', fontSize: 11 }} axisLine={{ stroke: 'hsl(32, 30%, 85%)' }} tickLine={false} />
              <YAxis tick={{ fill: 'hsl(16, 20%, 45%)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(0, 0%, 100%)', border: '1px solid hsl(32, 30%, 85%)', borderRadius: '8px' }} />
              <Area type="monotone" dataKey="scans" stroke="hsl(28, 60%, 55%)" strokeWidth={2} fill="url(#scansGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Scan Activity Heatmap" subtitle="Activity patterns by day and hour" delay={0.35}>
          <ActivityHeatmap />
        </ChartCard>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Scan Funnel */}
        <ChartCard title="QR to BDL Funnel" subtitle="Conversion through the flow" delay={0.4}>
          <div className="space-y-3">
            {funnelData.map((item, index) => (
              <div key={item.stage}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-foreground">{item.stage}</span>
                  <span className="text-sm text-muted-foreground">{item.value.toLocaleString()}</span>
                </div>
                <div className="h-6 bg-muted/50 rounded-lg overflow-hidden">
                  <div
                    className="h-full rounded-lg transition-all duration-500"
                    style={{
                      width: `${item.percentage}%`,
                      background: `linear-gradient(90deg, hsl(24, 35%, ${48 + index * 5}%), hsl(28, 60%, ${55 + index * 5}%))`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </ChartCard>

        {/* Device Success Rates */}
        <ChartCard title="iOS Scan Success" subtitle="Success vs failed scans" delay={0.45}>
          <div className="flex flex-col items-center">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={deviceSuccess} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                  {deviceSuccess.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="text-center mt-2">
              <p className="text-2xl font-display font-bold text-foreground">94%</p>
              <p className="text-sm text-muted-foreground">Success Rate</p>
            </div>
          </div>
        </ChartCard>

        <ChartCard title="Android Scan Success" subtitle="Success vs failed scans" delay={0.5}>
          <div className="flex flex-col items-center">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={androidSuccess} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                  {androidSuccess.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="text-center mt-2">
              <p className="text-2xl font-display font-bold text-foreground">89%</p>
              <p className="text-sm text-muted-foreground">Success Rate</p>
            </div>
          </div>
        </ChartCard>
      </div>

      {/* Top Locations */}
      <ChartCard title="Top Scanning Locations" subtitle="Cafés with most QR scans today" delay={0.55}>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={topLocations} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(32, 30%, 85%)" strokeOpacity={0.5} horizontal={true} vertical={false} />
            <XAxis type="number" tick={{ fill: 'hsl(16, 20%, 45%)', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="name" tick={{ fill: 'hsl(16, 20%, 45%)', fontSize: 12 }} axisLine={false} tickLine={false} width={100} />
            <Tooltip contentStyle={{ backgroundColor: 'hsl(0, 0%, 100%)', border: '1px solid hsl(32, 30%, 85%)', borderRadius: '8px' }} />
            <Bar dataKey="scans" fill="hsl(24, 35%, 48%)" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </DashboardLayout>
  );
};

export default QRAnalytics;
