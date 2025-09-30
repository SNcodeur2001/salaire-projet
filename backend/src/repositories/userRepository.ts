import { PrismaClient, User, Role } from '@prisma/client';

const prisma = new PrismaClient();

export class UserRepository {
  async findAll(): Promise<User[]> {
    return await prisma.user.findMany({
      include: { entreprise: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({ where: { email } });
  }

  async create(data: { email: string; password: string; role: Role; entrepriseId?: string | null }): Promise<User> {
    return await prisma.user.create({ data });
  }

  async findById(id: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { id },
      include: { entreprise: true },
    });
  }

  async update(id: string, data: Partial<User>): Promise<User | null> {
    return await prisma.user.update({
      where: { id },
      data,
      include: { entreprise: true },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.user.delete({ where: { id } });
  }
}

export default new UserRepository();