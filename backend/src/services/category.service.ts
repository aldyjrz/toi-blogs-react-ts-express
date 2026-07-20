import { prisma } from '@/config/prisma';
import { slugify } from '@/utils/helpers';
import { NotFoundError, ConflictError } from '@/utils/errors';
import { createCategorySchema, updateCategorySchema } from '@/validators/post.validator';

export const categoryService = {
  async list() {
    return prisma.category.findMany({ orderBy: { name: 'asc' }, include: { _count: { select: { posts: true } } } });
  },
  async create(input: typeof createCategorySchema._type) {
    const slug = input.slug ? slugify(input.slug) : slugify(input.name);
    const existing = await prisma.category.findUnique({ where: { slug } });
    if (existing) throw new ConflictError('Category slug already exists');
    return prisma.category.create({ data: { name: input.name, slug, description: input.description } });
  },
  async update(id: string, input: typeof updateCategorySchema._type) {
    const existing = await prisma.category.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError('Category not found');
    const slug = input.slug ? slugify(input.slug) : (input.name ? slugify(input.name) : existing.slug);
    if (slug !== existing.slug) {
      const conflict = await prisma.category.findUnique({ where: { slug } });
      if (conflict) throw new ConflictError('Category slug already exists');
    }
    return prisma.category.update({ where: { id }, data: { name: input.name ?? existing.name, slug, description: input.description } });
  },
  async remove(id: string) {
    const existing = await prisma.category.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError('Category not found');
    await prisma.category.delete({ where: { id } });
  },
};
