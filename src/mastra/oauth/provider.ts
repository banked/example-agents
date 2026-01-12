import type { OAuthClientProvider } from "@modelcontextprotocol/sdk/client/auth.js";
import type {
  OAuthTokens,
  OAuthClientMetadata,
  OAuthClientInformationMixed,
} from "@modelcontextprotocol/sdk/shared/auth.js";
import { getBearerToken } from "./manager";
import { bankedOauthConfig } from "../config/config";

/**
 * Minimal OAuth client provider for Banked MCP server using client_credentials flow.
 * This provider handles token management automatically via the OAuthTokenManager.
 */
export class BankedOAuthProvider implements OAuthClientProvider {
  get redirectUrl(): string | URL | undefined {
    // Client credentials flow doesn't require redirect
    return undefined;
  }

  get clientMetadata(): OAuthClientMetadata {
    return {
      redirect_uris: [], // Not needed for client_credentials flow
      grant_types: ["client_credentials"],
      token_endpoint_auth_method: "client_secret_basic",
    };
  }

  clientInformation(): OAuthClientInformationMixed | undefined {
    return {
      client_id: bankedOauthConfig.clientId,
      client_secret: bankedOauthConfig.clientSecret,
    };
  }

  async tokens(): Promise<OAuthTokens | undefined> {
    // Get token from our token manager (which handles refresh automatically)
    const token = await getBearerToken();
    return {
      access_token: token,
      token_type: "Bearer",
    };
  }

  saveTokens(_tokens: OAuthTokens): void {
    // Tokens are managed by OAuthTokenManager, no need to save here    
  }

  redirectToAuthorization(_authorizationUrl: URL): void {
    // Client credentials flow doesn't require user authorization
    throw new Error(
      "Client credentials flow does not support user authorization redirect"
    );
  }

  saveCodeVerifier(_codeVerifier: string): void {
    // Code verifier is not needed for client_credentials flow
  }

  async codeVerifier(): Promise<string> {
    // Not needed for client_credentials flow
    throw new Error("Client credentials flow does not use code verifier");
  }

  prepareTokenRequest(scope?: string): URLSearchParams | undefined {
    // Prepare client_credentials token request with scope if provided
    const params = new URLSearchParams({
      grant_type: "client_credentials",
    });
    if (scope || bankedOauthConfig.clientScope) {
      params.set("scope", scope || bankedOauthConfig.clientScope);
    }
    return params;
  }
}

