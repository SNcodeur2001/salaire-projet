import entrepriseRepository from '../repositories/entrepriseRepository.js';
import authService from './authService.js';
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
        // Create entreprise
        const entreprise = await entrepriseRepository.create({
            name: data.name,
            logo: data.logo,
            color: data.color,
            address: data.address,
            currency: data.currency,
            periodType: data.periodType,
        });
        // Create admin user if admin data provided
        if (data.adminEmail && data.adminPassword) {
            try {
                await authService.register(data.adminEmail, data.adminPassword, 'ADMIN', entreprise.id);
            }
            catch (error) {
                // If admin creation fails, don't delete the entreprise
                // Just log the error, entreprise is created without admin
            }
        }
        return entreprise;
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