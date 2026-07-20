import { describe, it, expect } from 'vitest';
import { sanitizeContent, sanitizePlainText } from '@/utils/sanitize';

describe('sanitize', () => {
  it('keeps allowed formatting tags', () => {
    const input = '<h2>Title</h2><p>Hello <strong>world</strong></p>';
    const out = sanitizeContent(input);
    expect(out).toContain('<h2>Title</h2>');
    expect(out).toContain('<strong>world</strong>');
  });

  it('strips script and event handlers (XSS protection)', () => {
    const input = '<p onclick="alert(1)">Hi</p><script>alert(2)</script>';
    const out = sanitizeContent(input);
    expect(out).not.toContain('<script>');
    expect(out).not.toContain('onclick');
  });

  it('adds rel/target to links', () => {
    const out = sanitizeContent('<a href="https://example.com">link</a>');
    expect(out).toContain('rel="noopener noreferrer"');
    expect(out).toContain('target="_blank"');
  });

  it('sanitizes plain text completely', () => {
    expect(sanitizePlainText('<img src=x onerror=alert(1)>')).toBe('');
  });
});
