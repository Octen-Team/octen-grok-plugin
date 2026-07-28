---
name: octen-web
description: Use Octen for web/news search, broad research, and clean URL extraction.
---

# Octen Web

Use the Octen MCP server for current, source-grounded information. Select the
smallest tool that covers the request, then synthesize the returned material
rather than pasting raw results.

## Tool selection

- Use `search` for a focused, current web question or source discovery.
- Use `news_search` for recent events, announcements, or time-sensitive news.
- Use `broad_search` for a question that needs multiple perspectives or broad
  coverage; it decomposes the query and searches the resulting angles.
- Use `extract` to read clean content from supplied URLs or selected search
  results. Prefer highlights when a query-specific fact is sufficient.

## Research quality

1. Write concise, specific queries; add domain, language, or time constraints
   only when they materially improve relevance.
2. For consequential claims, select authoritative sources and cross-check them
   before presenting a conclusion.
3. Keep source URLs with factual claims. Clearly distinguish retrieved facts
   from your inference or recommendation.
4. If the server cannot authenticate, ask the user to configure
   `OCTEN_API_KEY` in their local environment. Never request or echo an API key
   in chat.
