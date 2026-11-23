---
name: octen-web
description: Use Octen for web and news search, company and place lookup, fast URL lookup, broad research, deeper web search, image search, design references, and clean URL extraction.
---

# Octen Web

Use the Octen MCP server for current, source-grounded information. Select the
smallest tool that covers the request, then synthesize the returned material
rather than pasting raw results.

## Tool selection

- Use `search` for a focused, current web question or source discovery.
- Use `premier_search` when finding the exact page decides the answer: a
  specific fact buried deep in a page, a niche document, a report or filing you
  can name but not locate, or a question `search` has just answered thinly or
  off-target. It takes every parameter `search` takes and returns the same
  shape, with deeper retrieval and more careful reranking. It is slower and is
  billed at its own per-call rate, which a Search Plan's unlimited searches do
  not cover, so default to `search` for ordinary lookups.
- Use `news_search` for recent events, announcements, or time-sensitive news.
  It returns articles **and** `subjects` — the coverage grouped into
  storylines with summaries; read those before the articles.
- Use `business_search` for a company or the people in one, including the
  numbers: revenue, share price, funding, key people, career history, recent
  announcements. It returns structured cards, so one call answers what would
  otherwise take a dozen pages.
- Use `place_search` for a real-world place — address, opening hours, phone,
  rating. Pass the caller's coordinates when you have them; without a location
  a query that names no area is not limited to one.
- Use `pulse_search` when what is wanted is a web address rather than what is
  written on the page: official docs, API references, help centres, a site you
  could almost name. It is far faster and cheaper than `search` for that, and
  takes no filters and sees no fresh content, so it is not a substitute for it.
- Use `broad_search` for a question that needs multiple perspectives or broad
  coverage; it decomposes the query and searches the resulting angles. Do not
  reach for it when one of the tools above answers the question directly.
- Use `extract` to read clean content from supplied URLs or selected search
  results. Prefer highlights when a query-specific fact is sufficient.
- Use `image_search` to find images by a text query or a reference image.
- Use `design_search` to find real designs to build from: screenshots of web
  pages, page sections, mobile app screens and presentation slides, each with
  its design values where it has them (colours, fonts and font sizes; the
  fields vary by image) and, for a page section that has reusable code, the
  HTML. Describe what is being built, for example "pricing section
  for a SaaS landing page". A page section or slide carries a `group_id`; to
  get the rest of that page or deck, call again with `images.group_id` set to
  that id and `images.count` set to the group's total (100 at most, the default
  returns only 5); that call needs no query. The image links are signed and
  expire, so use them right away. The response is large: set
  `web_search.enable` or `images.enable` to false when only the other is
  needed. Use `image_search` for general photos and diagrams.

## Research quality

1. Write concise, specific queries; add domain, language, or time constraints
   only when they materially improve relevance.
2. For consequential claims, select authoritative sources and cross-check them
   before presenting a conclusion.
3. Keep source URLs with factual claims. Clearly distinguish retrieved facts
   from your inference or recommendation.
4. The connection authorises over OAuth: the first call opens a browser
   sign-in, and the approval is stored with the connection. If a call comes back
   unauthenticated, tell the user to reconnect the Octen server and complete
   that sign-in — there is no key to paste, so never ask for one or echo a
   credential in chat.
