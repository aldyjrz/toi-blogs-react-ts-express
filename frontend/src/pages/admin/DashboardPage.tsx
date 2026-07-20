import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { Seo } from '@/components/Seo';
import { Card } from '@/components/ui/Input';

export function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => apiFetch<{ data: Record<string, number> }>('/admin/dashboard/stats'),
  });

  const { data: recent } = useQuery({
    queryKey: ['dashboard-recent'],
    queryFn: () => apiFetch<{ data: Array<{ id: string; title: string; status: string; createdAt: string }> }>('/admin/dashboard/recent'),
  });

  const stats = data?.data;
  const cards = [
    { label: 'Total Posts', value: stats?.totalPosts },
    { label: 'Published', value: stats?.publishedPosts },
    { label: 'Drafts', value: stats?.draftPosts },
    { label: 'Categories', value: stats?.categories },
    { label: 'Tags', value: stats?.tags },
    { label: 'Comments', value: stats?.comments },
  ];

  return (
    <>
      <Seo title="Dashboard" noindex />
      <h1 className="mb-6 text-2xl font-bold">Dashboard</h1>
      {isLoading ? <p>Loading…</p> : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c) => (
            <Card key={c.label}>
              <p className="text-sm text-foreground/60">{c.label}</p>
              <p className="mt-2 text-3xl font-bold">{c.value ?? 0}</p>
            </Card>
          ))}
        </div>
      )}
      <h2 className="mb-3 mt-8 text-xl font-bold">Recent Articles</h2>
      <Card>
        <ul className="divide-y divide-border">
          {(recent?.data ?? []).map((p) => (
            <li key={p.id} className="flex items-center justify-between py-2 text-sm">
              <span>{p.title}</span>
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs">{p.status}</span>
            </li>
          ))}
        </ul>
      </Card>
    </>
  );
}
