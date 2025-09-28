import paymentService from '../services/paymentService.js';
export class PaymentController {
    async createPayment(req, res) {
        try {
            const caissierId = req.user?.userId;
            if (!caissierId) {
                return res.status(400).json({ error: 'Caissier non trouvé' });
            }
            const payment = await paymentService.createPayment({ ...req.body, caissierId });
            res.status(201).json(payment);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async getPayment(req, res) {
        try {
            const { id } = req.params;
            const payment = await paymentService.getPaymentById(id);
            res.json(payment);
        }
        catch (error) {
            res.status(404).json({ error: error.message });
        }
    }
    async getPaymentReceipt(req, res) {
        try {
            const { id } = req.params;
            const receipt = await paymentService.getPaymentReceipt(id);
            res.json(receipt);
        }
        catch (error) {
            res.status(404).json({ error: error.message });
        }
    }
}
export default new PaymentController();
//# sourceMappingURL=paymentController.js.map