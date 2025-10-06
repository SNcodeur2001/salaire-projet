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
      const { firstName, lastName, poste, contract, baseSalary, email, password } = req.body;

      // Validation détaillée
      if (!firstName || typeof firstName !== 'string' || firstName.trim().length === 0) {
        return res.status(400).json({ error: 'Le prénom est requis et doit être une chaîne non vide' });
      }
      if (!lastName || typeof lastName !== 'string' || lastName.trim().length === 0) {
        return res.status(400).json({ error: 'Le nom est requis et doit être une chaîne non vide' });
      }
      if (!poste || typeof poste !== 'string' || poste.trim().length === 0) {
        return res.status(400).json({ error: 'Le poste est requis et doit être une chaîne non vide' });
      }
      if (!contract || !['JOURNALIER', 'FIXE', 'HONORAIRE'].includes(contract)) {
        return res.status(400).json({ error: 'Le type de contrat doit être JOURNALIER, FIXE ou HONORAIRE' });
      }
      if (baseSalary === undefined || baseSalary === null || typeof baseSalary !== 'number' || baseSalary <= 0) {
        return res.status(400).json({ error: 'Le salaire de base doit être un nombre positif' });
      }

      let entrepriseId = req.user?.entrepriseId;
      if (req.user?.role === 'SUPER_ADMIN') {
        entrepriseId = req.body.entrepriseId;
      }
      if (!entrepriseId) {
        return res.status(400).json({ error: 'Entreprise non trouvée' });
      }

      // If email and password are provided, create user with employee
      if (email && password) {
        const authService = (await import('../services/authService.js')).default;
        const result = await authService.register(email, password, 'EMPLOYE', entrepriseId, {
          firstName,
          lastName,
          poste,
          contract,
          baseSalary,
        });
        // Return the created user and employee info
        res.status(201).json(result);
      } else {
        // Fallback to old method if no credentials
        const employee = await employeeService.createEmployee({ firstName, lastName, poste, contract, baseSalary, entrepriseId });
        res.status(201).json(employee);
      }
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
