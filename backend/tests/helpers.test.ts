import { describe, it, expect } from 'vitest';
import { slugify, generateExcerpt, estimateReadingTime, toBoolean } from '@/utils/helpers';

describe('helpers', () => {
  it('slugifies titles with special characters', () => {
    expect(slugify('Hello World!')).toBe('hello-world');
    expect(slugify('  My First Post  ')).toBe('my-first-post');
    expect(slugify('Café & Crème')).toBe('cafe-creme');
    expect(slugify('100% React + TypeScript')).toBe('100-react-typescript');
  });

  it('truncates long slugs', () => {
    const long = 'a'.repeat(200);
    expect(slugify(long).length).toBeLessThanOrEqual(120);
  });

  it('generates excerpts from html', () => {
    const excerpt = generateExcerpt('<p>Hello <strong>world</strong> this is a test</p>');
    expect(excerpt).not.toContain('<');
    expect(excerpt).toContain('Hello');
  });

  it('appends ellipsis when content is long', () => {
    const long = 'word '.repeat(100);
    const excerpt = generateExcerpt(long, 50);
    expect(excerpt.endsWith('...')).toBe(true);
  });

  it('estimates reading time', () => {
    const words = Array.from({ length: 400 }, (_, i) => `w${i}`).join(' ');
    expect(estimateReadingTime(words)).toBe(2);
    expect(estimateReadingTime('one two')).toBe(1);
  });

  it('coerces booleans', () => {
    expect(toBoolean('true')).toBe(true);
    expect(toBoolean('false')).toBe(false);
    expect(toBoolean(1)).toBe(true);
    expect(toBoolean(0)).toBe(false);
    expect(toBoolean(true)).toBe(true);
  });
});
