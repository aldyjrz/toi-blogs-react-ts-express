import { describe, it, expect } from 'vitest';
import {
  createPostSchema,
  listPostQuerySchema,
  createCommentSchema,
} from '@/validators/post.validator';
import {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
} from '@/validators/auth.validator';

describe('validators', () => {
  it('accepts a valid login', () => {
    expect(loginSchema.safeParse({ email: 'a@b.com', password: 'secret1' }).success).toBe(true);
  });

  it('rejects an invalid email', () => {
    expect(loginSchema.safeParse({ email: 'nope', password: 'secret1' }).success).toBe(false);
  });

  it('rejects short passwords on register', () => {
    expect(registerSchema.safeParse({ email: 'a@b.com', password: '123', name: 'Bob' }).success).toBe(false);
  });

  it('defaults post status to DRAFT and slug optional', () => {
    const res = createPostSchema.safeParse({ title: 'Hello', content: '<p>Body</p>' });
    expect(res.success).toBe(true);
    if (res.success) expect(res.data.status).toBe('DRAFT');
  });

  it('rejects empty post content', () => {
    expect(createPostSchema.safeParse({ title: 'Hello', content: '' }).success).toBe(false);
  });

  it('coerces numeric query params', () => {
    const res = listPostQuerySchema.safeParse({ page: '2', limit: '20' });
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.page).toBe(2);
      expect(res.data.limit).toBe(20);
    }
  });

  it('validates forgot/reset/change password', () => {
    expect(forgotPasswordSchema.safeParse({ email: 'a@b.com' }).success).toBe(true);
    expect(resetPasswordSchema.safeParse({ token: 'abc123token', password: 'newpass1' }).success).toBe(true);
    expect(changePasswordSchema.safeParse({ currentPassword: 'oldpass1', newPassword: 'newpass1' }).success).toBe(true);
  });

  it('validates comment input', () => {
    expect(createCommentSchema.safeParse({ content: 'Nice post' }).success).toBe(true);
    expect(createCommentSchema.safeParse({ content: '' }).success).toBe(false);
  });
});
