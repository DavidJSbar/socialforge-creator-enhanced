import { ContentServiceEnhanced } from '@/services/ContentServiceEnhanced';
import { PostRepository } from '@/lib/repositories/PostRepository';

jest.mock('@/lib/repositories/PostRepository');
jest.mock('@/lib/repositories/UserRepository');
jest.mock('@/lib/repositories/AnalyticsRepository');
jest.mock('@/lib/repositories/MonetizationRepository');
jest.mock('@/lib/repositories/PlatformAccountRepository');

describe('ContentServiceEnhanced', () => {
  let service: ContentServiceEnhanced;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new ContentServiceEnhanced();
  });

  describe('queuePostForApproval', () => {
    it('should queue a post for approval', async () => {
      const content = 'Test post content';
      const platforms = ['instagram', 'twitter'];
      const userId = 'user-123';

      const result = await service.queuePostForApproval(
        userId,
        content,
        platforms,
        []
      );

      expect(result).toBeDefined();
    });

    it('should reject duplicate content', async () => {
      const content = 'Duplicate content';
      const userId = 'user-123';

      await expect(
        service.queuePostForApproval(userId, content, ['instagram'], [])
      ).rejects.toThrow('Identical content already exists');
    });
  });

  describe('approvePost', () => {
    it('should approve a post', async () => {
      const postId = 'post-123';
      const userId = 'user-123';

      const result = await service.approvePost(postId, userId);
      expect(result).toBeDefined();
    });
  });

  describe('generateContentHash', () => {
    it('should generate consistent SHA-256 hashes', () => {
      const content = 'Test content';
      const hash1 = service['generateContentHash'](content);
      const hash2 = service['generateContentHash'](content);

      expect(hash1).toBe(hash2);
      expect(hash1).toHaveLength(64); // SHA-256 hex length
    });
  });
});
