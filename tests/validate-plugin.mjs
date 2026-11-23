import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));

const manifest = await readJson(".grok-plugin/plugin.json");
const mcpConfig = await readJson(".mcp.json");

assert.equal(manifest.name, "octen");
// Semver, not a literal: xAI's marketplace only moves its pin when this value
// changes, so every release must bump it, and a pinned literal guards nothing.
assert.match(manifest.version, /^\d+\.\d+\.\d+$/);
assert.equal(manifest.license, "MIT");
assert.equal(manifest.repository, "https://github.com/Octen-Team/octen-grok-plugin");
assert.equal(manifest.homepage, "https://octen.ai");
// The marketplace card shows this description, so it must not promise the
// invite-only tools and must keep naming the generally available ones.
assert.doesNotMatch(manifest.description, /video|deep[ _]research/i);
assert.match(manifest.description, /image search/);
assert.match(manifest.description, /design references/);

assert.deepEqual(Object.keys(mcpConfig.mcpServers), ["octen"]);
const octen = mcpConfig.mcpServers.octen;

// Hosted server over HTTP, matching every other remote entry in the Grok
// catalog. Asserted rather than assumed because the previous revision spawned
// `npx octen-mcp@0.3.6` locally, and that version shipped the HTTP-layer
// defects behind a customer's failure report.
assert.equal(octen.type, "http");
assert.equal(new URL(octen.url).origin + new URL(octen.url).pathname,
  "https://mcp.octen.ai/mcp");

// Nothing spawned, nothing read from the environment: an OAuth grant is the
// only credential, so a stray command/env here would be a real regression.
for (const key of ["command", "args", "env"]) {
  assert.equal(key in octen, false, `${key} must not be set on a hosted server`);
}

// The roster must come from the server, not from this file. `?tools=` is an
// allowlist: a tool missing from it is invisible to Grok however long it has
// been live, and keeping it current means a marketplace PR per tool. That is
// how business, place and pulse search, and image_search once it left Beta,
// went on being unreachable here for weeks after they shipped.
//
// video_search is invite-only and is advertised anyway: the server answers a
// clear 403 at call time for an account without access, which is what every
// other client already sees.
const url = new URL(octen.url);
assert.equal(url.searchParams.has("tools"), false,
  "the hosted URL must not pin a tool allowlist — the server decides the roster");
assert.equal(url.search, "", "the hosted URL takes no query parameters");

// No credential may be embedded in the config, in any spelling.
const raw = JSON.stringify(mcpConfig);
for (const pattern of [/sk-/, /octen-[0-9a-f]{32}/, /api[-_]?key/i, /Bearer /]) {
  assert.doesNotMatch(raw, pattern, `config must not carry a credential (${pattern})`);
}

const skill = await readFile("skills/octen-web/SKILL.md", "utf8");
const readme = await readFile("README.md", "utf8");
assert.match(
  skill,
  /^description: Use Octen for web and news search, company and place lookup, fast URL lookup, broad research, deeper web search, image search, design references, and clean URL extraction\.$/m,
);
// Only the capability table counts: a tool name elsewhere in the README is not a row.
const capabilities = readme.split(/^## /m).find((section) => section.startsWith("Capabilities")) ?? "";
// A table needs its header separator row, or GitHub renders the rows as plain text.
assert.match(capabilities, /^\|\s*-{3,}\s*\|\s*-{3,}\s*\|/m, "the capability table needs a header separator row");
const tools = ["search", "news_search", "business_search", "place_search", "pulse_search", "broad_search", "premier_search", "extract", "image_search", "design_search"];
for (const tool of tools) {
  assert.match(skill, new RegExp(`\\b${tool}\\b`));
  assert.match(capabilities, new RegExp(`^\\|\\s*\`${tool}\`\\s*\\|`, "m"), `the capability table must list ${tool}`);
}
// The two tools with usage rules an agent cannot guess: the paid premier rate and the group lookup.
assert.match(skill, /billed at its own per-call rate/);
assert.match(skill, /images\.group_id/);
// Installations from before 1.1.0 pin four tools and only `grok plugin update` fixes that.
assert.match(readme, /grok plugin update octen/);
// video_search is reachable — the server advertises it — but most accounts are
// not in its invite-only Beta, so routing guidance must not send the agent to
// a tool it will get a 403 from. Documenting it is the thing to avoid, not
// exposing it.
for (const unsupportedTool of ["deep_research", "video_search"]) {
  assert.doesNotMatch(skill, new RegExp(`\\b${unsupportedTool}\\b`));
}
// The marketplace guide asks submissions to declare their network endpoints
// and credentials in the README; these assertions keep that from rotting.
assert.match(readme, /https:\/\/mcp\.octen\.ai\/mcp/);
assert.match(readme, /https:\/\/auth\.octen\.ai/);
assert.match(readme, /OAuth/);
// The local-install instructions are gone along with the local install.
assert.doesNotMatch(readme, /OCTEN_API_KEY|npx/);
// video_search alone stays out: it is the one tool still invite-only, and a
// README that lists it promises something most accounts get a 403 for.
assert.doesNotMatch(readme, /video_search/);

console.log("Plugin manifest and MCP configuration are valid.");
