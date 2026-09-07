# Octen for Grok Build

The official Octen plugin for Grok Build. It connects Grok Build to Octen's
hosted MCP server for current web retrieval and content extraction.

## Capabilities

| Tool | Use |
| --- | --- |
| `search` | Focused, current web search and source discovery. |
| `news_search` | Recent events, announcements, and time-sensitive reporting. |
| `broad_search` | Multi-angle web search for broad coverage. |
| `extract` | Clean, structured content from supplied or selected URLs. |

## Install

```bash
grok plugin install octen --trust
```

Nothing is installed locally and there is no API key to paste. On first
connection the agent is prompted to sign in to Octen and authorize the
connection in your browser; the grant can be revoked from your Octen account
at any time.

## Network endpoints and credentials

- **Endpoint:** `https://mcp.octen.ai/mcp` — Octen's hosted MCP server, reached
  over HTTPS. Search queries and URLs are sent there and nowhere else.
- **Authorization server:** `https://auth.octen.ai` — used only for the OAuth
  sign-in and token exchange, advertised through
  [RFC 9728](https://www.rfc-editor.org/rfc/rfc9728) protected-resource
  metadata at `https://mcp.octen.ai/.well-known/oauth-protected-resource/mcp`.
- **Credentials:** an OAuth grant scoped to `mcp:tools`, held by the client.
  The plugin reads no environment variables, no files, and no local
  credentials.
- **Not included:** no hooks, no lifecycle scripts, no telemetry, no shell
  execution, and no filesystem access.

The connection is narrowed with `?tools=search,news_search,broad_search,extract`
so it advertises only the four generally available tools. Octen's image and
video search are in invite-only beta; without them in the roster a user is not
offered a tool that would answer `403`.

## License

[MIT](LICENSE)
