import axios from 'axios';

const FACEBOOK_API_BASE = 'https://graph.facebook.com/v18.0';

export class FacebookClient {
  private accessToken: string;
  private pageId: string;

  constructor(accessToken: string, pageId: string) {
    this.accessToken = accessToken;
    this.pageId = pageId;
  }

  async publishPost(message: string, imageUrl?: string) {
    try {
      const payload: any = {
        message,
        access_token: this.accessToken,
      };

      if (imageUrl) {
        payload.url = imageUrl;
      }

      const postResponse = await axios.post(
        `${FACEBOOK_API_BASE}/${this.pageId}/feed`,
        payload
      );

      return postResponse.data;
    } catch (error) {
      throw new Error(`Facebook post publish failed: ${error}`);
    }
  }

  async getPostInsights(postId: string) {
    try {
      const insightsResponse = await axios.get(
        `${FACEBOOK_API_BASE}/${postId}/insights`,
        {
          params: {
            metric: 'post_impressions,post_reactions_by_type_total',
            access_token: this.accessToken,
          },
        }
      );

      return insightsResponse.data;
    } catch (error) {
      throw new Error(`Facebook insights fetch failed: ${error}`);
    }
  }
}
