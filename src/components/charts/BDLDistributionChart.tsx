import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const data = [
  { name: 'Public', value: 45, color: 'hsl(24, 35%, 48%)' },
  { name: 'Friends Only', value: 35, color: 'hsl(28, 60%, 55%)' },
  { name: 'Private', value: 20, color: 'hsl(32, 44%, 72%)' },
];

export const BDLDistributionChart = () => {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={5}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(0, 0%, 100%)',
            border: '1px solid hsl(32, 30%, 85%)',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px hsl(17 27% 18% / 0.1)',
          }}
          formatter={(value: number) => [`${value}%`, 'Share']}
        />
        <Legend
          verticalAlign="bottom"
          height={36}
          formatter={(value) => (
            <span className="text-sm text-foreground">{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};
