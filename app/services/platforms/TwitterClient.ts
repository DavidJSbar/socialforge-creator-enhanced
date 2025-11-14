import axios, { AxiosError } from 'axios';
import { ExternalAPIError } from '@/app/lib/errors';
import { API_ENDPOINTS } from '@/app/lib/constants';
import { retryWithBackoff } from '@/app/lib/async-utils';

interface TweetPayload {
  text: string;
  media?: {
    media_ids: string[];
  };
}

interface TweetResponse {
  data: {
    id: string;
    text: string;
  };
}

interface TweetMetricsResponse {
  data: {
    id: string;
    text: string;
    public_metrics: {
      retweet_count: number;
      reply_count: number;
      like_count: number;
      quote_count: number;
      impression_count: number;
    };
  };
}

/**
 * Twitter API Client
 * Handles tweet creation and metrics retrieval
 */
export class TwitterClient {
  private accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  /**
   * Create a new tweet
   * @param text - Tweet text (max 280 characters)
   * @param mediaIds - Optional array of media IDs
   * @returns Created tweet details
   */
  async createTweet(text: string, mediaIds?: string[]): Promise<TweetResponse> {
    try {
      const payload: TweetPayload = { text };
      if (mediaIds && mediaIds.length > 0) {
        payload.media = { media_ids: mediaIds };
      }

      const response = await retryWithBackoff(
        async () => axios.post<TweetResponse>(
          `${API_ENDPOINTS.twitter}/tweets`,
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
            console.warn(`Twitter tweet retry attempt ${attempt}:`, error.message);
          },
        }
      );

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new ExternalAPIError(
          `Twitter tweet creation failed: ${error.response?.data?.detail || error.message}`,
          'twitter'
        );
      }
      throw new ExternalAPIError('Twitter tweet creation failed', 'twitter');
    }
  }

  /**
   * Get metrics for a tweet
   * @param tweetId - Tweet ID
   * @returns Tweet metrics including engagement data
   */
  async getTweetMetrics(tweetId: string): Promise<TweetMetricsResponse> {
    try {
      const response = await retryWithBackoff(
        async () => axios.get<TweetMetricsResponse>(
          `${API_ENDPOINTS.twitter}/tweets/${tweetId}`,
          {
            params: {
              'tweet.fields': 'public_metrics',
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
          `Twitter metrics fetch failed: ${error.response?.data?.detail || error.message}`,
          'twitter'
        );
      }
      throw new ExternalAPIError('Twitter metrics fetch failed', 'twitter');
    }
  }
}
