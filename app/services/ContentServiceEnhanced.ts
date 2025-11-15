import crypto from 'crypto';
import { prisma } from '@/lib/db';
import { PostRepository } from '@/lib/repositories/PostRepository';
import { UserRepository } from '@/lib/repositories/UserRepository';
import { AnalyticsRepository } from '@/lib/repositories/AnalyticsRepository';
import { MonetizationRepository } from '@/lib/repositories/MonetizationRepository';
import { PlatformAccountRepository } from '@/lib/repositories/PlatformAccountRepository';
import { InstagramClient } from './platforms/InstagramClient';
import { TikTokClient } from './platforms/TikTokClient';
import { YouTubeClient } from './platforms/YouTubeClient';
import { TwitterClient } from './platforms/TwitterClient';
import { LinkedInClient } from './platforms/LinkedInClient';
import { FacebookClient } from './platforms/FacebookClient';
import { PinterestClient } from './platforms/PinterestClient';

export class ContentServiceEnhanced {
  private postRepository: PostRepository;
  private userRepository: UserRepository;
  private analyticsRepository: AnalyticsRepository;
  private monetizationRepository: MonetizationRepository;
  private platformAccountRepository: PlatformAccountRepository;

  constructor() {
    this.postRepository = new PostRepository();
    this.userRepository = new UserRepository();
    this.analyticsRepository = new AnalyticsRepository();
    this.monetizationRepository = new MonetizationRepository();
    this.platformAccountRepository = new PlatformAccountRepository();
  }

  async queuePostForApproval(
    userId: string,
    content: string,
    platforms: string[],
    mediaUrls: string[] = []
  ) {
    const contentHash = this.generateContentHash(content);
    const existingHash = await this.postRepository.contentHashExists(contentHash);
    
    if (existingHash) {
      throw new Error('Identical content already exists - violation of unique content policy');
    }

    return this.postRepository.create({
      userId,
      content,
      contentHash,
      platforms,
      mediaUrls,
      scheduledFor: new Date(),
    });
  }

  async approvePost(postId: string, userId: string) {
    const post = await this.postRepository.getById(postId);
    if (!post) throw new Error('Post not found');
    if (post.userId !== userId) throw new Error('Unauthorized');

    return this.postRepository.updateStatus(postId, 'approved');
  }

  async rejectPost(postId: string, userId: string, reason: string) {
    const post = await this.postRepository.getById(postId);
    if (!post) throw new Error('Post not found');
    if (post.userId !== userId) throw new Error('Unauthorized');

    return this.postRepository.updateStatus(postId, 'rejected');
  }

  async postToApprovedPlatforms(postId: string, userId: string) {
    const post = await this.postRepository.getById(postId);
    if (!post || post.status !== 'approved') throw new Error('Post not approved');

    const user = await this.userRepository.getUserById(userId);
    if (!user) throw new Error('User not found');

    const results: Record<string, any> = {};

    for (const platform of post.platforms) {
      try {
        const platformAccount = await this.platformAccountRepository.getPlatformAccount(userId, platform);
        if (!platformAccount) throw new Error(`No ${platform} account connected`);

        let response;
        switch (platform) {
          case 'instagram':
            response = await this.postToInstagram(platformAccount.accessToken, post.content, platformAccount.platformUserId);
            break;
          case 'tiktok':
            response = await this.postToTikTok(platformAccount.accessToken, post.content, post.mediaUrls[0]);
            break;
          case 'youtube':
            response = await this.postToYouTube(platformAccount.accessToken, post.content, platformAccount.platformUserId);
            break;
          case 'twitter':
            response = await this.postToTwitter(platformAccount.accessToken, post.content);
            break;
          case 'linkedin':
            response = await this.postToLinkedIn(platformAccount.accessToken, post.content, platformAccount.platformUserId);
            break;
          case 'facebook':
            response = await this.postToFacebook(platformAccount.accessToken, post.content, platformAccount.platformUserId);
            break;
          case 'pinterest':
            response = await this.postToPinterest(platformAccount.accessToken, post.content, platformAccount.platformUserId);
            break;
          default:
            throw new Error(`Unknown platform: ${platform}`);
        }

        results[platform] = response;
        await this.postRepository.linkPlatformPost(postId, response.id, platform);
      } catch (error) {
        results[platform] = { error: String(error) };
      }
    }

    await this.postRepository.updateStatus(postId, 'posted');
    return results;
  }

  private async postToInstagram(token: string, content: string, businessAccountId: string) {
    const client = new InstagramClient(token, businessAccountId);
    const media = await client.uploadMedia('', content);
    return client.publishMedia(media.id);
  }

  private async postToTikTok(token: string, content: string, videoUrl?: string) {
    const client = new TikTokClient(token);
    const upload = await client.uploadVideo(videoUrl || '', content);
    return client.publishVideo(upload.video_id, content);
  }

  private async postToYouTube(token: string, content: string, channelId: string) {
    const client = new YouTubeClient(token, channelId);
    return client.uploadVideo('', 'SocialPilot Post', content);
  }

  private async postToTwitter(token: string, content: string) {
    const client = new TwitterClient(token);
    return client.createTweet(content);
  }

  private async postToLinkedIn(token: string, content: string, personId: string) {
    const client = new LinkedInClient(token, personId);
    return client.createPost(content);
  }

  private async postToFacebook(token: string, content: string, pageId: string) {
    const client = new FacebookClient(token, pageId);
    return client.publishPost(content);
  }

  private async postToPinterest(token: string, content: string, boardId: string) {
    const client = new PinterestClient(token);
    return client.createPin('', content, boardId);
  }

  private generateContentHash(content: string): string {
    return crypto.createHash('sha256').update(content).digest('hex');
  }
}
