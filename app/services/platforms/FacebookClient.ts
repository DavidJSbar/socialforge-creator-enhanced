import axios, { AxiosError } from 'axios';
import { ExternalAPIError } from '@/app/lib/errors';
import { API_ENDPOINTS } from '@/app/lib/constants';
import { retryWithBackoff } from '@/app/lib/async-utils';

interface FacebookPostPayload {
  message: string;
  access_token: string;
  url?: string;
}

interface FacebookPostResponse {
  id: string;
  post_id?: string;
}

interface FacebookInsightsData {
  name: string;
  values: Array<{
    value: number | Record<string, number>;
  }>;
}

interface FacebookInsightsResponse {
  data: FacebookInsightsData[];
}

/**
 * Facebook API Client
 * Handles post publishing and insights retrieval
 */
export class FacebookClient {
  private accessToken: string;
  private pageId: string;

  constructor(accessToken: string, pageId: string) {
    this.accessToken = accessToken;
    this.pageId = pageId;
  }

  /**
   * Publish a post to Facebook page
   * @param message - Post message/content
   * @param imageUrl - Optional image URL to attach
   * @returns Published post details
   */
  async publishPost(message: string, imageUrl?: string): Promise<FacebookPostResponse> {
    try {
      const payload: FacebookPostPayload = {
        message,
        access_token: this.accessToken,
      };

      if (imageUrl) {
        payload.url = imageUrl;
      }

      const response = await retryWithBackoff(
        async () => axios.post<FacebookPostResponse>(
          `${API_ENDPOINTS.facebook}/${this.pageId}/feed`,
          payload
        ),
        {
          onRetry: (attempt, error) => {
            console.warn(`Facebook post retry attempt ${attempt}:`, error.message);
          },
        }
      );

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new ExternalAPIError(
          `Facebook post publish failed: ${error.response?.data?.error?.message || error.message}`,
          'facebook'
        );
      }
      throw new ExternalAPIError('Facebook post publish failed', 'facebook');
    }
  }

  /**
   * Get insights for a published post
   * @param postId - Facebook post ID
   * @returns Post insights including impressions and reactions
   */
  async getPostInsights(postId: string): Promise<FacebookInsightsResponse> {
    try {
      const response = await retryWithBackoff(
        async () => axios.get<FacebookInsightsResponse>(
          `${API_ENDPOINTS.facebook}/${postId}/insights`,
          {
            params: {
              metric: 'post_impressions,post_reactions_by_type_total',
              access_token: this.accessToken,
            },
          }
        )
      );

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new ExternalAPIError(
          `Facebook insights fetch failed: ${error.response?.data?.error?.message || error.message}`,
          'facebook'
        );
      }
      throw new ExternalAPIError('Facebook insights fetch failed', 'facebook');
    }
  }
}
