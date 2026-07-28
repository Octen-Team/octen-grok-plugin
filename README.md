# Octen for Grok Build

The official Octen plugin for Grok Build. It connects Grok Build to the Octen
MCP server for current web retrieval and content extraction.

## Capabilities

| Tool | Use |
| --- | --- |
| `search` | Focused, current web search and source discovery. |
| `news_search` | Recent events, announcements, and time-sensitive reporting. |
| `broad_search` | Multi-angle web search for broad coverage. |
| `extract` | Clean, structured content from supplied or selected URLs. |

## Prerequisite

Create an Octen API key, then configure it in your local environment. Never
commit the key or paste it into prompts.

```bash
export OCTEN_API_KEY="your-key"
```

## Install

After this plugin is listed in the Grok Build Marketplace:

```bash
grok plugin install octen --trust
```

Grok Build starts `octen-mcp` locally through `npx`. The plugin sends search
queries and URLs only to the Octen API at `https://api.octen.ai`; it contains no
hooks, telemetry, or access to local files beyond the `OCTEN_API_KEY` provided
to the MCP process.

## License

[MIT](LICENSE)
