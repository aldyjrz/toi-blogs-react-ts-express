import { Link } from 'react-router-dom';
import type { Post } from '@/types';
import { formatDate, formatReadingTime } from '@/lib/utils';

export function PostCard({ post }: { post: Post }) {
  return (
   <article className="group flex h-full flex-col rounded-lg border border-border bg-card p-5 transition hover:shadow-sm">
  {post.featuredImage && (
    <Link to={`/blog/${post.slug}`} className="mb-3 block overflow-hidden rounded-md">
      <img
        src={post.featuredImage}
        alt={post.title}
        loading="lazy"
        className="aspect-[16/9] w-full object-cover transition group-hover:scale-105"
      />
    </Link>
  )}

    <div className="flex items-center gap-2 text-xs text-foreground/60">

  <span>
      {post.publishedAt
        ? formatDate(post.publishedAt)
        : post.createdAt
        ? formatDate(post.createdAt)
        : ""}
    </span>
    </div>
  <h2 className="mt-2 text-lg font-bold leading-snug">
    <Link to={`/blog/${post.slug}`} className="hover:underline">
      {post.title}
    </Link>
  </h2>

  {post.excerpt && (
    <p className="mt-2 line-clamp-3 text-sm text-foreground/70">
      {post.excerpt}
    </p>
  )}

  {/* Author selalu di bawah */}
  <div className="mt-auto pt-4 flex items-center gap-2 text-sm">
     
   <div className="flex items-center gap-2 text-xs text-foreground/60">
       <span className="font-medium">{post.author.name}</span>

    {post.category && (
      <Link
        to={`/blog/category/${post.category.slug}`}
        className="font-medium text-primary"
      >
        {post.category.name}
      </Link>
    )}
    
    <span>·</span>
    <span>{formatReadingTime(post.readingTime)}</span>
  </div>
  </div>
</article>
  );
}
