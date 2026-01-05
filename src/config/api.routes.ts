/**
 * API Routes Configuration
 * Centralized location for all API endpoints
 */

// Base API URL
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

/**
 * Authentication Routes
 */
export const AUTH_ROUTES = {
  // Public routes (no token required)
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  REGISTER_CAFE_ADMIN: '/auth/register-cafe-admin',
  REGISTER_PLATFORM_ADMIN: '/auth/register-platform-admin',
  REFRESH_TOKEN: '/auth/refresh',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  VERIFY_EMAIL: '/auth/verify-email',

  // Protected routes (token required)
  LOGOUT: '/auth/logout',
  CHANGE_PASSWORD: '/auth/change-password',
  ME: '/auth/me',
} as const;

/**
 * User Routes
 */
export const USER_ROUTES = {
  LIST: '/users',
  GET_BY_ID: (id: string) => `/users/${id}`,
  UPDATE: (id: string) => `/users/${id}`,
  DELETE: (id: string) => `/users/${id}`,
  PROFILE: '/users/profile',
} as const;

/**
 * Cafe Routes
 */
export const CAFE_ROUTES = {
  LIST: '/cafes',
  GET_BY_ID: (id: string) => `/cafes/${id}`,
  CREATE: '/cafes',
  UPDATE: (id: string) => `/cafes/${id}`,
  DELETE: (id: string) => `/cafes/${id}`,
  ANALYTICS: (id: string) => `/cafes/${id}/analytics`,
} as const;

/**
 * QR Code Routes
 */
export const QR_ROUTES = {
  LIST: '/qr-codes',
  GET_BY_ID: (id: string) => `/qr-codes/${id}`,
  CREATE: '/qr-codes',
  SCAN: '/qr-codes/scan',
  ANALYTICS: '/qr-codes/analytics',
} as const;

/**
 * Stamps Routes
 */
export const STAMPS_ROUTES = {
  LIST: '/stamps',
  USER_STAMPS: (userId: string) => `/stamps/user/${userId}`,
  CAFE_STAMPS: (cafeId: string) => `/stamps/cafe/${cafeId}`,
  REDEEM: '/stamps/redeem',
  ANALYTICS: '/stamps/analytics',
} as const;

/**
 * Analytics Routes
 */
export const ANALYTICS_ROUTES = {
  // Platform-wide analytics
  OVERVIEW: '/analytics/overview',
  USER_GROWTH: '/analytics/user-growth',
  CAFE_PERFORMANCE: '/analytics/cafe-performance',
  POPULAR_TIMES: '/analytics/popular-times',
  ENGAGEMENT: '/analytics/engagement',
  RETENTION: '/analytics/retention',
  REVENUE: '/analytics/revenue',
  BDL_DISTRIBUTION: '/analytics/bdl-distribution',
  
  // User analytics routes
  USER_RETENTION_CURVE: '/analytics/user-retention-curve',
  SCAN_FREQUENCY: '/analytics/scan-frequency',
  DEVICE_DISTRIBUTION: '/analytics/device-distribution',
  HOURLY_ACTIVITY: '/analytics/hourly-activity',
  TOP_USERS: '/analytics/top-users',
  
  // Stamps economy routes
  STAMPS_ECONOMY_METRICS: '/analytics/stamps-economy-metrics',
  WEEKLY_STAMPS_TREND: '/analytics/weekly-stamps-trend',
  STAMP_PROGRESS_DISTRIBUTION: '/analytics/stamp-progress-distribution',
  REDEMPTIONS_BY_CAFE: '/analytics/redemptions-by-cafe',
  TOP_STAMP_COLLECTORS: '/analytics/top-stamp-collectors',
  
  // Engagement funnel routes
  ENGAGEMENT_FUNNEL_METRICS: '/analytics/engagement-funnel-metrics',
  PRIMARY_FUNNEL: '/analytics/primary-funnel',
  ONBOARDING_FUNNEL: '/analytics/onboarding-funnel',
  
  // Cafe-specific analytics
  CAFE_ANALYTICS: (cafeId: string) => `/analytics/cafe/${cafeId}`,
  
  // Dashboard-specific analytics (cafe-level)
  DASHBOARD_METRICS: (cafeId: string) => `/analytics/dashboard/${cafeId}/metrics`,
  VISITS_CHART: (cafeId: string) => `/analytics/dashboard/${cafeId}/visits-chart`,
  STAMPS_CHART: (cafeId: string) => `/analytics/dashboard/${cafeId}/stamps-chart`,
  BDL_VISIBILITY: (cafeId: string) => `/analytics/dashboard/${cafeId}/bdl-visibility`,
  PEAK_HOURS: (cafeId: string) => `/analytics/dashboard/${cafeId}/peak-hours`,
  BDL_TIMELINE: (cafeId: string) => `/analytics/dashboard/${cafeId}/bdl-timeline`,
  BDL_ENGAGEMENT: (cafeId: string) => `/analytics/dashboard/${cafeId}/bdl-engagement`,
  BDL_PEAK_TIMES: (cafeId: string) => `/analytics/dashboard/${cafeId}/bdl-peak-times`,
  MOST_PHOTOGRAPHED_DRINKS: (cafeId: string) => `/analytics/dashboard/${cafeId}/most-photographed-drinks`,
  STAMP_CARD_FUNNEL: (cafeId: string) => `/analytics/dashboard/${cafeId}/stamp-card-funnel`,
  CUSTOMER_TYPE: (cafeId: string) => `/analytics/dashboard/${cafeId}/customer-type`,
  DAILY_STATISTICS: (cafeId: string) => `/analytics/dashboard/${cafeId}/daily-statistics`,
  STAMPS_BY_DRINK: (cafeId: string) => `/analytics/dashboard/${cafeId}/stamps-by-drink`,
} as const;

/**
 * Platform Admin Routes
 */
export const PLATFORM_ADMIN_ROUTES = {
  DASHBOARD: '/platform-admin/dashboard',
  STATS: '/platform-admin/stats',
  HEALTH: '/platform-admin/health',
  HEALTH_DETAILED: '/platform-admin/health/detailed',
  ACTIVITY: '/platform-admin/activity',
  
  // User management
  USERS: '/platform-admin/users',
  USER_ROLE: (userId: string) => `/platform-admin/users/${userId}/role`,
  USER_DEACTIVATE: (userId: string) => `/platform-admin/users/${userId}/deactivate`,
  USER_ACTIVATE: (userId: string) => `/platform-admin/users/${userId}/activate`,
  
  // Cafe admin management
  CAFE_ADMINS: '/platform-admin/cafe-admins',
  REMOVE_CAFE_ADMIN: (userId: string, cafeId: string) => `/platform-admin/cafe-admins/${userId}/${cafeId}`,
} as const;

/**
 * AI Insights Routes
 */
export const AI_INSIGHTS_ROUTES = {
  INSIGHTS: '/ai-insights',
  PREDICTIONS: '/ai-insights/predictions',
  CHURN_RISK: '/ai-insights/churn-risk',
} as const;

/**
 * Database Monitoring Routes
 */
export const DATABASE_ROUTES = {
  LOGS: '/database/logs',
  PERFORMANCE: '/database/performance',
  SLOW_QUERIES: '/database/slow-queries',
  ERRORS: '/database/errors',
  QUERY_PERFORMANCE: '/database/query-performance',
  CONNECTIONS: '/database/connections',
  HEALTH: '/database/health',
} as const;

/**
 * Users Routes (authenticated user endpoints)
 */
export const USERS_ROUTES = {
  PROFILE: '/users/profile',
  STATS: '/users/stats',
  PREFERENCES: '/users/preferences',
  SAVED_CAFES: '/users/saved-cafes',
  SAVE_CAFE: (cafeId: string) => `/users/saved-cafes/${cafeId}`,
  UNSAVE_CAFE: (cafeId: string) => `/users/saved-cafes/${cafeId}`,
  CAFE_CARDS: '/users/cafe-cards',
  STAMP_HISTORY: '/users/stamp-history',
  SEARCH: '/users/search',
  DELETE_ACCOUNT: '/users/account',
} as const;

/**
 * BDL (BeReal Daily Log) Routes
 */
export const BDL_ROUTES = {
  // Public/optional auth routes
  FEED: '/bdl/feed',
  CALENDAR: (userId: string) => `/bdl/calendar/${userId}`,
  POSTS_BY_DATE: (date: string) => `/bdl/date/${date}`,
  GET_POST: (userId: string, date: string) => `/bdl/${userId}/${date}`,
  
  // Protected routes
  CREATE: '/bdl',
  UPDATE: (date: string) => `/bdl/${date}`,
  DELETE: (date: string) => `/bdl/${date}`,
  MY_CALENDAR: '/bdl/my-calendar',
  CHECK_TODAY: '/bdl/check-today',
  STATS: '/bdl/stats',
  LIKE: (userId: string, date: string) => `/bdl/${userId}/${date}/like`,
} as const;

/**
 * Routes that don't require authentication
 */
export const PUBLIC_ROUTES = [
  AUTH_ROUTES.LOGIN,
  AUTH_ROUTES.REGISTER,
  AUTH_ROUTES.REGISTER_CAFE_ADMIN,
  AUTH_ROUTES.REGISTER_PLATFORM_ADMIN,
  AUTH_ROUTES.REFRESH_TOKEN,
  AUTH_ROUTES.FORGOT_PASSWORD,
  AUTH_ROUTES.RESET_PASSWORD,
  AUTH_ROUTES.VERIFY_EMAIL,
] as const;

/**
 * Check if a route is public (doesn't require auth)
 */
export const isPublicRoute = (route: string): boolean => {
  return PUBLIC_ROUTES.some((publicRoute) => route.includes(publicRoute));
};

export default {
  AUTH: AUTH_ROUTES,
  USER: USER_ROUTES,
  CAFE: CAFE_ROUTES,
  QR: QR_ROUTES,
  STAMPS: STAMPS_ROUTES,
  ANALYTICS: ANALYTICS_ROUTES,
  PLATFORM_ADMIN: PLATFORM_ADMIN_ROUTES,
  BDL: BDL_ROUTES,
  AI_INSIGHTS: AI_INSIGHTS_ROUTES,
  DATABASE: DATABASE_ROUTES,
  USERS: USERS_ROUTES,
};