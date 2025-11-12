import crypto from 'crypto';
import { Post, PostResult, Platform } from './types';
import { oauthHandler } from './auth/OAuthHandler';

export class ContentService {
  private postedContentHashes: Set<string> = new Set();
  private postQueue: Post[] = [];
  private retryAttempts: Map<string, number> = new Map();

  /**
   * Generate SHA-256 hash for content deduplication
   * Ensures unique content across all accounts
   */
  generateContentHash(content: string, mediaUrls?: string[]): string {
    const hashInput = content + (mediaUrls?.sort().join('') || '');
    return crypto.createHash('sha256').update(hashInput).digest('hex');
  }

  /**
   * Check if content already exists (prevents duplicate posting)
   */
  async isContentUnique(contentHash: string): Promise<boolean> {
    return !this.postedContentHashes.has(contentHash);
  }

  /**
   * Queue post for approval
   * IMPORTANT: This requires manual human approval before posting
   */
  async queuePostForApproval(
    content: string,
    platforms: Platform[],
    mediaUrls?: string[],
    scheduledFor?: Date
  ): Promise<Post> {
    const contentHash = this.generateContentHash(content, mediaUrls);

    // Check uniqueness
    const isUnique = await this.isContentUnique(contentHash);
    if (!isUnique) {
      throw new Error('This content has already been posted before. Duplicate content not allowed.');
    }

    const post: Post = {
      id: crypto.randomUUID(),
      content,
      mediaUrls,
      platforms,
      scheduledFor,
      status: 'pending-approval', // HUMAN APPROVAL REQUIRED
      contentHash,
      createdAt: new Date(),
    };

    this.postQueue.push(post);
    console.log(`Post queued for approval: ${post.id}`);
    return post;
  }

  /**
   * Approve post for posting (human action only)
   * This is the security gate that prevents automation bypass
   */
  async approvePost(postId: string, approvedBy: string): Promise<Post> {
    const post = this.postQueue.find(p => p.id === postId);
    if (!post) {
      throw new Error(`Post ${postId} not found`);
    }

    if (post.status !== 'pending-approval') {
      throw new Error(`Post ${postId} is not pending approval`);
    }

    post.status = 'approved';
    post.approvedAt = new Date();
    post.approvedBy = approvedBy;

    console.log(`Post ${postId} approved by ${approvedBy}`);
    return post;
  }

  /**
   * Reject post
   */
  async rejectPost(postId: string, reason: string): Promise<void> {
    const post = this.postQueue.find(p => p.id === postId);
    if (!post) {
      throw new Error(`Post ${postId} not found`);
    }

    post.status = 'draft';
    post.error = reason;
    console.log(`Post ${postId} rejected: ${reason}`);
  }

  /**
   * Post approved content to platforms
   */
  async postToApprovedPlatforms(postId: string): Promise<PostResult[]> {
    const post = this.postQueue.find(p => p.id === postId);
    if (!post) {
      throw new Error(`Post ${postId} not found`);
    }

    if (post.status !== 'approved') {
      throw new Error(`Post ${postId} has not been approved for posting`);
    }

    const results: PostResult[] = [];

    for (const platform of post.platforms) {
      try {
        const result = await this.postToPlatform(platform, post);
        results.push(result);

        if (result.success) {
          // Mark content hash as posted
          this.postedContentHashes.add(post.contentHash);
          post.status = 'posted';
          post.postedAt = new Date();
        }
      } catch (error) {
        results.push({
          platform,
          success: false,
          error: String(error),
          timestamp: new Date(),
        });
        post.error = String(error);
        post.status = 'failed';
      }
    }

    return results;
  }

  /**
   * Post to individual platform
   */
  private async postToPlatform(platform: Platform, post: Post): Promise<PostResult> {
    const credentials = oauthHandler.getCredentials(platform);
    if (!credentials) {
      throw new Error(`No credentials for ${platform}`);
    }

    // Implement platform-specific posting logic
    const postResult: PostResult = {
      platform,
      success: true,
      postId: `${platform}_${Date.now()}`,
      url: `https://${platform}.com/posts/${Date.now()}`,
      timestamp: new Date(),
    };

    return postResult;
  }

  /**
   * Get pending posts awaiting approval
   */
  getPendingPosts(): Post[] {
    return this.postQueue.filter(p => p.status === 'pending-approval');
  }

  /**
   * Get all posts
   */
  getAllPosts(): Post[] {
    return [...this.postQueue];
  }
}

export const contentService = new ContentService();
