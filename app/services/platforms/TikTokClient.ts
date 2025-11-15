import axios, { AxiosError } from 'axios';
import { ExternalAPIError } from '@/app/lib/errors';
import { API_ENDPOINTS } from '@/app/lib/constants';
import { retryWithBackoff } from '@/app/lib/async-utils';

interface TikTokUploadInitResponse {
  data: {
    upload_url: string;
    upload_id: string;
  };
}

interface TikTokVideoPublishPayload {
  video_id: string;
  post_info: {
    desc: string;
    privacy_level: 'PUBLIC_TO_EVERYONE' | 'MUTUAL_FOLLOW_FRIENDS' | 'SELF_ONLY';
    disable_comment: boolean;
    disable_duet: boolean;
    disable_stitch: boolean;
  };
}

interface TikTokPublishResponse {
  data: {
    publish_id: string;
    status: string;
  };
}

interface TikTokVideoAnalytics {
  data: {
    video_id: string;
    like_count: number;
    comment_count: number;
    share_count: number;
    view_count: number;
  };
}

/**
 * TikTok API Client
 * Handles video upload, publishing, and analytics retrieval
 */
export class TikTokClient {
  private accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  /**
   * Initialize video upload to TikTok
   * @param videoUrl - URL of the video to upload
   * @param caption - Video caption/description
   * @returns Upload initialization response with upload URL
   */
  async uploadVideo(videoUrl: string, caption: string): Promise<TikTokUploadInitResponse> {
    try {
      const response = await retryWithBackoff(
        async () => axios.post<TikTokUploadInitResponse>(
          `${API_ENDPOINTS.tiktok}/video/upload/init/`,
          {
            source_info: {
              source: 'FILE_UPLOAD',
              video_size: 0,
            },
          },
          {
            headers: {
              Authorization: `Bearer ${this.accessToken}`,
              'Content-Type': 'application/json',
            },
          }
        ),
        {
          onRetry: (attempt, error) => {
            console.warn(`TikTok upload init retry attempt ${attempt}:`, error.message);
          },
        }
      );

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new ExternalAPIError(
          `TikTok upload init failed: ${error.response?.data?.error?.message || error.message}`,
          'tiktok'
        );
      }
      throw new ExternalAPIError('TikTok upload init failed', 'tiktok');
    }
  }

  /**
   * Publish uploaded video to TikTok
   * @param videoId - Video ID from upload
   * @param caption - Video caption/description
   * @returns Publish response with publish ID
   */
  async publishVideo(videoId: string, caption: string): Promise<TikTokPublishResponse> {
    try {
      const payload: TikTokVideoPublishPayload = {
        video_id: videoId,
        post_info: {
          desc: caption,
          privacy_level: 'PUBLIC_TO_EVERYONE',
          disable_comment: false,
          disable_duet: false,
          disable_stitch: false,
        },
      };

      const response = await retryWithBackoff(
        async () => axios.post<TikTokPublishResponse>(
          `${API_ENDPOINTS.tiktok}/video/publish/`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${this.accessToken}`,
              'Content-Type': 'application/json',
            },
          }
        )
      );

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new ExternalAPIError(
          `TikTok publish failed: ${error.response?.data?.error?.message || error.message}`,
          'tiktok'
        );
      }
      throw new ExternalAPIError('TikTok publish failed', 'tiktok');
    }
  }

  /**
   * Get analytics for a published video
   * @param videoId - TikTok video ID
   * @returns Video analytics including views, likes, comments, shares
   */
  async getVideoAnalytics(videoId: string): Promise<TikTokVideoAnalytics> {
    try {
      const response = await retryWithBackoff(
        async () => axios.get<TikTokVideoAnalytics>(
          `${API_ENDPOINTS.tiktok}/video/query/`,
          {
            params: {
              video_id: videoId,
              fields: 'like_count,comment_count,share_count,view_count',
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
          `TikTok analytics fetch failed: ${error.response?.data?.error?.message || error.message}`,
          'tiktok'
        );
      }
      throw new ExternalAPIError('TikTok analytics fetch failed', 'tiktok');
    }
  }
}
