import { PrismaClient, Entreprise } from '@prisma/client';

const prisma = new PrismaClient();

export class EntrepriseRepository {
  async findAll(): Promise<Entreprise[]> {
    return await prisma.entreprise.findMany();
  }

  async findById(id: string): Promise<Entreprise | null> {
    return await prisma.entreprise.findUnique({ where: { id } });
  }

  async create(data: {
    name: string;
    logo?: string;
    address?: string;
    currency: string;
    periodType: string;
  }): Promise<Entreprise> {
    return await prisma.entreprise.create({ data });
  }

  async update(id: string, data: Partial<Entreprise>): Promise<Entreprise | null> {
    return await prisma.entreprise.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await prisma.entreprise.delete({ where: { id } });
  }
}

export default new EntrepriseRepository();
