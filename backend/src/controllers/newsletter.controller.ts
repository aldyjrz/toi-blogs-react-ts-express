import { Request, Response, NextFunction } from 'express';
import { prisma } from '@/config/prisma';
import { randomToken } from '@/utils/helpers';
import { BadRequestError } from '@/utils/errors';

async function subscribe(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const email = String(req.body.email ?? '').toLowerCase().trim();
    if (!email || !email.includes('@')) throw new BadRequestError('Valid email required');
    const existing = await prisma.newsletter.findUnique({ where: { email } });
    if (existing) {
      res.json({ success: true, message: 'Already subscribed or pending verification', data: existing });
      return;
    }
    const created = await prisma.newsletter.create({
      data: { email, token: randomToken(), verified: false },
    });
    res.status(201).json({ success: true, message: 'Subscribed. Check your email to confirm.', data: created });
  } catch (err) {
    next(err);
  }
}

async function verify(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { token } = req.query as { token?: string };
    if (!token) throw new BadRequestError('Token required');
    const record = await prisma.newsletter.findFirst({ where: { token } });
    if (!record) throw new BadRequestError('Invalid token');
    await prisma.newsletter.update({ where: { id: record.id }, data: { verified: true, token: null } });
    res.json({ success: true, message: 'Email verified' });
  } catch (err) {
    next(err);
  }
}

async function exportCsv(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const rows = await prisma.newsletter.findMany({ where: { verified: true } });
    const csv = ['email'].concat(rows.map((r) => r.email)).join('\n');
    res.header('Content-Type', 'text/csv');
    res.attachment('newsletter.csv');
    res.send(csv);
  } catch (err) {
    next(err);
  }
}

export const newsletterController = {
  subscribe,
  verify,
  exportCsv: [exportCsv],
};
