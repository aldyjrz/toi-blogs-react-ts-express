import { Router } from 'express';
import { seoGlobalController } from '@/controllers/seoGlobal.controller';

const router = Router();

router.get('/sitemap.xml', seoGlobalController.sitemap as never);
router.get('/robots.txt', seoGlobalController.robots as never);
router.get('/rss.xml', seoGlobalController.rss as never);
router.get('/manifest.json', seoGlobalController.manifest as never);

export default router;
