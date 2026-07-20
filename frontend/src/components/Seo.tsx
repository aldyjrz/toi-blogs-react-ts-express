import { useEffect } from 'react';
import { SITE_NAME } from '@/lib/constants';

interface SeoProps {
  title?: string;
  description?: string;
  canonical?: string;
  image?: string;
  type?: string;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  noindex?: boolean;
}

export function Seo({ title, description, canonical, image, type = 'website', jsonLd, noindex }: SeoProps) {
  useEffect(() => {
    const base = SITE_NAME;
    document.title = title ? `${title} | ${base}` : base;

    const setMeta = (name: string, content: string | undefined, attr: 'name' | 'property' = 'name') => {
      if (!content) return;
      let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMeta('description', description);
    if (noindex) {
      setMeta('robots', 'noindex,nofollow');
    } else {
      setMeta('robots', 'index,follow');
    }
    setMeta('og:title', title);
    setMeta('og:description', description, 'property');
    setMeta('og:image', image, 'property');
    setMeta('og:type', type, 'property');
    setMeta('twitter:card', 'summary_large_image');

    if (canonical) {
      let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }
      link.setAttribute('href', canonical);
    }

    const existing = document.head.querySelector('script[type="application/ld+json"]');
    existing?.remove();

    if (jsonLd) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }
  }, [title, description, canonical, image, type, jsonLd, noindex]);

  return null;
}
