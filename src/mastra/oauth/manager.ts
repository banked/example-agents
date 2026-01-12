import { bankedOauthConfig } from "../config/config";

/**
 * OAuth client for managing Banked bearer tokens.
 */

interface TokenResponse {
  access_token: string;
  expires_in?: number;
}

/**
 * Manages OAuth bearer tokens with automatic refresh.
 */
class OAuthTokenManager {
  private _accessToken: string | null = null;
  private _expiresAt: Date | null = null;
  private _refreshPromise: Promise<string> | null = null;

  /**
   * Generate Basic Auth header from client_id and client_secret.
   */
  private _getBasicAuthHeader(): string {
    const credentials = `${bankedOauthConfig.clientId}:${bankedOauthConfig.clientSecret}`;
    const encoded = Buffer.from(credentials).toString("base64");
    return `Basic ${encoded}`;
  }

  /**
   * Fetch a new access token from the OAuth server.
   */
  private async _fetchToken(): Promise<[string, number]> {
    const url = new URL(bankedOauthConfig.url);
    url.searchParams.set("grant_type", "client_credentials");
    url.searchParams.set("scope", bankedOauthConfig.clientScope);

    const response = await fetch(url.toString(), {
      method: "POST",
      headers: {
        Authorization: this._getBasicAuthHeader(),
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch OAuth token: ${response.status} ${response.statusText}`
      );
    }

    const data = (await response.json()) as TokenResponse;
    const accessToken = data.access_token;
    const expiresIn = data.expires_in ?? 7200; // Default to 2 hours

    return [accessToken, expiresIn];
  }

  /**
   * Get a valid access token, refreshing if necessary.
   * Uses a promise-based lock to prevent concurrent refresh requests.
   */
  async getToken(): Promise<string> {
    // If we have a valid token with more than 60 seconds remaining, return it
    if (this._accessToken && this._expiresAt) {
      const secondsUntilExpiry =
        (this._expiresAt.getTime() - Date.now()) / 1000;
      if (secondsUntilExpiry > 60) {
        return this._accessToken;
      }
    }

    // If a refresh is already in progress, wait for it
    if (this._refreshPromise) {
      return this._refreshPromise;
    }

    // Start a new refresh
    this._refreshPromise = (async () => {
      try {
        const [accessToken, expiresIn] = await this._fetchToken();
        this._accessToken = accessToken;
        // Set expiry to 90% of the actual expiry time for safety margin
        this._expiresAt = new Date(
          Date.now() + Math.floor(expiresIn * 0.9 * 1000)
        );
        return accessToken;
      } catch (error) {
        // Clear token state on error to force fresh fetch on next call
        this._accessToken = null;
        this._expiresAt = null;
        throw error;
      } finally {
        // Always clear the promise so future calls can refresh again
        this._refreshPromise = null;
      }
    })();

    return this._refreshPromise;
  }
}

// Singleton instance
const _tokenManager = new OAuthTokenManager();

/**
 * Get the current bearer token, refreshing if necessary.
 */
export async function getBearerToken(): Promise<string> {
  return _tokenManager.getToken();
}

