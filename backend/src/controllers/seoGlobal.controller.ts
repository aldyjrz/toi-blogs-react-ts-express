import { Request, Response, NextFunction } from 'express';
import { prisma } from '@/config/prisma';
import { env } from '@/config/env';

async function sitemap(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const base = env.siteUrl.replace(/\/$/, '');
    const [posts, categories, tags] = await Promise.all([
      prisma.post.findMany({ where: { status: 'PUBLISHED' }, select: { slug: true, updatedAt: true, seo: true } }),
      prisma.category.findMany({ select: { slug: true } }),
      prisma.tag.findMany({ select: { slug: true } }),
    ]);
    const urls: string[] = [];
    urls.push(`<url><loc>${base}/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>`);
    urls.push(`<url><loc>${base}/blog</loc><changefreq>daily</changefreq><priority>0.9</priority></url>`);
    for (const p of posts) {
      const prio = p.seo?.sitemapPriority ?? 0.8;
      urls.push(`<url><loc>${base}/blog/${p.slug}</loc><lastmod>${p.updatedAt.toISOString()}</lastmod><changefreq>weekly</changefreq><priority>${prio}</priority></url>`);
    }
    for (const c of categories) {
      urls.push(`<url><loc>${base}/blog/category/${c.slug}</loc><changefreq>weekly</changefreq><priority>0.6</priority></url>`);
    }
    for (const t of tags) {
      urls.push(`<url><loc>${base}/blog/tag/${t.slug}</loc><changefreq>weekly</changefreq><priority>0.5</priority></url>`);
    }
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>`;
    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (err) {
    next(err);
  }
}

async function robots(_req: Request, res: Response): Promise<void> {
  const base = env.siteUrl.replace(/\/$/, '');
  const txt = `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api\n\nSitemap: ${base}/sitemap.xml`;
  res.header('Content-Type', 'text/plain');
  res.send(txt);
}

async function rss(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const base = env.siteUrl.replace(/\/$/, '');
    const posts = await prisma.post.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { publishedAt: 'desc' },
      take: 20,
      include: { author: { select: { name: true } } },
    });
    const items = posts
      .map(
        (p) =>
          `<item><title>${escapeXml(p.title)}</title><link>${base}/blog/${p.slug}</link><guid>${base}/blog/${p.slug}</guid><description>${escapeXml(p.excerpt ?? '')}</description><pubDate>${(p.publishedAt ?? p.createdAt).toISOString()}</pubDate><author>${escapeXml(p.author?.name ?? '')}</author></item>`
      )
      .join('');
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"><channel><title>Blog</title><link>${base}</link><description>Latest articles</description>${items}</channel></rss>`;
    res.header('Content-Type', 'application/rss+xml');
    res.send(xml);
  } catch (err) {
    next(err);
  }
}

function escapeXml(s: string): string {
  return s.replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c] as string));
}

async function manifest(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const settings = await prisma.setting.findMany();
    const map = new Map(settings.map((s) => [s.key, s.value]));
    const manifestData = {
      name: map.get('siteName') ?? 'Blog',
      short_name: map.get('siteName') ?? 'Blog',
      start_url: '/',
      display: 'standalone',
      background_color: '#ffffff',
      theme_color: '#000000',
      icons: [
        { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      ],
    };
    res.header('Content-Type', 'application/manifest+json');
    res.json(manifestData);
  } catch (err) {
    next(err);
  }
}

export const seoGlobalController = {
  sitemap,
  robots,
  rss,
  manifest,
};
