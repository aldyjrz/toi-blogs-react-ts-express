import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { Seo } from '@/components/Seo';
import { SITE_URL } from '@/lib/constants';

interface CmsPage {
  title: string;
  slug: string;
  htmlContent?: string;
  content: string;
  metaTitle?: string;
  metaDescription?: string;
  noindex?: boolean;
}

const STATIC_PAGES: Record<string, { title: string; content: string }> = {
  about: { title: 'About Us', content: '<p>Welcome to our blog. We write about technology, lifestyle, and more.</p>' },
  contact: { title: 'Contact', content: '<p>Reach us at <a href="mailto:hello@blog.com">hello@blog.com</a>.</p>' },
  'privacy-policy': { title: 'Privacy Policy', content: '<p>We respect your privacy. This is a placeholder privacy policy.</p>' },
  terms: { title: 'Terms of Service', content: '<p>Placeholder terms of service.</p>' },
  disclaimer: { title: 'Disclaimer', content: '<p>Content is provided for informational purposes only.</p>' },
};

export function PagePage() {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading } = useQuery({
    queryKey: ['page', slug],
    queryFn: () => apiFetch<{ data: CmsPage }>(`/pages/${slug}`),
    retry: false,
  });

  const page = data?.data;
  const fallback = slug ? STATIC_PAGES[slug] : undefined;

  if (isLoading) return <div className="mx-auto max-w-3xl px-4 py-12">Loading…</div>;
  if (!page && !fallback) return <div className="mx-auto max-w-3xl px-4 py-12">Page not found.</div>;

  const title = page?.title ?? fallback?.title ?? '';
  const html = page?.htmlContent ?? fallback?.content ?? '';

  return (
    <>
      <Seo title={title} canonical={`${SITE_URL}/${slug}`} noindex={page?.noindex} />
      <section className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="mb-6 text-4xl font-bold">{title}</h1>
        <div className="prose-content" dangerouslySetInnerHTML={{ __html: html }} />
      </section>
    </>
  );
}
