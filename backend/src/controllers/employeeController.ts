import { Request, Response } from 'express';
import employeeService from '../services/employeeService.js';

export class EmployeeController {
  async getEmployees(req: Request, res: Response) {
    try {
      let entrepriseId = req.user?.entrepriseId;
      if (req.user?.role === 'SUPER_ADMIN') {
        entrepriseId = req.query.entrepriseId as string;
      }
      if (!entrepriseId) {
        return res.status(400).json({ error: 'Entreprise non trouvée' });
      }
      const employees = await employeeService.getAllEmployees(entrepriseId);
      res.json(employees);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getEmployee(req: Request, res: Response) {
    try {
      const { id } = req.params;
      let entrepriseId = req.user?.entrepriseId;
      if (req.user?.role === 'SUPER_ADMIN') {
        entrepriseId = req.query.entrepriseId as string || req.body.entrepriseId;
      }
      if (!entrepriseId) {
        return res.status(400).json({ error: 'Entreprise non trouvée' });
      }
      const employee = await employeeService.getEmployeeById(id, entrepriseId);
      res.json(employee);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  async createEmployee(req: Request, res: Response) {
    try {
      let entrepriseId = req.user?.entrepriseId;
      if (req.user?.role === 'SUPER_ADMIN') {
        entrepriseId = req.body.entrepriseId;
      }
      if (!entrepriseId) {
        return res.status(400).json({ error: 'Entreprise non trouvée' });
      }
      const employee = await employeeService.createEmployee({ ...req.body, entrepriseId });
      res.status(201).json(employee);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateEmployee(req: Request, res: Response) {
    try {
      const { id } = req.params;
      let entrepriseId = req.user?.entrepriseId;
      if (req.user?.role === 'SUPER_ADMIN') {
        entrepriseId = req.body.entrepriseId;
      }
      if (!entrepriseId) {
        return res.status(400).json({ error: 'Entreprise non trouvée' });
      }
      const employee = await employeeService.updateEmployee(id, entrepriseId, req.body);
      res.json(employee);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async activateEmployee(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { isActive } = req.body;
      let entrepriseId = req.user?.entrepriseId;
      if (req.user?.role === 'SUPER_ADMIN') {
        entrepriseId = req.body.entrepriseId;
      }
      if (!entrepriseId) {
        return res.status(400).json({ error: 'Entreprise non trouvée' });
      }
      const employee = await employeeService.activateEmployee(id, entrepriseId, isActive);
      res.json(employee);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async filterEmployees(req: Request, res: Response) {
    try {
      let entrepriseId = req.user?.entrepriseId;
      if (req.user?.role === 'SUPER_ADMIN') {
        entrepriseId = req.body.entrepriseId;
      }
      if (!entrepriseId) {
        return res.status(400).json({ error: 'Entreprise non trouvée' });
      }
      const employees = await employeeService.filterEmployees(entrepriseId, req.body);
      res.json(employees);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}

export default new EmployeeController();
