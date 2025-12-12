import { motion } from 'framer-motion';

const hours = ['12am', '3am', '6am', '9am', '12pm', '3pm', '6pm', '9pm'];
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const generateHeatmapData = () => {
  return days.map((day) => ({
    day,
    values: hours.map(() => Math.random()),
  }));
};

const data = generateHeatmapData();

const getIntensityColor = (value: number) => {
  if (value > 0.8) return 'bg-espresso';
  if (value > 0.6) return 'bg-mocha';
  if (value > 0.4) return 'bg-primary';
  if (value > 0.2) return 'bg-latte';
  return 'bg-muted';
};

export const ActivityHeatmap = () => {
  return (
    <div className="space-y-3">
      {/* Hours header */}
      <div className="flex gap-2 ml-12">
        {hours.map((hour) => (
          <div key={hour} className="flex-1 text-xs text-muted-foreground text-center">
            {hour}
          </div>
        ))}
      </div>

      {/* Heatmap grid */}
      <div className="space-y-2">
        {data.map((row, rowIndex) => (
          <div key={row.day} className="flex items-center gap-2">
            <div className="w-10 text-xs text-muted-foreground font-medium">{row.day}</div>
            <div className="flex gap-2 flex-1">
              {row.values.map((value, colIndex) => (
                <motion.div
                  key={colIndex}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: (rowIndex * 8 + colIndex) * 0.02 }}
                  className={`flex-1 h-8 rounded ${getIntensityColor(value)} transition-all hover:scale-110 cursor-pointer`}
                  title={`${row.day} ${hours[colIndex]}: ${Math.round(value * 100)}% activity`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-2 mt-4">
        <span className="text-xs text-muted-foreground">Less</span>
        <div className="flex gap-1">
          <div className="w-4 h-4 rounded bg-muted" />
          <div className="w-4 h-4 rounded bg-latte" />
          <div className="w-4 h-4 rounded bg-primary" />
          <div className="w-4 h-4 rounded bg-mocha" />
          <div className="w-4 h-4 rounded bg-espresso" />
        </div>
        <span className="text-xs text-muted-foreground">More</span>
      </div>
    </div>
  );
};
