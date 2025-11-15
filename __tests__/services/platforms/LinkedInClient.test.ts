import { LinkedInClient } from '@/app/services/platforms/LinkedInClient';
import { ExternalAPIError } from '@/app/lib/errors';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('LinkedInClient', () => {
  let client: LinkedInClient;
  const mockAccessToken = 'test-access-token';
  const mockPersonId = 'test-person-id';

  beforeEach(() => {
    jest.clearAllMocks();
    client = new LinkedInClient(mockAccessToken, mockPersonId);
  });

  describe('createPost', () => {
    it('should successfully create a post', async () => {
      const mockResponse = {
        data: {
          id: 'urn:li:share:123456',
          activity: 'urn:li:activity:123456',
        },
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      const result = await client.createPost('Test LinkedIn post content');

      expect(result).toEqual(mockResponse.data);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining('/ugcPosts'),
        expect.objectContaining({
          author: `urn:li:person:${mockPersonId}`,
          lifecycleState: 'PUBLISHED',
          specificContent: expect.objectContaining({
            'com.linkedin.ugc.ShareContent': expect.objectContaining({
              shareCommentary: {
                text: 'Test LinkedIn post content',
              },
              shareMediaCategory: 'NONE',
            }),
          }),
          visibility: {
            'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
          },
        }),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: `Bearer ${mockAccessToken}`,
            'X-Restli-Protocol-Version': '2.0.0',
          }),
        })
      );
    });

    it('should throw ExternalAPIError on post creation failure', async () => {
      mockedAxios.post.mockRejectedValue({
        response: {
          data: { message: 'Unauthorized access' },
        },
        isAxiosError: true,
      });

      await expect(client.createPost('Test content')).rejects.toThrow(ExternalAPIError);
    });

    it('should retry on transient failures', async () => {
      mockedAxios.post
        .mockRejectedValueOnce(new Error('Network error'))
        .mockRejectedValueOnce(new Error('Timeout'))
        .mockResolvedValueOnce({
          data: { id: 'urn:li:share:123', activity: 'urn:li:activity:123' },
        });

      const result = await client.createPost('Test content');

      expect(result.id).toBe('urn:li:share:123');
      expect(mockedAxios.post).toHaveBeenCalledTimes(3);
    });
  });

  describe('getPostAnalytics', () => {
    it('should successfully fetch post analytics', async () => {
      const mockResponse = {
        data: {
          id: 'urn:li:share:123456',
          author: 'urn:li:person:test-person-id',
          created: {
            time: 1234567890,
          },
          lifecycleState: 'PUBLISHED',
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await client.getPostAnalytics('urn:li:share:123456');

      expect(result).toEqual(mockResponse.data);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('/ugcPosts/urn:li:share:123456'),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: `Bearer ${mockAccessToken}`,
            'X-Restli-Protocol-Version': '2.0.0',
          }),
        })
      );
    });

    it('should throw ExternalAPIError on analytics fetch failure', async () => {
      mockedAxios.get.mockRejectedValue({
        response: {
          data: { message: 'Post not found' },
        },
        isAxiosError: true,
      });

      await expect(client.getPostAnalytics('invalid-urn')).rejects.toThrow(ExternalAPIError);
    });
  });
});
