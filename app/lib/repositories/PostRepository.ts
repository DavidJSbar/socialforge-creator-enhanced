import { prisma } from '../db';
import { Post, PlatformPost } from '@prisma/client';

export class PostRepository {
  /**
   * Create a new post
   */
  async create(
    userId: string,
    content: string,
    contentHash: string,
    platforms: string[],
    mediaUrls?: string[],
    scheduledFor?: Date
  ): Promise<Post> {
    return prisma.post.create({
      data: {
        userId,
        content,
        contentHash,
        platforms,
        mediaUrls: mediaUrls || [],
        scheduledFor,
        status: 'draft',
      },
    });
  }

  /**
   * Check if content hash already exists (deduplication)
   */
  async contentHashExists(contentHash: string): Promise<boolean> {
    const post = await prisma.post.findUnique({
      where: { contentHash },
    });
    return !!post;
  }

  /**
   * Get post by ID
   */
  async getById(postId: string): Promise<Post | null> {
    return prisma.post.findUnique({
      where: { id: postId },
    });
  }

  /**
   * Get pending posts for approval
   */
  async getPendingApproval(userId: string): Promise<Post[]> {
    return prisma.post.findMany({
      where: {
        userId,
        status: 'pending-approval',
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  /**
   * Update post status
   */
  async updateStatus(postId: string, status: string, error?: string): Promise<Post> {
    return prisma.post.update({
      where: { id: postId },
      data: {
        status,
        error,
        ...(status === 'posted' && { postedAt: new Date() }),
      },
    });
  }

  /**
   * Link post to platform
   */
  async linkPlatformPost(
    postId: string,
    platform: string,
    platformPostId: string,
    url: string
  ): Promise<PlatformPost> {
    return prisma.platformPost.create({
      data: {
        postId,
        platform,
        platformPostId,
        url,
      },
    });
  }
}

export const postRepository = new PostRepository();
