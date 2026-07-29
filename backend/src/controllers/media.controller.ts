import { Request, Response, NextFunction } from 'express';
import { prisma } from '@/config/prisma';
import { upload } from '@/middlewares/upload';
import { authenticate, authorize } from '@/middlewares/auth';
import { uploadImageToSupabase } from '@/utils/storage';
import { BadRequestError } from '@/utils/errors';

async function uploadHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const files = req.files as Express.Multer.File[] | undefined;
    if (!files || files.length === 0) throw new BadRequestError('No files provided');
    const results = [];
    for (const file of files) {
      const result = await uploadImageToSupabase(file.buffer, file.originalname);
      const media = await prisma.media.create({
        data: {
          fileName: file.originalname,
          url: result.url,
          mimeType: 'image/*',
          size: result.size,
          width: result.width,
          height: result.height,
          altText: req.body.altText ?? file.originalname,
        },
      });
      results.push(media);
    }
    res.status(201).json({ success: true, data: results });
  } catch (err) {
    next(err);
  }
}

async function list(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const media = await prisma.media.findMany({ orderBy: { createdAt: 'desc' }, take: 100 });
    res.json({ success: true, data: media });
  } catch (err) {
    next(err);
  }
}

export const mediaController = {
  upload: [authenticate, authorize('ADMIN', 'EDITOR', 'AUTHOR'), upload.array('files', 10), uploadHandler],
  list,
};
