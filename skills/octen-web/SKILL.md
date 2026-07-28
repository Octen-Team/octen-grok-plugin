---
name: octen-web
description: Use Octen for live web and news search, multi-angle research, clean URL extraction, and Beta image (Octen Design) and video search.
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
- Use `image_search` for visual references. For UI or frontend design work,
  call it Octen Design; it is invite-only Beta and may require enabled access.
- Use `video_search` when the user needs relevant web videos or clips. It is
  Beta and may require enabled access.

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

## Beta capability handling

If `image_search` or `video_search` is unavailable, say that the requested
capability is in Beta and direct the user to request access at
https://octen.ai. Do not silently substitute an unrelated tool.
