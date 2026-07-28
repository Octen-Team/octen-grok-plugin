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
assert.equal(octen.command, "npx");
assert.deepEqual(octen.args, ["-y", "octen-mcp@0.3.6"]);
assert.equal(octen.env.OCTEN_API_KEY, "${OCTEN_API_KEY}");
assert.equal(octen.env.OCTEN_ENABLE_BETA_TOOLS, "false");
assert.equal(JSON.stringify(mcpConfig).includes("sk-"), false);

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
assert.match(readme, /OCTEN_API_KEY/);
assert.doesNotMatch(readme, /image_search|video_search/);

console.log("Plugin manifest and MCP configuration are valid.");
