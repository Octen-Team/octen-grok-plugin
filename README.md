# Octen for Grok Build

The official Octen plugin for Grok Build. It connects Grok Build to Octen's
hosted MCP server for current web retrieval and content extraction.

## Capabilities

| Tool | Use |
| --- | --- |
| `search` | Focused, current web search and source discovery. |
| `news_search` | Recent events and reporting, returned as articles **and** as storylines — the coverage grouped into subjects with summaries. |
| `business_search` | A company or person as a structured card: profile, financials, key people, career history, recent announcements. |
| `place_search` | Real-world places with address, coordinates, phone, opening hours and rating, around a point or in a named area. |
| `pulse_search` | The URL a query most likely means, in about 10ms — official docs, help centres, known sites. |
| `broad_search` | Multi-angle web search for broad coverage. |
| `premier_search` | Web search with deeper retrieval and more careful reranking, for the page that is hard to find. It is slower and billed at its own per-call rate, so use `search` for ordinary lookups. |
| `extract` | Clean, structured content from supplied or selected URLs. |
| `image_search` | Images by text query or a reference image. |
| `design_search` | Real web page, page section, app screen and slide designs, with their design values where available (such as colours and fonts) and the HTML for page sections that have reusable code. |

## Install

```bash
grok plugin marketplace add xai-org/plugin-marketplace
grok plugin install octen --trust
```

Or from inside a session: type `/marketplace`, search for `octen`, and press `i`.

If `install` reports that a name cannot be resolved safely, another registered
marketplace failed to scan and Grok Build will not guess between sources. Pin
this one explicitly:

```bash
grok plugin install octen@plugin-marketplace --trust
```

Grok Build keys marketplaces on the repository name, so the qualifier is
`plugin-marketplace` rather than the `name` inside the catalog file.

Nothing is installed locally and there is no API key to paste. On first
connection the agent is prompted to sign in to Octen and authorize the
connection in your browser; the grant can be revoked from your Octen account
at any time.

## Updating

Grok Build keeps the commit a plugin was installed at. Early revisions of this plugin
listed tools in the connection URL (`?tools=...`), for example only `search`,
`news_search`, `broad_search` and `extract`, and an installation made from one of them
still shows only the listed tools, whatever its version number says. If Octen shows
fewer tools than the table above, update it, then restart the session:

```bash
grok plugin update octen
```

From version 1.1.0 on, the plugin does not list tools at all: the server decides the
roster, so tools that Octen adds later appear without another update.

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

The connection takes no `?tools=` filter: the roster is whatever the server
advertises, so a tool Octen adds reaches Grok Build without a change here.
Octen's video search is in invite-only beta; the server advertises it like the
rest and answers `403` at call time for an account without access.

## License

[MIT](LICENSE)
