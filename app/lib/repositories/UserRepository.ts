import { prisma } from '../db';
import { User, PlatformAccount } from '@prisma/client';

export class UserRepository {
  async createUser(
    email: string,
    name: string,
    passwordHash: string,
    avatar?: string
  ): Promise<User> {
    return prisma.user.create({
      data: {
        email,
        name,
        password: passwordHash,
        avatar: avatar || null,
      },
    });
  }

  async getUserById(userId: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id: userId },
    });
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async updateUser(
    userId: string,
    updates: Partial<User>
  ): Promise<User> {
    return prisma.user.update({
      where: { id: userId },
      data: updates,
    });
  }

  async getUserWithPlatforms(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
      include: {
        platformAccounts: true,
        posts: true,
      },
    });
  }

  async deleteUser(userId: string): Promise<void> {
    await prisma.user.delete({
      where: { id: userId },
    });
  }
}
