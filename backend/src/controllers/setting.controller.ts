import { Request, Response, NextFunction } from 'express';
import { prisma } from '@/config/prisma';
import { authenticate, authorize } from '@/middlewares/auth';
import { validate } from '@/middlewares/validate';
import { updateSettingSchema } from '@/validators/post.validator';

async function list(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const settings = await prisma.setting.findMany();
    res.json({ success: true, data: settings });
  } catch (err) {
    next(err);
  }
}

async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = req.body;
    const setting = await prisma.setting.upsert({
      where: { key: data.key },
      update: { value: data.value, group: data.group ?? 'general' },
      create: { key: data.key, value: data.value, group: data.group ?? 'general' },
    });
    res.json({ success: true, data: setting });
  } catch (err) {
    next(err);
  }
}

export const settingController = {
  list,
  update: [authenticate, authorize('ADMIN'), validate(updateSettingSchema), update],
};
