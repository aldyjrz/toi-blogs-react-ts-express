import { prisma as db } from '@/config/prisma';
import { comparePassword, hashPassword, signAccessToken, signRefreshToken, verifyRefreshToken } from '@/utils/auth';
import { randomToken } from '@/utils/helpers';
import { UnauthorizedError, NotFoundError, ConflictError } from '@/utils/errors';
import type { LoginInput, RegisterInput, ChangePasswordInput, ResetPasswordInput } from '@/validators/auth.validator';

interface AuthResult {
  accessToken: string;
  refreshToken: string;
  user: { id: string; email: string; name: string; role: string };
}

export const authService = {
  async login(input: LoginInput): Promise<AuthResult> {
    const user = await db.user.findUnique({ where: { email: input.email } });
    if (!user) throw new UnauthorizedError('Invalid credentials');
    const valid = await comparePassword(input.password, user.passwordHash);
    if (!valid) throw new UnauthorizedError('Invalid credentials');
    return this.issueTokens(user);
  },

  async register(input: RegisterInput): Promise<AuthResult> {
    const existing = await db.user.findUnique({ where: { email: input.email } });
    if (existing) throw new ConflictError('Email already registered');
    const passwordHash = await hashPassword(input.password);
    const user = await db.user.create({
      data: { email: input.email, passwordHash, name: input.name, role: input.role ?? 'AUTHOR' },
    });
    return this.issueTokens(user);
  },

  issueTokens(user: { id: string; email: string; name: string; role: string }): AuthResult {
    const accessToken = signAccessToken({ sub: user.id, role: user.role });
    const refreshToken = signRefreshToken({ sub: user.id, role: user.role });
    return {
      accessToken,
      refreshToken,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    };
  },

  async refresh(refreshToken: string): Promise<AuthResult> {
    try {
      const payload = verifyRefreshToken(refreshToken);
      const user = await db.user.findUnique({ where: { id: payload.sub } });
      if (!user) throw new UnauthorizedError('User not found');
      return this.issueTokens(user);
    } catch {
      throw new UnauthorizedError('Invalid refresh token');
    }
  },

  async changePassword(userId: string, input: ChangePasswordInput): Promise<void> {
    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundError('User not found');
    const valid = await comparePassword(input.currentPassword, user.passwordHash);
    if (!valid) throw new UnauthorizedError('Current password is incorrect');
    await db.user.update({ where: { id: userId }, data: { passwordHash: await hashPassword(input.newPassword) } });
  },

  async forgotPassword(email: string): Promise<string> {
    const user = await db.user.findUnique({ where: { email } });
    if (!user) return '';
    const token = randomToken();
    const exp = new Date(Date.now() + 60 * 60 * 1000);
    await db.user.update({ where: { id: user.id }, data: { resetToken: token, resetTokenExp: exp } });
    return token;
  },

  async resetPassword(input: ResetPasswordInput): Promise<void> {
    const user = await db.user.findUnique({ where: { resetToken: input.token } });
    if (!user || !user.resetTokenExp || user.resetTokenExp < new Date()) {
      throw new UnauthorizedError('Invalid or expired reset token');
    }
    await db.user.update({
      where: { id: user.id },
      data: { passwordHash: await hashPassword(input.password), resetToken: null, resetTokenExp: null },
    });
  },

  async getProfile(userId: string) {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, role: true, bio: true, avatarUrl: true, createdAt: true },
    });
    if (!user) throw new NotFoundError('User not found');
    return user;
  },
};
