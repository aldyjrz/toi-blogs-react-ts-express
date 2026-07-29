import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const passwordHash = await bcrypt.hash('password123', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@blog.com' },
    update: {},
    create: { email: 'admin@blog.com', passwordHash, name: 'Site Admin', role: 'ADMIN' },
  });

  const tech = await prisma.category.upsert({
    where: { slug: 'technology' },
    update: {},
    create: { name: 'Technology', slug: 'technology', description: 'Tech articles' },
  });

  const web = await prisma.tag.upsert({
    where: { slug: 'web-development' },
    update: {},
    create: { name: 'Web Development', slug: 'web-development' },
  });

  const post = await prisma.post.upsert({
    where: { slug: 'welcome-to-our-blog' },
    update: {},
    create: {
      title: 'Welcome to Our Blog',
      slug: 'welcome-to-our-blog',
      excerpt: 'Our first post introducing the blog platform.',
      content: '<p>This is a <strong>sample</strong> post created by the seed script.</p>',
      htmlContent: '<p>This is a <strong>sample</strong> post created by the seed script.</p>',
      status: 'PUBLISHED',
      publishedAt: new Date(),
      readingTime: 1,
      viewCount: 0,
      authorId: admin.id,
      categoryId: tech.id,
      postTags: { create: { tagId: web.id } },
    },
  });

  await prisma.seo.upsert({
    where: { postId: post.id },
    update: {},
    create: { postId: post.id, metaTitle: 'Welcome to Our Blog', metaDescription: 'Our first post.', robots: 'index,follow' },
  });

  await prisma.setting.upsert({
    where: { key: 'siteName' },
    update: {},
    create: { key: 'siteName', value: 'My Awesome Blog', group: 'general' },
  });

  console.log('✅ Seed complete');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
