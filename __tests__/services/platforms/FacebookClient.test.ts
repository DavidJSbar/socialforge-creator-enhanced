import { FacebookClient } from '@/app/services/platforms/FacebookClient';
import { ExternalAPIError } from '@/app/lib/errors';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('FacebookClient', () => {
  let client: FacebookClient;
  const mockAccessToken = 'test-access-token';
  const mockPageId = 'test-page-id';

  beforeEach(() => {
    jest.clearAllMocks();
    client = new FacebookClient(mockAccessToken, mockPageId);
  });

  describe('publishPost', () => {
    it('should successfully publish a post without image', async () => {
      const mockResponse = {
        data: {
          id: 'post-123',
          post_id: 'page_post_123',
        },
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      const result = await client.publishPost('Test message');

      expect(result).toEqual(mockResponse.data);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining('/feed'),
        expect.objectContaining({
          message: 'Test message',
          access_token: mockAccessToken,
        })
      );
    });

    it('should successfully publish a post with image', async () => {
      const mockResponse = {
        data: {
          id: 'post-123',
        },
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      const result = await client.publishPost('Test message', 'https://example.com/image.jpg');

      expect(result).toEqual(mockResponse.data);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          message: 'Test message',
          url: 'https://example.com/image.jpg',
        })
      );
    });

    it('should throw ExternalAPIError on API failure', async () => {
      const mockError = {
        response: {
          data: {
            error: {
              message: 'Invalid access token',
            },
          },
        },
        isAxiosError: true,
      };

      mockedAxios.post.mockRejectedValue(mockError);

      await expect(client.publishPost('Test')).rejects.toThrow(ExternalAPIError);
    });

    it('should retry on transient failures', async () => {
      mockedAxios.post
        .mockRejectedValueOnce(new Error('Network error'))
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({ data: { id: 'post-123' } });

      const result = await client.publishPost('Test message');

      expect(result).toEqual({ id: 'post-123' });
      expect(mockedAxios.post).toHaveBeenCalledTimes(3);
    });
  });

  describe('getPostInsights', () => {
    it('should successfully fetch post insights', async () => {
      const mockResponse = {
        data: {
          data: [
            {
              name: 'post_impressions',
              values: [{ value: 1000 }],
            },
            {
              name: 'post_reactions_by_type_total',
              values: [{ value: { like: 50, love: 20 } }],
            },
          ],
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await client.getPostInsights('post-123');

      expect(result).toEqual(mockResponse.data);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('/post-123/insights'),
        expect.objectContaining({
          params: expect.objectContaining({
            metric: 'post_impressions,post_reactions_by_type_total',
          }),
        })
      );
    });

    it('should throw ExternalAPIError on insights fetch failure', async () => {
      mockedAxios.get.mockRejectedValue({
        response: { data: { error: { message: 'Post not found' } } },
        isAxiosError: true,
      });

      await expect(client.getPostInsights('invalid-post')).rejects.toThrow(ExternalAPIError);
    });
  });
});
