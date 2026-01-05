import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface BDLVisibilityData {
  public: number;
  private: number;
  friends: number;
}

interface BDLDistributionChartProps {
  data?: BDLVisibilityData | null;
}

// Default mock data
const defaultData: BDLVisibilityData = {
  public: 45,
  private: 20,
  friends: 35,
};

// Colors matching the coffee theme
const COLORS = {
  public: 'hsl(24, 35%, 48%)',    // espresso
  friends: 'hsl(28, 60%, 55%)',   // mocha  
  private: 'hsl(32, 44%, 72%)',   // latte
};

export const BDLDistributionChart = ({ data }: BDLDistributionChartProps) => {
  const chartData = useMemo(() => {
    const sourceData = data || defaultData;
    
    return [
      { name: 'Public', value: sourceData.public, color: COLORS.public },
      { name: 'Friends Only', value: sourceData.friends, color: COLORS.friends },
      { name: 'Private', value: sourceData.private, color: COLORS.private },
    ];
  }, [data]);

  const total = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.value, 0);
  }, [chartData]);

  // If no data, show empty state
  if (total === 0) {
    return (
      <div className="h-[260px] flex flex-col items-center justify-center text-muted-foreground">
        <p className="text-lg font-medium">No BDL posts yet</p>
        <p className="text-sm">Data will appear once users start posting</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={5}
          dataKey="value"
        >
          {chartData.map((entry, index) => (
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
          formatter={(value: number) => {
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
            return [`${value.toLocaleString()} (${percentage}%)`, 'Posts'];
          }}
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