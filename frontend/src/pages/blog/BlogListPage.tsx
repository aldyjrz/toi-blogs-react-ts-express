import { Seo } from '@/components/Seo';
import { usePosts } from '@/hooks/usePosts';
import { PostCard } from '@/components/PostCard';
import { SITE_URL } from '@/lib/constants';

export function BlogListPage() {
  const { data, isLoading } = usePosts({ status: 'PUBLISHED', limit: 20 });
  const posts = data?.data ?? [];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Blog',
    url: `${SITE_URL}/blog`,
  };

  return (
    <>
      <Seo title="Blog" canonical={`${SITE_URL}/blog`} jsonLd={jsonLd} />
      <section className="mx-auto max-w-5xl px-4 py-12">
        <h1 className="mb-8 text-3xl font-bold">Artikel</h1>
        {isLoading ? <p>Loading…</p> : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => <PostCard key={p.id} post={p} />)}
          </div>
        )}
      </section>
    </>
  );
}
