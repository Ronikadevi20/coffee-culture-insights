import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Coffee } from "lucide-react";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import UserAnalytics from "./pages/UserAnalytics";
import CafeAnalytics from "./pages/CafeAnalytics";
import QRAnalytics from "./pages/QRAnalytics";
import BDLAnalytics from "./pages/BDLAnalytics";
import StampsEconomy from "./pages/StampsEconomy";
import AIInsights from "./pages/AIInsights";
import EngagementFunnels from "./pages/EngagementFunnels";
import PlatformHealth from "./pages/PlatformHealth";
import DatabaseLogs from "./pages/DatabaseLogs";
import Settings from "./pages/Settings";
import UserManagement from "./pages/UserManagement";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

/**
 * Loading Spinner Component
 */
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="flex flex-col items-center gap-4">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg animate-pulse">
        <Coffee className="w-8 h-8 text-primary-foreground" />
      </div>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
        <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
        <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
      </div>
      <p className="text-muted-foreground text-sm">Loading...</p>
    </div>
  </div>
);

/**
 * Protected Route Component
 * Redirects to login if user is not authenticated
 */
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading while checking auth state
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

/**
 * Public Route Component
 * Redirects to dashboard if user is already authenticated
 */
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading while checking auth state
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Redirect to dashboard if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

/**
 * App Routes Component
 */
const AppRoutes = () => (
  <Routes>
    {/* Public Routes */}
    <Route
      path="/"
      element={
        <PublicRoute>
          <Index />
        </PublicRoute>
      }
    />

    {/* Protected Routes */}
    <Route
      path="/dashboard"
      element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/dashboard/users"
      element={
        <ProtectedRoute>
          <UserAnalytics />
        </ProtectedRoute>
      }
    />
    <Route
      path="/dashboard/cafes"
      element={
        <ProtectedRoute>
          <CafeAnalytics />
        </ProtectedRoute>
      }
    />
    <Route
      path="/dashboard/qr"
      element={
        <ProtectedRoute>
          <QRAnalytics />
        </ProtectedRoute>
      }
    />
    <Route
      path="/dashboard/bdl"
      element={
        <ProtectedRoute>
          <BDLAnalytics />
        </ProtectedRoute>
      }
    />
    <Route
      path="/dashboard/stamps"
      element={
        <ProtectedRoute>
          <StampsEconomy />
        </ProtectedRoute>
      }
    />
    <Route
      path="/dashboard/funnels"
      element={
        <ProtectedRoute>
          <EngagementFunnels />
        </ProtectedRoute>
      }
    />
    <Route
      path="/dashboard/ai"
      element={
        <ProtectedRoute>
          <AIInsights />
        </ProtectedRoute>
      }
    />
    <Route
      path="/dashboard/health"
      element={
        <ProtectedRoute>
          <PlatformHealth />
        </ProtectedRoute>
      }
    />
    <Route
      path="/dashboard/logs"
      element={
        <ProtectedRoute>
          <DatabaseLogs />
        </ProtectedRoute>
      }
    />
    <Route
      path="/dashboard/settings"
      element={
        <ProtectedRoute>
          <Settings />
        </ProtectedRoute>
      }
    />
    <Route
      path="/dashboard/user-management"
      element={
        <ProtectedRoute>
          <UserManagement />
        </ProtectedRoute>
      }
    />

    {/* 404 Route */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

/**
 * Main App Component
 */
const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;