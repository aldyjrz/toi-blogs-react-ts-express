import { Request, Response, NextFunction } from 'express';
import { postService } from '@/services/post.service';
import { authenticate, authorize } from '@/middlewares/auth';
import { validate } from '@/middlewares/validate';
import { createPostSchema, updatePostSchema, listPostQuerySchema } from '@/validators/post.validator';

async function list(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = listPostQuerySchema.parse(req.query);
    const result = await postService.list(parsed);
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
}

async function getBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const post = await postService.getBySlug(req.params.slug);
    res.json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
}

async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const post = await postService.create(req.body, req.user!.id);
    res.status(201).json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
}

async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const post = await postService.update(req.params.id, req.body);
    res.json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
}

async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await postService.remove(req.params.id);
    res.json({ success: true, message: 'Post deleted' });
  } catch (err) {
    next(err);
  }
}

export const postController = {
  list,
  getBySlug,
  create: [authenticate, authorize('ADMIN', 'EDITOR', 'AUTHOR'), validate(createPostSchema), create],
  update: [authenticate, authorize('ADMIN', 'EDITOR', 'AUTHOR'), validate(updatePostSchema), update],
  remove: [authenticate, authorize('ADMIN', 'EDITOR'), remove],
};
