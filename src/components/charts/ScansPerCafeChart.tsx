import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface CafeData {
  name: string;
  scans: number;
  stamps?: number;
  rating?: number;
}

interface ScansPerCafeChartProps {
  data?: CafeData[];
}

// Default mock data
const defaultData = [
  { name: 'The Roastery', scans: 1420, stamps: 890 },
  { name: 'Café Brew', scans: 1180, stamps: 720 },
  { name: 'Bean Scene', scans: 980, stamps: 540 },
  { name: 'Mocha House', scans: 850, stamps: 480 },
  { name: 'Latte Art', scans: 720, stamps: 390 },
  { name: 'Espresso Lab', scans: 640, stamps: 320 },
];

export const ScansPerCafeChart = ({ data }: ScansPerCafeChartProps) => {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) {
      return defaultData;
    }
    
    // Map incoming data to chart format and truncate long names
    return data.slice(0, 6).map(item => ({
      cafe: item.name.length > 12 ? item.name.substring(0, 10) + '...' : item.name,
      fullName: item.name,
      scans: item.scans,
      stamps: item.stamps || Math.round(item.scans * 0.6), // Estimate stamps if not provided
    }));
  }, [data]);

  // Check if we have stamps data
  const hasStamps = chartData.some(item => item.stamps !== undefined);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }} barCategoryGap="20%">
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(32, 30%, 85%)" strokeOpacity={0.5} vertical={false} />
        <XAxis
          dataKey="cafe"
          tick={{ fill: 'hsl(16, 20%, 45%)', fontSize: 11 }}
          axisLine={{ stroke: 'hsl(32, 30%, 85%)' }}
          tickLine={false}
          angle={-20}
          textAnchor="end"
          height={60}
        />
        <YAxis
          tick={{ fill: 'hsl(16, 20%, 45%)', fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(value) => value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(0, 0%, 100%)',
            border: '1px solid hsl(32, 30%, 85%)',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px hsl(17 27% 18% / 0.1)',
          }}
          labelStyle={{ color: 'hsl(19, 38%, 12%)', fontWeight: 600 }}
          formatter={(value: number, name: string) => [
            value.toLocaleString(),
            name === 'scans' ? 'Visits' : 'Stamps'
          ]}
          labelFormatter={(label, payload) => {
            // Show full name in tooltip
            if (payload && payload[0]?.payload?.fullName) {
              return payload[0].payload.fullName;
            }
            return label;
          }}
        />
        <Bar dataKey="scans" fill="hsl(24, 35%, 48%)" radius={[4, 4, 0, 0]} name="scans" />
        {hasStamps && (
          <Bar dataKey="stamps" fill="hsl(32, 44%, 72%)" radius={[4, 4, 0, 0]} name="stamps" />
        )}
      </BarChart>
    </ResponsiveContainer>
  );
};