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
| `image_search` | Visual references and Octen Design for UI work. Beta access required. |
| `video_search` | Relevant web videos and clips. Beta access required. |

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

## Beta features

Octen Design (`image_search`) and `video_search` are Beta capabilities. If your
account is not enabled, request access at [octen.ai](https://octen.ai).

## License

[MIT](LICENSE)
