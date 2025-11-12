import axios from 'axios';

const TIKTOK_API_BASE = 'https://open.tiktokapis.com/v1';

export class TikTokClient {
  private accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  async uploadVideo(videoUrl: string, caption: string) {
    try {
      const uploadResponse = await axios.post(
        `${TIKTOK_API_BASE}/video/upload/init/`,
        {
          source_info: {
            source: 'FILE_UPLOAD',
            video_size: 0,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        }
      );

      return uploadResponse.data;
    } catch (error) {
      throw new Error(`TikTok upload init failed: ${error}`);
    }
  }

  async publishVideo(videoId: string, caption: string) {
    try {
      const publishResponse = await axios.post(
        `${TIKTOK_API_BASE}/video/publish/`,
        {
          video_id: videoId,
          post_info: {
            desc: caption,
            privacy_level: 'PUBLIC_TO_EVERYONE',
            disable_comment: false,
            disable_duet: false,
            disable_stitch: false,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        }
      );

      return publishResponse.data;
    } catch (error) {
      throw new Error(`TikTok publish failed: ${error}`);
    }
  }

  async getVideoAnalytics(videoId: string) {
    try {
      const analyticsResponse = await axios.get(
        `${TIKTOK_API_BASE}/video/query/`,
        {
          params: {
            video_id: videoId,
            fields: 'like_count,comment_count,share_count,view_count',
          },
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        }
      );

      return analyticsResponse.data;
    } catch (error) {
      throw new Error(`TikTok analytics fetch failed: ${error}`);
    }
  }
}
