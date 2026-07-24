import { Router, type RequestHandler } from 'express';
import { settingController } from '@/controllers/setting.controller';
import { newsletterController } from '@/controllers/newsletter.controller';
import { dashboardController } from '@/controllers/dashboard.controller';
import { commentController } from '@/controllers/comment.controller';

const router = Router();

router.get('/settings', settingController.list as RequestHandler);
router.put('/settings', ...(settingController.update as unknown as RequestHandler[]));

router.post('/newsletter/subscribe', newsletterController.subscribe as RequestHandler);
router.get('/newsletter/verify', newsletterController.verify as RequestHandler);
router.get('/newsletter/export', ...(newsletterController.exportCsv as unknown as RequestHandler[]));

router.get('/dashboard/stats', ...(dashboardController.stats as unknown as RequestHandler[]));
router.get('/dashboard/recent', ...(dashboardController.recentArticles as unknown as RequestHandler[]));
router.get('/dashboard/activity', ...(dashboardController.latestActivity as unknown as RequestHandler[]));

router.get('/comments', ...(commentController.adminList as unknown as RequestHandler[]));
router.delete('/comments/:id', ...(commentController.adminDelete as unknown as RequestHandler[]));

export default router;
