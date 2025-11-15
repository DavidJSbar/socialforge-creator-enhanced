import axios, { AxiosError } from 'axios';
import { ExternalAPIError } from '@/app/lib/errors';
import { API_ENDPOINTS } from '@/app/lib/constants';
import { retryWithBackoff } from '@/app/lib/async-utils';

interface LinkedInShareContent {
  shareCommentary: {
    text: string;
  };
  shareMediaCategory: 'NONE' | 'ARTICLE' | 'IMAGE';
}

interface LinkedInPostPayload {
  author: string;
  lifecycleState: 'PUBLISHED' | 'DRAFT';
  specificContent: {
    'com.linkedin.ugc.ShareContent': LinkedInShareContent;
  };
  visibility: {
    'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' | 'CONNECTIONS';
  };
}

interface LinkedInPostResponse {
  id: string;
  activity: string;
}

interface LinkedInAnalyticsResponse {
  id: string;
  author: string;
  created: {
    time: number;
  };
  lifecycleState: string;
}

/**
 * LinkedIn API Client
 * Handles post creation and analytics retrieval
 */
export class LinkedInClient {
  private accessToken: string;
  private personId: string;

  constructor(accessToken: string, personId: string) {
    this.accessToken = accessToken;
    this.personId = personId;
  }

  /**
   * Create a post on LinkedIn
   * @param content - Post content/text
   * @returns Created post details
   */
  async createPost(content: string): Promise<LinkedInPostResponse> {
    try {
      const payload: LinkedInPostPayload = {
        author: `urn:li:person:${this.personId}`,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: {
              text: content,
            },
            shareMediaCategory: 'NONE',
          },
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
        },
      };

      const response = await retryWithBackoff(
        async () => axios.post<LinkedInPostResponse>(
          `${API_ENDPOINTS.linkedin}/ugcPosts`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${this.accessToken}`,
              'Content-Type': 'application/json',
              'X-Restli-Protocol-Version': '2.0.0',
            },
          }
        ),
        {
          onRetry: (attempt, error) => {
            console.warn(`LinkedIn post retry attempt ${attempt}:`, error.message);
          },
        }
      );

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new ExternalAPIError(
          `LinkedIn post creation failed: ${error.response?.data?.message || error.message}`,
          'linkedin'
        );
      }
      throw new ExternalAPIError('LinkedIn post creation failed', 'linkedin');
    }
  }

  /**
   * Get analytics for a post
   * @param postId - LinkedIn post ID (URN)
   * @returns Post analytics data
   */
  async getPostAnalytics(postId: string): Promise<LinkedInAnalyticsResponse> {
    try {
      const response = await retryWithBackoff(
        async () => axios.get<LinkedInAnalyticsResponse>(
          `${API_ENDPOINTS.linkedin}/ugcPosts/${postId}`,
          {
            headers: {
              Authorization: `Bearer ${this.accessToken}`,
              'X-Restli-Protocol-Version': '2.0.0',
            },
          }
        )
      );

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new ExternalAPIError(
          `LinkedIn analytics fetch failed: ${error.response?.data?.message || error.message}`,
          'linkedin'
        );
      }
      throw new ExternalAPIError('LinkedIn analytics fetch failed', 'linkedin');
    }
  }
}
