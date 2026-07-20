import { Router } from 'express';
import { prisma } from '@/config/prisma';

const router = Router();

router.get('/pages/:slug', async (req, res) => {
  const page = await prisma.page.findUnique({ where: { slug: req.params.slug } });
  if (!page) {
    return res.status(404).json({ success: false, message: 'Page not found' });
  }
  res.json({ success: true, data: page });
});

router.get('/pages', async (_req, res) => {
  const pages = await prisma.page.findMany({ where: { status: 'PUBLISHED' } });
  res.json({ success: true, data: pages });
});

export default router;
