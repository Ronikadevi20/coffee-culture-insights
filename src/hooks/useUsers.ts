/**
 * Users Hooks
 * React Query hooks for user profile, preferences, and stats
 */

import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { usersService } from '@/services/users.service';
import {
  UserProfileResponse,
  UserStatsResponse,
  UserPreferences,
  UpdateUserDTO,
  UpdatePreferencesDTO,
  SavedCafe,
  CafeCard,
  StampHistoryEntry,
} from '@/types/users.types';

// Paginated response type
interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

// Query keys
export const usersKeys = {
  all: ['users'] as const,
  profile: () => [...usersKeys.all, 'profile'] as const,
  stats: () => [...usersKeys.all, 'stats'] as const,
  preferences: () => [...usersKeys.all, 'preferences'] as const,
  savedCafes: (page: number, limit: number) => [...usersKeys.all, 'savedCafes', page, limit] as const,
  cafeCards: () => [...usersKeys.all, 'cafeCards'] as const,
  stampHistory: (page: number, limit: number) => [...usersKeys.all, 'stampHistory', page, limit] as const,
};

/**
 * Hook to fetch user profile
 */
export const useUserProfile = (
  options?: Omit<UseQueryOptions<UserProfileResponse, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: usersKeys.profile(),
    queryFn: () => usersService.getProfile(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

/**
 * Hook to update user profile
 */
export const useUpdateProfile = (
  options?: Omit<UseMutationOptions<UserProfileResponse, Error, UpdateUserDTO>, 'mutationFn'>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateUserDTO) => usersService.updateProfile(data),
    onSuccess: (data) => {
      queryClient.setQueryData(usersKeys.profile(), data);
    },
    ...options,
  });
};

/**
 * Hook to fetch user stats
 */
export const useUserStats = (
  options?: Omit<UseQueryOptions<UserStatsResponse, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: usersKeys.stats(),
    queryFn: () => usersService.getStats(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    ...options,
  });
};

/**
 * Hook to fetch user preferences
 */
export const useUserPreferences = (
  options?: Omit<UseQueryOptions<UserPreferences, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: usersKeys.preferences(),
    queryFn: () => usersService.getPreferences(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

/**
 * Hook to update user preferences
 */
export const useUpdatePreferences = (
  options?: Omit<UseMutationOptions<UserPreferences, Error, UpdatePreferencesDTO>, 'mutationFn'>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdatePreferencesDTO) => usersService.updatePreferences(data),
    onSuccess: (data) => {
      queryClient.setQueryData(usersKeys.preferences(), data);
    },
    ...options,
  });
};

/**
 * Hook to fetch saved cafes
 */
export const useSavedCafes = (
  page: number = 1,
  limit: number = 20,
  options?: Omit<UseQueryOptions<PaginatedResponse<SavedCafe>, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: usersKeys.savedCafes(page, limit),
    queryFn: () => usersService.getSavedCafes(page, limit),
    staleTime: 2 * 60 * 1000, // 2 minutes
    ...options,
  });
};

/**
 * Hook to save a cafe
 */
export const useSaveCafe = (
  options?: Omit<UseMutationOptions<SavedCafe, Error, string>, 'mutationFn'>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (cafeId: string) => usersService.saveCafe(cafeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usersKeys.all });
    },
    ...options,
  });
};

/**
 * Hook to unsave a cafe
 */
export const useUnsaveCafe = (
  options?: Omit<UseMutationOptions<void, Error, string>, 'mutationFn'>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (cafeId: string) => usersService.unsaveCafe(cafeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usersKeys.all });
    },
    ...options,
  });
};

/**
 * Hook to fetch cafe cards
 */
export const useCafeCards = (
  options?: Omit<UseQueryOptions<CafeCard[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: usersKeys.cafeCards(),
    queryFn: () => usersService.getCafeCards(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    ...options,
  });
};

/**
 * Hook to fetch stamp history
 */
export const useStampHistory = (
  page: number = 1,
  limit: number = 20,
  options?: Omit<UseQueryOptions<PaginatedResponse<StampHistoryEntry>, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: usersKeys.stampHistory(page, limit),
    queryFn: () => usersService.getStampHistory(page, limit),
    staleTime: 2 * 60 * 1000, // 2 minutes
    ...options,
  });
};

/**
 * Hook to delete account
 */
export const useDeleteAccount = (
  options?: Omit<UseMutationOptions<void, Error, void>, 'mutationFn'>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => usersService.deleteAccount(),
    onSuccess: () => {
      queryClient.clear();
    },
    ...options,
  });
};