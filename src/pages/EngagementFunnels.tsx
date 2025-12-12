import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { ChartCard } from '@/components/dashboard/ChartCard';
import { TrendingUp, Users, Target, ArrowRight, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  FunnelChart,
  Funnel,
  LabelList,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

const mainFunnelData = [
  { name: 'App Open', value: 12500, fill: 'hsl(var(--chart-1))' },
  { name: 'Scan QR', value: 8200, fill: 'hsl(var(--chart-2))' },
  { name: 'Receive Stamp', value: 6800, fill: 'hsl(var(--chart-3))' },
  { name: 'Post BDL', value: 2400, fill: 'hsl(var(--chart-4))' },
];

const onboardingFunnelData = [
  { name: 'Onboarded', value: 5200, fill: 'hsl(var(--chart-1))' },
  { name: 'First Café Visit', value: 3800, fill: 'hsl(var(--chart-2))' },
  { name: 'Stamp Collection', value: 2900, fill: 'hsl(var(--chart-3))' },
];

const promotionFunnelData = [
  { name: 'Promotion Seen', value: 8500, fill: 'hsl(var(--chart-1))' },
  { name: 'Visit', value: 4200, fill: 'hsl(var(--chart-2))' },
  { name: 'Scan', value: 3100, fill: 'hsl(var(--chart-3))' },
  { name: 'Redemption', value: 1800, fill: 'hsl(var(--chart-4))' },
];

const conversionData = [
  { stage: 'Open→Scan', rate: 65.6 },
  { stage: 'Scan→Stamp', rate: 82.9 },
  { stage: 'Stamp→BDL', rate: 35.3 },
  { stage: 'Overall', rate: 19.2 },
];

const FunnelStep = ({ step, value, percentage, index }: { step: string; value: string; percentage: number; index: number }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.1 }}
    className="flex items-center gap-4"
  >
    <div className="flex-1">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-foreground">{step}</span>
        <span className="text-sm text-muted-foreground">{value}</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
          className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full"
        />
      </div>
    </div>
    {index < 3 && <ArrowRight className="w-4 h-4 text-muted-foreground" />}
  </motion.div>
);

export default function EngagementFunnels() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Engagement Funnels</h1>
          <p className="text-muted-foreground mt-1">Track user journey conversion rates</p>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Overall Conversion"
            value="19.2%"
            change={3.2}
            icon={<TrendingUp className="w-6 h-6" />}
          />
          <MetricCard
            title="Scan Rate"
            value="65.6%"
            change={1.8}
            icon={<Target className="w-6 h-6" />}
          />
          <MetricCard
            title="Stamp Completion"
            value="82.9%"
            change={5.1}
            icon={<Zap className="w-6 h-6" />}
          />
          <MetricCard
            title="BDL Engagement"
            value="35.3%"
            change={-2.4}
            icon={<Users className="w-6 h-6" />}
          />
        </div>

        {/* Main Funnel */}
        <ChartCard title="Primary User Journey" subtitle="App Open → Scan QR → Receive Stamp → Post BDL">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <FunnelChart>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Funnel dataKey="value" data={mainFunnelData} isAnimationActive>
                    <LabelList position="right" fill="hsl(var(--foreground))" stroke="none" dataKey="name" />
                  </Funnel>
                </FunnelChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-6 py-4">
              <FunnelStep step="App Open" value="12,500" percentage={100} index={0} />
              <FunnelStep step="Scan QR" value="8,200" percentage={65.6} index={1} />
              <FunnelStep step="Receive Stamp" value="6,800" percentage={54.4} index={2} />
              <FunnelStep step="Post BDL" value="2,400" percentage={19.2} index={3} />
            </div>
          </div>
        </ChartCard>

        {/* Secondary Funnels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="Onboarding Funnel" subtitle="New user journey">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <FunnelChart>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Funnel dataKey="value" data={onboardingFunnelData} isAnimationActive>
                    <LabelList position="right" fill="hsl(var(--foreground))" stroke="none" dataKey="name" />
                  </Funnel>
                </FunnelChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard title="Promotion Funnel" subtitle="Campaign conversion">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <FunnelChart>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Funnel dataKey="value" data={promotionFunnelData} isAnimationActive>
                    <LabelList position="right" fill="hsl(var(--foreground))" stroke="none" dataKey="name" />
                  </Funnel>
                </FunnelChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        {/* Conversion Rates */}
        <ChartCard title="Stage Conversion Rates" subtitle="Percentage conversion at each step">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={conversionData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} stroke="hsl(var(--muted-foreground))" />
                <YAxis dataKey="stage" type="category" width={100} stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  formatter={(value: number) => [`${value}%`, 'Conversion Rate']}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="rate" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>
    </DashboardLayout>
  );
}
