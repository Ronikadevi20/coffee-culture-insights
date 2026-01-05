import { useMemo } from 'react';
import { motion } from 'framer-motion';

interface FunnelStage {
  stage: string;
  users: number;
  percentage: number;
}

interface EngagementFunnelChartProps {
  data?: FunnelStage[];
}

// Default mock data
const defaultData: FunnelStage[] = [
  { stage: 'App Opens', users: 12500, percentage: 100 },
  { stage: 'QR Scans', users: 8750, percentage: 70 },
  { stage: 'Stamps Collected', users: 5625, percentage: 45 },
  { stage: 'BDL Posts', users: 2812, percentage: 22.5 },
  { stage: 'Free Drinks', users: 1125, percentage: 9 },
];

export const EngagementFunnelChart = ({ data }: EngagementFunnelChartProps) => {
  const funnelData = useMemo(() => {
    if (!data || data.length === 0) {
      return defaultData;
    }
    return data;
  }, [data]);

  // Calculate total for percentage if not provided
  const processedData = useMemo(() => {
    const maxUsers = Math.max(...funnelData.map(d => d.users));
    
    return funnelData.map((item) => ({
      ...item,
      percentage: item.percentage || (maxUsers > 0 ? (item.users / maxUsers) * 100 : 0),
    }));
  }, [funnelData]);

  return (
    <div className="space-y-3">
      {processedData.map((item, index) => (
        <motion.div
          key={item.stage}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="relative"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-foreground">{item.stage}</span>
            <span className="text-sm text-muted-foreground">
              {item.users.toLocaleString()} ({item.percentage.toFixed(1)}%)
            </span>
          </div>
          <div className="h-8 bg-muted/50 rounded-lg overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${item.percentage}%` }}
              transition={{ duration: 0.8, delay: index * 0.1, ease: 'easeOut' }}
              className="h-full rounded-lg"
              style={{
                background: `linear-gradient(90deg, hsl(24, 35%, ${48 + index * 5}%), hsl(28, 60%, ${55 + index * 5}%))`,
              }}
            />
          </div>
          {index < processedData.length - 1 && (
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-muted-foreground/20" />
          )}
        </motion.div>
      ))}
      
      {/* Conversion summary */}
      {processedData.length > 1 && (
        <div className="pt-4 mt-4 border-t border-border">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Overall Conversion</span>
            <span className="font-medium text-foreground">
              {processedData.length > 0 
                ? `${((processedData[processedData.length - 1].users / processedData[0].users) * 100).toFixed(1)}%`
                : '0%'
              }
            </span>
          </div>
        </div>
      )}
    </div>
  );
};