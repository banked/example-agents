import "dotenv/config";
import { z } from "zod";

export type ModelProvider = "google-vertex" | "anthropic" | "openai";

// Require explicit MODEL_PROVIDER setting
const modelProvider = process.env.MODEL_PROVIDER as ModelProvider | undefined;

if (!modelProvider) {
  throw new Error(
    "MODEL_PROVIDER is required. Please set it to one of:\n" +
    '- MODEL_PROVIDER=google-vertex\n' +
    '- MODEL_PROVIDER=anthropic\n' +
    '- MODEL_PROVIDER=openai'
  );
}

if (!["google-vertex", "anthropic", "openai"].includes(modelProvider)) {
  throw new Error(
    `Invalid MODEL_PROVIDER value: "${modelProvider}". ` +
    `Must be one of: "google-vertex", "anthropic", or "openai"`
  );
}

export { modelProvider };

// Base config schema for all providers
const baseConfigSchema = z.object({
  modelName: z.string().default(""),
  bankedOauthUrl: z.string().url().default("https://api.banked.com/oauth/token"),
  bankedOauthClientId: z.string().min(1, "BANKED_OAUTH_CLIENT_ID is required"),
  bankedOauthClientScope: z.string().default(""),
  bankedOauthClientSecret: z.string().min(1, "BANKED_OAUTH_CLIENT_SECRET is required"),
  bankedMcpUrl: z.string().url().default("https://mcp.banked.com"),
  bankedAllowedTools: z.string().default(""),
});

// Provider-specific schemas
const googleVertexConfigSchema = baseConfigSchema.extend({
  googleCloudProject: z.string().min(1, "GOOGLE_CLOUD_PROJECT is required"),
  googleCloudLocation: z.string().default("europe-west1"),
});

const anthropicConfigSchema = baseConfigSchema.extend({
  anthropicApiKey: z.string().min(1, "ANTHROPIC_API_KEY is required"),
});

const openaiConfigSchema = baseConfigSchema.extend({
  openaiApiKey: z.string().min(1, "OPENAI_API_KEY is required"),
});

// Parse config based on provider
let config: z.infer<typeof baseConfigSchema> & {
  googleCloudProject?: string;
  googleCloudLocation?: string;
  anthropicApiKey?: string;
  openaiApiKey?: string;
};

// Validate and parse config based on selected provider
try {
  if (modelProvider === "google-vertex") {
    config = googleVertexConfigSchema.parse({
      googleCloudProject: process.env.GOOGLE_CLOUD_PROJECT,
      googleCloudLocation: process.env.GOOGLE_CLOUD_LOCATION,
      modelName: process.env.MODEL_NAME,
      bankedOauthUrl: process.env.BANKED_OAUTH_URL,
      bankedOauthClientId: process.env.BANKED_OAUTH_CLIENT_ID,
      bankedOauthClientScope: process.env.BANKED_OAUTH_CLIENT_SCOPE,
      bankedOauthClientSecret: process.env.BANKED_OAUTH_CLIENT_SECRET,
      bankedMcpUrl: process.env.BANKED_MCP_URL,
      bankedAllowedTools: process.env.BANKED_ALLOWED_TOOLS,
    });
  } else if (modelProvider === "anthropic") {
    config = anthropicConfigSchema.parse({
      anthropicApiKey: process.env.ANTHROPIC_API_KEY,
      modelName: process.env.MODEL_NAME || "claude-sonnet-4-5",
      bankedOauthUrl: process.env.BANKED_OAUTH_URL,
      bankedOauthClientId: process.env.BANKED_OAUTH_CLIENT_ID,
      bankedOauthClientScope: process.env.BANKED_OAUTH_CLIENT_SCOPE,
      bankedOauthClientSecret: process.env.BANKED_OAUTH_CLIENT_SECRET,
      bankedMcpUrl: process.env.BANKED_MCP_URL,
      bankedAllowedTools: process.env.BANKED_ALLOWED_TOOLS,
    });
  } else {
    config = openaiConfigSchema.parse({
      openaiApiKey: process.env.OPENAI_API_KEY,
      modelName: process.env.MODEL_NAME || "gpt-4o",
      bankedOauthUrl: process.env.BANKED_OAUTH_URL,
      bankedOauthClientId: process.env.BANKED_OAUTH_CLIENT_ID,
      bankedOauthClientScope: process.env.BANKED_OAUTH_CLIENT_SCOPE,
      bankedOauthClientSecret: process.env.BANKED_OAUTH_CLIENT_SECRET,
      bankedMcpUrl: process.env.BANKED_MCP_URL,
      bankedAllowedTools: process.env.BANKED_ALLOWED_TOOLS,
    });
  }
} catch (error) {
  if (error instanceof z.ZodError) {
    const missingFields = error.errors.map((e) => e.path.join(".")).join(", ");
    throw new Error(
      `Configuration error: Missing or invalid fields: ${missingFields}\n` +
      `Please check your .env file and ensure all required variables are set.`
    );
  }
  throw error;
}

export const googleCloudConfig = config.googleCloudProject
  ? {
      project: config.googleCloudProject,
      location: config.googleCloudLocation || "europe-west1",
    }
  : undefined;

export const anthropicConfig = config.anthropicApiKey
  ? {
      apiKey: config.anthropicApiKey,
    }
  : undefined;

export const openaiConfig = config.openaiApiKey
  ? {
      apiKey: config.openaiApiKey,
    }
  : undefined;

export const modelConfig = {
  name: config.modelName,
} as const;

export const bankedOauthConfig = {
  url: config.bankedOauthUrl,
  clientId: config.bankedOauthClientId,
  clientScope: config.bankedOauthClientScope,
  clientSecret: config.bankedOauthClientSecret,
} as const;

export const bankedMcpConfig = {
  url: config.bankedMcpUrl,
  allowedTools: config.bankedAllowedTools,
} as const;

