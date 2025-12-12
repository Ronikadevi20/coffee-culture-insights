import { Brain, Lightbulb, TrendingUp, AlertTriangle, Sparkles, Target } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ChartCard } from '@/components/dashboard/ChartCard';
import { motion } from 'framer-motion';

const predictions = [
  {
    title: 'Peak Hours Prediction',
    description: 'Tomorrow\'s peak activity expected between 6-8 PM based on historical patterns and weather forecast.',
    confidence: 92,
    icon: TrendingUp,
    type: 'insight',
  },
  {
    title: 'Churn Risk Alert',
    description: '247 users haven\'t scanned in 14+ days. Recommended: Send personalized re-engagement notifications.',
    confidence: 87,
    icon: AlertTriangle,
    type: 'warning',
  },
  {
    title: 'Café Performance Boost',
    description: 'Latte Art café can increase scans by 35% with evening promotions (6-9 PM suggested).',
    confidence: 78,
    icon: Target,
    type: 'recommendation',
  },
  {
    title: 'Stamp Engagement Opportunity',
    description: '1,420 users are 1 stamp away from completion. Flash notification could drive 40% conversion.',
    confidence: 85,
    icon: Sparkles,
    type: 'opportunity',
  },
];

const anomalies = [
  { metric: 'Scan Volume', change: '+45%', location: 'The Roastery', time: '2 hours ago', severity: 'positive' },
  { metric: 'Failed Scans', change: '+120%', location: 'Café Brew', time: '1 hour ago', severity: 'negative' },
  { metric: 'BDL Posts', change: '-30%', location: 'System-wide', time: '30 min ago', severity: 'warning' },
];

const recommendations = [
  {
    cafe: 'Mocha House',
    suggestion: 'Launch "Happy Hour Stamps" between 3-5 PM to boost weekday traffic',
    impact: '+28% expected visits',
    priority: 'high',
  },
  {
    cafe: 'Bean Scene',
    suggestion: 'Partner with nearby offices for corporate stamp cards',
    impact: '+15% new users',
    priority: 'medium',
  },
  {
    cafe: 'Espresso Lab',
    suggestion: 'Feature customer BDL posts on in-store displays',
    impact: '+22% BDL engagement',
    priority: 'medium',
  },
];

const AIInsights = () => {
  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Brain className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">AI Predictions & Insights</h1>
            <p className="text-muted-foreground">Machine learning powered analytics and recommendations.</p>
          </div>
        </div>
      </div>

      {/* AI Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 p-6 rounded-xl bg-gradient-to-br from-primary/5 to-accent/10 border border-primary/20"
      >
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold text-foreground mb-2">AI Summary</h3>
            <p className="text-muted-foreground leading-relaxed">
              Today's ecosystem health is <span className="text-primary font-medium">strong</span>. User engagement is 
              <span className="text-emerald-600 font-medium"> 12% above average</span>, with peak activity expected around 7 PM. 
              Consider focusing on The Roastery's momentum and addressing Café Brew's scan issues. 
              247 users are at risk of churning - immediate re-engagement recommended.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Predictions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {predictions.map((prediction, index) => (
          <motion.div
            key={prediction.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`metric-card border-l-4 ${
              prediction.type === 'warning' ? 'border-l-amber-500' :
              prediction.type === 'opportunity' ? 'border-l-emerald-500' :
              prediction.type === 'recommendation' ? 'border-l-primary' :
              'border-l-accent'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                prediction.type === 'warning' ? 'bg-amber-500/10 text-amber-500' :
                prediction.type === 'opportunity' ? 'bg-emerald-500/10 text-emerald-500' :
                prediction.type === 'recommendation' ? 'bg-primary/10 text-primary' :
                'bg-accent/10 text-accent'
              }`}>
                <prediction.icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-foreground">{prediction.title}</h4>
                  <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                    {prediction.confidence}% confidence
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{prediction.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Anomalies & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Anomaly Detection" subtitle="Unusual patterns detected by AI" delay={0.4}>
          <div className="space-y-3">
            {anomalies.map((anomaly, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className={`flex items-center justify-between p-4 rounded-lg ${
                  anomaly.severity === 'positive' ? 'bg-emerald-50 dark:bg-emerald-900/20' :
                  anomaly.severity === 'negative' ? 'bg-red-50 dark:bg-red-900/20' :
                  'bg-amber-50 dark:bg-amber-900/20'
                }`}
              >
                <div>
                  <p className="font-medium text-foreground">{anomaly.metric}</p>
                  <p className="text-sm text-muted-foreground">{anomaly.location} • {anomaly.time}</p>
                </div>
                <span className={`text-lg font-bold ${
                  anomaly.severity === 'positive' ? 'text-emerald-600' :
                  anomaly.severity === 'negative' ? 'text-red-600' :
                  'text-amber-600'
                }`}>
                  {anomaly.change}
                </span>
              </motion.div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="AI Recommendations" subtitle="Actionable suggestions for growth" delay={0.5}>
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="p-4 rounded-lg bg-muted/30 border border-border/50"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-accent" />
                    <span className="font-medium text-foreground">{rec.cafe}</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    rec.priority === 'high' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                  }`}>
                    {rec.priority}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{rec.suggestion}</p>
                <p className="text-xs font-medium text-emerald-600">{rec.impact}</p>
              </motion.div>
            ))}
          </div>
        </ChartCard>
      </div>
    </DashboardLayout>
  );
};

export default AIInsights;
