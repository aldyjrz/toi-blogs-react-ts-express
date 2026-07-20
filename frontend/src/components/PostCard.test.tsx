import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { PostCard } from '@/components/PostCard';
import type { Post } from '@/types';

const post: Post = {
  id: '1',
  title: 'Hello World',
  slug: 'hello-world',
  excerpt: 'An excerpt',
  content: '<p>body</p>',
  status: 'PUBLISHED',
  readingTime: 4,
  author: { id: 'a', name: 'Jane Doe' },
  category: { id: 'c', name: 'Tech', slug: 'tech' },
  postTags: [],
  publishedAt: '2026-01-10T00:00:00.000Z',
};

describe('PostCard', () => {
  it('renders title, author and category link', () => {
    render(
      <MemoryRouter>
        <PostCard post={post} />
      </MemoryRouter>
    );
    expect(screen.getByText('Hello World')).toBeInTheDocument();
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('Tech')).toHaveAttribute('href', '/blog/category/tech');
  });

  it('links to the post slug', () => {
    render(
      <MemoryRouter>
        <PostCard post={post} />
      </MemoryRouter>
    );
    expect(screen.getByText('Hello World').closest('a')).toHaveAttribute('href', '/blog/hello-world');
  });
});
