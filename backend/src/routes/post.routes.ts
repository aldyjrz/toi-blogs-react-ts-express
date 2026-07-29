import { Router, type RequestHandler } from 'express';
import { postController } from '@/controllers/post.controller';

const router = Router();

router.get('/', postController.list as RequestHandler);
router.get('/slug/:slug', postController.getBySlug as RequestHandler);
router.post('/', ...(postController.create as unknown as RequestHandler[]));
router.patch('/:id', ...(postController.update as unknown as RequestHandler[]));
router.delete('/:id', ...(postController.remove as unknown as RequestHandler[]));
router.post('/slug/:slug/view', postController.incrementView as RequestHandler);
router.get('/most-viewed', postController.mostViewed as RequestHandler);
router.get('/:id/related', postController.related as RequestHandler);

export default router;
