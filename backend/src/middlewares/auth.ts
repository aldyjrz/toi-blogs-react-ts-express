import { NextFunction, Request, Response } from 'express';
import { AppError, UnauthorizedError, ForbiddenError } from '@/utils/errors';
import { verifyAccessToken } from '@/utils/auth';
import type { AuthenticatedUser } from '@/types';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      throw new UnauthorizedError('Missing or invalid authorization header');
    }
    const token = header.slice(7);
    const payload = verifyAccessToken(token);
    if (payload.tokenType !== 'access') {
      throw new UnauthorizedError('Invalid token type');
    }
    req.user = { id: payload.sub, email: '', role: payload.role };
    next();
  } catch (err) {
    if (err instanceof AppError) return next(err);
    next(new UnauthorizedError('Invalid or expired token'));
  }
}

export function authorize(...roles: string[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) return next(new UnauthorizedError());
    if (roles.length > 0 && !roles.includes(req.user.role)) {
      return next(new ForbiddenError('Insufficient permissions'));
    }
    next();
  };
}
