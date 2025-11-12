import axios from 'axios';

const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';

export class YouTubeClient {
  private accessToken: string;
  private channelId: string;

  constructor(accessToken: string, channelId: string) {
    this.accessToken = accessToken;
    this.channelId = channelId;
  }

  async uploadVideo(videoPath: string, title: string, description: string) {
    try {
      const videoResponse = await axios.post(
        `${YOUTUBE_API_BASE}/videos?part=snippet,status`,
        {
          snippet: {
            title,
            description,
            tags: ['content', 'creator'],
            categoryId: '24',
          },
          status: {
            privacyStatus: 'PUBLIC',
          },
        },
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return videoResponse.data;
    } catch (error) {
      throw new Error(`YouTube upload failed: ${error}`);
    }
  }

  async getVideoStatistics(videoId: string) {
    try {
      const statsResponse = await axios.get(
        `${YOUTUBE_API_BASE}/videos`,
        {
          params: {
            id: videoId,
            part: 'statistics',
            key: process.env.YOUTUBE_API_KEY,
          },
        }
      );

      return statsResponse.data.items?.[0]?.statistics || {};
    } catch (error) {
      throw new Error(`YouTube statistics fetch failed: ${error}`);
    }
  }

  async getChannelAnalytics() {
    try {
      const analyticsResponse = await axios.get(
        `${YOUTUBE_API_BASE}/channels`,
        {
          params: {
            part: 'statistics',
            forUsername: this.channelId,
            key: process.env.YOUTUBE_API_KEY,
          },
        }
      );

      return analyticsResponse.data;
    } catch (error) {
      throw new Error(`YouTube channel analytics failed: ${error}`);
    }
  }
}
