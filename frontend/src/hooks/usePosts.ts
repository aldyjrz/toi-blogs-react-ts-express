import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import type { Paginated, Post } from '@/types';

interface ListParams {
  page?: number;
  limit?: number;
  status?: string;
  category?: string;
  tag?: string;
  author?: string;
  search?: string;
}

export function usePosts(params: ListParams = {}) {
  const query = new URLSearchParams();
  if (params.page) query.set('page', String(params.page));
  if (params.limit) query.set('limit', String(params.limit));
  if (params.status) query.set('status', params.status);
  if (params.category) query.set('category', params.category);
  if (params.tag) query.set('tag', params.tag);
  if (params.search) query.set('search', params.search);
  const qs = query.toString();

  return useQuery({
    queryKey: ['posts', params],
    queryFn: () => apiFetch<{ data: Post[]; pagination: Paginated<Post>['pagination'] }>(`/posts${qs ? `?${qs}` : ''}`),
  });
}

export function usePost(slug: string) {
  return useQuery({
    queryKey: ['post', slug],
    queryFn: () => apiFetch<{ data: Post }>(`/posts/slug/${slug}`),
    enabled: !!slug,
  });
}

export function useCreatePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: unknown) =>
      apiFetch<{ data: Post }>('/posts', { method: 'POST', body: JSON.stringify(payload) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['posts'] }),
  });
}

export function useUpdatePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: unknown }) =>
      apiFetch<{ data: Post }>(`/posts/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['posts'] }),
  });
}

export function useDeletePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiFetch(`/posts/${id}`, { method: 'DELETE' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['posts'] }),
  });
}

export function useMostViewed(limit = 5) {
  return useQuery({
    queryKey: ['posts', 'most-viewed', limit],
    queryFn: () => apiFetch<{ data: Post[] }>(`/posts/most-viewed?limit=${limit}`),
  });
}

export function useRelatedPosts(id: string, limit = 3) {
  return useQuery({
    queryKey: ['posts', 'related', id, limit],
    queryFn: () => apiFetch<{ data: Post[] }>(`/posts/${id}/related?limit=${limit}`),
    enabled: !!id,
  });
}

export function useIncrementView(slug: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => apiFetch<{ data: Post }>(`/posts/slug/${slug}/view`, { method: 'POST' }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['post', slug] });
      qc.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}
