import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Seo } from '@/components/Seo';
import { usePosts } from '@/hooks/usePosts';
import { PostCard } from '@/components/PostCard';
import { SITE_URL } from '@/lib/constants';

export function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState(1);
  const { data, isLoading } = usePosts({ status: 'PUBLISHED', category: slug, limit: 12, page });
  const posts = data?.data ?? [];

  return (
    <>
      <Seo title={`Category: ${slug}`} canonical={`${SITE_URL}/blog/category/${slug}`} />
      <section className="mx-auto max-w-5xl px-4 py-12">
        <h1 className="mb-8 text-3xl font-bold capitalize">{slug?.replace(/-/g, ' ')}</h1>
        {isLoading ? <p>Loading…</p> : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => <PostCard key={p.id} post={p} />)}
          </div>
        )}
        <div className="mt-8 flex gap-2">
          <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-40">Prev</button>
          <button onClick={() => setPage((p) => p + 1)} className="rounded-md border border-border px-3 py-1.5 text-sm">Next</button>
        </div>
      </section>
    </>
  );
}
