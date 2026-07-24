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
       <article className="mx-auto max-w-3xl px-4 py-12" aria-labelledby="post-title">
         <nav aria-label="Breadcrumb" className="mb-4 text-sm text-foreground/60">
           <ol className="flex items-center gap-2">
             <li><Link to="/" className="hover:underline">Home</Link></li>
             <li aria-hidden="true">/</li>
             <li><Link to="/blog" className="hover:underline">Blog</Link></li>
             {post.category && <><li aria-hidden="true">/</li><li><Link to={`/blog/category/${post.category.slug}`} className="hover:underline">{post.category.name}</Link></li></>}
             <li aria-hidden="true" className="hidden sm:inline">/</li>
           </ol>
         </nav>
         {post.category && (
           <Link to={`/blog/category/${post.category.slug}`} className="text-sm font-medium text-primary">
             {post.category.name}
           </Link>
         )}
         <h1 id="post-title" className="mt-2 text-4xl font-bold leading-tight">{post.title}</h1>
         <div className="mt-3 flex items-center gap-3 text-sm text-foreground/60">
           <span className="font-medium text-foreground">{post.author.name}</span>
           <span aria-hidden="true">·</span>
           <time dateTime={post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined}>{post.publishedAt ? formatDate(post.publishedAt) : ''}</time>
           <span aria-hidden="true">·</span>
           <span>{formatReadingTime(post.readingTime)}</span>
         </div>
         {post.featuredImage && (
           <img src={post.featuredImage} alt={post.featuredImage ? (post.seo?.metaTitle ?? post.title) : undefined} className="mt-6 aspect-[16/9] w-full rounded-lg object-cover" />
         )}
        <div
  ref={contentRef}
  className="prose-content mt-6 text-lg"
  dangerouslySetInnerHTML={{
    __html: post.htmlContent ?? post.content
  }}
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === 'Tab') {
      const focusable = e.currentTarget.querySelectorAll('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])');
      if (focusable.length === 0) return;
      const first = focusable[0] as HTMLElement;
      const last = focusable[focusable.length - 1] as HTMLElement;
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); (last as HTMLElement).focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); (first as HTMLElement).focus(); }
    }
  }}
/>
         {post.postTags.length > 0 && (
           <div className="mt-8 flex flex-wrap gap-2" aria-label="Tags">
             {post.postTags.map((pt) => (
               <Link key={pt.tag.slug} to={`/blog/tag/${pt.tag.slug}`} className="rounded-full border border-border px-3 py-1 text-sm hover:bg-muted">
                 #{pt.tag.name}
               </Link>
             ))}
           </div>
         )}
         <nav className="mt-8 flex items-center justify-between" aria-label="Share">
           <span className="text-sm text-foreground/60">Share</span>
           <div className="flex gap-3 text-sm">
             <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(`${SITE_URL}/blog/${post.slug}`)}&text=${encodeURIComponent(post.title)}`} target="_blank" rel="noopener noreferrer" className="hover:underline">Twitter</a>
             <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${SITE_URL}/blog/${post.slug}`)}`} target="_blank" rel="noopener noreferrer" className="hover:underline">Facebook</a>
             <button className="hover:underline" onClick={() => { navigator.clipboard.writeText(`${SITE_URL}/blog/${post.slug}`); }}>Copy link</button>
           </div>
         </nav>
         <CommentForm postId={post.id} comments={post.comments ?? []} />
       </article>
    </>
  );
}
