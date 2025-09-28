import entrepriseRepository from '../repositories/entrepriseRepository.js';

export class EntrepriseService {
  async getAllEntreprises() {
    return await entrepriseRepository.findAll();
  }

  async getEntrepriseById(id: string) {
    const entreprise = await entrepriseRepository.findById(id);
    if (!entreprise) {
      throw new Error('Entreprise non trouvée');
    }
    return entreprise;
  }

  async createEntreprise(data: {
    name: string;
    logo?: string;
    address?: string;
    currency: string;
    periodType: string;
  }) {
    // Validation
    if (!data.name || !data.currency || !data.periodType) {
      throw new Error('Nom, devise et type de période requis');
    }
    return await entrepriseRepository.create(data);
  }

  async updateEntreprise(id: string, data: Partial<{
    name: string;
    logo?: string;
    address?: string;
    currency: string;
    periodType: string;
  }>) {
    const entreprise = await this.getEntrepriseById(id);
    return await entrepriseRepository.update(id, data);
  }

  async deleteEntreprise(id: string) {
    const entreprise = await this.getEntrepriseById(id);
    // Business logic: check if has users/employees before delete
    await entrepriseRepository.delete(id);
  }
}

export default new EntrepriseService();
