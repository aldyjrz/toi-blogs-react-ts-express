import { prisma } from '@/config/prisma';
import { slugify } from '@/utils/helpers';
import { NotFoundError, ConflictError } from '@/utils/errors';
import { createTagSchema, updateTagSchema } from '@/validators/post.validator';

export const tagService = {
  async list() {
    return prisma.tag.findMany({ orderBy: { name: 'asc' }, include: { _count: { select: { postTags: true } } } });
  },
  async create(input: typeof createTagSchema._type) {
    const slug = input.slug ? slugify(input.slug) : slugify(input.name);
    const existing = await prisma.tag.findUnique({ where: { slug } });
    if (existing) throw new ConflictError('Tag slug already exists');
    return prisma.tag.create({ data: { name: input.name, slug } });
  },
  async update(id: string, input: typeof updateTagSchema._type) {
    const existing = await prisma.tag.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError('Tag not found');
    const slug = input.slug ? slugify(input.slug) : (input.name ? slugify(input.name) : existing.slug);
    if (slug !== existing.slug) {
      const conflict = await prisma.tag.findUnique({ where: { slug } });
      if (conflict) throw new ConflictError('Tag slug already exists');
    }
    return prisma.tag.update({ where: { id }, data: { name: input.name ?? existing.name, slug } });
  },
  async remove(id: string) {
    const existing = await prisma.tag.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError('Tag not found');
    await prisma.tag.delete({ where: { id } });
  },
};
