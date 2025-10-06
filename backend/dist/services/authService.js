import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Role } from '@prisma/client';
import userRepository from '../repositories/userRepository.js';
import entrepriseRepository from '../repositories/entrepriseRepository.js';
import employeeRepository from '../repositories/employeeRepository.js';
export class AuthService {
    async register(email, password, role = Role.ADMIN, entrepriseId, employeeData) {
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
        // Create employee if role is EMPLOYE or CAISSIER
        if ((role === Role.EMPLOYE || role === Role.CAISSIER) && employeeData && entrepriseId) {
            await employeeRepository.create({
                firstName: employeeData.firstName,
                lastName: employeeData.lastName,
                poste: employeeData.poste,
                contract: employeeData.contract,
                baseSalary: employeeData.baseSalary,
                entrepriseId,
                userId: user.id,
            });
        }
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
        let entreprise = null;
        if (user.entrepriseId) {
            const entrepriseData = await entrepriseRepository.findById(user.entrepriseId);
            if (entrepriseData) {
                entreprise = {
                    id: entrepriseData.id,
                    name: entrepriseData.name,
                    logo: entrepriseData.logo,
                    color: entrepriseData.color,
                };
            }
        }
        return {
            id: user.id,
            email: user.email,
            role: user.role,
            entrepriseId: user.entrepriseId,
            entreprise
        };
    }
}
export default new AuthService();
//# sourceMappingURL=authService.js.map