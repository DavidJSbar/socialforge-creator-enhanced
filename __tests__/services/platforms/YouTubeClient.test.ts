import { YouTubeClient } from '@/app/services/platforms/YouTubeClient';
import { ExternalAPIError } from '@/app/lib/errors';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('YouTubeClient', () => {
  let client: YouTubeClient;
  const mockAccessToken = 'test-access-token';
  const mockChannelId = 'test-channel-id';

  beforeEach(() => {
    jest.clearAllMocks();
    client = new YouTubeClient(mockAccessToken, mockChannelId);
  });

  describe('uploadVideo', () => {
    it('should successfully upload a video', async () => {
      const mockResponse = {
        data: {
          id: 'video-123',
          snippet: {
            title: 'Test Video',
            description: 'Test Description',
            tags: ['content', 'creator'],
            categoryId: '24',
          },
          status: {
            privacyStatus: 'PUBLIC',
          },
        },
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      const result = await client.uploadVideo(
        'video.mp4',
        'Test Video',
        'Test Description'
      );

      expect(result).toEqual(mockResponse.data);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining('/videos?part=snippet,status'),
        expect.objectContaining({
          snippet: expect.objectContaining({
            title: 'Test Video',
            description: 'Test Description',
          }),
          status: {
            privacyStatus: 'PUBLIC',
          },
        }),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: `Bearer ${mockAccessToken}`,
          }),
        })
      );
    });

    it('should throw ExternalAPIError on upload failure', async () => {
      mockedAxios.post.mockRejectedValue({
        response: {
          data: { error: { message: 'Upload quota exceeded' } },
        },
        isAxiosError: true,
      });

      await expect(
        client.uploadVideo('video.mp4', 'Title', 'Description')
      ).rejects.toThrow(ExternalAPIError);
    });

    it('should retry on transient failures', async () => {
      mockedAxios.post
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({
          data: { id: 'video-123', snippet: {}, status: {} },
        });

      const result = await client.uploadVideo('video.mp4', 'Test', 'Test Desc');

      expect(result.id).toBe('video-123');
      expect(mockedAxios.post).toHaveBeenCalledTimes(2);
    });
  });

  describe('getVideoStatistics', () => {
    it('should successfully fetch video statistics', async () => {
      const mockResponse = {
        data: {
          items: [
            {
              id: 'video-123',
              statistics: {
                viewCount: '10000',
                likeCount: '500',
                commentCount: '50',
              },
            },
          ],
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await client.getVideoStatistics('video-123');

      expect(result).toEqual(mockResponse.data.items[0].statistics);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('/videos'),
        expect.objectContaining({
          params: expect.objectContaining({
            id: 'video-123',
            part: 'statistics',
          }),
        })
      );
    });

    it('should return empty object when video not found', async () => {
      const mockResponse = {
        data: {
          items: [],
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await client.getVideoStatistics('invalid-video');

      expect(result).toEqual({});
    });

    it('should throw ExternalAPIError on statistics fetch failure', async () => {
      mockedAxios.get.mockRejectedValue({
        response: { data: { error: { message: 'Invalid API key' } } },
        isAxiosError: true,
      });

      await expect(client.getVideoStatistics('video-123')).rejects.toThrow(ExternalAPIError);
    });
  });

  describe('getChannelAnalytics', () => {
    it('should successfully fetch channel analytics', async () => {
      const mockResponse = {
        data: {
          items: [
            {
              id: 'channel-123',
              statistics: {
                viewCount: '1000000',
                subscriberCount: '50000',
                videoCount: '100',
              },
            },
          ],
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await client.getChannelAnalytics();

      expect(result).toEqual(mockResponse.data);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('/channels'),
        expect.objectContaining({
          params: expect.objectContaining({
            part: 'statistics',
            forUsername: mockChannelId,
          }),
        })
      );
    });

    it('should throw ExternalAPIError on channel analytics failure', async () => {
      mockedAxios.get.mockRejectedValue(new Error('Channel not found'));

      await expect(client.getChannelAnalytics()).rejects.toThrow(ExternalAPIError);
    });
  });
});
