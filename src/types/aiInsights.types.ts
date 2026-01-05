/**
 * AI Insights Types
 * Types for AI-powered predictions, anomalies, and recommendations
 */

// AI Prediction
export interface AIPrediction {
  title: string;
  description: string;
  confidence: number;
  type: 'insight' | 'warning' | 'recommendation' | 'opportunity';
  icon?: string;
  priority?: 'high' | 'medium' | 'low';
  impact?: string;
  actionable?: boolean;
}

// Anomaly Detection
export interface AnomalyDetection {
  metric: string;
  change: string;
  location: string;
  time: string;
  severity: 'positive' | 'negative' | 'warning';
  baselineValue?: number;
  currentValue?: number;
}

// AI Recommendation
export interface AIRecommendation {
  cafe?: string;
  suggestion: string;
  impact: string;
  priority: 'high' | 'medium' | 'low';
  category?: 'marketing' | 'operations' | 'engagement' | 'retention';
  estimatedROI?: number;
}

// AI Insights Summary
export interface AIInsightsSummary {
  ecosystemHealth: 'excellent' | 'good' | 'fair' | 'poor';
  keyInsight: string;
  urgentActions: number;
  opportunitiesIdentified: number;
}

// Full AI Insights Response
export interface AIInsightsResponse {
  predictions: AIPrediction[];
  anomalies: AnomalyDetection[];
  recommendations: AIRecommendation[];
  summary: AIInsightsSummary;
}

// Detailed Predictions Response
export interface DetailedPredictionsResponse {
  userMetrics: {
    expectedNewUsers: number;
    expectedChurn: number;
    expectedRetention: number;
    confidence: number;
  };
  cafeMetrics: {
    expectedVisits: number;
    expectedRevenue: number;
    expectedStamps: number;
    confidence: number;
  };
  engagementMetrics: {
    expectedBDLPosts: number;
    expectedReviews: number;
    expectedScans: number;
    confidence: number;
  };
  timeframe: {
    startDate: string;
    endDate: string;
    period: string;
  };
}

// Churn Risk User
export interface ChurnRiskUser {
  userId: string;
  username: string;
  email: string;
  lastActivity: string;
  daysSinceLastActivity: number;
  totalStamps: number;
  riskLevel: 'high' | 'medium' | 'low';
  churnProbability: number;
  recommendedAction: string;
}

// AI Analytics Timeframe
export interface AIAnalyticsTimeframe {
  timeframe: 'day' | 'week' | 'month' | 'year';
  startDate?: string;
  endDate?: string;
}