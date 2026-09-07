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

// Only the generally available tools. Image and video search are invite-only
// beta, and advertising a tool that answers 403 is worse than not offering it.
const advertised = new URL(octen.url).searchParams.get("tools")?.split(",");
assert.deepEqual(advertised, ["search", "news_search", "broad_search", "extract"]);

// No credential may be embedded in the config, in any spelling.
const raw = JSON.stringify(mcpConfig);
for (const pattern of [/sk-/, /octen-[0-9a-f]{32}/, /api[-_]?key/i, /Bearer /]) {
  assert.doesNotMatch(raw, pattern, `config must not carry a credential (${pattern})`);
}

const skill = await readFile("skills/octen-web/SKILL.md", "utf8");
const readme = await readFile("README.md", "utf8");
assert.match(
  skill,
  /^description: Use Octen for web\/news search, broad research, and clean URL extraction\.$/m,
);
for (const tool of ["search", "news_search", "broad_search", "extract"]) {
  assert.match(skill, new RegExp(`\\b${tool}\\b`));
}
// Beta tools are gated off for this plugin (OCTEN_ENABLE_BETA_TOOLS=false), so
// they must not be documented or referenced anywhere user-facing.
for (const unsupportedTool of ["deep_research", "image_search", "video_search"]) {
  assert.doesNotMatch(skill, new RegExp(`\\b${unsupportedTool}\\b`));
}
// The marketplace guide asks submissions to declare their network endpoints
// and credentials in the README; these assertions keep that from rotting.
assert.match(readme, /https:\/\/mcp\.octen\.ai\/mcp/);
assert.match(readme, /https:\/\/auth\.octen\.ai/);
assert.match(readme, /OAuth/);
// The local-install instructions are gone along with the local install.
assert.doesNotMatch(readme, /OCTEN_API_KEY|npx/);
assert.doesNotMatch(readme, /image_search|video_search/);

console.log("Plugin manifest and MCP configuration are valid.");
