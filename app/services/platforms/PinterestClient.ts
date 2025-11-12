import axios from 'axios';

const PINTEREST_API_BASE = 'https://api.pinterest.com/v5';

export class PinterestClient {
  private accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  async createPin(imageUrl: string, description: string, boardId: string) {
    try {
      const pinResponse = await axios.post(
        `${PINTEREST_API_BASE}/pins`,
        {
          image_url: imageUrl,
          description,
          board_id: boardId,
          link: imageUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        }
      );

      return pinResponse.data;
    } catch (error) {
      throw new Error(`Pinterest pin creation failed: ${error}`);
    }
  }

  async getPinAnalytics(pinId: string) {
    try {
      const analyticsResponse = await axios.get(
        `${PINTEREST_API_BASE}/pins/${pinId}/analytics`,
        {
          params: {
            start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            end_date: new Date().toISOString(),
            metric_types: 'OUTBOUND_CLICKS,IMPRESSION,SAVE',
          },
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        }
      );

      return analyticsResponse.data;
    } catch (error) {
      throw new Error(`Pinterest analytics fetch failed: ${error}`);
    }
  }
}
