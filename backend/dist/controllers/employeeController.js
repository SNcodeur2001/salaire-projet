import employeeService from '../services/employeeService.js';
export class EmployeeController {
    async getEmployees(req, res) {
        try {
            const entrepriseId = req.user?.entrepriseId;
            if (!entrepriseId) {
                return res.status(400).json({ error: 'Entreprise non trouvée' });
            }
            const employees = await employeeService.getAllEmployees(entrepriseId);
            res.json(employees);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async getEmployee(req, res) {
        try {
            const { id } = req.params;
            const entrepriseId = req.user?.entrepriseId;
            if (!entrepriseId) {
                return res.status(400).json({ error: 'Entreprise non trouvée' });
            }
            const employee = await employeeService.getEmployeeById(id, entrepriseId);
            res.json(employee);
        }
        catch (error) {
            res.status(404).json({ error: error.message });
        }
    }
    async createEmployee(req, res) {
        try {
            const entrepriseId = req.user?.entrepriseId;
            if (!entrepriseId) {
                return res.status(400).json({ error: 'Entreprise non trouvée' });
            }
            const employee = await employeeService.createEmployee({ ...req.body, entrepriseId });
            res.status(201).json(employee);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async updateEmployee(req, res) {
        try {
            const { id } = req.params;
            const entrepriseId = req.user?.entrepriseId;
            if (!entrepriseId) {
                return res.status(400).json({ error: 'Entreprise non trouvée' });
            }
            const employee = await employeeService.updateEmployee(id, entrepriseId, req.body);
            res.json(employee);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async activateEmployee(req, res) {
        try {
            const { id } = req.params;
            const { isActive } = req.body;
            const entrepriseId = req.user?.entrepriseId;
            if (!entrepriseId) {
                return res.status(400).json({ error: 'Entreprise non trouvée' });
            }
            const employee = await employeeService.activateEmployee(id, entrepriseId, isActive);
            res.json(employee);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async filterEmployees(req, res) {
        try {
            const entrepriseId = req.user?.entrepriseId;
            if (!entrepriseId) {
                return res.status(400).json({ error: 'Entreprise non trouvée' });
            }
            const employees = await employeeService.filterEmployees(entrepriseId, req.body);
            res.json(employees);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}
export default new EmployeeController();
//# sourceMappingURL=employeeController.js.map