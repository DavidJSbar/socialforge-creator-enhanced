import { prisma } from '../db';
import { PlatformAccount } from '@prisma/client';

export class PlatformAccountRepository {
  async createPlatformAccount(
    userId: string,
    platform: string,
    platformUserId: string,
    accessToken: string,
    refreshToken?: string,
    tokenExpiresAt?: Date
  ): Promise<PlatformAccount> {
    return prisma.platformAccount.create({
      data: {
        userId,
        platform,
        platformUserId,
        accessToken,
        refreshToken: refreshToken || null,
        tokenExpiresAt,
      },
    });
  }

  async getPlatformAccountById(accountId: string): Promise<PlatformAccount | null> {
    return prisma.platformAccount.findUnique({
      where: { id: accountId },
    });
  }

  async getPlatformAccountsByUser(userId: string): Promise<PlatformAccount[]> {
    return prisma.platformAccount.findMany({
      where: { userId },
    });
  }

  async getPlatformAccount(
    userId: string,
    platform: string
  ): Promise<PlatformAccount | null> {
    return prisma.platformAccount.findFirst({
      where: {
        userId,
        platform,
      },
    });
  }

  async updateToken(
    accountId: string,
    accessToken: string,
    refreshToken?: string,
    tokenExpiresAt?: Date
  ): Promise<PlatformAccount> {
    return prisma.platformAccount.update({
      where: { id: accountId },
      data: {
        accessToken,
        refreshToken: refreshToken || undefined,
        tokenExpiresAt,
      },
    });
  }

  async revokePlatformAccount(accountId: string): Promise<void> {
    await prisma.platformAccount.delete({
      where: { id: accountId },
    });
  }
}
