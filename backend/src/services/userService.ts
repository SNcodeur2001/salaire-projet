import { Role } from '@prisma/client';
import userRepository from '../repositories/userRepository.js';

export class UserService {
  async getAllUsers() {
    const users = await userRepository.findAll();
    // Return users with entreprise info
    return users.map((user: any) => ({
      id: user.id,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      entrepriseId: user.entrepriseId,
      entreprise: user.entreprise ? {
        id: user.entreprise.id,
        name: user.entreprise.name,
      } : null,
    }));
  }

  async getUserById(id: string) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      entrepriseId: user.entrepriseId,
      entreprise: (user as any).entreprise ? {
        id: (user as any).entreprise.id,
        name: (user as any).entreprise.name,
      } : null,
    };
  }

  async updateUser(id: string, data: Partial<{
    email: string;
    role: Role;
    isActive: boolean;
    entrepriseId: string | null;
  }>) {
    const user = await this.getUserById(id);
    return await userRepository.update(id, data);
  }

  async deleteUser(id: string) {
    const user = await this.getUserById(id);
    // Business logic: prevent deletion of last SUPER_ADMIN, etc.
    await userRepository.delete(id);
  }
}

export default new UserService();