import { useParams, Link } from 'react-router-dom';
import { Seo } from '@/components/Seo';
import { usePost } from '@/hooks/usePosts';
import { formatDate, formatReadingTime } from '@/lib/utils';
import { SITE_URL } from '@/lib/constants';
import { CommentForm } from '@/components/CommentForm';

import { useEffect, useRef } from 'react';
 export function PostPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading } = usePost(slug ?? '');
  const post = data?.data;
  const contentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
  const container = contentRef.current;

  if (!container) return;

  const preBlocks = container.querySelectorAll("pre");

  preBlocks.forEach((pre) => {

    // cegah duplicate button
    if (pre.querySelector(".copy-code-btn")) return;

    const button = document.createElement("button");

    button.className = "copy-code-btn";
    button.innerText = "Copy";

    button.onclick = async () => {
      const code = pre.querySelector("code");

  const text = code
    ? code.innerText
    : pre.cloneNode(true) as HTMLElement;

  const content = typeof text === "string"
    ? text
    : text.innerText.replace("Copy", "");

  await navigator.clipboard.writeText(content);

  button.innerText = "Copied!";

  setTimeout(() => {
    button.innerText = "Copy";
  }, 2000);
    };

    pre.appendChild(button);
  });

}, [post?.htmlContent]);

  if (isLoading) return <div className="mx-auto max-w-3xl px-4 py-12">Loading…</div>;
  if (!post) return <div className="mx-auto max-w-3xl px-4 py-12">Post not found.</div>;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: post.featuredImage,
    datePublished: post.publishedAt,
    author: { '@type': 'Person', name: post.author.name },
    publisher: { '@type': 'Organization', name: 'Blog' },
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
  };
   

  return (
    <>
      <Seo
        title={post.seo?.metaTitle ?? post.title}
        description={post.seo?.metaDescription ?? post.excerpt}
        canonical={post.seo?.canonicalUrl ?? `${SITE_URL}/blog/${post.slug}`}
        image={post.featuredImage}
        type="article"
        noindex={post.seo?.noindex}
        jsonLd={jsonLd}
      />
      <article className="mx-auto max-w-3xl px-4 py-12">
        {post.category && (
          <Link to={`/blog/category/${post.category.slug}`} className="text-sm font-medium text-primary">
            {post.category.name}
          </Link>
        )}
        <h1 className="mt-2 text-4xl font-bold leading-tight">{post.title}</h1>
        <div className="mt-3 flex items-center gap-3 text-sm text-foreground/60">
          <span className="font-medium text-foreground">{post.author.name}</span>
          <span>·</span>
          <span>{post.publishedAt ? formatDate(post.publishedAt) : ''}</span>
          <span>·</span>
          <span>{formatReadingTime(post.readingTime)}</span>
        </div>
        {post.featuredImage && (
          <img src={post.featuredImage} alt={post.title} className="mt-6 aspect-[16/9] w-full rounded-lg object-cover" />
        )}
       <div
  ref={contentRef}
  className="prose-content mt-6 text-lg"
  dangerouslySetInnerHTML={{
    __html: post.htmlContent ?? post.content
  }}
/>
        {post.postTags.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2">
            {post.postTags.map((pt) => (
              <Link key={pt.tag.slug} to={`/blog/tag/${pt.tag.slug}`} className="rounded-full border border-border px-3 py-1 text-sm hover:bg-muted">
                #{pt.tag.name}
              </Link>
            ))}
          </div>
        )}
        <CommentForm postId={post.id} comments={post.comments ?? []} />
      </article>
    </>
  );
}
