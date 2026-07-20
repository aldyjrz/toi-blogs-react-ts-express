import { describe, it, expect } from 'vitest';
import {
  hashPassword,
  comparePassword,
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from '@/utils/auth';
import { env } from '@/config/env';

describe('auth utils', () => {
  it('hashes and verifies passwords', async () => {
    const hash = await hashPassword('password123');
    expect(hash).not.toBe('password123');
    expect(await comparePassword('password123', hash)).toBe(true);
    expect(await comparePassword('wrong', hash)).toBe(false);
  });

  it('signs and verifies access token', () => {
    const token = signAccessToken({ sub: 'user-1', role: 'ADMIN' });
    const payload = verifyAccessToken(token);
    expect(payload.sub).toBe('user-1');
    expect(payload.role).toBe('ADMIN');
    expect(payload.tokenType).toBe('access');
  });

  it('signs and verifies refresh token', () => {
    const token = signRefreshToken({ sub: 'user-1', role: 'AUTHOR' });
    const payload = verifyRefreshToken(token);
    expect(payload.tokenType).toBe('refresh');
  });

  it('rejects an access token when verified as refresh', () => {
    const token = signAccessToken({ sub: 'user-1', role: 'ADMIN' });
    expect(() => verifyRefreshToken(token)).toThrow();
  });

  it('uses jwt secrets from env', () => {
    expect(env.jwtSecret).toBeTruthy();
    expect(env.jwtRefreshSecret).toBeTruthy();
  });
});
