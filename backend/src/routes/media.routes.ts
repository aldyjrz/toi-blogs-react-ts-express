import { Router, type RequestHandler } from 'express';
import { mediaController } from '@/controllers/media.controller';

const router = Router();

router.get('/', mediaController.list as RequestHandler);
router.post('/', ...(mediaController.upload as unknown as RequestHandler[]));

export default router;
