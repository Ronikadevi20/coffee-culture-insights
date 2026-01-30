import { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Store,
  QrCode,
  Camera,
  Stamp,
  TrendingUp,
  Brain,
  Activity,
  Database,
  Settings,
  ChevronLeft,
  ChevronRight,
  Coffee,
  LogOut,
  UserCog,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
  { icon: Users, label: 'User Analytics', path: '/dashboard/users' },
  { icon: Store, label: 'Café Analytics', path: '/dashboard/cafes' },
  { icon: QrCode, label: 'QR & Scan Analytics', path: '/dashboard/qr' },
  { icon: Camera, label: 'BDL Analytics', path: '/dashboard/bdl' },
  { icon: Stamp, label: 'Stamps Economy', path: '/dashboard/stamps' },
  { icon: TrendingUp, label: 'Engagement Funnels', path: '/dashboard/funnels' },
  { icon: Brain, label: 'AI Predictions', path: '/dashboard/ai' },
  { icon: Activity, label: 'Platform Health', path: '/dashboard/health' },
  { icon: Database, label: 'Database Logs', path: '/dashboard/logs' },
  { icon: UserCog, label: 'User Management', path: '/dashboard/user-management' },
  { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
];

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    if (isLoggingOut) return;
    
    try {
      setIsLoggingOut(true);
      await logout();
      toast({
        title: 'Signed out',
        description: 'You have been successfully signed out.',
      });
      navigate('/');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to sign out. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 80 : 280 }}
      className="h-screen bg-sidebar fixed left-0 top-0 z-40 flex flex-col border-r border-sidebar-border"
    >
      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-sidebar-primary flex items-center justify-center flex-shrink-0">
          <Coffee className="w-5 h-5 text-sidebar-primary-foreground" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="overflow-hidden"
            >
              <h1 className="font-display text-lg font-semibold text-sidebar-foreground leading-tight">
                Coffee Culture
              </h1>
              <p className="text-xs text-sidebar-foreground/60">Intelligence Hub</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'nav-item',
                isActive && 'active'
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-sm font-medium truncate"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="p-3 border-t border-sidebar-border space-y-2">
        {/* User Info - Only show when not collapsed */}
        <AnimatePresence>
          {!collapsed && user && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="px-3 py-2 rounded-lg bg-sidebar-accent/50"
            >
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                {user.username || user.email?.split('@')[0]}
              </p>
              <p className="text-xs text-sidebar-foreground/60 truncate">
                {user.email}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className={cn(
            'nav-item w-full text-sidebar-foreground/60 hover:text-sidebar-foreground',
            isLoggingOut && 'opacity-50 cursor-not-allowed'
          )}
        >
          {isLoggingOut ? (
            <div className="w-5 h-5 border-2 border-sidebar-foreground/30 border-t-sidebar-foreground rounded-full animate-spin flex-shrink-0" />
          ) : (
            <LogOut className="w-5 h-5 flex-shrink-0" />
          )}
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm font-medium"
              >
                {isLoggingOut ? 'Signing out...' : 'Sign Out'}
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-8 w-6 h-6 rounded-full bg-sidebar-primary text-sidebar-primary-foreground flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
      >
        {collapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>
    </motion.aside>
  );
};