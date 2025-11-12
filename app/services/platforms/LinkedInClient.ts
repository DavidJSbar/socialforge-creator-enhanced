import axios from 'axios';

const LINKEDIN_API_BASE = 'https://api.linkedin.com/v2';

export class LinkedInClient {
  private accessToken: string;
  private personId: string;

  constructor(accessToken: string, personId: string) {
    this.accessToken = accessToken;
    this.personId = personId;
  }

  async createPost(content: string) {
    try {
      const postResponse = await axios.post(
        `${LINKEDIN_API_BASE}/ugcPosts`,
        {
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
        },
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        }
      );

      return postResponse.data;
    } catch (error) {
      throw new Error(`LinkedIn post creation failed: ${error}`);
    }
  }

  async getPostAnalytics(postId: string) {
    try {
      const analyticsResponse = await axios.get(
        `${LINKEDIN_API_BASE}/ugcPosts/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        }
      );

      return analyticsResponse.data;
    } catch (error) {
      throw new Error(`LinkedIn analytics fetch failed: ${error}`);
    }
  }
}
