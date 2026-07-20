import { describe, it, expect } from 'vitest';
import { cn, formatDate, formatReadingTime } from '@/lib/utils';

describe('lib/utils', () => {
  it('merges class names', () => {
    expect(cn('a', 'b')).toBe('a b');
    const conditional = false;
    expect(cn('a', conditional && 'b', 'c')).toBe('a c');
    expect(cn('px-2', 'px-4')).toBe('px-4');
  });

  it('formats dates', () => {
    const out = formatDate('2026-01-15T00:00:00.000Z');
    expect(out).toMatch(/Jan/);
    expect(out).toContain('2026');
  });

  it('formats reading time', () => {
    expect(formatReadingTime(3)).toBe('3 min read');
    expect(formatReadingTime(1)).toBe('1 min read');
  });
});
