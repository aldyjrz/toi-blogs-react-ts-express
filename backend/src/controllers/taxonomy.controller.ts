import { Request, Response, NextFunction } from 'express';
import { categoryService } from '@/services/category.service';
import { tagService } from '@/services/tag.service';
import { authenticate, authorize } from '@/middlewares/auth';
import { validate } from '@/middlewares/validate';
import { createCategorySchema, updateCategorySchema, createTagSchema, updateTagSchema } from '@/validators/post.validator';

async function listCategories(_req: Request, res: Response, next: NextFunction) {
  try { res.json({ success: true, data: await categoryService.list() }); } catch (err) { next(err); }
}
async function createCategory(req: Request, res: Response, next: NextFunction) {
  try { res.status(201).json({ success: true, data: await categoryService.create(req.body) }); } catch (err) { next(err); }
}
async function updateCategory(req: Request, res: Response, next: NextFunction) {
  try { res.json({ success: true, data: await categoryService.update(req.params.id, req.body) }); } catch (err) { next(err); }
}
async function deleteCategory(req: Request, res: Response, next: NextFunction) {
  try { await categoryService.remove(req.params.id); res.json({ success: true, message: 'Category deleted' }); } catch (err) { next(err); }
}

async function listTags(_req: Request, res: Response, next: NextFunction) {
  try { res.json({ success: true, data: await tagService.list() }); } catch (err) { next(err); }
}
async function createTag(req: Request, res: Response, next: NextFunction) {
  try { res.status(201).json({ success: true, data: await tagService.create(req.body) }); } catch (err) { next(err); }
}
async function updateTag(req: Request, res: Response, next: NextFunction) {
  try { res.json({ success: true, data: await tagService.update(req.params.id, req.body) }); } catch (err) { next(err); }
}
async function deleteTag(req: Request, res: Response, next: NextFunction) {
  try { await tagService.remove(req.params.id); res.json({ success: true, message: 'Tag deleted' }); } catch (err) { next(err); }
}

export const categoryController = {
  list: listCategories,
  create: [authenticate, authorize('ADMIN', 'EDITOR'), validate(createCategorySchema), createCategory],
  update: [authenticate, authorize('ADMIN', 'EDITOR'), validate(updateCategorySchema), updateCategory],
  remove: [authenticate, authorize('ADMIN', 'EDITOR'), deleteCategory],
};

export const tagController = {
  list: listTags,
  create: [authenticate, authorize('ADMIN', 'EDITOR'), validate(createTagSchema), createTag],
  update: [authenticate, authorize('ADMIN', 'EDITOR'), validate(updateTagSchema), updateTag],
  remove: [authenticate, authorize('ADMIN', 'EDITOR'), deleteTag],
};
