import { describe, it, expect, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Seo } from '@/components/Seo';

afterEach(() => {
  cleanup();
  document.head.innerHTML = '';
});

describe('Seo component', () => {
  it('sets the document title', () => {
    render(
      <MemoryRouter>
        <Seo title="My Post" />
      </MemoryRouter>
    );
    expect(document.title).toBe('My Post | My Awesome Blog');
  });

  it('injects meta description and canonical link', () => {
    render(
      <MemoryRouter>
        <Seo title="T" description="A description" canonical="https://example.com/x" />
      </MemoryRouter>
    );
    expect(document.querySelector('meta[name="description"]')?.getAttribute('content')).toBe('A description');
    expect(document.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe('https://example.com/x');
  });

  it('adds noindex robots when requested', () => {
    render(
      <MemoryRouter>
        <Seo title="T" noindex />
      </MemoryRouter>
    );
    expect(document.querySelector('meta[name="robots"]')?.getAttribute('content')).toBe('noindex,nofollow');
  });

  it('injects JSON-LD script', () => {
    render(
      <MemoryRouter>
        <Seo title="T" jsonLd={{ '@context': 'https://schema.org', '@type': 'Article', headline: 'X' }} />
      </MemoryRouter>
    );
    const script = document.querySelector('script[type="application/ld+json"]');
    expect(script).toBeTruthy();
    expect(script?.textContent).toContain('"@type":"Article"');
  });
});
