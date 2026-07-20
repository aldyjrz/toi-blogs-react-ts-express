import sanitizeHtml from 'sanitize-html';

const allowedTags = [
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'p', 'a', 'ul', 'ol', 'li', 'blockquote', 'code', 'pre',
  'strong', 'em', 'u', 's', 'br', 'hr', 'img', 'figure', 'figcaption',
  'table', 'thead', 'tbody', 'tr', 'th', 'td', 'span', 'div',
  'iframe', 'blockquote', 'mark', 'small', 'sub', 'sup',
];

export function sanitizeContent(dirty: string): string {
  return sanitizeHtml(dirty, {
    allowedTags,
    allowedAttributes: {
      a: ['href', 'name', 'target', 'rel'],
      img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
      iframe: ['src', 'width', 'height', 'allow', 'allowfullscreen', 'frameborder'],
      code: ['class'],
      span: ['class'],
      div: ['class'],
    },
    allowedSchemes: ['http', 'https', 'mailto', 'data'],
    allowedIframeHostnames: ['www.youtube.com', 'www.youtube-nocookie.com', 'twitter.com', 'platform.twitter.com'],
    transformTags: {
      a: sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer', target: '_blank' }),
    },
  });
}

export function sanitizePlainText(input: string): string {
  return sanitizeHtml(input, { allowedTags: [], allowedAttributes: {} }).trim();
}
