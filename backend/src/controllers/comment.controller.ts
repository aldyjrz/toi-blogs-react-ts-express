import { prisma } from '@/config/prisma';
import { authenticate } from '@/middlewares/auth';
import { validate } from '@/middlewares/validate';
import { createCommentSchema } from '@/validators/post.validator';
import { Request, Response, NextFunction } from 'express';
import { NotFoundError } from '@/utils/errors';
import { sanitizePlainText } from '@/utils/sanitize';

async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const post = await prisma.post.findUnique({ where: { id: req.params.postId } });
    if (!post) throw new NotFoundError('Post not found');
    const content = sanitizePlainText(req.body.content);
    const comment = await prisma.comment.create({
      data: {
        postId: req.params.postId,
        authorId: req.user?.id,
        authorName: req.body.authorName,
        authorEmail: req.body.authorEmail,
        content,
        status: 'PENDING',
      },
    });
    res.status(201).json({ success: true, data: comment });
  } catch (err) {
    next(err);
  }
}

async function list(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const where = req.user ? {} : { status: 'APPROVED' };
    const comments = await prisma.comment.findMany({
      where: { postId: req.params.postId, ...where },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: comments });
  } catch (err) {
    next(err);
  }
}

async function moderate(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const comment = await prisma.comment.update({
      where: { id: req.params.id },
      data: { status: req.body.status },
    });
    res.json({ success: true, data: comment });
  } catch (err) {
    next(err);
  }
}

export const commentController = {
  create: [validate(createCommentSchema), create],
  list,
  moderate: [authenticate, moderate],
};
