import { Router, type RequestHandler } from 'express';
import { categoryController, tagController } from '@/controllers/taxonomy.controller';

const router = Router();

router.get('/categories', categoryController.list as RequestHandler);
router.post('/categories', ...(categoryController.create as unknown as RequestHandler[]));
router.patch('/categories/:id', ...(categoryController.update as unknown as RequestHandler[]));
router.delete('/categories/:id', ...(categoryController.remove as unknown as RequestHandler[]));

router.get('/tags', tagController.list as RequestHandler);
router.post('/tags', ...(tagController.create as unknown as RequestHandler[]));
router.patch('/tags/:id', ...(tagController.update as unknown as RequestHandler[]));
router.delete('/tags/:id', ...(tagController.remove as unknown as RequestHandler[]));

export default router;
