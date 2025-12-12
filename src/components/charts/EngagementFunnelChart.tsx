import { motion } from 'framer-motion';

const funnelData = [
  { stage: 'App Opens', value: 12500, percentage: 100 },
  { stage: 'QR Scans', value: 8750, percentage: 70 },
  { stage: 'Stamps Collected', value: 5625, percentage: 45 },
  { stage: 'BDL Posts', value: 2812, percentage: 22.5 },
  { stage: 'Free Drinks', value: 1125, percentage: 9 },
];

export const EngagementFunnelChart = () => {
  return (
    <div className="space-y-3">
      {funnelData.map((item, index) => (
        <motion.div
          key={item.stage}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="relative"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-foreground">{item.stage}</span>
            <span className="text-sm text-muted-foreground">{item.value.toLocaleString()} ({item.percentage}%)</span>
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
          {index < funnelData.length - 1 && (
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-muted-foreground/20" />
          )}
        </motion.div>
      ))}
    </div>
  );
};
