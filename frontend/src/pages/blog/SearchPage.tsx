import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Seo } from '@/components/Seo';
import { usePosts } from '@/hooks/usePosts';
import { PostCard } from '@/components/PostCard';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export function SearchPage() {
  const [params] = useSearchParams();
  const [query, setQuery] = useState(params.get('q') ?? '');
  const { data, isLoading } = usePosts({ status: 'PUBLISHED', search: params.get('q') ?? '', limit: 20 });
  const posts = data?.data ?? [];

  return (
    <>
      <Seo title="Search" noindex />
      <section className="mx-auto max-w-5xl px-4 py-12">
        <h1 className="mb-6 text-3xl font-bold">Search</h1>
        <form onSubmit={(e) => { e.preventDefault(); window.location.href = `/search?q=${encodeURIComponent(query)}`; }} className="mb-8 flex gap-2">
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search articles…" />
          <Button type="submit">Search</Button>
        </form>
        {isLoading ? <p>Loading…</p> : posts.length === 0 ? <p>No results found.</p> : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => <PostCard key={p.id} post={p} />)}
          </div>
        )}
      </section>
    </>
  );
}
