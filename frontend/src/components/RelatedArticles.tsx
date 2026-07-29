import { PostCard } from '@/components/PostCard';
import { useRelatedPosts } from '@/hooks/usePosts';

interface RelatedArticlesProps {
  postId: string;
  limit?: number;
  title?: string;
}

export function RelatedArticles({ postId, limit = 3, title = 'Related Articles' }: RelatedArticlesProps) {
  const { data, isLoading } = useRelatedPosts(postId, limit);

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
