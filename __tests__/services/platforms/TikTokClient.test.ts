import { TikTokClient } from '@/app/services/platforms/TikTokClient';
import { ExternalAPIError } from '@/app/lib/errors';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('TikTokClient', () => {
  let client: TikTokClient;
  const mockAccessToken = 'test-access-token';

  beforeEach(() => {
    jest.clearAllMocks();
    client = new TikTokClient(mockAccessToken);
  });

  describe('uploadVideo', () => {
    it('should successfully initialize video upload', async () => {
      const mockResponse = {
        data: {
          data: {
            upload_url: 'https://upload.tiktok.com/123',
            upload_id: 'upload-123',
          },
        },
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      const result = await client.uploadVideo('https://example.com/video.mp4', 'Test caption');

      expect(result).toEqual(mockResponse.data);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining('/video/upload/init/'),
        expect.objectContaining({
          source_info: {
            source: 'FILE_UPLOAD',
            video_size: 0,
          },
        }),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: `Bearer ${mockAccessToken}`,
          }),
        })
      );
    });

    it('should throw ExternalAPIError on upload init failure', async () => {
      mockedAxios.post.mockRejectedValue({
        response: { data: { error: { message: 'Invalid token' } } },
        isAxiosError: true,
      });

      await expect(client.uploadVideo('video.mp4', 'caption')).rejects.toThrow(ExternalAPIError);
    });
  });

  describe('publishVideo', () => {
    it('should successfully publish video', async () => {
      const mockResponse = {
        data: {
          data: {
            publish_id: 'publish-123',
            status: 'PUBLISH_COMPLETE',
          },
        },
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      const result = await client.publishVideo('video-123', 'Test caption');

      expect(result).toEqual(mockResponse.data);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining('/video/publish/'),
        expect.objectContaining({
          video_id: 'video-123',
          post_info: expect.objectContaining({
            desc: 'Test caption',
            privacy_level: 'PUBLIC_TO_EVERYONE',
          }),
        }),
        expect.any(Object)
      );
    });

    it('should throw ExternalAPIError on publish failure', async () => {
      mockedAxios.post.mockRejectedValue(new Error('Publish failed'));

      await expect(client.publishVideo('video-123', 'caption')).rejects.toThrow(ExternalAPIError);
    });

    it('should retry on transient failures', async () => {
      mockedAxios.post
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({
          data: { data: { publish_id: 'publish-123', status: 'COMPLETE' } },
        });

      const result = await client.publishVideo('video-123', 'Test');

      expect(result.data.publish_id).toBe('publish-123');
      expect(mockedAxios.post).toHaveBeenCalledTimes(2);
    });
  });

  describe('getVideoAnalytics', () => {
    it('should successfully fetch video analytics', async () => {
      const mockResponse = {
        data: {
          data: {
            video_id: 'video-123',
            like_count: 1000,
            comment_count: 50,
            share_count: 100,
            view_count: 50000,
          },
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await client.getVideoAnalytics('video-123');

      expect(result).toEqual(mockResponse.data);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('/video/query/'),
        expect.objectContaining({
          params: expect.objectContaining({
            video_id: 'video-123',
            fields: 'like_count,comment_count,share_count,view_count',
          }),
        })
      );
    });

    it('should throw ExternalAPIError on analytics fetch failure', async () => {
      mockedAxios.get.mockRejectedValue({
        response: { data: { error: { message: 'Video not found' } } },
        isAxiosError: true,
      });

      await expect(client.getVideoAnalytics('invalid-video')).rejects.toThrow(ExternalAPIError);
    });
  });
});
