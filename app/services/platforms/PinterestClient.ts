import axios, { AxiosError } from 'axios';
import { ExternalAPIError } from '@/app/lib/errors';
import { API_ENDPOINTS } from '@/app/lib/constants';
import { retryWithBackoff } from '@/app/lib/async-utils';

interface PinterestPinPayload {
  image_url: string;
  description: string;
  board_id: string;
  link: string;
}

interface PinterestPinResponse {
  id: string;
  created_at: string;
  link: string;
  media: {
    media_type: string;
  };
}

interface PinterestAnalyticsMetric {
  metric_type: string;
  data_status: string;
  summary_metrics: {
    [key: string]: number;
  };
}

interface PinterestAnalyticsResponse {
  all: PinterestAnalyticsMetric[];
}

/**
 * Pinterest API Client
 * Handles pin creation and analytics retrieval
 */
export class PinterestClient {
  private accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  /**
   * Create a pin on Pinterest
   * @param imageUrl - URL of the image to pin
   * @param description - Pin description/caption
   * @param boardId - Pinterest board ID to post to
   * @returns Created pin details
   */
  async createPin(
    imageUrl: string,
    description: string,
    boardId: string
  ): Promise<PinterestPinResponse> {
    try {
      const payload: PinterestPinPayload = {
        image_url: imageUrl,
        description,
        board_id: boardId,
        link: imageUrl,
      };

      const response = await retryWithBackoff(
        async () => axios.post<PinterestPinResponse>(
          `${API_ENDPOINTS.pinterest}/pins`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${this.accessToken}`,
              'Content-Type': 'application/json',
            },
          }
        ),
        {
          onRetry: (attempt, error) => {
            console.warn(`Pinterest pin creation retry attempt ${attempt}:`, error.message);
          },
        }
      );

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new ExternalAPIError(
          `Pinterest pin creation failed: ${error.response?.data?.message || error.message}`,
          'pinterest'
        );
      }
      throw new ExternalAPIError('Pinterest pin creation failed', 'pinterest');
    }
  }

  /**
   * Get analytics for a pin
   * @param pinId - Pinterest pin ID
   * @returns Pin analytics including clicks, impressions, and saves
   */
  async getPinAnalytics(pinId: string): Promise<PinterestAnalyticsResponse> {
    try {
      const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const endDate = new Date().toISOString().split('T')[0];

      const response = await retryWithBackoff(
        async () => axios.get<PinterestAnalyticsResponse>(
          `${API_ENDPOINTS.pinterest}/pins/${pinId}/analytics`,
          {
            params: {
              start_date: startDate,
              end_date: endDate,
              metric_types: 'OUTBOUND_CLICKS,IMPRESSION,SAVE',
            },
            headers: {
              Authorization: `Bearer ${this.accessToken}`,
            },
          }
        )
      );

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new ExternalAPIError(
          `Pinterest analytics fetch failed: ${error.response?.data?.message || error.message}`,
          'pinterest'
        );
      }
      throw new ExternalAPIError('Pinterest analytics fetch failed', 'pinterest');
    }
  }
}
