import { PrismaClient, Employee, ContractType } from '@prisma/client';

const prisma = new PrismaClient();

export class EmployeeRepository {
  async findAll(entrepriseId: string): Promise<Employee[]> {
    return await prisma.employee.findMany({
      where: { entrepriseId },
      include: { user: true, entreprise: true, payslips: true },
    });
  }

  async findById(id: string, entrepriseId: string): Promise<Employee | null> {
    return await prisma.employee.findFirst({
      where: { id, entrepriseId },
      include: { user: true, entreprise: true, payslips: true },
    });
  }

  async create(data: {
    firstName: string;
    lastName: string;
    poste: string;
    contract: ContractType;
    baseSalary: number;
    entrepriseId: string;
    userId?: string;
  }): Promise<Employee> {
    return await prisma.employee.create({ data });
  }

  async update(id: string, entrepriseId: string, data: Partial<Employee>): Promise<Employee | null> {
    return await prisma.employee.updateMany({
      where: { id, entrepriseId },
      data,
    }).then(() => this.findById(id, entrepriseId));
  }

  async activate(id: string, entrepriseId: string, isActive: boolean): Promise<Employee | null> {
    return await prisma.employee.updateMany({
      where: { id, entrepriseId },
      data: { isActive },
    }).then(() => this.findById(id, entrepriseId));
  }

  async filter(entrepriseId: string, filters: {
    poste?: string;
    contract?: ContractType;
    isActive?: boolean;
  }): Promise<Employee[]> {
    return await prisma.employee.findMany({
      where: {
        entrepriseId,
        ...filters,
      },
      include: { user: true, entreprise: true },
    });
  }

  async findAllActive(entrepriseId: string): Promise<Employee[]> {
    return await prisma.employee.findMany({
      where: { entrepriseId, isActive: true },
    });
  }
}

export default new EmployeeRepository();
