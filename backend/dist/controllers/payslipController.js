import payslipService from '../services/payslipService.js';
export class PayslipController {
    async getPayslips(req, res) {
        try {
            let entrepriseId = req.user?.entrepriseId;
            if (req.user?.role === 'SUPER_ADMIN') {
                entrepriseId = req.query.entrepriseId;
            }
            if (!entrepriseId) {
                return res.status(400).json({ error: 'Entreprise non trouvée' });
            }
            const payslips = await payslipService.getAllPayslips(entrepriseId);
            res.json(payslips);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async getPayslip(req, res) {
        try {
            const { id } = req.params;
            let entrepriseId = req.user?.entrepriseId;
            if (req.user?.role === 'SUPER_ADMIN') {
                entrepriseId = req.query.entrepriseId;
            }
            if (!entrepriseId) {
                return res.status(400).json({ error: 'Entreprise non trouvée' });
            }
            const payslip = await payslipService.getPayslipById(id, entrepriseId);
            res.json(payslip);
        }
        catch (error) {
            res.status(404).json({ error: error.message });
        }
    }
    async updatePayslip(req, res) {
        try {
            const { id } = req.params;
            const { grossSalary, deductions, netSalary, notes } = req.body;
            // Validation détaillée
            if (grossSalary !== undefined && (typeof grossSalary !== 'number' || grossSalary <= 0)) {
                return res.status(400).json({ error: 'Le salaire brut doit être un nombre positif' });
            }
            if (deductions !== undefined && (typeof deductions !== 'number' || deductions < 0)) {
                return res.status(400).json({ error: 'Les charges ne peuvent pas être négatives' });
            }
            if (netSalary !== undefined && (typeof netSalary !== 'number' || netSalary <= 0)) {
                return res.status(400).json({ error: 'Le salaire net doit être un nombre positif' });
            }
            if (notes !== undefined && typeof notes !== 'string') {
                return res.status(400).json({ error: 'Les notes doivent être une chaîne de caractères' });
            }
            let entrepriseId = req.user?.entrepriseId;
            if (req.user?.role === 'SUPER_ADMIN') {
                entrepriseId = req.query.entrepriseId;
            }
            if (!entrepriseId) {
                return res.status(400).json({ error: 'Entreprise non trouvée' });
            }
            const payslip = await payslipService.updatePayslip(id, entrepriseId, req.body);
            res.json(payslip);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async getPayslipPayments(req, res) {
        try {
            const { id } = req.params;
            const entrepriseId = req.user?.entrepriseId;
            if (!entrepriseId) {
                return res.status(400).json({ error: 'Entreprise non trouvée' });
            }
            const payments = await payslipService.getPayslipPayments(id, entrepriseId);
            res.json(payments);
        }
        catch (error) {
            res.status(404).json({ error: error.message });
        }
    }
    async downloadPayslipPdf(req, res) {
        try {
            const { id } = req.params;
            const entrepriseId = req.user?.entrepriseId;
            if (!entrepriseId) {
                return res.status(400).json({ error: 'Entreprise non trouvée' });
            }
            await payslipService.generatePayslipPdf(id, entrepriseId, res);
        }
        catch (error) {
            res.status(404).json({ error: error.message });
        }
    }
    async sendPayslipEmail(req, res) {
        try {
            const { id } = req.params;
            const entrepriseId = req.user?.entrepriseId;
            if (!entrepriseId) {
                return res.status(400).json({ error: 'Entreprise non trouvée' });
            }
            const payslip = await payslipService.getPayslipById(id, entrepriseId);
            // Simulate email sending (in real app, use email service)
            console.log(`Sending email to employee with payslip ${id}`);
            res.json({ message: 'Email envoyé avec succès' });
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}
export default new PayslipController();
//# sourceMappingURL=payslipController.js.map