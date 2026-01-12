import { MCPClient } from "@mastra/mcp";
import { bankedMcpConfig } from "../config/config";
import { BankedOAuthProvider } from "../oauth/provider";

/**
 * MCP Client for Banked.
 * This client is used to get the tools available to the agent.
 */
const banked = new MCPClient({
    id: "banked-mcp-tools",
    servers: {
        banked: {
            url: new URL(bankedMcpConfig.url),
            authProvider: new BankedOAuthProvider(),
        },
    },
});


/**
 * MCP Client for Banked with tool filtering.
 * This client is used to filter the tools available to the agent.
 */
const bankedFiltered = new MCPClient({
    id: "banked-mcp-tools-filtered",
    servers: {
        banked: {
            url: new URL(bankedMcpConfig.url),
            authProvider: new BankedOAuthProvider(),
            requestInit: {
                headers: {
                    "X-Allowed-Tools": bankedMcpConfig.allowedTools,
                }
            },
        },
    },
});

export { banked, bankedFiltered };