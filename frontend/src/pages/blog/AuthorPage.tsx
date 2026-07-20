import { useParams } from 'react-router-dom';
import { Seo } from '@/components/Seo';
import { usePosts } from '@/hooks/usePosts';
import { PostCard } from '@/components/PostCard';

export function AuthorPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = usePosts({ status: 'PUBLISHED', author: id, limit: 20 });
  const posts = data?.data ?? [];

  return (
    <>
      <Seo title="Author" />
      <section className="mx-auto max-w-5xl px-4 py-12">
        <h1 className="mb-8 text-3xl font-bold">Articles by author</h1>
        {isLoading ? <p>Loading…</p> : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => <PostCard key={p.id} post={p} />)}
          </div>
        )}
      </section>
    </>
  );
}
