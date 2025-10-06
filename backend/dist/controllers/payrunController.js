import payrunService from '../services/payrunService.js';
export class PayrunController {
    async getPayruns(req, res) {
        try {
            let entrepriseId = req.user?.entrepriseId;
            if (req.user?.role === 'SUPER_ADMIN') {
                entrepriseId = req.query.entrepriseId;
            }
            if (!entrepriseId) {
                return res.status(400).json({ error: 'Entreprise non trouvée' });
            }
            const payruns = await payrunService.getAllPayruns(entrepriseId);
            res.json(payruns);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async getPayrun(req, res) {
        try {
            const { id } = req.params;
            let entrepriseId = req.user?.entrepriseId;
            if (req.user?.role === 'SUPER_ADMIN') {
                entrepriseId = req.query.entrepriseId || req.body.entrepriseId;
            }
            if (!entrepriseId) {
                return res.status(400).json({ error: 'Entreprise non trouvée' });
            }
            const payrun = await payrunService.getPayrunById(id, entrepriseId);
            res.json(payrun);
        }
        catch (error) {
            res.status(404).json({ error: error.message });
        }
    }
    async createPayrun(req, res) {
        try {
            const { period, status } = req.body;
            // Validation détaillée
            if (!period || typeof period !== 'string' || period.trim().length === 0) {
                return res.status(400).json({ error: 'La période est requise et doit être une chaîne non vide' });
            }
            if (!status || !['BROUILLON', 'APPROUVE', 'CLOS'].includes(status)) {
                return res.status(400).json({ error: 'Le statut doit être BROUILLON, APPROUVE ou CLOS' });
            }
            let entrepriseId = req.user?.entrepriseId;
            if (req.user?.role === 'SUPER_ADMIN') {
                entrepriseId = req.body.entrepriseId;
            }
            if (!entrepriseId) {
                return res.status(400).json({ error: 'Entreprise non trouvée' });
            }
            const payrun = await payrunService.createPayrun({ ...req.body, entrepriseId });
            res.status(201).json(payrun);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async updatePayrun(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            let entrepriseId = req.user?.entrepriseId;
            if (req.user?.role === 'SUPER_ADMIN') {
                entrepriseId = req.body.entrepriseId;
            }
            if (!entrepriseId) {
                return res.status(400).json({ error: 'Entreprise non trouvée' });
            }
            const payrun = await payrunService.updatePayrunStatus(id, entrepriseId, status);
            res.json(payrun);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async getPayrunPayslips(req, res) {
        try {
            const { id } = req.params;
            let entrepriseId = req.user?.entrepriseId;
            if (req.user?.role === 'SUPER_ADMIN') {
                entrepriseId = req.query.entrepriseId || req.body.entrepriseId;
            }
            if (!entrepriseId) {
                return res.status(400).json({ error: 'Entreprise non trouvée' });
            }
            const payslips = await payrunService.getPayrunPayslips(id, entrepriseId);
            res.json(payslips);
        }
        catch (error) {
            res.status(404).json({ error: error.message });
        }
    }
    async generatePayslips(req, res) {
        try {
            const { id } = req.params;
            let entrepriseId = req.user?.entrepriseId;
            if (req.user?.role === 'SUPER_ADMIN') {
                entrepriseId = req.body.entrepriseId;
            }
            if (!entrepriseId) {
                return res.status(400).json({ error: 'Entreprise non trouvée' });
            }
            const payslips = await payrunService.generatePayslips(id, entrepriseId);
            res.json(payslips);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}
export default new PayrunController();
//# sourceMappingURL=payrunController.js.map