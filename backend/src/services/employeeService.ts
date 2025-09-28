import { ContractType } from '@prisma/client';
import employeeRepository from '../repositories/employeeRepository.js';

export class EmployeeService {
  async getAllEmployees(entrepriseId: string) {
    return await employeeRepository.findAll(entrepriseId);
  }

  async getEmployeeById(id: string, entrepriseId: string) {
    const employee = await employeeRepository.findById(id, entrepriseId);
    if (!employee) {
      throw new Error('Employé non trouvé');
    }
    return employee;
  }

  async createEmployee(data: {
    firstName: string;
    lastName: string;
    poste: string;
    contract: ContractType;
    baseSalary: number;
    entrepriseId: string;
    userId?: string;
  }) {
    // Validation
    if (!data.firstName || !data.lastName || !data.poste || !data.contract || data.baseSalary <= 0) {
      throw new Error('Champs requis manquants ou invalides');
    }
    return await employeeRepository.create(data);
  }

  async updateEmployee(id: string, entrepriseId: string, data: {
    firstName?: string;
    lastName?: string;
    poste?: string;
    contract?: ContractType;
    baseSalary?: number;
  }) {
    const employee = await this.getEmployeeById(id, entrepriseId);
    return await employeeRepository.update(id, entrepriseId, data);
  }

  async activateEmployee(id: string, entrepriseId: string, isActive: boolean) {
    const employee = await this.getEmployeeById(id, entrepriseId);
    return await employeeRepository.activate(id, entrepriseId, isActive);
  }

  async filterEmployees(entrepriseId: string, filters: any) {
    const { status, ...rest } = filters;
    const mappedFilters = { ...rest };
    if (status === 'active') {
      mappedFilters.isActive = true;
    } else if (status === 'inactive') {
      mappedFilters.isActive = false;
    }
    return await employeeRepository.filter(entrepriseId, mappedFilters);
  }
}

export default new EmployeeService();
