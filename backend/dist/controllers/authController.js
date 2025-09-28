import authService from '../services/authService.js';
export class AuthController {
    async register(req, res) {
        try {
            const { email, password, role, entrepriseId } = req.body;
            if (!email || !password) {
                return res.status(400).json({ error: 'Email et password requis' });
            }
            // Only SUPER_ADMIN can create users with entrepriseId
            const currentUser = req.user;
            if (entrepriseId && (!currentUser || currentUser.role !== 'SUPER_ADMIN')) {
                return res.status(403).json({ error: 'Seul SUPER_ADMIN peut créer des utilisateurs pour une entreprise' });
            }
            // If not SUPER_ADMIN, use the current user's entrepriseId
            const finalEntrepriseId = entrepriseId || currentUser?.entrepriseId;
            const result = await authService.register(email, password, role, finalEntrepriseId);
            res.json(result);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async login(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ error: 'Email et password requis' });
            }
            const result = await authService.login(email, password);
            res.json(result);
        }
        catch (error) {
            res.status(401).json({ error: error.message });
        }
    }
    async me(req, res) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                return res.status(401).json({ error: 'Non authentifié' });
            }
            const user = await authService.me(userId);
            res.json({ user });
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}
export default new AuthController();
//# sourceMappingURL=authController.js.map