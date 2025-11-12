import axios from 'axios';

const TWITTER_API_BASE = 'https://api.twitter.com/2';

export class TwitterClient {
  private accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  async createTweet(text: string, mediaIds?: string[]) {
    try {
      const payload: any = { text };
      if (mediaIds && mediaIds.length > 0) {
        payload.media = { media_ids: mediaIds };
      }

      const tweetResponse = await axios.post(
        `${TWITTER_API_BASE}/tweets`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        }
      );

      return tweetResponse.data;
    } catch (error) {
      throw new Error(`Twitter tweet creation failed: ${error}`);
    }
  }

  async getTweetMetrics(tweetId: string) {
    try {
      const metricsResponse = await axios.get(
        `${TWITTER_API_BASE}/tweets/${tweetId}`,
        {
          params: {
            'tweet.fields': 'public_metrics',
          },
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        }
      );

      return metricsResponse.data;
    } catch (error) {
      throw new Error(`Twitter metrics fetch failed: ${error}`);
    }
  }
}
