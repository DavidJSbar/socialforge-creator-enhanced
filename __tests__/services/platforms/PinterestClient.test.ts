import { PinterestClient } from '@/app/services/platforms/PinterestClient';
import { ExternalAPIError } from '@/app/lib/errors';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('PinterestClient', () => {
  let client: PinterestClient;
  const mockAccessToken = 'test-access-token';

  beforeEach(() => {
    jest.clearAllMocks();
    client = new PinterestClient(mockAccessToken);
  });

  describe('createPin', () => {
    it('should successfully create a pin', async () => {
      const mockResponse = {
        data: {
          id: 'pin-123',
          created_at: '2024-11-15T00:00:00Z',
          link: 'https://example.com/image.jpg',
          media: {
            media_type: 'image',
          },
        },
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      const result = await client.createPin(
        'https://example.com/image.jpg',
        'Test pin description',
        'board-123'
      );

      expect(result).toEqual(mockResponse.data);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining('/pins'),
        expect.objectContaining({
          image_url: 'https://example.com/image.jpg',
          description: 'Test pin description',
          board_id: 'board-123',
          link: 'https://example.com/image.jpg',
        }),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: `Bearer ${mockAccessToken}`,
          }),
        })
      );
    });

    it('should throw ExternalAPIError on pin creation failure', async () => {
      mockedAxios.post.mockRejectedValue({
        response: {
          data: { message: 'Invalid board ID' },
        },
        isAxiosError: true,
      });

      await expect(
        client.createPin('image.jpg', 'description', 'invalid-board')
      ).rejects.toThrow(ExternalAPIError);
    });

    it('should retry on transient failures', async () => {
      mockedAxios.post
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({
          data: {
            id: 'pin-123',
            created_at: '2024-11-15T00:00:00Z',
            link: 'https://example.com',
            media: { media_type: 'image' },
          },
        });

      const result = await client.createPin('image.jpg', 'desc', 'board-123');

      expect(result.id).toBe('pin-123');
      expect(mockedAxios.post).toHaveBeenCalledTimes(2);
    });
  });

  describe('getPinAnalytics', () => {
    it('should successfully fetch pin analytics', async () => {
      const mockResponse = {
        data: {
          all: [
            {
              metric_type: 'IMPRESSION',
              data_status: 'READY',
              summary_metrics: {
                IMPRESSION: 1000,
              },
            },
            {
              metric_type: 'OUTBOUND_CLICKS',
              data_status: 'READY',
              summary_metrics: {
                OUTBOUND_CLICKS: 50,
              },
            },
            {
              metric_type: 'SAVE',
              data_status: 'READY',
              summary_metrics: {
                SAVE: 100,
              },
            },
          ],
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await client.getPinAnalytics('pin-123');

      expect(result).toEqual(mockResponse.data);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('/pins/pin-123/analytics'),
        expect.objectContaining({
          params: expect.objectContaining({
            metric_types: 'OUTBOUND_CLICKS,IMPRESSION,SAVE',
          }),
        })
      );
    });

    it('should format dates correctly in analytics request', async () => {
      mockedAxios.get.mockResolvedValue({ data: { all: [] } });

      await client.getPinAnalytics('pin-123');

      const callArgs = mockedAxios.get.mock.calls[0][1];
      expect(callArgs?.params?.start_date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(callArgs?.params?.end_date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('should throw ExternalAPIError on analytics fetch failure', async () => {
      mockedAxios.get.mockRejectedValue({
        response: {
          data: { message: 'Pin not found' },
        },
        isAxiosError: true,
      });

      await expect(client.getPinAnalytics('invalid-pin')).rejects.toThrow(ExternalAPIError);
    });
  });
});
