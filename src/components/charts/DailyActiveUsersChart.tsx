import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { date: 'Mon', users: 2400 },
  { date: 'Tue', users: 2210 },
  { date: 'Wed', users: 2890 },
  { date: 'Thu', users: 3490 },
  { date: 'Fri', users: 4200 },
  { date: 'Sat', users: 5100 },
  { date: 'Sun', users: 4800 },
];

export const DailyActiveUsersChart = () => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(28, 60%, 55%)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="hsl(28, 60%, 55%)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(32, 30%, 85%)" strokeOpacity={0.5} />
        <XAxis
          dataKey="date"
          tick={{ fill: 'hsl(16, 20%, 45%)', fontSize: 12 }}
          axisLine={{ stroke: 'hsl(32, 30%, 85%)' }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: 'hsl(16, 20%, 45%)', fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(value) => `${(value / 1000).toFixed(1)}k`}
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
        <Area
          type="monotone"
          dataKey="users"
          stroke="hsl(28, 60%, 55%)"
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#colorUsers)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};
