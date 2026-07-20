import { z } from 'zod';

const postStatusEnum = z.enum(['DRAFT', 'SCHEDULED', 'PUBLISHED', 'ARCHIVED']);

export const createPostSchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(1).optional(),
  excerpt: z.string().optional(),
  content: z.string().min(1),
  htmlContent: z.string().optional(),
  featuredImage: z.string().optional(),
  gallery: z.array(z.string()).optional(),
  status: postStatusEnum.default('DRAFT'),
  publishedAt: z.string().datetime().optional(),
  categoryId: z.string().optional(),
  tagIds: z.array(z.string()).optional(),
  authorId: z.string().optional(),
});

export const updatePostSchema = z.object({
  title: z.string().min(3).optional(),
  slug: z.string().min(1).optional(),
  excerpt: z.string().optional(),
  content: z.string().min(1).optional(),
  htmlContent: z.string().optional(),
  featuredImage: z.string().optional(),
  gallery: z.array(z.string()).optional(),
  status: postStatusEnum.optional(),
  publishedAt: z.string().datetime().optional(),
  categoryId: z.string().optional(),
  tagIds: z.array(z.string()).optional(),
});

export const listPostQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  status: postStatusEnum.optional(),
  category: z.string().optional(),
  tag: z.string().optional(),
  author: z.string().optional(),
  search: z.string().optional(),
});

export const seoSchema = z.object({
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  metaKeywords: z.array(z.string()).optional(),
  canonicalUrl: z.string().optional(),
  ogTitle: z.string().optional(),
  ogDescription: z.string().optional(),
  ogImage: z.string().optional(),
  twitterTitle: z.string().optional(),
  twitterDescription: z.string().optional(),
  twitterImage: z.string().optional(),
  robots: z.string().optional(),
  noindex: z.boolean().optional(),
  nofollow: z.boolean().optional(),
  sitemapPriority: z.number().optional(),
  changeFreq: z.string().optional(),
}).optional();

export const createCategorySchema = z.object({
  name: z.string().min(2),
  slug: z.string().optional(),
  description: z.string().optional(),
});

export const updateCategorySchema = createCategorySchema.partial();

export const createTagSchema = z.object({
  name: z.string().min(2),
  slug: z.string().optional(),
});

export const updateTagSchema = createTagSchema.partial();

export const createCommentSchema = z.object({
  authorName: z.string().min(2).optional(),
  authorEmail: z.string().email().optional(),
  content: z.string().min(1),
});

export const updateSettingSchema = z.object({
  key: z.string(),
  value: z.string(),
  group: z.string().optional(),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
export type ListPostQuery = z.infer<typeof listPostQuerySchema>;
