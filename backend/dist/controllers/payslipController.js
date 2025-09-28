import payslipService from '../services/payslipService.js';
export class PayslipController {
    async getPayslip(req, res) {
        try {
            const { id } = req.params;
            const entrepriseId = req.user?.entrepriseId;
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
            const entrepriseId = req.user?.entrepriseId;
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
}
export default new PayslipController();
//# sourceMappingURL=payslipController.js.map