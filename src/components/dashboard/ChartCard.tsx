import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  delay?: number;
  className?: string;
}

export const ChartCard = ({ title, subtitle, children, delay = 0, className = '' }: ChartCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={`chart-container ${className}`}
    >
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-display font-semibold text-foreground">{title}</h3>
          {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </div>
      {children}
    </motion.div>
  );
};
