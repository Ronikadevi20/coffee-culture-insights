import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { bdlService } from '@/services/bdl.service';
import {
  BDLPost,
  BDLCalendarResponse,
  CreateBDLPostDTO,
  UpdateBDLPostDTO,
  BDLTodayStatus,
  BDLStats,
  BDLFeedResponse,
} from '@/types/bdl.types';

// Query keys for caching
export const bdlKeys = {
  all: ['bdl'] as const,
  feed: (page: number, limit: number) => [...bdlKeys.all, 'feed', page, limit] as const,
  calendar: (userId: string, month?: number, year?: number) => 
    [...bdlKeys.all, 'calendar', userId, month, year] as const,
  myCalendar: (month?: number, year?: number) => 
    [...bdlKeys.all, 'myCalendar', month, year] as const,
  postsByDate: (date: string) => [...bdlKeys.all, 'postsByDate', date] as const,
  post: (userId: string, date: string) => [...bdlKeys.all, 'post', userId, date] as const,
  todayStatus: () => [...bdlKeys.all, 'todayStatus'] as const,
  stats: () => [...bdlKeys.all, 'stats'] as const,
};

/**
 * Hook to fetch BDL feed
 */
export const useBDLFeed = (
  page: number = 1,
  limit: number = 20,
  options?: Omit<UseQueryOptions<BDLFeedResponse, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: bdlKeys.feed(page, limit),
    queryFn: () => bdlService.getFeed(page, limit),
    staleTime: 2 * 60 * 1000, // 2 minutes
    ...options,
  });
};

/**
 * Hook to fetch user's BDL calendar
 */
export const useBDLCalendar = (
  userId: string,
  month?: number,
  year?: number,
  options?: Omit<UseQueryOptions<BDLCalendarResponse, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: bdlKeys.calendar(userId, month, year),
    queryFn: () => bdlService.getUserCalendar(userId, month, year),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

/**
 * Hook to fetch my BDL calendar
 */
export const useMyBDLCalendar = (
  month?: number,
  year?: number,
  options?: Omit<UseQueryOptions<BDLCalendarResponse, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: bdlKeys.myCalendar(month, year),
    queryFn: () => bdlService.getMyCalendar(month, year),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

/**
 * Hook to fetch posts by date
 */
export const useBDLPostsByDate = (
  date: string,
  options?: Omit<UseQueryOptions<BDLPost[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: bdlKeys.postsByDate(date),
    queryFn: () => bdlService.getPostsByDate(date),
    staleTime: 2 * 60 * 1000,
    ...options,
  });
};

/**
 * Hook to fetch specific BDL post
 */
export const useBDLPost = (
  userId: string,
  date: string,
  options?: Omit<UseQueryOptions<BDLPost, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: bdlKeys.post(userId, date),
    queryFn: () => bdlService.getPost(userId, date),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

/**
 * Hook to check today's BDL status
 */
export const useBDLTodayStatus = (
  options?: Omit<UseQueryOptions<BDLTodayStatus, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: bdlKeys.todayStatus(),
    queryFn: () => bdlService.checkTodayStatus(),
    staleTime: 1 * 60 * 1000, // 1 minute - check frequently
    ...options,
  });
};

/**
 * Hook to fetch BDL statistics
 */
export const useBDLStats = (
  options?: Omit<UseQueryOptions<BDLStats, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: bdlKeys.stats(),
    queryFn: () => bdlService.getStats(),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

/**
 * Hook to create BDL post
 */
export const useCreateBDLPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBDLPostDTO) => bdlService.createPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bdlKeys.all });
    },
  });
};

/**
 * Hook to update BDL post
 */
export const useUpdateBDLPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ date, data }: { date: string; data: UpdateBDLPostDTO }) =>
      bdlService.updatePost(date, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bdlKeys.all });
    },
  });
};

/**
 * Hook to delete BDL post
 */
export const useDeleteBDLPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (date: string) => bdlService.deletePost(date),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bdlKeys.all });
    },
  });
};

/**
 * Hook to like/unlike BDL post
 */
export const useLikeBDLPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, date }: { userId: string; date: string }) =>
      bdlService.likePost(userId, date),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bdlKeys.all });
    },
  });
};