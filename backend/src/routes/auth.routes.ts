import { Router, type RequestHandler } from 'express';
import { authController } from '@/controllers/auth.controller';
import { authenticate } from '@/middlewares/auth';
import { validate } from '@/middlewares/validate';
import {
  loginSchema,
  registerSchema,
  refreshSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
} from '@/validators/auth.validator';

const router = Router();

router.post('/login', ...(authController.login as unknown as RequestHandler[]));
router.post('/register', validate(registerSchema), authController.register as RequestHandler);
router.post('/refresh', validate(refreshSchema), authController.refresh as RequestHandler);
router.post('/logout', authenticate, authController.logout as RequestHandler);
router.get('/me', authenticate, authController.me as RequestHandler);
router.post('/change-password', authenticate, validate(changePasswordSchema), authController.changePassword as RequestHandler);
router.post('/forgot-password', ...(authController.forgotPassword as unknown as RequestHandler[]));
router.post('/reset-password', validate(resetPasswordSchema), authController.resetPassword as RequestHandler);

void loginSchema;
void forgotPasswordSchema;

export default router;
