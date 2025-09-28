import entrepriseRepository from '../repositories/entrepriseRepository.js';
export class EntrepriseService {
    async getAllEntreprises() {
        return await entrepriseRepository.findAll();
    }
    async getEntrepriseById(id) {
        const entreprise = await entrepriseRepository.findById(id);
        if (!entreprise) {
            throw new Error('Entreprise non trouvée');
        }
        return entreprise;
    }
    async createEntreprise(data) {
        // Validation
        if (!data.name || !data.currency || !data.periodType) {
            throw new Error('Nom, devise et type de période requis');
        }
        return await entrepriseRepository.create(data);
    }
    async updateEntreprise(id, data) {
        const entreprise = await this.getEntrepriseById(id);
        return await entrepriseRepository.update(id, data);
    }
    async deleteEntreprise(id) {
        const entreprise = await this.getEntrepriseById(id);
        // Business logic: check if has users/employees before delete
        await entrepriseRepository.delete(id);
    }
}
export default new EntrepriseService();
//# sourceMappingURL=entrepriseService.js.map