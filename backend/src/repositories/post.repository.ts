import { prisma } from "@/config/prisma";
import type { Post, PostStatus } from "@prisma/client";
interface ListParams {
  page: number;
  limit: number;
  status?: PostStatus;
  category?: string;
  tag?: string;
  author?: string;
  search?: string;
}
export const postRepository = {
  async list(params: ListParams) {
    const where: Record<string, unknown> = {};
    if (params.status) where.status = params.status;
    if (params.category) where.category = { slug: params.category };
    if (params.tag) where.postTags = { some: { tag: { slug: params.tag } } };
    if (params.author) where.author = { email: params.author };
    if (params.search) {
      where.OR = [
        { title: { contains: params.search, mode: "insensitive" } },
        { content: { contains: params.search, mode: "insensitive" } },
      ];
    }
    const [data, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          author: { select: { id: true, name: true, avatarUrl: true } },
          category: { select: { id: true, name: true, slug: true } },
          postTags: {
            include: { tag: { select: { id: true, name: true, slug: true } } },
          },
          seo: true,
        },
        orderBy: { publishedAt: "desc" },
        skip: (params.page - 1) * params.limit,
        take: params.limit,
      }),
      prisma.post.count({ where }),
    ]);
    return { data, total };
  },
  async findBySlug(slug: string): Promise<Post | null> {
    return prisma.post.findUnique({
      where: { slug },
      include: {
        author: {
          select: { id: true, name: true, bio: true, avatarUrl: true },
        },
        category: { select: { id: true, name: true, slug: true } },
        postTags: {
          include: { tag: { select: { id: true, name: true, slug: true } } },
        },
        seo: true,
        comments: {
          where: { status: "APPROVED" },
          orderBy: { createdAt: "desc" },
        },
      },
    });
  },
  async findById(id: string): Promise<Post | null> {
    return prisma.post.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, name: true, avatarUrl: true } },
        category: true,
        postTags: { include: { tag: true } },
        seo: true,
      },
    });
  },
  async create(data: Record<string, unknown>): Promise<Post> {
    return prisma.post.create({
      data: data as never,
      include: { seo: true, postTags: { include: { tag: true } } },
    });
  },
  async update(id: string, data: Record<string, unknown>): Promise<Post> {
    return prisma.post.update({
      where: { id },
      data: data as never,
      include: { seo: true, postTags: { include: { tag: true } } },
    });
  },
  async remove(id: string): Promise<void> {
    await prisma.post.delete({ where: { id } });
  },
  async countByStatus(status: PostStatus): Promise<number> {
    return prisma.post.count({ where: { status } });
  },
  async totalCount(): Promise<number> {
    return prisma.post.count();
  },
};
