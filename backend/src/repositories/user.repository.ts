import { prisma } from '@/config/prisma';
import type { User } from '@prisma/client';

export const userRepository = {
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  },
  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  },
  async create(data: { email: string; passwordHash: string; name: string; role?: 'ADMIN' | 'AUTHOR' | 'EDITOR' }): Promise<User> {
    return prisma.user.create({ data });
  },
  async updatePassword(id: string, passwordHash: string): Promise<void> {
    await prisma.user.update({ where: { id }, data: { passwordHash } });
  },
};
