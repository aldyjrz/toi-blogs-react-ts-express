import { afterAll, describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { buildTestApp } from './testApp';
import { prisma } from '@/config/prisma';
import { hashPassword } from '@/utils/auth';

const TEST_EMAIL = 'test-user@example.com';
const TEST_PASSWORD = 'password123';

async function dbAvailable(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}

const DB_READY = await dbAvailable();

describe('Health endpoint (no DB required)', () => {
  const app = buildTestApp();
  it('returns ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.status).toBe('ok');
  });
});

describe.skipIf(!DB_READY)('Auth API', () => {
  const app = buildTestApp();

  beforeAll(async () => {
    const hash = await hashPassword(TEST_PASSWORD);
    await prisma.user.upsert({
      where: { email: TEST_EMAIL },
      update: { passwordHash: hash },
      create: { email: TEST_EMAIL, passwordHash: hash, name: 'Test User', role: 'ADMIN' },
    });
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: TEST_EMAIL } });
    await prisma.$disconnect();
  });

  it('logs in and returns tokens', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({ email: TEST_EMAIL, password: TEST_PASSWORD });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.accessToken).toBeTypeOf('string');
    expect(res.body.data.refreshToken).toBeTypeOf('string');
    expect(res.body.data.user.role).toBe('ADMIN');
  });

  it('rejects invalid credentials', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({ email: TEST_EMAIL, password: 'wrong' });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('protects /auth/me without token', async () => {
    const res = await request(app).get('/api/v1/auth/me');
    expect(res.status).toBe(401);
  });
});

describe.skipIf(!DB_READY)('Posts API', () => {
  const app = buildTestApp();
  let accessToken = '';
  let authorId = '';
  let categoryId = '';

  beforeAll(async () => {
    const hash = await hashPassword(TEST_PASSWORD);
    const user = await prisma.user.upsert({
      where: { email: TEST_EMAIL },
      update: { passwordHash: hash },
      create: { email: TEST_EMAIL, passwordHash: hash, name: 'Test User', role: 'ADMIN' },
    });
    authorId = user.id;
    const cat = await prisma.category.create({ data: { name: 'Test Cat', slug: 'test-cat' } });
    categoryId = cat.id;
    const login = await request(app).post('/api/v1/auth/login').send({ email: TEST_EMAIL, password: TEST_PASSWORD });
    accessToken = login.body.data.accessToken;
  });

  afterAll(async () => {
    await prisma.post.deleteMany({ where: { authorId } });
    await prisma.category.deleteMany({ where: { id: categoryId } });
    await prisma.user.deleteMany({ where: { email: TEST_EMAIL } });
    await prisma.$disconnect();
  });

  it('lists published posts publicly', async () => {
    const res = await request(app).get('/api/v1/posts?status=PUBLISHED');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.pagination).toBeDefined();
  });

  it('creates, fetches and deletes a post', async () => {
    const createRes = await request(app)
      .post('/api/v1/posts')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ title: 'Integration Test Post', content: '<p>Hello integration</p>', status: 'PUBLISHED', categoryId });
    expect(createRes.status).toBe(201);
    const slug = createRes.body.data.slug;
    expect(slug).toBeTypeOf('string');

    const getRes = await request(app).get(`/api/v1/posts/slug/${slug}`);
    expect(getRes.status).toBe(200);
    expect(getRes.body.data.title).toBe('Integration Test Post');

    const delRes = await request(app).delete(`/api/v1/posts/${createRes.body.data.id}`).set('Authorization', `Bearer ${accessToken}`);
    expect(delRes.status).toBe(200);
  });

  it('blocks post creation without auth', async () => {
    const res = await request(app).post('/api/v1/posts').send({ title: 'x', content: '<p>y</p>' });
    expect(res.status).toBe(401);
  });
});

describe.skipIf(!DB_READY)('Global SEO endpoints', () => {
  const app = buildTestApp();
  it('serves robots.txt', async () => {
    const res = await request(app).get('/robots.txt');
    expect(res.status).toBe(200);
    expect(res.text).toContain('Sitemap:');
  });
});
