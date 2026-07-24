import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { Seo } from '@/components/Seo';
import { Card } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/lib/utils';
import type { Comment } from '@/types';

export function AdminCommentsPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['admin-comments'],
    queryFn: () => apiFetch<{ data: Array<Comment & { post?: { title: string; slug: string } }> }>('/admin/comments'),
  });

  const moderate = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      apiFetch(`/content/comments/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-comments'] }),
  });

  const removeComment = useMutation({
    mutationFn: (id: string) => apiFetch(`/admin/comments/${id}`, { method: 'DELETE' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-comments'] }),
  });

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      APPROVED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800',
      SPAM: 'bg-gray-100 text-gray-800',
    };
    return <span className={`rounded px-2 py-0.5 text-xs font-medium ${map[status] ?? 'bg-muted'}`}>{status}</span>;
  };

  return (
    <>
      <Seo title="Comments" noindex />
      <h1 className="mb-6 text-2xl font-bold">Comments</h1>
      {isLoading ? <p>Loading…</p> : (
        <Card className="overflow-hidden p-0">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-2 text-left">Author</th>
                <th className="px-4 py-2 text-left">Content</th>
                <th className="px-4 py-2 text-left">Post</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(data?.data ?? []).map((c) => (
                <tr key={c.id} className="border-t border-border">
                  <td className="px-4 py-2">{c.authorName ?? 'Anonymous'}</td>
                  <td className="max-w-xs truncate px-4 py-2">{c.content}</td>
                  <td className="px-4 py-2"><a href={`/blog/${c.post?.slug}`} className="text-primary hover:underline" target="_blank">{c.post?.title}</a></td>
                  <td className="px-4 py-2">{statusBadge(c.status)}</td>
                  <td className="px-4 py-2">{formatDate(c.createdAt)}</td>
                  <td className="px-4 py-2">
                    <select className="rounded border border-border bg-transparent px-2 py-1 text-xs" value="" onChange={(e) => { if (e.target.value) moderate.mutate({ id: c.id, status: e.target.value }); }}>
                      <option value="">Set status…</option>
                      <option value="APPROVED">Approve</option>
                      <option value="REJECTED">Reject</option>
                      <option value="SPAM">Spam</option>
                    </select>
                    <Button variant="destructive" size="sm" className="ml-2" onClick={() => { if (window.confirm('Delete this comment?')) removeComment.mutate(c.id); }}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </>
  );
}
