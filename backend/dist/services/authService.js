import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Role } from '@prisma/client';
import userRepository from '../repositories/userRepository.js';
export class AuthService {
    async register(email, password, role = Role.ADMIN, entrepriseId) {
        // Check if user exists
        const existing = await userRepository.findByEmail(email);
        if (existing) {
            throw new Error('Utilisateur existe déjà');
        }
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create user
        const user = await userRepository.create({
            email,
            password: hashedPassword,
            role,
            entrepriseId,
        });
        // Generate token
        const token = jwt.sign({ userId: user.id, role: user.role, entrepriseId: user.entrepriseId }, process.env.JWT_SECRET, { expiresIn: '7d' });
        return { token, user: { id: user.id, email: user.email, role: user.role, entrepriseId: user.entrepriseId } };
    }
    async login(email, password) {
        const user = await userRepository.findByEmail(email);
        if (!user) {
            throw new Error('Credentials invalides');
        }
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            throw new Error('Credentials invalides');
        }
        const token = jwt.sign({ userId: user.id, role: user.role, entrepriseId: user.entrepriseId }, process.env.JWT_SECRET, { expiresIn: '7d' });
        return { token, user: { id: user.id, email: user.email, role: user.role, entrepriseId: user.entrepriseId } };
    }
    async me(userId) {
        const user = await userRepository.findById(userId);
        if (!user) {
            throw new Error('Utilisateur non trouvé');
        }
        return { id: user.id, email: user.email, role: user.role, entrepriseId: user.entrepriseId };
    }
}
export default new AuthService();
//# sourceMappingURL=authService.js.map