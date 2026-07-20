import { Request, Response, NextFunction } from 'express';
import { prisma } from '@/config/prisma';
import { authenticate } from '@/middlewares/auth';

async function stats(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const [totalPosts, publishedPosts, draftPosts, categories, tags, comments] = await Promise.all([
      prisma.post.count(),
      prisma.post.count({ where: { status: 'PUBLISHED' } }),
      prisma.post.count({ where: { status: 'DRAFT' } }),
      prisma.category.count(),
      prisma.tag.count(),
      prisma.comment.count(),
    ]);
    res.json({
      success: true,
      data: { totalPosts, publishedPosts, draftPosts, categories, tags, comments, visitors: 0 },
    });
  } catch (err) {
    next(err);
  }
}

async function recentArticles(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { id: true, title: true, slug: true, status: true, createdAt: true },
    });
    res.json({ success: true, data: posts });
  } catch (err) {
    next(err);
  }
}

async function latestActivity(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const logs = await prisma.activityLog.findMany({ orderBy: { createdAt: 'desc' }, take: 10 });
    res.json({ success: true, data: logs });
  } catch (err) {
    next(err);
  }
}

export const dashboardController = {
  stats: [authenticate, stats],
  recentArticles: [authenticate, recentArticles],
  latestActivity: [authenticate, latestActivity],
};
