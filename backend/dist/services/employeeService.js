import employeeRepository from '../repositories/employeeRepository.js';
export class EmployeeService {
    async getAllEmployees(entrepriseId) {
        return await employeeRepository.findAll(entrepriseId);
    }
    async getEmployeeById(id, entrepriseId) {
        const employee = await employeeRepository.findById(id, entrepriseId);
        if (!employee) {
            throw new Error('Employé non trouvé');
        }
        return employee;
    }
    async createEmployee(data) {
        // Validation
        if (!data.firstName || !data.lastName || !data.poste || !data.contract || data.baseSalary <= 0) {
            throw new Error('Champs requis manquants ou invalides');
        }
        return await employeeRepository.create(data);
    }
    async updateEmployee(id, entrepriseId, data) {
        const employee = await this.getEmployeeById(id, entrepriseId);
        return await employeeRepository.update(id, entrepriseId, data);
    }
    async activateEmployee(id, entrepriseId, isActive) {
        const employee = await this.getEmployeeById(id, entrepriseId);
        return await employeeRepository.activate(id, entrepriseId, isActive);
    }
    async filterEmployees(entrepriseId, filters) {
        return await employeeRepository.filter(entrepriseId, filters);
    }
}
export default new EmployeeService();
//# sourceMappingURL=employeeService.js.map