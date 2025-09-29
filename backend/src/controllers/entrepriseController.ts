import { Request, Response } from 'express';
import entrepriseService from '../services/entrepriseService.js';

export class EntrepriseController {
  async getEntreprises(req: Request, res: Response) {
    try {
      const entreprises = await entrepriseService.getAllEntreprises();
      res.json(entreprises);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getEntreprise(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const entreprise = await entrepriseService.getEntrepriseById(id);
      res.json(entreprise);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  async createEntreprise(req: Request, res: Response) {
    try {
      const entreprise = await entrepriseService.createEntreprise(req.body);
      res.status(201).json(entreprise);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateEntreprise(req: Request, res: Response) {
    try {
      const { id } = req.params;
      console.log('Updating entreprise:', id, req.body);
      const entreprise = await entrepriseService.updateEntreprise(id, req.body);
      res.json(entreprise);
    } catch (error: any) {
      console.error('Error updating entreprise:', error);
      res.status(400).json({ error: error.message });
    }
  }

  async deleteEntreprise(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await entrepriseService.deleteEntreprise(id);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}

export default new EntrepriseController();
