import { Request, Response, NextFunction } from 'express';
import { prisma } from '@/config/prisma';
import { authenticate, authorize } from '@/middlewares/auth';
import { validate } from '@/middlewares/validate';
import { seoSchema } from '@/validators/post.validator';
import { NotFoundError } from '@/utils/errors';

async function upsert(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const postId = req.params.postId;
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new NotFoundError('Post not found');
    const existing = await prisma.seo.findUnique({ where: { postId } });
    const data = req.body ?? {};
    const seo = existing
      ? await prisma.seo.update({ where: { postId }, data })
      : await prisma.seo.create({ data: { postId, ...data } });
    res.json({ success: true, data: seo });
  } catch (err) {
    next(err);
  }
}

export const seoController = {
  upsert: [authenticate, authorize('ADMIN', 'EDITOR', 'AUTHOR'), validate(seoSchema), upsert],
};
