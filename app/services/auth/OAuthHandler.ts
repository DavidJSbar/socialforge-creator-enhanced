import { PlatformCredentials, Platform } from '../types';
import crypto from 'crypto';

export class OAuthHandler {
  private tokenStore: Map<string, PlatformCredentials> = new Map();

  /**
   * Generate OAuth authorization URL for a platform
   */
  generateAuthUrl(
    platform: Platform,
    clientId: string,
    redirectUri: string,
    scope: string[]
  ): string {
    const authUrls: Record<Platform, string> = {
      instagram: 'https://api.instagram.com/oauth/authorize',
      tiktok: 'https://www.tiktok.com/v1/oauth/authorize',
      youtube: 'https://accounts.google.com/o/oauth2/v2/auth',
      twitter: 'https://twitter.com/i/oauth2/authorize',
      linkedin: 'https://www.linkedin.com/oauth/v2/authorization',
      facebook: 'https://www.facebook.com/v18.0/dialog/oauth',
      pinterest: 'https://api.pinterest.com/oauth/',
    };

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: scope.join(' '),
      state: this.generateState(),
    });

    return `${authUrls[platform]}?${params.toString()}`;
  }

  /**
   * Exchange authorization code for access token
   */
  async exchangeCodeForToken(
    platform: Platform,
    code: string,
    clientId: string,
    clientSecret: string,
    redirectUri: string
  ): Promise<PlatformCredentials> {
    const tokenUrls: Record<Platform, string> = {
      instagram: 'https://graph.instagram.com/v18.0/access_token',
      tiktok: 'https://open.tiktokapis.com/v1/oauth/token',
      youtube: 'https://oauth2.googleapis.com/token',
      twitter: 'https://twitter.com/2/oauth2/token',
      linkedin: 'https://www.linkedin.com/oauth/v2/accessToken',
      facebook: 'https://graph.facebook.com/v18.0/oauth/access_token',
      pinterest: 'https://api.pinterest.com/v1/oauth/token',
    };

    try {
      const response = await fetch(tokenUrls[platform], {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          code,
          redirect_uri: redirectUri,
          grant_type: 'authorization_code',
        }).toString(),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(`OAuth token exchange failed: ${data.error_description || data.error}`);
      }

      const credentials: PlatformCredentials = {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresAt: data.expires_in ? Date.now() + data.expires_in * 1000 : undefined,
      };

      this.tokenStore.set(`${platform}_token`, credentials);
      return credentials;
    } catch (error) {
      throw new Error(`Failed to exchange code for token on ${platform}: ${error}`);
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(
    platform: Platform,
    refreshToken: string,
    clientId: string,
    clientSecret: string
  ): Promise<PlatformCredentials> {
    const tokenUrls: Record<Platform, string> = {
      instagram: 'https://graph.instagram.com/v18.0/refresh_access_token',
      tiktok: 'https://open.tiktokapis.com/v1/oauth/token',
      youtube: 'https://oauth2.googleapis.com/token',
      twitter: 'https://twitter.com/2/oauth2/token',
      linkedin: 'https://www.linkedin.com/oauth/v2/accessToken',
      facebook: 'https://graph.facebook.com/v18.0/oauth/access_token',
      pinterest: 'https://api.pinterest.com/v1/oauth/token',
    };

    try {
      const response = await fetch(tokenUrls[platform], {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          refresh_token: refreshToken,
          grant_type: 'refresh_token',
        }).toString(),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(`Token refresh failed: ${data.error_description || data.error}`);
      }

      const credentials: PlatformCredentials = {
        accessToken: data.access_token,
        refreshToken: data.refresh_token || refreshToken,
        expiresAt: data.expires_in ? Date.now() + data.expires_in * 1000 : undefined,
      };

      this.tokenStore.set(`${platform}_token`, credentials);
      return credentials;
    } catch (error) {
      throw new Error(`Failed to refresh token on ${platform}: ${error}`);
    }
  }

  /**
   * Get stored credentials
   */
  getCredentials(platform: Platform): PlatformCredentials | undefined {
    return this.tokenStore.get(`${platform}_token`);
  }

  /**
   * Check if token needs refresh
   */
  needsRefresh(platform: Platform): boolean {
    const creds = this.getCredentials(platform);
    if (!creds?.expiresAt) return false;
    return Date.now() > creds.expiresAt - 300000; // Refresh 5 minutes before expiry
  }

  /**
   * Revoke token (logout)
   */
  async revokeToken(platform: Platform, accessToken: string, clientId: string, clientSecret: string): Promise<void> {
    const revokeUrls: Record<Platform, string> = {
      instagram: 'https://graph.instagram.com/v18.0/me/permissions',
      tiktok: 'https://open.tiktokapis.com/v1/oauth/revoke',
      youtube: 'https://oauth2.googleapis.com/revoke',
      twitter: 'https://twitter.com/2/oauth2/revoke',
      linkedin: 'https://www.linkedin.com/oauth/v2/revoke',
      facebook: 'https://graph.facebook.com/me/permissions',
      pinterest: 'https://api.pinterest.com/v1/oauth/revoke',
    };

    try {
      await fetch(revokeUrls[platform], {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${accessToken}` },
      });
      this.tokenStore.delete(`${platform}_token`);
    } catch (error) {
      console.error(`Failed to revoke token for ${platform}:`, error);
    }
  }

  private generateState(): string {
    return crypto.randomBytes(32).toString('hex');
  }
}

export const oauthHandler = new OAuthHandler();
