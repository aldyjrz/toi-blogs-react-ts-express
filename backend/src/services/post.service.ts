import { prisma } from '@/config/prisma';
import { postRepository } from '@/repositories/post.repository';
import { slugify, generateExcerpt, estimateReadingTime } from '@/utils/helpers';
import { sanitizeContent } from '@/utils/sanitize';
import { NotFoundError, ConflictError } from '@/utils/errors';
import type { CreatePostInput, UpdatePostInput } from '@/validators/post.validator';
import type { ListPostQuery } from '@/validators/post.validator';

export const postService = {
  async list(query: ListPostQuery) {
    const { data, total } = await postRepository.list({
      page: query.page,
      limit: query.limit,
      status: query.status,
      category: query.category,
      tag: query.tag,
      author: query.author,
      search: query.search,
    });
    return {
      data,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
      },
    };
  },

  async getBySlug(slug: string) {
    const post = await postRepository.findBySlug(slug);
    if (!post) throw new NotFoundError('Post not found');
    return post;
  },

  async create(input: CreatePostInput, authorId: string) {
    const slug = input.slug ? slugify(input.slug) : slugify(input.title);
    const existing = await prisma.post.findUnique({ where: { slug } });
    if (existing) throw new ConflictError('Slug already exists');
    const htmlContent = input.htmlContent ?? sanitizeContent(input.content);
    const excerpt = input.excerpt && input.excerpt.trim() ? input.excerpt : generateExcerpt(htmlContent);
    const readingTime = estimateReadingTime(input.content);
    const status = input.status;
    const data: Record<string, unknown> = {
      title: input.title,
      slug,
      excerpt,
      content: input.content,
      htmlContent,
      featuredImage: input.featuredImage,
      gallery: input.gallery ?? [],
      status,
      readingTime,
      authorId: input.authorId ?? authorId,
      categoryId: input.categoryId,
      publishedAt: status === 'PUBLISHED' ? (input.publishedAt ? new Date(input.publishedAt) : new Date()) : (input.publishedAt ? new Date(input.publishedAt) : null),
      postTags: { create: (input.tagIds ?? []).map((tagId) => ({ tagId })) },
    };
    return postRepository.create(data);
  },

  async update(id: string, input: UpdatePostInput) {
    const existing = await postRepository.findById(id);
    if (!existing) throw new NotFoundError('Post not found');
    const slug = input.slug ? slugify(input.slug) : (input.title ? slugify(input.title) : existing.slug);
    if (slug !== existing.slug) {
      const conflict = await prisma.post.findUnique({ where: { slug } });
      if (conflict) throw new ConflictError('Slug already exists');
    }
    const htmlContent = input.htmlContent ?? (input.content ? sanitizeContent(input.content) : existing.htmlContent);
    const excerpt = input.excerpt && input.excerpt.trim() ? input.excerpt : (input.content ? generateExcerpt(htmlContent!) : existing.excerpt);
    const readingTime = input.content ? estimateReadingTime(input.content) : existing.readingTime;
    const data: Record<string, unknown> = {};
    if (input.title) data.title = input.title;
    if (slug) data.slug = slug;
    if (excerpt !== undefined) data.excerpt = excerpt;
    if (input.content !== undefined) data.content = input.content;
    if (htmlContent) data.htmlContent = htmlContent;
    if (input.featuredImage !== undefined) data.featuredImage = input.featuredImage;
    if (input.gallery !== undefined) data.gallery = input.gallery;
    if (input.content) data.readingTime = readingTime;
    if (input.status) data.status = input.status;
    if (input.publishedAt !== undefined) data.publishedAt = new Date(input.publishedAt);
    if (input.categoryId !== undefined) data.categoryId = input.categoryId;
    if (input.tagIds) {
      await prisma.postTag.deleteMany({ where: { postId: id } });
      data.postTags = { create: input.tagIds.map((tagId) => ({ tagId })) };
    }
    return postRepository.update(id, data);
  },

  async remove(id: string) {
    const existing = await postRepository.findById(id);
    if (!existing) throw new NotFoundError('Post not found');
    await postRepository.remove(id);
  },
};
