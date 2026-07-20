import { Request, Response, NextFunction } from 'express';
import { authService } from '@/services/auth.service';
import { authRateLimiter } from '@/middlewares/rateLimiter';

async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await authService.login(req.body);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await authService.register(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

async function refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await authService.refresh(req.body.refreshToken);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

async function logout(_req: Request, res: Response): Promise<void> {
  res.json({ success: true, message: 'Logged out' });
}

async function me(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await authService.getProfile(req.user!.id);
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}

async function changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await authService.changePassword(req.user!.id, req.body);
    res.json({ success: true, message: 'Password updated' });
  } catch (err) {
    next(err);
  }
}

async function forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const token = await authService.forgotPassword(req.body.email);
    res.json({ success: true, message: 'If the email exists, a reset link was sent.', ...(token ? { devToken: token } : {}) });
  } catch (err) {
    next(err);
  }
}

async function resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await authService.resetPassword(req.body);
    res.json({ success: true, message: 'Password reset successful' });
  } catch (err) {
    next(err);
  }
}

export const authController = {
  login: [authRateLimiter, login],
  register,
  refresh,
  logout,
  me,
  changePassword,
  forgotPassword: [authRateLimiter, forgotPassword],
  resetPassword,
};
