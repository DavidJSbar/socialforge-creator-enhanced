import axios, { AxiosError } from 'axios';
import { ExternalAPIError } from '@/app/lib/errors';
import { API_ENDPOINTS } from '@/app/lib/constants';
import { retryWithBackoff } from '@/app/lib/async-utils';

interface YouTubeVideoSnippet {
  title: string;
  description: string;
  tags: string[];
  categoryId: string;
}

interface YouTubeVideoStatus {
  privacyStatus: 'PUBLIC' | 'PRIVATE' | 'UNLISTED';
}

interface YouTubeUploadPayload {
  snippet: YouTubeVideoSnippet;
  status: YouTubeVideoStatus;
}

interface YouTubeVideoResponse {
  id: string;
  snippet: YouTubeVideoSnippet;
  status: YouTubeVideoStatus;
}

interface YouTubeVideoStatistics {
  viewCount?: string;
  likeCount?: string;
  dislikeCount?: string;
  favoriteCount?: string;
  commentCount?: string;
}

interface YouTubeStatisticsResponse {
  items?: Array<{
    id: string;
    statistics: YouTubeVideoStatistics;
  }>;
}

interface YouTubeChannelResponse {
  items?: Array<{
    id: string;
    statistics: {
      viewCount: string;
      subscriberCount: string;
      videoCount: string;
    };
  }>;
}

/**
 * YouTube API Client
 * Handles video upload and analytics retrieval
 */
export class YouTubeClient {
  private accessToken: string;
  private channelId: string;

  constructor(accessToken: string, channelId: string) {
    this.accessToken = accessToken;
    this.channelId = channelId;
  }

  /**
   * Upload a video to YouTube
   * @param videoPath - Path or URL to video file
   * @param title - Video title
   * @param description - Video description
   * @returns Uploaded video details
   */
  async uploadVideo(
    videoPath: string,
    title: string,
    description: string
  ): Promise<YouTubeVideoResponse> {
    try {
      const payload: YouTubeUploadPayload = {
        snippet: {
          title,
          description,
          tags: ['content', 'creator'],
          categoryId: '24', // Entertainment category
        },
        status: {
          privacyStatus: 'PUBLIC',
        },
      };

      const response = await retryWithBackoff(
        async () => axios.post<YouTubeVideoResponse>(
          `${API_ENDPOINTS.youtube}/videos?part=snippet,status`,
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
            console.warn(`YouTube upload retry attempt ${attempt}:`, error.message);
          },
        }
      );

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new ExternalAPIError(
          `YouTube upload failed: ${error.response?.data?.error?.message || error.message}`,
          'youtube'
        );
      }
      throw new ExternalAPIError('YouTube upload failed', 'youtube');
    }
  }

  /**
   * Get statistics for a video
   * @param videoId - YouTube video ID
   * @returns Video statistics including views, likes, comments
   */
  async getVideoStatistics(videoId: string): Promise<YouTubeVideoStatistics> {
    try {
      const response = await retryWithBackoff(
        async () => axios.get<YouTubeStatisticsResponse>(
          `${API_ENDPOINTS.youtube}/videos`,
          {
            params: {
              id: videoId,
              part: 'statistics',
              key: process.env.YOUTUBE_API_KEY,
            },
          }
        )
      );

      return response.data.items?.[0]?.statistics || {};
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new ExternalAPIError(
          `YouTube statistics fetch failed: ${error.response?.data?.error?.message || error.message}`,
          'youtube'
        );
      }
      throw new ExternalAPIError('YouTube statistics fetch failed', 'youtube');
    }
  }

  /**
   * Get analytics for the channel
   * @returns Channel analytics including total views and subscribers
   */
  async getChannelAnalytics(): Promise<YouTubeChannelResponse> {
    try {
      const response = await retryWithBackoff(
        async () => axios.get<YouTubeChannelResponse>(
          `${API_ENDPOINTS.youtube}/channels`,
          {
            params: {
              part: 'statistics',
              forUsername: this.channelId,
              key: process.env.YOUTUBE_API_KEY,
            },
          }
        )
      );

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new ExternalAPIError(
          `YouTube channel analytics failed: ${error.response?.data?.error?.message || error.message}`,
          'youtube'
        );
      }
      throw new ExternalAPIError('YouTube channel analytics failed', 'youtube');
    }
  }
}
