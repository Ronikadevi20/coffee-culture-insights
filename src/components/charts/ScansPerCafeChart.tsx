import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { cafe: 'The Roastery', scans: 1420, stamps: 890 },
  { cafe: 'Café Brew', scans: 1180, stamps: 720 },
  { cafe: 'Bean Scene', scans: 980, stamps: 540 },
  { cafe: 'Mocha House', scans: 850, stamps: 480 },
  { cafe: 'Latte Art', scans: 720, stamps: 390 },
  { cafe: 'Espresso Lab', scans: 640, stamps: 320 },
];

export const ScansPerCafeChart = () => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }} barCategoryGap="20%">
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
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(0, 0%, 100%)',
            border: '1px solid hsl(32, 30%, 85%)',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px hsl(17 27% 18% / 0.1)',
          }}
          labelStyle={{ color: 'hsl(19, 38%, 12%)', fontWeight: 600 }}
        />
        <Bar dataKey="scans" fill="hsl(24, 35%, 48%)" radius={[4, 4, 0, 0]} />
        <Bar dataKey="stamps" fill="hsl(32, 44%, 72%)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};
