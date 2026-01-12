# Sample Agent for Banked MCP

This is a TypeScript example project demonstrating how to connect to and use the Banked MCP (Model Context Protocol) server. This example uses Mastra as a framework, but the focus is on showcasing Banked's MCP server functionality.

## What is Banked MCP Server?

The Banked MCP server provides payment-related tools and capabilities that can be integrated into AI agents and workflows. This example shows how to:

- Connect to the Banked MCP server
- Authenticate using OAuth
- Use Banked payment tools in your agents
- Filter available tools for specific use cases

## Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

1. Clone or download this repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Configuration

1. Create a `.env` file by copying `.env.example`:
   ```bash
   cp .env.example .env
   ```
2. Edit the `.env` file and set up the following required environment variables:

   **Banked OAuth Credentials (Required):**
   - `BANKED_OAUTH_CLIENT_ID` - Your Banked OAuth client ID
   - `BANKED_OAUTH_CLIENT_SECRET` - Your Banked OAuth client secret
   - `BANKED_OAUTH_CLIENT_SCOPE` - OAuth scope should be your business application ID
   
   > **Important:** To obtain Banked OAuth credentials, please contact **support@banked.com**

   **Model Provider Configuration (Required):**
   
   Set `MODEL_PROVIDER` to select which provider to use:
   - `MODEL_PROVIDER=google-vertex` - Use Google Vertex AI
   - `MODEL_PROVIDER=anthropic` - Use Anthropic
   - `MODEL_PROVIDER=openai` - Use OpenAI
   
   Then configure the required credentials for your selected provider:
   
   **For Google Vertex AI (`MODEL_PROVIDER=google-vertex`):**
   - `GOOGLE_CLOUD_PROJECT` - Your Google Cloud project ID (required)
   - `GOOGLE_CLOUD_LOCATION` - Google Cloud location (optional, default: `europe-west1`)
   - `MODEL_NAME` - AI model name (optional, e.g., `gemini-2.5-flash`)
   
   **For Anthropic (`MODEL_PROVIDER=anthropic`):**
   - `ANTHROPIC_API_KEY` - Your Anthropic API key (required)
   - `MODEL_NAME` - AI model name (optional, default: `claude-sonnet-4-5`)
   
   **For OpenAI (`MODEL_PROVIDER=openai`):**
   - `OPENAI_API_KEY` - Your OpenAI API key (required)
   - `MODEL_NAME` - AI model name (optional, default: `gpt-4o`)
   
   > **Tip:** See `.env.example` for a complete example configuration file with all three provider options documented.

   **Optional Configuration:**
   - `BANKED_MCP_URL` - Banked MCP server URL (default: `https://mcp.banked.com`)
   - `BANKED_OAUTH_URL` - OAuth token endpoint (default: `https://api.banked.com/oauth/token`)
   - `BANKED_ALLOWED_TOOLS` - Comma-separated list of allowed tools (for filtering)
   
### Running the Example

Start the development server:

```bash
npm run dev
```

Once the server is running, open your browser and navigate to:

**http://localhost:4111**

This will open the interface where you can interact with the example agents that use the Banked MCP server.

## Example Interactions

Once connected, you can interact with Banked's tools through natural conversation. Here are some examples:

### Creating a Payment

Try asking:

```
Create a $50 payment for invoice INV-2024-001
```

The assistant will use `payments.create` and return a checkout URL. You can also ask about the tool's parameters:

```
What parameters does payments.create need?
```

---

### Searching Payments

You can search for payments in several ways:

```
Find the payment for invoice INV-123
```

or

```
Show me payments from last week
```

The assistant will use `payments.search` with the appropriate filters.

---

### Processing Refunds

To process a refund, you can specify the payment directly:

```
Refund $25 from payment [payment-id]
```

or reference it more naturally:

```
Refund $25 from last payment
```

The assistant will use `payments.refund` to process the refund.

## Examples Included

This project includes two example agents that demonstrate different ways to use the Banked MCP server:

- **Basic Agent** - Connects to Banked MCP server with full access to all available tools
- **With Tool Filter Agent** - Connects to Banked MCP server with filtered tool access (using `BANKED_ALLOWED_TOOLS`)

Both agents are configured to help users with payment-related questions and can interact with Banked's payment services through the MCP server.

## Getting Help

- For Banked OAuth credentials and MCP server support: **support@banked.com**

