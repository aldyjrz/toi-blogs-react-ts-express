import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => apiFetch<{ data: Array<{ id: string; name: string; slug: string; description?: string; _count?: { posts: number } }> }>('/taxonomy/categories'),
  });
}

export function useTags() {
  return useQuery({
    queryKey: ['tags'],
    queryFn: () => apiFetch<{ data: Array<{ id: string; name: string; slug: string }> }>('/taxonomy/tags'),
  });
}

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { name: string; slug?: string; description?: string }) =>
      apiFetch('/taxonomy/categories', { method: 'POST', body: JSON.stringify(payload) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categories'] }),
  });
}

export function useCreateTag() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { name: string; slug?: string }) =>
      apiFetch('/taxonomy/tags', { method: 'POST', body: JSON.stringify(payload) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tags'] }),
  });
}
