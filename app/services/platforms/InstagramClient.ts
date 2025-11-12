import axios from 'axios';

const INSTAGRAM_API_BASE = 'https://graph.instagram.com';

export class InstagramClient {
  private accessToken: string;
  private businessAccountId: string;

  constructor(accessToken: string, businessAccountId: string) {
    this.accessToken = accessToken;
    this.businessAccountId = businessAccountId;
  }

  async uploadMedia(imageUrl: string, caption: string) {
    try {
      const mediaResponse = await axios.post(
        `${INSTAGRAM_API_BASE}/${this.businessAccountId}/media`,
        {
          image_url: imageUrl,
          caption,
          access_token: this.accessToken,
        }
      );

      return mediaResponse.data;
    } catch (error) {
      throw new Error(`Instagram media upload failed: ${error}`);
    }
  }

  async publishMedia(mediaId: string) {
    try {
      const publishResponse = await axios.post(
        `${INSTAGRAM_API_BASE}/${this.businessAccountId}/media_publish`,
        {
          creation_id: mediaId,
          access_token: this.accessToken,
        }
      );

      return publishResponse.data;
    } catch (error) {
      throw new Error(`Instagram publish failed: ${error}`);
    }
  }

  async getInsights(mediaId: string) {
    try {
      const insightsResponse = await axios.get(
        `${INSTAGRAM_API_BASE}/${mediaId}/insights`,
        {
          params: {
            metric: 'engagement,impressions,reach',
            access_token: this.accessToken,
          },
        }
      );

      return insightsResponse.data;
    } catch (error) {
      throw new Error(`Instagram insights fetch failed: ${error}`);
    }
  }
}
