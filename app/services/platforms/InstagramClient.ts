import axios, { AxiosError } from 'axios';
import { ExternalAPIError } from '@/app/lib/errors';
import { API_ENDPOINTS } from '@/app/lib/constants';
import { retryWithBackoff } from '@/app/lib/async-utils';

interface MediaUploadResponse {
  id: string;
}

interface MediaPublishResponse {
  id: string;
  permalink?: string;
}

interface InsightsResponse {
  data: Array<{
    name: string;
    values: Array<{
      value: number;
    }>;
  }>;
}

/**
 * Instagram API Client
 * Handles media upload, publishing, and insights retrieval
 */
export class InstagramClient {
  private accessToken: string;
  private businessAccountId: string;

  constructor(accessToken: string, businessAccountId: string) {
    this.accessToken = accessToken;
    this.businessAccountId = businessAccountId;
  }

  /**
   * Upload media to Instagram
   * @param imageUrl - URL of the image to upload
   * @param caption - Caption for the post
   * @returns Media container ID
   */
  async uploadMedia(imageUrl: string, caption: string): Promise<MediaUploadResponse> {
    try {
      const response = await retryWithBackoff(
        async () => axios.post<MediaUploadResponse>(
          `${API_ENDPOINTS.instagram}/${this.businessAccountId}/media`,
          {
            image_url: imageUrl,
            caption,
            access_token: this.accessToken,
          }
        ),
        {
          onRetry: (attempt, error) => {
            console.warn(`Instagram upload retry attempt ${attempt}:`, error.message);
          },
        }
      );

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new ExternalAPIError(
          `Instagram media upload failed: ${error.response?.data?.error?.message || error.message}`,
          'instagram'
        );
      }
      throw new ExternalAPIError('Instagram media upload failed', 'instagram');
    }
  }

  /**
   * Publish uploaded media
   * @param mediaId - Media container ID from uploadMedia
   * @returns Published media details
   */
  async publishMedia(mediaId: string): Promise<MediaPublishResponse> {
    try {
      const response = await retryWithBackoff(
        async () => axios.post<MediaPublishResponse>(
          `${API_ENDPOINTS.instagram}/${this.businessAccountId}/media_publish`,
          {
            creation_id: mediaId,
            access_token: this.accessToken,
          }
        )
      );

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new ExternalAPIError(
          `Instagram publish failed: ${error.response?.data?.error?.message || error.message}`,
          'instagram'
        );
      }
      throw new ExternalAPIError('Instagram publish failed', 'instagram');
    }
  }

  /**
   * Get insights for a media post
   * @param mediaId - Published media ID
   * @returns Insights data including engagement, impressions, and reach
   */
  async getInsights(mediaId: string): Promise<InsightsResponse> {
    try {
      const response = await retryWithBackoff(
        async () => axios.get<InsightsResponse>(
          `${API_ENDPOINTS.instagram}/${mediaId}/insights`,
          {
            params: {
              metric: 'engagement,impressions,reach',
              access_token: this.accessToken,
            },
          }
        )
      );

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new ExternalAPIError(
          `Instagram insights fetch failed: ${error.response?.data?.error?.message || error.message}`,
          'instagram'
        );
      }
      throw new ExternalAPIError('Instagram insights fetch failed', 'instagram');
    }
  }
}
