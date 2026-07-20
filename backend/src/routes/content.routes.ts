import { Router, type RequestHandler } from 'express';
import { commentController } from '@/controllers/comment.controller';
import { seoController } from '@/controllers/seo.controller';

const router = Router();

router.get('/posts/:postId/comments', commentController.list as RequestHandler);
router.post('/posts/:postId/comments', ...(commentController.create as unknown as RequestHandler[]));
router.patch('/comments/:id', ...(commentController.moderate as unknown as RequestHandler[]));

router.put('/posts/:postId/seo', ...(seoController.upsert as unknown as RequestHandler[]));

export default router;
