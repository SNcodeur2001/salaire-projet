import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Role } from '@prisma/client';
import userRepository from '../repositories/userRepository.js';

interface UserResponse {
  id: string;
  email: string;
  role: string;
  entrepriseId?: string | null;
}

interface AuthResult {
  token: string;
  user: UserResponse;
}

export class AuthService {
  async register(email: string, password: string, role: Role = Role.ADMIN, entrepriseId?: string | null): Promise<AuthResult> {
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
    const token = jwt.sign(
      { userId: user.id, role: user.role, entrepriseId: user.entrepriseId },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    );

    return { token, user: { id: user.id, email: user.email, role: user.role, entrepriseId: user.entrepriseId } };
  }

  async login(email: string, password: string): Promise<AuthResult> {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Credentials invalides');
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new Error('Credentials invalides');
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role, entrepriseId: user.entrepriseId },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    );

    return { token, user: { id: user.id, email: user.email, role: user.role, entrepriseId: user.entrepriseId } };
  }

  async me(userId: string): Promise<UserResponse> {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }
    return { id: user.id, email: user.email, role: user.role, entrepriseId: user.entrepriseId };
  }
}

export default new AuthService();
