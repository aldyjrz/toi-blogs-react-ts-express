import { PostCard } from '@/components/PostCard';
import { usePosts } from '@/hooks/usePosts';

interface RecentArticlesProps {
  limit?: number;
  title?: string;
}

export function RecentArticles({ limit = 5, title = 'Recent Articles' }: RecentArticlesProps) {
  const { data, isLoading } = usePosts({ status: 'PUBLISHED', limit });

  if (isLoading) return <p className="text-sm text-foreground/60">Loading…</p>;
  const posts = data?.data ?? [];
  if (posts.length === 0) return null;

  return (
    <section className="mx-auto max-w-5xl px-4 py-12">
      <h2 className="mb-6 text-2xl font-bold">{title}</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => (
          <PostCard key={p.id} post={p} />
        ))}
      </div>
    </section>
  );
}
