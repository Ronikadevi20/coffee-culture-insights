import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import UserAnalytics from "./pages/UserAnalytics";
import CafeAnalytics from "./pages/CafeAnalytics";
import QRAnalytics from "./pages/QRAnalytics";
import BDLAnalytics from "./pages/BDLAnalytics";
import StampsEconomy from "./pages/StampsEconomy";
import AIInsights from "./pages/AIInsights";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
    <Route path="/dashboard/users" element={<ProtectedRoute><UserAnalytics /></ProtectedRoute>} />
    <Route path="/dashboard/cafes" element={<ProtectedRoute><CafeAnalytics /></ProtectedRoute>} />
    <Route path="/dashboard/qr" element={<ProtectedRoute><QRAnalytics /></ProtectedRoute>} />
    <Route path="/dashboard/bdl" element={<ProtectedRoute><BDLAnalytics /></ProtectedRoute>} />
    <Route path="/dashboard/stamps" element={<ProtectedRoute><StampsEconomy /></ProtectedRoute>} />
    <Route path="/dashboard/ai" element={<ProtectedRoute><AIInsights /></ProtectedRoute>} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

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
