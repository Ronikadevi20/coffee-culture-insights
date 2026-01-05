import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { platformAdminService } from '@/services/platformAdmin.service';
import {
  PlatformDashboardStats,
  SystemHealth,
  PlatformStats,
  PlatformUser,
  CafeAdmin,
  ActivityLog,
  AssignCafeAdminDTO,
  UpdateUserRoleDTO,
  PaginatedResponse,
  UserFilters,
} from '@/types/platformAdmin.types';

// Query keys for caching
export const platformAdminKeys = {
  all: ['platformAdmin'] as const,
  dashboard: () => [...platformAdminKeys.all, 'dashboard'] as const,
  stats: () => [...platformAdminKeys.all, 'stats'] as const,
  health: () => [...platformAdminKeys.all, 'health'] as const,
  healthDetailed: () => [...platformAdminKeys.all, 'healthDetailed'] as const,
  activity: (limit: number) => [...platformAdminKeys.all, 'activity', limit] as const,
  users: (page: number, limit: number, filters?: UserFilters) => 
    [...platformAdminKeys.all, 'users', page, limit, filters] as const,
  cafeAdmins: (page: number, limit: number) => 
    [...platformAdminKeys.all, 'cafeAdmins', page, limit] as const,
};

/**
 * Hook to fetch platform dashboard statistics
 */
export const usePlatformDashboard = (
  options?: Omit<UseQueryOptions<PlatformDashboardStats, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: platformAdminKeys.dashboard(),
    queryFn: () => platformAdminService.getDashboard(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

/**
 * Hook to fetch platform statistics
 */
export const usePlatformStats = (
  options?: Omit<UseQueryOptions<PlatformStats, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: platformAdminKeys.stats(),
    queryFn: () => platformAdminService.getStats(),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

/**
 * Hook to fetch system health
 */
export const useSystemHealth = (
  options?: Omit<UseQueryOptions<SystemHealth, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: platformAdminKeys.health(),
    queryFn: () => platformAdminService.getSystemHealth(),
    staleTime: 30 * 1000, // 30 seconds - health checks should be more frequent
    refetchInterval: 60 * 1000, // Refetch every minute
    ...options,
  });
};

// Detailed system health response type
interface DetailedSystemHealth extends SystemHealth {
  services?: {
    database?: { status: string; latency: string };
    api?: { status: string; activeUsers: number; errorRate: string };
    cache?: { status: string; hitRate: string };
  };
  resources?: {
    memory: { used: number; total: number; unit: string; percentage: string };
    cpu: { usage: number; unit: string };
  };
  metrics?: {
    requestsPerMinute: number;
    avgResponseTime: string;
    errorsLastHour: number;
    activeUsers: number;
  };
  performance?: {
    dbLatency: string;
    memoryUsage: string;
    uptime: string;
  };
}

/**
 * Hook to fetch detailed system health
 */
export const useDetailedSystemHealth = (
  options?: Omit<UseQueryOptions<DetailedSystemHealth, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: platformAdminKeys.healthDetailed(),
    queryFn: () => platformAdminService.getDetailedSystemHealth(),
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
    ...options,
  });
};

/**
 * Hook to fetch recent activity
 */
export const useRecentActivity = (
  limit: number = 50,
  options?: Omit<UseQueryOptions<ActivityLog[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: platformAdminKeys.activity(limit),
    queryFn: () => platformAdminService.getRecentActivity(limit),
    staleTime: 2 * 60 * 1000, // 2 minutes
    ...options,
  });
};

/**
 * Hook to fetch users with pagination
 */
export const useUsers = (
  page: number = 1,
  limit: number = 20,
  filters?: UserFilters,
  options?: Omit<UseQueryOptions<PaginatedResponse<PlatformUser>, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: platformAdminKeys.users(page, limit, filters),
    queryFn: () => platformAdminService.getUsers(page, limit, filters),
    staleTime: 2 * 60 * 1000,
    ...options,
  });
};

/**
 * Hook to fetch cafe admins with pagination
 */
export const useCafeAdmins = (
  page: number = 1,
  limit: number = 20,
  options?: Omit<UseQueryOptions<PaginatedResponse<CafeAdmin>, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: platformAdminKeys.cafeAdmins(page, limit),
    queryFn: () => platformAdminService.getCafeAdmins(page, limit),
    staleTime: 2 * 60 * 1000,
    ...options,
  });
};

/**
 * Hook to update user role
 */
export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: UpdateUserRoleDTO }) =>
      platformAdminService.updateUserRole(userId, data),
    onSuccess: () => {
      // Invalidate users query to refetch
      queryClient.invalidateQueries({ queryKey: platformAdminKeys.all });
    },
  });
};

/**
 * Hook to deactivate user
 */
export const useDeactivateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => platformAdminService.deactivateUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: platformAdminKeys.all });
    },
  });
};

/**
 * Hook to activate user
 */
export const useActivateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => platformAdminService.activateUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: platformAdminKeys.all });
    },
  });
};

/**
 * Hook to assign cafe admin
 */
export const useAssignCafeAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AssignCafeAdminDTO) => platformAdminService.assignCafeAdmin(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: platformAdminKeys.all });
    },
  });
};

/**
 * Hook to remove cafe admin
 */
export const useRemoveCafeAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, cafeId }: { userId: string; cafeId: string }) =>
      platformAdminService.removeCafeAdmin(userId, cafeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: platformAdminKeys.all });
    },
  });
};

/**
 * Combined hook to fetch all platform admin data
 */
export const usePlatformAdminData = () => {
  const dashboard = usePlatformDashboard();
  const stats = usePlatformStats();
  const health = useSystemHealth();
  const detailedHealth = useDetailedSystemHealth();
  const activity = useRecentActivity(10);

  const isLoading = 
    dashboard.isLoading ||
    stats.isLoading ||
    health.isLoading ||
    detailedHealth.isLoading ||
    activity.isLoading;

  const isError =
    dashboard.isError ||
    stats.isError ||
    health.isError ||
    detailedHealth.isError ||
    activity.isError;

  const refetchAll = () => {
    dashboard.refetch();
    stats.refetch();
    health.refetch();
    detailedHealth.refetch();
    activity.refetch();
  };

  return {
    dashboard,
    stats,
    health,
    detailedHealth,
    activity,
    isLoading,
    isError,
    refetchAll,
  };
};