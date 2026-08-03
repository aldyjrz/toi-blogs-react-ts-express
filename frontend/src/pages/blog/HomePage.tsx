import { Link, useNavigate } from 'react-router-dom';
import { Seo } from '@/components/Seo';
import { usePosts, useMostViewed } from '@/hooks/usePosts';
import { PostCard } from '@/components/PostCard';
import { SITE_URL, SITE_NAME } from '@/lib/constants';
import Loading from '@/components/ui/Loading';
export function HomePage() {
  const { data, isLoading } = usePosts({ status: 'PUBLISHED', limit: 12 });
  const { data: mostViewedData } = useMostViewed(5);
  const navigate = useNavigate();
  const posts = data?.data ?? [];
  const mostViewed = mostViewedData?.data ?? [];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
  };

  return (
    <>
      <Seo title="Home" canonical={`${SITE_URL}/`} jsonLd={jsonLd} />
      <section className="mx-auto max-w-5xl px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight">Latest Posts</h1>
          <p className="mt-2 text-foreground/70">Insights, tutorials and stories.</p>
        </div>
        {isLoading ? (
          <Loading />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        )}
        <div className="mt-10 text-center">
          <button onClick={() => navigate('/blog')} className="rounded-md border border-border px-5 py-2 text-sm hover:bg-muted">View all posts</button>
          <Link to="/blog" className="sr-only">Blog</Link>
        </div>
      </section>

      {mostViewed.length > 0 && (
        <section className="mx-auto max-w-5xl px-4 py-12">
          <h2 className="mb-6 text-2xl font-bold">Most Viewed</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {mostViewed.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
