import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));

const manifest = await readJson(".grok-plugin/plugin.json");
const mcpConfig = await readJson(".mcp.json");

assert.equal(manifest.name, "octen");
assert.equal(manifest.version, "1.0.0");
assert.equal(manifest.license, "MIT");
assert.equal(manifest.repository, "https://github.com/Octen-Team/octen-grok-plugin");
assert.equal(manifest.homepage, "https://octen.ai");

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

// Only the generally available tools. video_search is invite-only beta, and
// advertising a tool that answers 403 is worse than not offering it;
// image_search stopped being one when the API opened it to every account.
//
// This list is an allowlist, so a tool missing here is invisible to Grok even
// after it ships on the server — which is how news, business, place and pulse
// search went on being unreachable here after they were added upstream.
const advertised = new URL(octen.url).searchParams.get("tools")?.split(",");
assert.deepEqual(advertised, ["search", "news_search", "business_search", "place_search", "pulse_search", "broad_search", "extract", "image_search"]);

// No credential may be embedded in the config, in any spelling.
const raw = JSON.stringify(mcpConfig);
for (const pattern of [/sk-/, /octen-[0-9a-f]{32}/, /api[-_]?key/i, /Bearer /]) {
  assert.doesNotMatch(raw, pattern, `config must not carry a credential (${pattern})`);
}

const skill = await readFile("skills/octen-web/SKILL.md", "utf8");
const readme = await readFile("README.md", "utf8");
assert.match(
  skill,
  /^description: Use Octen for web and news search, company and place lookup, fast URL lookup, broad research, image search, and clean URL extraction\.$/m,
);
for (const tool of ["search", "news_search", "business_search", "place_search", "pulse_search", "broad_search", "extract", "image_search"]) {
  assert.match(skill, new RegExp(`\\b${tool}\\b`));
}
// Beta tools are gated off for this plugin (OCTEN_ENABLE_BETA_TOOLS=false), so
// they must not be documented or referenced anywhere user-facing.
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
